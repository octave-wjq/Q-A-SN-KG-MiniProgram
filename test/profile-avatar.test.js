'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')

const PROFILE = path.resolve(__dirname, '../miniprogram/pages/profile/profile.js')
const API = path.resolve(__dirname, '../miniprogram/utils/api.js')
const CLOUD = path.resolve(__dirname, '../miniprogram/utils/cloud.js')
const UTIL = path.resolve(__dirname, '../miniprogram/utils/util.js')

// 可控的共享云 mock：getTempFileURL 的完成由测试显式触发，便于构造逆序 Promise
const deferreds = []
class DeferredCloud {
  constructor(opts) { this.opts = opts }
  init() { return Promise.resolve() }
  getTempFileURL(o) {
    const d = {}
    d.promise = new Promise((resolve) => { d.resolve = resolve })
    d.o = o
    deferreds.push(d)
    return d.promise
  }
}

// 可变持久登录态（globalData + 本地缓存），便于模拟登出/换用户/换头像
let persistent = { userInfo: null, isLogin: false }
let storage = {}
function loadProfile(globalUser) {
  persistent = { userInfo: globalUser, isLogin: !!globalUser }
  storage = {}
  global.wx = {
    cloud: { Cloud: DeferredCloud },
    getStorageSync: (k) => (k === 'userInfo' ? storage.userInfo : storage[k]),
    setStorageSync: (k, v) => { storage[k] = v },
    removeStorageSync: (k) => { delete storage[k] }
  }
  global.getApp = () => ({ globalData: persistent })
  let pageConfig = null
  global.Page = (cfg) => { pageConfig = cfg }
  for (const f of [PROFILE, API, CLOUD, UTIL]) delete require.cache[f]
  require(PROFILE)
  return pageConfig
}

function makeCtx(page) {
  return Object.assign({}, page, {
    data: {
      userInfo: { nickName: 'u', avatarUrl: 'cloud://old/avatars/a.jpg', avatarDisplay: 'https://A-old' }
    },
    setData(update) {
      for (const key of Object.keys(update)) {
        const parts = key.split('.')
        let obj = this.data
        for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]]
        obj[parts[parts.length - 1]] = update[key]
      }
    }
  })
}

const flush = () => new Promise((r) => setImmediate(r))

const AVATAR_A = 'cloud://old/avatars/a.jpg'
const DEFAULT_AVATAR = '/images/default-avatar.png'

test('F5 头像逆序解析：过期结果不覆盖新头像展示', async () => {
  const page = loadProfile()
  deferreds.length = 0
  const ctx = makeCtx(page)
  const p = page.refreshAvatarDisplay.call(ctx, AVATAR_A)
  // 等待 getTempFileURL 注册 deferred（请求进行中、尚未返回）
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  // 旧请求进行中，用户资料刷新/保存了新头像（当前持久 fileID 变化）
  ctx.data.userInfo.avatarUrl = 'cloud://old/avatars/b.jpg'
  // 旧请求此刻才返回
  const d = deferreds[0]
  d.o.success({ fileList: [{ status: 0, tempFileURL: 'https://A-new' }] })
  d.resolve()
  await p
  // 过期结果必须被忽略，不得覆盖新头像的展示字段
  assert.strictEqual(ctx.data.userInfo.avatarDisplay, 'https://A-old')
})

test('F5 头像解析：当前持久头像未变时正常写入展示字段', async () => {
  const page = loadProfile()
  deferreds.length = 0
  const ctx = makeCtx(page)
  const p = page.refreshAvatarDisplay.call(ctx, AVATAR_A)
  await flush()
  await flush()
  const d = deferreds[0]
  d.o.success({ fileList: [{ status: 0, tempFileURL: 'https://A-fresh' }] })
  d.resolve()
  await p
  assert.strictEqual(ctx.data.userInfo.avatarDisplay, 'https://A-fresh')
})

test('P1 资料页云头像：请求开始即默认图占位，解析失败保持占位不渲染 fileID', async () => {
  const page = loadProfile({ nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.syncUserState.call(ctx)
  // 解析请求进行中：展示字段必须是可展示的默认图，而不是 cloud:// fileID
  assert.strictEqual(ctx.data.userInfo.avatarDisplay, DEFAULT_AVATAR)
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  const d = deferreds[0]
  d.o.success({ fileList: [{ status: 1 }] }) // 解析失败
  d.resolve()
  await flush()
  await flush()
  // 失败保持可展示 fallback，绝不把 fileID 写入展示字段
  assert.strictEqual(ctx.data.userInfo.avatarDisplay, DEFAULT_AVATAR)
  assert.notStrictEqual(ctx.data.userInfo.avatarDisplay, AVATAR_A)
})

test('P1 资料页同 fileID 换用户：旧用户解析结果不覆盖新用户展示', async () => {
  const page = loadProfile({ nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.syncUserState.call(ctx) // A 的解析请求 d0
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  // 同 fileID 换用户：B 的持久头像与 A 完全相同（仅身份不同）
  persistent.userInfo = { nickName: '用户B', avatarUrl: AVATAR_A, openid: 'openid-b' }
  storage.userInfo = { nickName: '用户B', avatarUrl: AVATAR_A, openid: 'openid-b' }
  storage.openid = 'openid-b'
  page.syncUserState.call(ctx) // B 的解析请求 d1
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 2)
  // B 的请求先返回并展示
  deferreds[1].o.success({ fileList: [{ status: 0, tempFileURL: 'https://B' }] })
  deferreds[1].resolve()
  await flush()
  await flush()
  // A 的过期请求最后返回：不得覆盖 B 的展示
  deferreds[0].o.success({ fileList: [{ status: 0, tempFileURL: 'https://A-stale' }] })
  deferreds[0].resolve()
  await flush()
  await flush()
  assert.strictEqual(ctx.data.userInfo.avatarDisplay, 'https://B')
})

test('P1 资料页 A→B→A：最早请求最后返回不覆盖最新展示', async () => {
  const page = loadProfile({ nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.syncUserState.call(ctx) // A1：d0
  await flush()
  await flush()
  persistent.userInfo = { nickName: '用户B', avatarUrl: AVATAR_A, openid: 'openid-b' }
  storage.userInfo = { nickName: '用户B', avatarUrl: AVATAR_A, openid: 'openid-b' }
  storage.openid = 'openid-b'
  page.syncUserState.call(ctx) // B：d1
  await flush()
  await flush()
  persistent.userInfo = { nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' }
  storage.userInfo = { nickName: '用户A', avatarUrl: AVATAR_A, openid: 'openid-a' }
  storage.openid = 'openid-a'
  page.syncUserState.call(ctx) // A2：d2
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 3)
  // 最新请求（A2）先返回
  deferreds[2].o.success({ fileList: [{ status: 0, tempFileURL: 'https://A2' }] })
  deferreds[2].resolve()
  await flush()
  await flush()
  // B 与最早 A1 的过期请求随后返回：均不得覆盖 A2 的展示
  deferreds[1].o.success({ fileList: [{ status: 0, tempFileURL: 'https://B-stale' }] })
  deferreds[1].resolve()
  await flush()
  await flush()
  deferreds[0].o.success({ fileList: [{ status: 0, tempFileURL: 'https://A1-stale' }] })
  deferreds[0].resolve()
  await flush()
  await flush()
  assert.strictEqual(ctx.data.userInfo.avatarDisplay, 'https://A2')
})
