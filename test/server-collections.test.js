'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')
const Module = require('node:module')

const ROOT = path.resolve(__dirname, '..')
const SOURCE_APPID = 'wxd08371300aa163c5'
const ADMIN = 'oQ0UG7ooFWi9ekMxXK9bO9HM9OOY'

// 链式 db mock：记录 collection(name) 调用，终端操作返回稳定默认值
function makeDbMock() {
  const collections = []
  const db = {
    collections,
    command: { or: (a) => a, neq: (v) => ({ neq: v }), inc: (v) => ({ inc: v }), in: (v) => ({ in: v }), gte: (v) => ({ gte: v }) },
    RegExp: (o) => o,
    serverDate: () => new Date(),
    collection: (name) => {
      collections.push(name)
      return makeChain()
    }
  }
  return db
}

function makeChain() {
  const chain = {}
  return new Proxy(chain, {
    get(t, prop) {
      if (prop === 'get') return async () => ({ data: [] })
      if (prop === 'count') return async () => ({ total: 0 })
      if (prop === 'add') return async () => ({ _id: 'id' })
      if (prop === 'update') return async () => ({})
      if (prop === 'remove') return async () => ({})
      if (prop === 'set') return async () => ({})
      return () => makeChain() // doc / where / limit / skip / orderBy ...
    }
  })
}

function loadFunction(fnDir, sdk) {
  const index = path.resolve(ROOT, 'cloudfunctions', fnDir, 'index.js')
  const identity = path.resolve(ROOT, 'cloudfunctions', fnDir, 'identity.js')
  const orig = Module._load
  Module._load = function (request, parent, isMain) {
    if (request === 'wx-server-sdk') return sdk
    return orig.apply(this, arguments)
  }
  try {
    delete require.cache[index]
    delete require.cache[identity]
    return require(index)
  } finally {
    Module._load = orig
  }
}

function sdkFor(ctx, db) {
  return {
    DYNAMIC_CURRENT_ENV: 'env',
    init: () => {},
    getWXContext: () => ctx,
    database: () => db
  }
}

test('sn 函数：graph/spillover 读取 snkg- 前缀集合', async () => {
  const db = makeDbMock()
  const mod = loadFunction('snkg-sn', sdkFor({ APPID: SOURCE_APPID, OPENID: 'oUser' }, db))

  const g = await mod.main({ action: 'graph' })
  assert.strictEqual(g.code, 0)
  const s = await mod.main({ action: 'spillover', intervention_type: 'alleviate' })
  assert.strictEqual(s.code, 0)

  assert.ok(db.collections.includes('snkg-sn_graph'), 'graph 应读 snkg-sn_graph')
  assert.ok(db.collections.includes('snkg-sn_spillover'), 'spillover 应读 snkg-sn_spillover')
  assert.ok(!db.collections.includes('sn_graph'), '不得读取未加前缀集合')
})

test('sn 函数：拒绝非来源 appid', async () => {
  const db = makeDbMock()
  const mod = loadFunction('snkg-sn', sdkFor({ APPID: 'wx3da56dbad356038f', OPENID: 'oX' }, db))
  const res = await mod.main({ action: 'graph' })
  assert.strictEqual(res.code, 401)
  assert.strictEqual(db.collections.length, 0)
})

test('import_data 单项导入：物理写 snkg-*，响应键保持无前缀逻辑名', async () => {
  const db = makeDbMock()
  const mod = loadFunction('snkg-import_data', sdkFor({ APPID: SOURCE_APPID, OPENID: ADMIN }, db))
  const res = await mod.main({ action: 'import_sn_graph', data: { nodes: [], edges: [] } })
  assert.strictEqual(res.code, 0)
  // 响应键不得泄漏物理前缀，仍为旧协议的逻辑键
  assert.deepStrictEqual(res.data.imported, { sn_graph: 1 })
  // 物理集合必须写入 snkg- 前缀
  assert.ok(db.collections.includes('snkg-sn_graph'))
  assert.ok(!db.collections.includes('sn_graph'))
})

test('import_data import_all：六个响应键保持无前缀逻辑名', async () => {
  const db = makeDbMock()
  const mod = loadFunction('snkg-import_data', sdkFor({ APPID: SOURCE_APPID, OPENID: ADMIN }, db))
  const res = await mod.main({
    action: 'import_all',
    data: {
      sn_graph: { nodes: [], edges: [] },
      sn_centrality: { rankings: [] },
      sn_simulation: [{ node_id: 'n1', intervention_type: 'alleviate' }],
      sn_spillover: [{ intervention_type: 'alleviate' }],
      kg_nodes: [{ node_id: 'k1', label: 'k1' }],
      kg_edges: [{ source: 'a', target: 'b', relation: 'r' }]
    }
  })
  assert.strictEqual(res.code, 0)
  assert.deepStrictEqual(res.data.imported, {
    sn_graph: 1, sn_centrality: 1, sn_simulation: 1, sn_spillover: 1, kg_nodes: 1, kg_edges: 1
  })
  // 物理集合均为 snkg- 前缀
  for (const name of ['sn_graph', 'sn_centrality', 'sn_simulation', 'sn_spillover', 'kg_nodes', 'kg_edges']) {
    assert.ok(db.collections.includes('snkg-' + name), `物理集合应写入 snkg-${name}`)
  }
  assert.ok(!db.collections.includes('sn_graph') && !db.collections.includes('kg_edges'))
})

test('import_data count：对 snkg- 前缀集合计数，响应保持原有 data.imported 协议', async () => {
  const db = makeDbMock()
  const mod = loadFunction('snkg-import_data', sdkFor({ APPID: SOURCE_APPID, OPENID: ADMIN }, db))
  const res = await mod.main({ action: 'count' })
  assert.strictEqual(res.code, 0)
  // 保持原响应协议：ok() 将结果包在 data.imported 下
  assert.deepStrictEqual(Object.keys(res.data.imported).sort(), [
    'kg_edges', 'kg_nodes', 'sn_centrality', 'sn_graph', 'sn_simulation', 'sn_spillover'
  ])
  const counted = db.collections.filter((n) => n.startsWith('snkg-'))
  assert.strictEqual(counted.length, 6)
  assert.ok(counted.includes('snkg-sn_graph'))
  assert.ok(counted.includes('snkg-kg_nodes'))
})

test('import_data：非来源 appid 拒绝（401），不执行计数', async () => {
  const db = makeDbMock()
  const mod = loadFunction('snkg-import_data', sdkFor({ APPID: 'wx3da56dbad356038f', OPENID: ADMIN }, db))
  const res = await mod.main({ action: 'count' })
  assert.strictEqual(res.code, 401)
  assert.strictEqual(db.collections.length, 0)
})

test('import_data：来源正确但非管理员拒绝（403）', async () => {
  const db = makeDbMock()
  const mod = loadFunction('snkg-import_data', sdkFor({ APPID: SOURCE_APPID, OPENID: 'oNotAdmin' }, db))
  const res = await mod.main({ action: 'count' })
  assert.strictEqual(res.code, 403)
  assert.strictEqual(db.collections.length, 0)
})
