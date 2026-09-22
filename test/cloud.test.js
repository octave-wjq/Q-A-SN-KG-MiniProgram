'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

const CLOUD = path.resolve(__dirname, '../miniprogram/utils/cloud.js')

const OLD_ROOT = 'cloud://cloud1-9g32qnjv9f0dc26a.636c-cloud1-9g32qnjv9f0dc26a-1412631187/'
const NEW_ROOT = 'cloud://yuelai-0gawhvuc757cd498.7975-yuelai-0gawhvuc757cd498-1313725099/'

function makeMockCloud() {
  const calls = []
  let constructed = 0
  const Cloud = class {
    constructor(opts) { constructed++; this.opts = opts }
    init() { return Promise.resolve() }
    callFunction(o) { calls.push({ type: 'callFunction', name: o.name, data: o.data }); if (o.success) o.success({ result: { ok: true } }); return Promise.resolve() }
    uploadFile(o) { calls.push({ type: 'uploadFile', cloudPath: o.cloudPath }); if (o.success) o.success({ fileID: NEW_ROOT + 'apps/snkg/avatars/up.jpg' }); return Promise.resolve() }
    downloadFile(o) { calls.push({ type: 'downloadFile', fileID: o.fileID }); if (o.success) o.success({ tempFilePath: '/tmp/qr.jpg' }); return Promise.resolve() }
    getTempFileURL(o) { calls.push({ type: 'getTempFileURL', fileList: o.fileList }); if (o.success) o.success({ fileList: [{ status: 0, tempFileURL: 'https://cdn/tmp1' }] }); return Promise.resolve() }
  }
  return { Cloud, calls, constructed: () => constructed }
}

function freshCloud(wxGlobal) {
  global.wx = wxGlobal
  delete require.cache[CLOUD]
  return require(CLOUD)
}

function baseWx(Cloud) {
  return { cloud: { Cloud } }
}

test('导出常量与 Contract 一致（resourceAppid / resourceEnv）', () => {
  const c = freshCloud(baseWx(makeMockCloud().Cloud))
  assert.strictEqual(c.RESOURCE_APPID, 'wx3da56dbad356038f')
  assert.strictEqual(c.RESOURCE_ENV, 'yuelai-0gawhvuc757cd498')
  assert.strictEqual(c.FUNCTION_PREFIX, 'snkg-')
})

test('创建共享实例：new wx.cloud.Cloud 且使用 resourceAppid/resourceEnv，仅一个实例', async () => {
  const { Cloud, constructed } = makeMockCloud()
  const c = freshCloud(baseWx(Cloud))
  await c.init()
  await c.init() // 单例：重复 init 不重复构造
  assert.strictEqual(constructed(), 1)
  const inst = c.sharedCloud()
  assert.ok(inst instanceof Cloud)
  assert.deepStrictEqual(inst.opts, {
    resourceAppid: 'wx3da56dbad356038f',
    resourceEnv: 'yuelai-0gawhvuc757cd498'
  })
})

test('init 单例：多次调用只初始化一次', async () => {
  const { Cloud } = makeMockCloud()
  const c = freshCloud(baseWx(Cloud))
  let inits = 0
  const orig = c.sharedCloud().init
  c.sharedCloud().init = () => { inits++; return Promise.resolve() }
  await c.init()
  await c.init()
  assert.strictEqual(inits, 1)
})

test('callFunction 将逻辑函数名映射为 snkg-<name> 并返回 result', async () => {
  const { Cloud, calls } = makeMockCloud()
  const c = freshCloud(baseWx(Cloud))
  const res = await c.callFunction({ name: 'coze', data: { action: 'chat' } })
  assert.strictEqual(calls[0].name, 'snkg-coze')
  assert.deepStrictEqual(res, { ok: true })
})

test('resolveFunctionName：已带前缀不再重复添加', () => {
  const c = freshCloud(baseWx(makeMockCloud().Cloud))
  assert.strictEqual(c.resolveFunctionName('login'), 'snkg-login')
  assert.strictEqual(c.resolveFunctionName('snkg-login'), 'snkg-login')
})

test('mapFileID：源根引用精确转换为目标 apps/snkg 引用', () => {
  const c = freshCloud(baseWx(makeMockCloud().Cloud))
  const oldId = OLD_ROOT + 'pic/%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D.jpg'
  assert.strictEqual(c.mapFileID(oldId), NEW_ROOT + 'apps/snkg/pic/%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D.jpg')
  // 非源根引用原样返回
  const external = 'https://example.com/a.png'
  assert.strictEqual(c.mapFileID(external), external)
  assert.strictEqual(c.mapFileID(undefined), undefined)
})

test('mapCloudPath：上传路径自动置于 apps/snkg/ 隔离前缀下', () => {
  const c = freshCloud(baseWx(makeMockCloud().Cloud))
  assert.strictEqual(c.mapCloudPath('avatars/123.jpg'), 'apps/snkg/avatars/123.jpg')
  assert.strictEqual(c.mapCloudPath('/avatars/123.jpg'), 'apps/snkg/avatars/123.jpg')
  // 已带前缀不重复
  assert.strictEqual(c.mapCloudPath('apps/snkg/avatars/123.jpg'), 'apps/snkg/avatars/123.jpg')
})

test('downloadFile 走共享实例并映射 fileID', async () => {
  const { Cloud, calls } = makeMockCloud()
  const c = freshCloud(baseWx(Cloud))
  const oldId = OLD_ROOT + 'pic/qr.jpg'
  await c.downloadFile({ fileID: oldId })
  assert.strictEqual(calls[0].fileID, NEW_ROOT + 'apps/snkg/pic/qr.jpg')
})

test('初始化失败：callFunction 拒绝且调用 fail 收口', async () => {
  class FailingCloud {
    constructor(opts) { this.opts = opts }
    init() { return Promise.reject(new Error('init boom')) }
  }
  const c = freshCloud(baseWx(FailingCloud))
  let failed = false
  await assert.rejects(
    c.callFunction({ name: 'login', fail: () => { failed = true } }),
    /init boom/
  )
  assert.strictEqual(failed, true)
})

test('resolveForDisplay：fileID 经映射后解析为临时地址', async () => {
  const { Cloud, calls } = makeMockCloud()
  const c = freshCloud(baseWx(Cloud))
  const url = await c.resolveForDisplay(OLD_ROOT + 'avatars/a.jpg')
  assert.strictEqual(url, 'https://cdn/tmp1')
  assert.deepStrictEqual(calls[0].fileList, [NEW_ROOT + 'apps/snkg/avatars/a.jpg'])
})

// SDK 回调约定：失败时先 fail 后 complete（SDK 负责调用 complete）。
function makeFailThenCompleteCloud() {
  return class {
    constructor(opts) { this.opts = opts }
    init() { return Promise.resolve() }
    callFunction(o) { o.fail && o.fail(new Error('fn boom')); o.complete && o.complete({ errMsg: 'fn boom' }); return Promise.resolve() }
    uploadFile(o) { o.fail && o.fail(new Error('up boom')); o.complete && o.complete({ errMsg: 'up boom' }); return Promise.resolve() }
    downloadFile(o) { o.fail && o.fail(new Error('dl boom')); o.complete && o.complete({ errMsg: 'dl boom' }); return Promise.resolve() }
  }
}

// F3：进入 SDK 后 complete 只能由 SDK 触发一次，wrapper 不得在 fail 中重复调用
test('F3 callFunction：SDK fail→complete 顺序下 complete 只调用一次', async () => {
  const c = freshCloud(baseWx(makeFailThenCompleteCloud()))
  let fail = 0
  let complete = 0
  await assert.rejects(
    c.callFunction({ name: 'x', fail: () => { fail++ }, complete: () => { complete++ } }),
    /fn boom/
  )
  assert.strictEqual(fail, 1)
  assert.strictEqual(complete, 1)
})

test('F3 uploadFile：SDK fail→complete 顺序下 complete 只调用一次', async () => {
  const c = freshCloud(baseWx(makeFailThenCompleteCloud()))
  let fail = 0
  let complete = 0
  await assert.rejects(
    c.uploadFile({ cloudPath: 'a.jpg', fail: () => { fail++ }, complete: () => { complete++ } }),
    /up boom/
  )
  assert.strictEqual(fail, 1)
  assert.strictEqual(complete, 1)
})

test('F3 downloadFile：SDK fail→complete 顺序下 complete 只调用一次', async () => {
  const c = freshCloud(baseWx(makeFailThenCompleteCloud()))
  let fail = 0
  let complete = 0
  await assert.rejects(
    c.downloadFile({ fileID: 'x', fail: () => { fail++ }, complete: () => { complete++ } }),
    /dl boom/
  )
  assert.strictEqual(fail, 1)
  assert.strictEqual(complete, 1)
})

test('F3 初始化失败：未进入 SDK，complete 手动收口一次', async () => {
  class FailInitCloud { constructor(opts) { this.opts = opts } init() { return Promise.reject(new Error('init boom')) } }
  const c = freshCloud(baseWx(FailInitCloud))
  let fail = 0
  let complete = 0
  await assert.rejects(
    c.callFunction({ name: 'x', fail: () => { fail++ }, complete: () => { complete++ } }),
    /init boom/
  )
  assert.strictEqual(fail, 1)
  assert.strictEqual(complete, 1)
})

// F4：callback-only 调用不消费返回 Promise 会未处理拒绝，消费后消除。
// 在独立子进程验证（避免 node:test 自身的 unhandledRejection 干扰判定）。
function runF4Scenario(withCatch) {
  const cloudAbs = path.resolve(__dirname, '../miniprogram/utils/cloud.js')
  const script = `
global.wx={cloud:{Cloud:class{init(){return Promise.resolve()}downloadFile(o){if(o.fail)o.fail(new Error('dl fail'));return Promise.resolve()}}}};
const path=require('node:path');
const cloud=require(${JSON.stringify(cloudAbs)});
let unhandled=0;
process.on('unhandledRejection',()=>{unhandled++});
const p=cloud.downloadFile({fileID:'x',fail:()=>{}});
${withCatch ? 'p.catch(()=>{});' : ''}
setTimeout(()=>{console.log('UNHANDLED='+unhandled);process.exit(0);},80);
`
  return execFileSync(process.execPath, ['-e', script], { encoding: 'utf8' })
}

test('F4 回调式 downloadFile：未消费 Promise 产生未处理拒绝，catch 后消除', () => {
  const noCatch = runF4Scenario(false)
  assert.match(noCatch, /UNHANDLED=[1-9]/, `未消费时应出现未处理拒绝，得到: ${noCatch}`)
  const withCatch = runF4Scenario(true)
  assert.match(withCatch, /UNHANDLED=0/, `消费后不应出现未处理拒绝，得到: ${withCatch}`)
})
