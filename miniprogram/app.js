const sharedCloud = require('./utils/cloud');

App({
  onLaunch() {
    // 通过共享资源实例初始化目标云环境；失败统一在此收口提示
    sharedCloud.init().catch(() => {
      wx.showModal({
        title: '提示',
        content: '当前微信版本不支持云开发，或云服务初始化失败，请升级微信后重试。',
        showCancel: false
      });
    });

    // 恢复本地缓存的登录状态
    const cachedUser = wx.getStorageSync('userInfo');
    const cachedOpenid = wx.getStorageSync('openid');
    if (cachedUser && cachedOpenid) {
      this.globalData.userInfo = cachedUser;
      this.globalData.isLogin = true;
    }
  },
  globalData: {
    userInfo: null,
    isLogin: false
  }
});
