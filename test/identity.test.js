'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')

// 纯函数：无 wx / wx-server-sdk 依赖，直接 require
const { resolveIdentity, SOURCE_APPID } = require(path.resolve(__dirname, '../cloudfunctions/login/identity.js'))

test('SOURCE_APPID 保持源小程序 appid 不变', () => {
  assert.strictEqual(SOURCE_APPID, 'wxd08371300aa163c5')
})

test('直接来源：APPID==sourceAppid 且 OPENID 非空 → 通过并返回原 openid', () => {
  const r = resolveIdentity({ APPID: 'wxd08371300aa163c5', OPENID: 'oXyz', UNIONID: 'u123' })
  assert.strictEqual(r.valid, true)
  assert.strictEqual(r.openid, 'oXyz')
  assert.strictEqual(r.appid, 'wxd08371300aa163c5')
  assert.strictEqual(r.unionid, 'u123')
})

test('共享调用：FROM_APPID==sourceAppid 且 FROM_OPENID 非空 → 通过并保留可信 FROM_UNIONID', () => {
  const r = resolveIdentity({ FROM_APPID: 'wxd08371300aa163c5', FROM_OPENID: 'oShared', FROM_UNIONID: 'uShared' })
  assert.strictEqual(r.valid, true)
  assert.strictEqual(r.openid, 'oShared')
  // 官方可信 FROM_UNIONID 应透传，保证跨应用用户关联可用
  assert.strictEqual(r.unionid, 'uShared')
})

test('共享调用：无可信 FROM_UNIONID 时 unionid 置空', () => {
  const r = resolveIdentity({ FROM_APPID: 'wxd08371300aa163c5', FROM_OPENID: 'oShared' })
  assert.strictEqual(r.valid, true)
  assert.strictEqual(r.unionid, '')
})

test('拒绝：FROM_APPID 为其它项目 / ResearchBridge 来源', () => {
  const r = resolveIdentity({ FROM_APPID: 'wx3da56dbad356038f', FROM_OPENID: 'oXyz' })
  assert.strictEqual(r.valid, false)
})

test('拒绝：FROM_APPID==sourceAppid 但 FROM_OPENID 为空', () => {
  assert.strictEqual(resolveIdentity({ FROM_APPID: 'wxd08371300aa163c5', FROM_OPENID: '' }).valid, false)
  assert.strictEqual(resolveIdentity({ FROM_APPID: 'wxd08371300aa163c5' }).valid, false)
})

test('拒绝：直接来源 APPID 不匹配（其它项目）', () => {
  const r = resolveIdentity({ APPID: 'wx3da56dbad356038f', OPENID: 'oXyz' })
  assert.strictEqual(r.valid, false)
})

test('拒绝：直接来源 OPENID 缺失/为空', () => {
  assert.strictEqual(resolveIdentity({ APPID: 'wxd08371300aa163c5', OPENID: '' }).valid, false)
  assert.strictEqual(resolveIdentity({ APPID: 'wxd08371300aa163c5' }).valid, false)
})

test('拒绝：无上下文 / 非对象', () => {
  assert.strictEqual(resolveIdentity(null).valid, false)
  assert.strictEqual(resolveIdentity(undefined).valid, false)
  assert.strictEqual(resolveIdentity('x').valid, false)
})

test('拒绝：共享来源缺失 FROM_OPENID 时不得回退到直接来源判断', () => {
  // FROM_APPID 已存在但 FROM_OPENID 缺失 → 必须拒绝，而不是看 APPID/OPENID
  const r = resolveIdentity({ FROM_APPID: 'wx3da56dbad356038f', APPID: 'wxd08371300aa163c5', OPENID: 'oXyz' })
  assert.strictEqual(r.valid, false)
})
