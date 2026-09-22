'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')

const INDEX = path.resolve(__dirname, '../miniprogram/pages/index/index.js')
const API = path.resolve(__dirname, '../miniprogram/utils/api.js')
const CLOUD = path.resolve(__dirname, '../miniprogram/utils/cloud.js')
const UTIL = path.resolve(__dirname, '../miniprogram/utils/util.js')
const COZECHAT = path.resolve(__dirname, '../miniprogram/utils/cozeChat.js')

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
function loadPage(globalUser) {
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
  for (const f of [INDEX, API, CLOUD, UTIL, COZECHAT]) delete require.cache[f]
  require(INDEX)
  return pageConfig
}

function makeCtx(page, initialAvatar) {
  return Object.assign({}, page, {
    data: { userAvatar: initialAvatar || '/images/default-avatar.png' },
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

const SRC_FILEID = 'cloud://cloud1-9g32qnjv9f0dc26a.636c-cloud1-9g32qnjv9f0dc26a-1412631187/avatars/user-a.jpg'
const TARGET_FILEID = 'cloud://yuelai-0gawhvuc757cd498.7975-yuelai-0gawhvuc757cd498-1313725099/apps/snkg/avatars/user-a.jpg'
const DEFAULT_AVATAR = '/images/default-avatar.png'

test('P1 首页头像云 fileID：解析为 https 渲染，持久 fileID 不被临时地址覆盖', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: SRC_FILEID })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: SRC_FILEID }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.onShow.call(ctx)
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  const d = deferreds[0]
  // 源根 fileID 先映射到目标隔离路径再解析（跨共享环境可用）
  assert.strictEqual(d.o.fileList[0], TARGET_FILEID)
  d.o.success({ fileList: [{ status: 0, tempFileURL: 'https://resolved-a' }] })
  d.resolve()
  await flush()
  await flush()
  // 展示字段为 https，旧 fileID 不直接渲染
  assert.strictEqual(ctx.data.userAvatar, 'https://resolved-a')
  assert.notStrictEqual(ctx.data.userAvatar, SRC_FILEID)
  // 持久记录保持原 fileID，临时地址不回写
  assert.strictEqual(persistent.userInfo.avatarUrl, SRC_FILEID)
  assert.strictEqual(storage.userInfo.avatarUrl, SRC_FILEID)
})

test('P1 首页头像换用户/换头像：旧异步结果不覆盖新头像展示', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: SRC_FILEID })
  deferreds.length = 0
  const ctx = makeCtx(page, 'https://A-old')
  const p = page.refreshAvatarDisplay.call(ctx, SRC_FILEID)
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  // 解析期间持久头像变化（换用户/同用户换头像）
  persistent.userInfo = { nickName: '用户B', avatarUrl: 'cloud://old/avatars/b.jpg' }
  storage.userInfo = { nickName: '用户B', avatarUrl: 'cloud://old/avatars/b.jpg' }
  const d = deferreds[0]
  d.o.success({ fileList: [{ status: 0, tempFileURL: 'https://A-new' }] })
  d.resolve()
  await p
  // 过期结果被忽略，展示字段不被旧头像覆盖
  assert.strictEqual(ctx.data.userAvatar, 'https://A-old')
})

test('P1 首页头像登出：旧异步结果不覆盖展示字段', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: SRC_FILEID })
  deferreds.length = 0
  const ctx = makeCtx(page, 'https://A-old')
  const p = page.refreshAvatarDisplay.call(ctx, SRC_FILEID)
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  // 解析期间用户登出（持久头像清空）
  persistent.userInfo = null
  delete storage.userInfo
  const d = deferreds[0]
  d.o.success({ fileList: [{ status: 0, tempFileURL: 'https://A-new' }] })
  d.resolve()
  await p
  assert.strictEqual(ctx.data.userAvatar, 'https://A-old')
})

test('P1 首页头像非云 https：直接展示，不发起云解析', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: 'https://cdn.example.com/a.png' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: 'https://cdn.example.com/a.png' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.onShow.call(ctx)
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 0)
  assert.strictEqual(ctx.data.userAvatar, 'https://cdn.example.com/a.png')
})

test('P1 首页游客：保持默认头像', async () => {
  const page = loadPage(null)
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.onShow.call(ctx)
  await flush()
  await flush()
  assert.strictEqual(ctx.data.isLogin, false)
  assert.strictEqual(ctx.data.userAvatar, DEFAULT_AVATAR)
  assert.strictEqual(deferreds.length, 0)
})

test('P1 首页新用户无头像：不沿用上一用户头像展示', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: 'https://cdn.example.com/a.png' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: 'https://cdn.example.com/a.png' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.onShow.call(ctx)
  await flush()
  // 换为新用户（无头像）：展示字段应回到默认头像，而不是上一用户的头像
  persistent.userInfo = { nickName: '用户B', avatarUrl: '' }
  storage.userInfo = { nickName: '用户B', avatarUrl: '' }
  page.onShow.call(ctx)
  await flush()
  assert.strictEqual(ctx.data.userAvatar, DEFAULT_AVATAR)
  assert.notStrictEqual(ctx.data.userAvatar, 'https://cdn.example.com/a.png')
})

test('P1 首页头像云解析失败：保持默认头像占位，不渲染 fileID', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.onShow.call(ctx)
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  const d = deferreds[0]
  // 解析失败（SDK 返回非 0 状态）：展示字段必须保持可展示的默认头像
  d.o.success({ fileList: [{ status: 1 }] })
  d.resolve()
  await flush()
  await flush()
  assert.strictEqual(ctx.data.userAvatar, DEFAULT_AVATAR)
  assert.notStrictEqual(ctx.data.userAvatar, SRC_FILEID)
})

test('P1 首页头像同 fileID 换用户：旧用户解析结果不覆盖新用户展示', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.onShow.call(ctx) // A 的解析请求 d0
  await flush()
  await flush()
  assert.strictEqual(deferreds.length, 1)
  // 同 fileID 换用户：B 的持久头像与 A 完全相同（仅身份不同）
  persistent.userInfo = { nickName: '用户B', avatarUrl: SRC_FILEID, openid: 'openid-b' }
  storage.userInfo = { nickName: '用户B', avatarUrl: SRC_FILEID, openid: 'openid-b' }
  storage.openid = 'openid-b'
  page.onShow.call(ctx) // B 的解析请求 d1
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
  assert.strictEqual(ctx.data.userAvatar, 'https://B')
})

test('P1 首页头像 A→B→A：最早请求最后返回不覆盖最新展示', async () => {
  const page = loadPage({ nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' })
  storage.openid = 'openid-a'
  storage.userInfo = { nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' }
  deferreds.length = 0
  const ctx = makeCtx(page)
  page.onShow.call(ctx) // A1：d0
  await flush()
  await flush()
  persistent.userInfo = { nickName: '用户B', avatarUrl: SRC_FILEID, openid: 'openid-b' }
  storage.userInfo = { nickName: '用户B', avatarUrl: SRC_FILEID, openid: 'openid-b' }
  storage.openid = 'openid-b'
  page.onShow.call(ctx) // B：d1
  await flush()
  await flush()
  persistent.userInfo = { nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' }
  storage.userInfo = { nickName: '用户A', avatarUrl: SRC_FILEID, openid: 'openid-a' }
  storage.openid = 'openid-a'
  page.onShow.call(ctx) // A2：d2
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
  assert.strictEqual(ctx.data.userAvatar, 'https://A2')
})
