const { callCloud } = require('../../utils/api')
const sharedCloud = require('../../utils/cloud')
const { showLoading, hideLoading, showToast } = require('../../utils/util')

const DEFAULT_AVATAR = '/images/default-avatar.png'
const ADMIN_OPENIDS = ['oQ0UG7ooFWi9ekMxXK9bO9HM9OOY']

// 将头像地址解析为可直接展示的地址；cloud:// fileID 走共享实例解析为临时 https 地址，
// 其它（默认图 / 外部 URL）原样返回。持久 fileID 始终保留，不回写短期地址。
function resolveAvatarForDisplay(url) {
  if (!url) return Promise.resolve('')
  if (typeof url === 'string' && url.indexOf('cloud://') === 0) {
    return sharedCloud.resolveForDisplay(url).catch(() => '')
  }
  return Promise.resolve(url)
}

// 当前用户 openid（本地缓存优先，兼容 globalData 中已有的身份字段）；登出后为空字符串
function currentOpenid() {
  const app = getApp()
  const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || null
  return wx.getStorageSync('openid') || (userInfo && userInfo.openid) || ''
}

Page({
  data: {
    userInfo: { nickName: '', avatarUrl: DEFAULT_AVATAR, avatarDisplay: DEFAULT_AVATAR },
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
      const persistentAvatar = currentUser.avatarUrl || DEFAULT_AVATAR
      // cloud:// fileID 在共享环境下不可直接渲染：解析请求期间先用默认头像占位，
      // 解析成功后才换成 https；解析失败保持占位，绝不把 fileID 写入展示字段。
      const isCloudAvatar = typeof persistentAvatar === 'string' && persistentAvatar.indexOf('cloud://') === 0
      this.setData({
        isLogin: true,
        isAdmin: ADMIN_OPENIDS.includes(cachedOpenid),
        // avatarUrl 始终保留持久 fileID（不回写临时地址）
        userInfo: {
          nickName: currentUser.nickName || '微信用户',
          avatarUrl: persistentAvatar,
          avatarDisplay: isCloudAvatar ? DEFAULT_AVATAR : persistentAvatar
        },
        userId: cachedOpenid.slice(-8)
      })
      this.refreshAvatarDisplay(persistentAvatar)
    } else {
      // 每次展示/登出都作废在途解析，避免旧结果迟到覆盖游客展示
      this._avatarGeneration = (this._avatarGeneration || 0) + 1
      this.setData({
        isLogin: false,
        isAdmin: false,
        userInfo: { nickName: '', avatarUrl: DEFAULT_AVATAR, avatarDisplay: DEFAULT_AVATAR },
        userId: ''
      })
    }
  },

  // 将持久头像 fileID 解析为可展示地址（临时 https），仅更新展示字段，不回写持久记录。
  // 解析是异步的：写回前要求「请求序号 + 当前用户 openid + 持久头像」三者同时匹配本次请求，
  // 作废登出、换用户、同 fileID 换用户（A→B→A）等场景下迟到的旧解析结果。
  async refreshAvatarDisplay(persistentAvatar) {
    const generation = (this._avatarGeneration = (this._avatarGeneration || 0) + 1)
    const identity = currentOpenid()
    const display = await resolveAvatarForDisplay(persistentAvatar)
    if (!display) return
    if (this._avatarGeneration !== generation) return
    if (currentOpenid() !== identity) return
    const current = this.data.userInfo && this.data.userInfo.avatarUrl
    if (current === persistentAvatar && display !== this.data.userInfo.avatarDisplay) {
      this.setData({ 'userInfo.avatarDisplay': display })
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
      // 预览用可展示地址；保存时仍以持久 fileID 为准
      editAvatar: this.data.userInfo.avatarDisplay || this.data.userInfo.avatarUrl,
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
      // 仅当用户新选本地头像时上传到共享目标存储；否则保留持久 fileID（不回写临时展示地址）
      let finalAvatar = this.data.userInfo.avatarUrl || DEFAULT_AVATAR
      const candidate = (avatarUrl || '').trim()
      if (candidate.startsWith('http://tmp') || candidate.startsWith('wxfile://')) {
        const uploadRes = await sharedCloud.uploadFile({
          cloudPath: `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
          filePath: candidate
        })
        finalAvatar = uploadRes.fileID
      } else if (candidate.startsWith('cloud://')) {
        // 已是持久 fileID（例如重新确认当前头像），直接沿用
        finalAvatar = candidate
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
