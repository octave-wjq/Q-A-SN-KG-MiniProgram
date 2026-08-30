const { callCloud } = require('../../utils/api')
const { showLoading, hideLoading, showToast } = require('../../utils/util')

const DEFAULT_AVATAR = '/images/default-avatar.png'
const ADMIN_OPENIDS = ['oQ0UG7ooFWi9ekMxXK9bO9HM9OOY']

Page({
  data: {
    userInfo: { nickName: '', avatarUrl: DEFAULT_AVATAR },
    userId: '',
    isLogin: false,
    isAdmin: false,
    defaultAvatar: DEFAULT_AVATAR,
    showEditPanel: false,
    editAvatar: '',
    editNickName: '',
    showFeedbackPanel: false,
    feedbackContent: '',
    feedbackContact: '',
    feedbackSubmitting: false,
    menuList: [
      { key: 'qaHistory', title: '问答历史' },
      { key: 'feedback', title: '反馈建议' },
      { key: 'about', title: '关于我们' }
    ]
  },

  onShow() {
    this.syncUserState()
  },

  syncUserState() {
    const app = getApp()
    const cachedUser = wx.getStorageSync('userInfo') || null
    const cachedOpenid = wx.getStorageSync('openid') || ''
    const currentUser = app.globalData.userInfo || cachedUser

    if (currentUser && cachedOpenid) {
      this.setData({
        isLogin: true,
        isAdmin: ADMIN_OPENIDS.includes(cachedOpenid),
        userInfo: {
          nickName: currentUser.nickName || '微信用户',
          avatarUrl: currentUser.avatarUrl || DEFAULT_AVATAR
        },
        userId: cachedOpenid.slice(-8)
      })
    } else {
      this.setData({
        isLogin: false,
        isAdmin: false,
        userInfo: { nickName: '', avatarUrl: DEFAULT_AVATAR },
        userId: ''
      })
    }
  },

  async handleLogin() {
    showLoading('登录中')
    try {
      const loginRes = await callCloud('login')
      const openid = (loginRes && loginRes.openid) || ''
      if (!openid) {
        showToast('登录失败')
        return
      }

      wx.setStorageSync('openid', openid)

      // 查询用户是否已存在资料
      const profileRes = await callCloud('user', { action: 'getProfile' })
      const existingProfile = (profileRes && profileRes.success && profileRes.profile) || null
      // 本地缓存兜底：之前登录/完善过资料则视为老用户，避免重复弹完善面板
      const cachedUser = wx.getStorageSync('userInfo') || null
      const isReturning = !!existingProfile || !!(cachedUser && cachedUser.nickName)

      const app = getApp()

      if (isReturning) {
        // 老用户：优先用云端资料，其次本地缓存，不再要求重新获取
        const src = existingProfile || cachedUser || {}
        const userInfo = {
          nickName: src.nickName || '微信用户',
          avatarUrl: src.avatarUrl || DEFAULT_AVATAR
        }
        app.globalData.userInfo = { ...userInfo, openid }
        app.globalData.isLogin = true
        wx.setStorageSync('userInfo', { ...userInfo, openid })
        this.syncUserState()
        showToast('登录成功', 'success')
      } else {
        // 首次登录：用默认资料先登录，引导完善头像昵称
        const userInfo = { nickName: '微信用户', avatarUrl: DEFAULT_AVATAR }
        app.globalData.userInfo = { ...userInfo, openid }
        app.globalData.isLogin = true
        wx.setStorageSync('userInfo', { ...userInfo, openid })
        this.syncUserState()
        showToast('登录成功', 'success')
        setTimeout(() => {
          this.setData({ showEditPanel: true, editNickName: '', editAvatar: '' })
        }, 500)
      }
    } catch (err) {
      console.error('登录失败:', err)
      showToast('登录失败，请重试')
    } finally {
      hideLoading()
    }
  },

  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '退出后问答历史等数据仍会保留',
      success: ({ confirm }) => {
        if (!confirm) return
        const app = getApp()
        app.globalData.userInfo = null
        app.globalData.isLogin = false
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('openid')
        this.syncUserState()
        showToast('已退出')
      }
    })
  },

  onEditProfile() {
    this.setData({
      showEditPanel: true,
      editAvatar: this.data.userInfo.avatarUrl,
      editNickName: this.data.userInfo.nickName
    })
  },

  onCloseEdit() {
    this.setData({ showEditPanel: false })
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    if (avatarUrl) {
      this.setData({ editAvatar: avatarUrl })
    }
  },

  onNickNameChange(e) {
    this.setData({ editNickName: e.detail.value || '' })
  },

  onNickNameInput(e) {
    this.setData({ editNickName: e.detail.value || '' })
  },

  async onSaveProfile() {
    const nickName = (this.data.editNickName || '').trim()
    const avatarUrl = this.data.editAvatar

    if (!nickName) {
      showToast('请输入昵称')
      return
    }

    showLoading('保存中')
    try {
      // 如果用户选了新头像，上传到云存储
      let finalAvatar = avatarUrl
      if (avatarUrl && (avatarUrl.startsWith('http://tmp') || avatarUrl.startsWith('wxfile://'))) {
        const uploadRes = await wx.cloud.uploadFile({
          cloudPath: `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
          filePath: avatarUrl
        })
        finalAvatar = uploadRes.fileID
      }

      const profile = { nickName, avatarUrl: finalAvatar }
      await callCloud('user', { action: 'updateProfile', profile })

      const openid = wx.getStorageSync('openid') || ''
      const merged = { ...profile, openid }
      const app = getApp()
      app.globalData.userInfo = merged
      wx.setStorageSync('userInfo', merged)

      this.syncUserState()
      this.setData({ showEditPanel: false })
      showToast('保存成功', 'success')
    } catch (err) {
      console.error('保存资料失败:', err)
      showToast('保存失败')
    } finally {
      hideLoading()
    }
  },

  onMenuTap(e) {
    const key = e.currentTarget.dataset.key
    switch (key) {
      case 'qaHistory':
        wx.switchTab({ url: '/pages/qa/qa' })
        break
      case 'feedback':
        this.setData({ showFeedbackPanel: true, feedbackContent: '', feedbackContact: '' })
        break
      case 'about':
        wx.showModal({
          title: '关于我们',
          content: '本小程序由复旦大学护理学院开发，旨在为HIV/AIDS患者提供健康管理支持。',
          showCancel: false
        })
        break
      case 'admin':
        wx.navigateTo({ url: '/pages/admin/admin' })
        break
      default:
        showToast('功能开发中')
    }
  },

  onCloseFeedback() {
    this.setData({ showFeedbackPanel: false })
  },

  onFeedbackInput(e) {
    this.setData({ feedbackContent: e.detail.value || '' })
  },

  onFeedbackContactInput(e) {
    this.setData({ feedbackContact: e.detail.value || '' })
  },

  async onSubmitFeedback() {
    const content = (this.data.feedbackContent || '').trim()
    if (!content) {
      showToast('请输入反馈内容')
      return
    }
    if (this.data.feedbackSubmitting) {
      return
    }
    this.setData({ feedbackSubmitting: true })
    showLoading('提交中')
    try {
      const res = await callCloud('user', {
        action: 'submitFeedback',
        content,
        contact: this.data.feedbackContact
      })
      if (res && res.success) {
        this.setData({ showFeedbackPanel: false, feedbackContent: '', feedbackContact: '' })
        showToast('感谢反馈', 'success')
      } else {
        showToast((res && res.message) || '提交失败')
      }
    } catch (err) {
      console.error('反馈提交失败:', err)
      showToast('提交失败，请重试')
    } finally {
      hideLoading()
      this.setData({ feedbackSubmitting: false })
    }
  },

  noop() {}
})
