App({
  onLaunch() {
    if (!wx.cloud) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本不支持云开发，请升级微信后重试。',
        showCancel: false
      });
      return;
    }
    wx.cloud.init({
      env: 'cloud1-9g32qnjv9f0dc26a',
      traceUser: true
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
