const formatNumber = (value) => {
  const str = value.toString();
  return str[1] ? str : `0${str}`;
};

const formatTime = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second]
    .map(formatNumber)
    .join(':')}`;
};

const showLoading = (title = '加载中') =>
  wx.showLoading({
    title,
    mask: true
  });

const hideLoading = () => wx.hideLoading();

const showToast = (title, icon = 'none', duration = 2000) =>
  wx.showToast({
    title,
    icon,
    duration
  });

const isLoggedIn = () => !!wx.getStorageSync('openid');

const requireLogin = (content = '请先登录后使用该功能') => {
  if (isLoggedIn()) {
    return true;
  }
  wx.showModal({
    title: '提示',
    content,
    confirmText: '去登录',
    success: (res) => {
      if (res.confirm) {
        wx.switchTab({ url: '/pages/profile/profile' });
      }
    }
  });
  return false;
};

module.exports = {
  formatTime,
  showLoading,
  hideLoading,
  showToast,
  isLoggedIn,
  requireLogin
};
