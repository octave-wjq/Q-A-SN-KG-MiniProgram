/**
 * 共享资源云实例封装（ResearchBridge 迁移）。
 *
 * 规则：
 * - 一律通过 `new wx.cloud.Cloud({ resourceAppid, resourceEnv })` 访问共享目标环境，
 *   绝不 monkey-patch `wx.cloud`，也不失败回退到源环境。
 * - 所有资源调用（callFunction / uploadFile / downloadFile / getTempFileURL）都等待同一个
 *   已初始化的共享实例（`init()` 单例），初始化失败统一走各自的错误收口（fail/complete + reject）。
 * - 函数逻辑名统一映射为部署名 `snkg-<逻辑名>`。
 * - 文件路径与 fileID 统一做源→目标映射：目标对象位于 `apps/snkg/<原key>`。
 */
const RESOURCE_APPID = 'wx3da56dbad356038f'
const RESOURCE_ENV = 'yuelai-0gawhvuc757cd498'
const FUNCTION_PREFIX = 'snkg-'

// 源存储根 → 目标存储根（文件按 apps/snkg/<原key> 隔离迁入）
const OLD_FILE_ROOT = 'cloud://cloud1-9g32qnjv9f0dc26a.636c-cloud1-9g32qnjv9f0dc26a-1412631187/'
const NEW_FILE_ROOT = 'cloud://yuelai-0gawhvuc757cd498.7975-yuelai-0gawhvuc757cd498-1313725099/apps/snkg/'

const FILE_PATH_PREFIX = 'apps/snkg/'

let _instance = null
let _initPromise = null

function sharedCloud() {
  if (!wx.cloud || typeof wx.cloud.Cloud !== 'function') {
    throw new Error('当前微信版本不支持云开发')
  }
  if (!_instance) {
    _instance = new wx.cloud.Cloud({
      resourceAppid: RESOURCE_APPID,
      resourceEnv: RESOURCE_ENV
    })
  }
  return _instance
}

function init() {
  if (!_initPromise) {
    _initPromise = Promise.resolve()
      .then(() => sharedCloud().init())
      .catch((err) => {
        // 允许下次重试
        _initPromise = null
        throw err
      })
  }
  return _initPromise
}

// 源 fileID → 目标 fileID；非源根引用原样返回
function mapFileID(fileID) {
  if (typeof fileID === 'string' && fileID.startsWith(OLD_FILE_ROOT)) {
    return NEW_FILE_ROOT + fileID.slice(OLD_FILE_ROOT.length)
  }
  return fileID
}

// 上传 cloudPath → 目标隔离路径（apps/snkg/<原key>）
function mapCloudPath(cloudPath) {
  const p = String(cloudPath || '').replace(/^\/+/, '')
  if (!p) return p
  if (p.startsWith(FILE_PATH_PREFIX)) return p
  return FILE_PATH_PREFIX + p
}

// 逻辑函数名 → 部署函数名
function resolveFunctionName(name) {
  const n = String(name || '')
  if (!n) return n
  return n.startsWith(FUNCTION_PREFIX) ? n : FUNCTION_PREFIX + n
}

function callFunction(options) {
  const opts = options || {}
  return init().then(
    () => new Promise((resolve, reject) => {
      sharedCloud().callFunction({
        name: resolveFunctionName(opts.name),
        data: opts.data || {},
        config: opts.config || { timeout: 60000 },
        success: (res) => {
          const result = res && res.result !== undefined ? res.result : res
          if (typeof opts.success === 'function') opts.success(Object.assign({}, res, { result }))
          resolve(result)
        },
        fail: (err) => {
          // 进入 SDK 后 complete 由 SDK 的 complete 回调唯一负责，避免 fail→complete 触发两次
          if (typeof opts.fail === 'function') opts.fail(err)
          reject(err)
        },
        complete: (res) => {
          if (typeof opts.complete === 'function') opts.complete(res)
        }
      })
    }),
    (err) => {
      // 初始化失败统一走错误收口
      if (typeof opts.fail === 'function') opts.fail(err)
      if (typeof opts.complete === 'function') opts.complete(err)
      throw err
    }
  )
}

function uploadFile(options) {
  const opts = options || {}
  return init().then(
    () => new Promise((resolve, reject) => {
      sharedCloud().uploadFile({
        cloudPath: mapCloudPath(opts.cloudPath),
        filePath: opts.filePath,
        success: (res) => {
          if (typeof opts.success === 'function') opts.success(res)
          resolve(res)
        },
        fail: (err) => {
          // 进入 SDK 后 complete 由 SDK 的 complete 回调唯一负责，避免 fail→complete 触发两次
          if (typeof opts.fail === 'function') opts.fail(err)
          reject(err)
        },
        complete: (res) => {
          if (typeof opts.complete === 'function') opts.complete(res)
        }
      })
    }),
    (err) => {
      if (typeof opts.fail === 'function') opts.fail(err)
      if (typeof opts.complete === 'function') opts.complete(err)
      throw err
    }
  )
}

function downloadFile(options) {
  const opts = options || {}
  return init().then(
    () => new Promise((resolve, reject) => {
      sharedCloud().downloadFile({
        fileID: mapFileID(opts.fileID),
        success: (res) => {
          if (typeof opts.success === 'function') opts.success(res)
          resolve(res)
        },
        fail: (err) => {
          // 进入 SDK 后 complete 由 SDK 的 complete 回调唯一负责，避免 fail→complete 触发两次
          if (typeof opts.fail === 'function') opts.fail(err)
          reject(err)
        },
        complete: (res) => {
          if (typeof opts.complete === 'function') opts.complete(res)
        }
      })
    }),
    (err) => {
      if (typeof opts.fail === 'function') opts.fail(err)
      if (typeof opts.complete === 'function') opts.complete(err)
      throw err
    }
  )
}

/**
 * 将（可能是源根的）云 fileID 解析为可展示的临时地址（https）。
 * 仅用于展示，返回的短期 URL 不得写回永久记录；持久 fileID 保持不变。
 */
function resolveForDisplay(fileID) {
  const mapped = mapFileID(fileID)
  return init().then(() => new Promise((resolve) => {
    sharedCloud().getTempFileURL({
      fileList: [mapped],
      success: (res) => {
        const item = res && res.fileList && res.fileList[0]
        if (item && item.status === 0 && item.tempFileURL) {
          resolve(item.tempFileURL)
        } else {
          resolve('')
        }
      },
      fail: () => resolve('')
    })
  }))
}

module.exports = {
  RESOURCE_APPID,
  RESOURCE_ENV,
  FUNCTION_PREFIX,
  sharedCloud,
  init,
  mapFileID,
  mapCloudPath,
  resolveFunctionName,
  callFunction,
  uploadFile,
  downloadFile,
  resolveForDisplay
}
