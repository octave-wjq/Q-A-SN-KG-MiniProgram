const GRAPH_URL = 'https://fudan-hiv-kg-sn.cloud/kg-sn.html'
const MAX_AUTO_RETRY = 5

Page({
  data: {
    url: '',               // 初始空，避免 web-view 用无时间戳 url 抢先加载一次
    loading: true,        // 是否显示「加载中」浮层
    failed: false,        // 是否显示「刷新」按钮（重试耗尽）
    retryCount: 0
  },

  onLoad() {
    this.loadGraph()
  },

  // 加载/重载图谱：加时间戳避免缓存，强制 web-view 重新拉取
  loadGraph() {
    this.setData({
      url: `${GRAPH_URL}?t=${Date.now()}`,
      loading: true,
      failed: false
    })
  },

  // web-view 加载成功
  onWebLoad() {
    this.setData({ loading: false, failed: false, retryCount: 0 })
  },

  // web-view 加载失败：自动重试，超过上限显示刷新按钮
  onWebError() {
    const next = this.data.retryCount + 1
    if (next < MAX_AUTO_RETRY) {
      this.setData({ retryCount: next, loading: true, failed: false })
      // 间隔递增重试，给网络恢复时间
      setTimeout(() => {
        this.setData({ url: `${GRAPH_URL}?t=${Date.now()}` })
      }, 800 + next * 400)
    } else {
      this.setData({ loading: false, failed: true })
    }
  },

  // 点击刷新按钮：重置计数重新加载
  onRetry() {
    this.setData({ retryCount: 0 })
    this.loadGraph()
  },

  onShareAppMessage() {
    return {
      title: '知识-症状网络图谱 — HIV健康知识可视化',
      path: '/pages/graph/graph'
    }
  },

  onShareTimeline() {
    return {
      title: '知识-症状网络图谱 — HIV健康知识可视化'
    }
  }
})
