const cloud = require('wx-server-sdk');
const { resolveIdentity } = require('./identity');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async () => {
  const identity = resolveIdentity(cloud.getWXContext());

  if (!identity.valid) {
    return { code: 401, message: 'unauthorized' };
  }

  return {
    openid: identity.openid,
    appid: identity.appid,
    unionid: identity.unionid || ''
  };
};
