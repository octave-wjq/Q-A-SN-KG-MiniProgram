'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')
const Module = require('node:module')

const FUNC = path.resolve(__dirname, '../cloudfunctions/login/index.js')
const IDENTITY = path.resolve(__dirname, '../cloudfunctions/login/identity.js')

function loadLogin(sdk) {
  const orig = Module._load
  Module._load = function (request, parent, isMain) {
    if (request === 'wx-server-sdk') return sdk
    return orig.apply(this, arguments)
  }
  try {
    delete require.cache[FUNC]
    delete require.cache[IDENTITY]
    return require(FUNC)
  } finally {
    Module._load = orig
  }
}

function sdkFor(ctx) {
  return {
    DYNAMIC_CURRENT_ENV: 'env',
    init: () => {},
    getWXContext: () => ctx,
    database: () => ({ command: {} })
  }
}

test('有效直接来源：返回原 openid / appid / unionid', async () => {
  const mod = loadLogin(sdkFor({ APPID: 'wxd08371300aa163c5', OPENID: 'oReal', UNIONID: 'uA' }))
  const res = await mod.main({})
  assert.strictEqual(res.code, undefined) // 登录成功不返回 code
  assert.strictEqual(res.openid, 'oReal')
  assert.strictEqual(res.appid, 'wxd08371300aa163c5')
  assert.strictEqual(res.unionid, 'uA')
})

test('有效共享来源：FROM_APPID==source 且 FROM_OPENID 非空，透传可信 FROM_UNIONID', async () => {
  const mod = loadLogin(sdkFor({ FROM_APPID: 'wxd08371300aa163c5', FROM_OPENID: 'oShared', FROM_UNIONID: 'uShared' }))
  const res = await mod.main({})
  assert.strictEqual(res.openid, 'oShared')
  assert.strictEqual(res.appid, 'wxd08371300aa163c5')
  assert.strictEqual(res.unionid, 'uShared')
})

test('有效共享来源：无 FROM_UNIONID 时 unionid 置空', async () => {
  const mod = loadLogin(sdkFor({ FROM_APPID: 'wxd08371300aa163c5', FROM_OPENID: 'oShared' }))
  const res = await mod.main({})
  assert.strictEqual(res.unionid, '')
})

test('拒绝其它项目来源（ResearchBridge appid）', async () => {
  const mod = loadLogin(sdkFor({ APPID: 'wx3da56dbad356038f', OPENID: 'oX' }))
  const res = await mod.main({})
  assert.strictEqual(res.code, 401)
})

test('拒绝共享来源 FROM_APPID 不匹配', async () => {
  const mod = loadLogin(sdkFor({ FROM_APPID: 'wx3da56dbad356038f', FROM_OPENID: 'oX' }))
  const res = await mod.main({})
  assert.strictEqual(res.code, 401)
})

test('拒绝 OPENID 缺失（不信任空身份）', async () => {
  const mod = loadLogin(sdkFor({ APPID: 'wxd08371300aa163c5' }))
  const res = await mod.main({})
  assert.strictEqual(res.code, 401)
})
