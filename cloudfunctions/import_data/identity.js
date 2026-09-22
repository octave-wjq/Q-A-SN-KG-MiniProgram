/**
 * 可信身份解析（ResearchBridge 迁移）。
 *
 * 规则：仅接受本小程序（sourceAppid）的直接来源（APPID==sourceAppid 且 OPENID 非空），
 * 或共享调用中可信上下文携带的经授权来源（FROM_APPID==sourceAppid 且 FROM_OPENID 非空）。
 * 未知/另一项目/ResearchBridge 来源一律拒绝；绝不信任客户端 event.openid，
 * 也不错误回退到资源方 OPENID。返回的 openid 即原小程序业务身份，供后续沿用。
 */
const SOURCE_APPID = 'wxd08371300aa163c5'

function resolveIdentity(ctx) {
  if (!ctx || typeof ctx !== 'object') {
    return { valid: false }
  }

  // 共享资源调用：WeChat 在可信上下文中携带原调用方身份（含官方可信 FROM_UNIONID）
  if (ctx.FROM_APPID) {
    if (ctx.FROM_APPID === SOURCE_APPID && ctx.FROM_OPENID) {
      return { valid: true, appid: ctx.FROM_APPID, openid: ctx.FROM_OPENID, unionid: ctx.FROM_UNIONID || '' }
    }
    return { valid: false }
  }

  // 直接来源
  if (ctx.APPID === SOURCE_APPID && ctx.OPENID) {
    return { valid: true, appid: ctx.APPID, openid: ctx.OPENID, unionid: ctx.UNIONID || '' }
  }

  return { valid: false }
}

module.exports = { resolveIdentity, SOURCE_APPID }
