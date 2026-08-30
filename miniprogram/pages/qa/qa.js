const { submitFeedback } = require('../../utils/cozeChat')
const { callCloud } = require('../../utils/api')
const { showToast, requireLogin } = require('../../utils/util')

const SEVERITY_LABELS = ['无', '轻微', '中等', '较重', '严重']

// 客服二维码云存储 fileID；展示前下载为本地临时文件，避免 image 将 cloud:// 误判为相对路径。
const SERVICE_QRCODE_FILE_ID = 'cloud://cloud1-9g32qnjv9f0dc26a.636c-cloud1-9g32qnjv9f0dc26a-1412631187/pic/微信客服.jpg'

// 证据等级归一化：高→A 中→B 低→C，缺省 C
function normalizeEvidenceLevel(raw) {
  const v = String(raw || '').trim().toUpperCase()
  if (v === 'A' || v.indexOf('高') !== -1) return 'A'
  if (v === 'B' || v.indexOf('中') !== -1) return 'B'
  if (v === 'C' || v.indexOf('低') !== -1) return 'C'
  return 'C'
}

// 前端兜底解析：当后端未解析、answer 仍是结构化 JSON 字符串时，前端自行解析出
// answer / references.literature / needHuman，避免把整段 JSON 直接显示给用户。
// 返回 { answer, literature, needHuman } 或 null（非 JSON）。
function parseAnswerJSON(text) {
  const raw = String(text || '').trim()
  if (raw.indexOf('"answer"') === -1) return null
  let obj = null
  try {
    obj = JSON.parse(raw)
  } catch (e) {
    // 容错：从第一个 { 开始做括号配平扫描，找到匹配的结束 }，
    // 自动丢弃结尾多余字符（如模型误加的 ]）。同时跳过字符串内的括号。
    const start = raw.indexOf('{')
    if (start !== -1) {
      let depth = 0, inStr = false, esc = false, end = -1
      for (let i = start; i < raw.length; i++) {
        const ch = raw[i]
        if (inStr) {
          if (esc) { esc = false }
          else if (ch === '\\') { esc = true }
          else if (ch === '"') { inStr = false }
          continue
        }
        if (ch === '"') { inStr = true }
        else if (ch === '{') { depth++ }
        else if (ch === '}') { depth--; if (depth === 0) { end = i; break } }
      }
      if (end > start) {
        try { obj = JSON.parse(raw.slice(start, end + 1)) } catch (e2) { obj = null }
      }
    }
  }
  if (!obj || typeof obj !== 'object' || typeof obj.answer !== 'string') return null

  const rawRefs = Array.isArray(obj.references) ? obj.references : []
  const literature = rawRefs
    .map((item, i) => {
      if (!item) return null
      const title = String(item.title || item.name || '').trim()
      if (!title || title === '暂无') return null
      return {
        index: Number(item.index) || (i + 1),
        title,
        evidenceLevel: normalizeEvidenceLevel(item.evidence_level || item.evidenceLevel || item.level),
        snippet: String(item.snippet || '').trim()
      }
    })
    .filter(Boolean)
  literature.forEach((item, i) => { item.index = i + 1 })

  return {
    answer: obj.answer.trim(),
    literature,
    needHuman: obj.need_human === true || obj.needHuman === true
  }
}

function clampSeverity(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 1
  return Math.max(0, Math.min(4, Math.round(parsed)))
}

function pad2(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '00'
  return n < 10 ? `0${n}` : String(n)
}

function parseDateValue(value) {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof value === 'string') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof value === 'object') {
    if (value.$date) {
      const date = new Date(value.$date)
      return Number.isNaN(date.getTime()) ? null : date
    }

    if (typeof value.seconds === 'number') {
      const date = new Date(value.seconds * 1000)
      return Number.isNaN(date.getTime()) ? null : date
    }

    if (typeof value.toDate === 'function') {
      try {
        const date = value.toDate()
        if (date instanceof Date && !Number.isNaN(date.getTime())) {
          return date
        }
      } catch (e) {
        return null
      }
    }
  }

  return null
}

function formatTimeLabel(value) {
  const date = parseDateValue(value)
  if (!date) return ''
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function buildWelcomeMessage() {
  return {
    id: 'msg-welcome',
    role: 'ai',
    text: '你好，我是你的健康问答助手。你可以咨询症状变化、用药依从、生活方式管理等问题。',
    sources: ['国家卫健委 HIV/AIDS 诊疗建议', 'WHO HIV 自我管理建议'],
    evidenceLabel: '证据等级：高',
    evidenceClass: 'tag-high',
    showFeedback: false,
    qa_id: '',
    feedbackGiven: ''
  }
}

Page({
  data: {
    inputValue: '',
    isSending: false,
    statusText: '',
    scrollIntoView: '',
    showHistory: false,
    showServiceModal: false,
    serviceQrcode: '',
    serviceQrcodeStatus: 'loading',
    conversations: [],
    currentConversationId: '',
    symptomPromptCard: null,
    messages: [buildWelcomeMessage()]
  },

  async onLoad() {
    // Workflow 模式无需预先创建会话
  },

  onShow() {
    this.consumePrefillQuestion()
    this.loadSymptomPromptCard()
    this.loadConversations()
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  consumePrefillQuestion() {
    const rawQuestion = wx.getStorageSync('qa_prefill_message')
    const question = typeof rawQuestion === 'string' ? rawQuestion.trim() : ''
    if (!question) {
      return
    }

    wx.removeStorageSync('qa_prefill_message')
    const autoSend = !!wx.getStorageSync('qa_prefill_auto_send')
    wx.removeStorageSync('qa_prefill_auto_send')

    this.setData({ inputValue: question }, () => {
      if (autoSend && !this.data.isSending) {
        this.onSend()
      }
    })
  },

  formatSymptomSummary(symptoms) {
    return (symptoms || [])
      .map((item) => `${item.name}（${SEVERITY_LABELS[clampSeverity(item.severity)]}）`)
      .join('、')
  },

  buildSymptomAdviceQuestion(symptoms) {
    const summary = this.formatSymptomSummary(symptoms)
    if (!summary) {
      return ''
    }
    return `我目前有以下症状：${summary}。请根据这些症状给出健康管理建议，包括：1.需要紧急就医的情况 2.需要随访关注的症状 3.日常自我管理建议。请使用以下固定格式输出：\n【紧急】...\n【随访】...\n【日常】...`
  },

  async loadSymptomPromptCard() {
    try {
      const cached = wx.getStorageSync('symptom_self_check_latest')
      if (cached && Array.isArray(cached.symptoms) && cached.symptoms.length) {
        const summary = this.formatSymptomSummary(cached.symptoms)
        const question = cached.question || this.buildSymptomAdviceQuestion(cached.symptoms)
        this.setData({
          symptomPromptCard: {
            date: cached.date || '',
            summary,
            question
          }
        })
        return
      }

      const result = await callCloud('health', {
        action: 'symptom_list',
        page: 1,
        page_size: 1
      })
      if (!result || result.code !== 0) {
        this.setData({ symptomPromptCard: null })
        return
      }
      const latest = result.data && result.data.list && result.data.list[0]
      if (!latest || !Array.isArray(latest.symptoms) || !latest.symptoms.length) {
        this.setData({ symptomPromptCard: null })
        return
      }

      const summary = this.formatSymptomSummary(latest.symptoms)
      this.setData({
        symptomPromptCard: {
          date: latest.date || '',
          summary,
          question: this.buildSymptomAdviceQuestion(latest.symptoms)
        }
      })
    } catch (error) {
      console.warn('加载症状记录失败:', error)
      this.setData({ symptomPromptCard: null })
    }
  },

  onUseSymptomPrompt() {
    const card = this.data.symptomPromptCard
    if (!card || !card.question) {
      showToast('暂无可用症状记录')
      return
    }
    this.setData({ inputValue: card.question }, () => {
      this.onSend()
    })
  },

  buildMessage(role, text, extra = {}) {
    const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    return {
      id,
      role,
      text,
      references: extra.references || null,
      showRefs: false,
      showFeedback: role === 'ai' && !extra.isLoading,
      qa_id: extra.qa_id || '',
      feedbackGiven: extra.feedbackGiven || ''
    }
  },

  getEvidenceMeta(level) {
    const v = String(level || '').toLowerCase()
    if (v.includes('高') || v === 'high') return { label: '证据等级：高', className: 'tag-high' }
    if (v.includes('中') || v === 'medium') return { label: '证据等级：中', className: 'tag-medium' }
    if (v.includes('低') || v === 'low') return { label: '证据等级：低', className: 'tag-low' }
    return { label: '证据等级：待核实', className: 'tag-pending' }
  },

  appendMessage(msg) {
    const messages = [...this.data.messages, msg]
    this.setData({ messages, scrollIntoView: msg.id })
  },

  updateLastAiMessage(updates) {
    // 给参考文献每项初始化展开状态，供点击展开查看 snippet
    if (updates.references && Array.isArray(updates.references.literature)) {
      updates.references.literature = updates.references.literature.map((lit) => ({
        ...lit,
        expanded: false
      }))
    }
    const messages = [...this.data.messages]
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'ai-loading' || (messages[i].role === 'ai' && messages[i].isLoading)) {
        messages[i] = {
          ...messages[i],
          ...updates,
          role: 'ai',
          isLoading: false,
          showFeedback: true,
          showRefs: false,
          showThinking: false
        }
        this.setData({ messages })
        return
      }
    }
  },

  async loadConversations() {
    try {
      const result = await callCloud('coze', { action: 'getConversations' })
      const list = result && result.success && Array.isArray(result.data) ? result.data : []
      const conversations = list.map((item) => ({
        ...item,
        timeLabel: formatTimeLabel(item.updatedAt || item.createdAt)
      }))
      this.setData({ conversations })
    } catch (error) {
      console.warn('加载会话列表失败:', error)
      this.setData({ conversations: [] })
    }
  },

  async loadMessages(conversationId) {
    const id = typeof conversationId === 'string' ? conversationId.trim() : ''
    if (!id) return

    try {
      const result = await callCloud('coze', { action: 'getMessages', conversationId: id })
      if (!result || !result.success || !Array.isArray(result.data)) {
        showToast((result && result.error) || '加载会话失败')
        return
      }

      const historyMessages = result.data.map((item, index) => {
        const isAssistant = item.role === 'assistant'
        const role = isAssistant ? 'ai' : 'user'
        let text = item.content || ''
        let references = item.references || null
        let needHuman = !!item.needHuman
        // 兜底：历史里若存了结构化 JSON 字符串，解析出纯回答和文献
        if (isAssistant) {
          const parsed = parseAnswerJSON(text)
          if (parsed) {
            text = parsed.answer || text
            if (references && typeof references === 'object') {
              references = { ...references, literature: parsed.literature }
            } else {
              references = { sn_nodes: [], kg_nodes: [], literature: parsed.literature }
            }
            needHuman = needHuman || parsed.needHuman
          }
          if (references && Array.isArray(references.literature)) {
            references.literature = references.literature.map((lit) => ({ ...lit, expanded: false }))
          }
        }
        return {
          id: item._id || `msg-history-${Date.now()}-${index}`,
          role,
          text,
          references: isAssistant ? references : null,
          thinking: isAssistant ? (item.thinking || null) : null,
          needHuman: isAssistant ? needHuman : false,
          showRefs: false,
          showThinking: false,
          showFeedback: isAssistant,
          qa_id: item.qa_id || '',
          feedbackGiven: (item.feedback && item.feedback.type) || ''
        }
      })

      const messages = historyMessages.length ? historyMessages : [buildWelcomeMessage()]
      const lastMessage = messages[messages.length - 1]
      this.setData({
        messages,
        currentConversationId: id,
        scrollIntoView: lastMessage ? lastMessage.id : ''
      })
    } catch (error) {
      console.warn('加载会话消息失败:', error)
      showToast('加载会话失败')
    }
  },

  async onShowHistory() {
    this.setData({ showHistory: true })
    await this.loadConversations()
  },

  onCloseHistory() {
    this.setData({ showHistory: false })
  },

  async onSelectConversation(e) {
    const id = (e.currentTarget.dataset.id || '').trim()
    if (!id) return
    await this.loadMessages(id)
    this.onCloseHistory()
  },

  onRenameConversation(e) {
    const id = (e.currentTarget.dataset.id || '').trim()
    if (!id) return
    const conv = this.data.conversations.find(c => c._id === id)
    const oldTitle = (conv && conv.title) || ''
    wx.showActionSheet({
      itemList: ['重命名', '删除会话'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.doRename(id, oldTitle)
        } else if (res.tapIndex === 1) {
          this.doDelete(id)
        }
      }
    })
  },

  doRename(id, oldTitle) {
    wx.showModal({
      title: '重命名会话',
      editable: true,
      placeholderText: '输入新名称',
      content: oldTitle,
      success: async (res) => {
        if (!res.confirm || !res.content || !res.content.trim()) return
        try {
          await callCloud('coze', { action: 'renameConversation', conversationId: id, title: res.content.trim() })
          await this.loadConversations()
          showToast('已重命名')
        } catch (err) {
          showToast('重命名失败')
        }
      }
    })
  },

  doDelete(id) {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定删除该会话？',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await callCloud('coze', { action: 'deleteConversation', conversationId: id })
          if (this.data.currentConversationId === id) {
            this.setData({ currentConversationId: '', messages: [buildWelcomeMessage()] })
          }
          await this.loadConversations()
          showToast('已删除')
        } catch (err) {
          showToast('删除失败')
        }
      }
    })
  },

  async onSend() {
    const question = this.data.inputValue.trim()
    if (!question || this.data.isSending) return
    if (!requireLogin('登录后即可使用健康问答')) return

    const userMsg = this.buildMessage('user', question)
    this.appendMessage(userMsg)
    this.setData({ inputValue: '', isSending: true, statusText: '思考中...' })

    const loadingMsg = {
      id: `msg-loading-${Date.now()}`,
      role: 'ai',
      text: '',
      sources: [],
      evidenceLabel: '',
      evidenceClass: '',
      isLoading: true,
      showFeedback: false,
      qa_id: '',
      feedbackGiven: ''
    }
    this.appendMessage(loadingMsg)

    try {
      const result = await callCloud('coze', {
        action: 'chat',
        question,
        conversationId: this.data.currentConversationId
      })

      if (result && result.code === 0 && result.data) {
        // 前端兜底：后端若未解析、answer 仍是结构化 JSON，则前端自行解析
        let answerText = result.data.answer || '抱歉，暂时无法回答您的问题。'
        let references = result.data.references || null
        let needHuman = !!result.data.needHuman
        const parsed = parseAnswerJSON(answerText)
        if (parsed) {
          answerText = parsed.answer || answerText
          if (references && typeof references === 'object') {
            references = { ...references, literature: parsed.literature }
          } else {
            references = { sn_nodes: [], kg_nodes: [], literature: parsed.literature }
          }
          needHuman = needHuman || parsed.needHuman
        }
        this.updateLastAiMessage({
          text: answerText,
          references: references,
          thinking: result.data.thinking || null,
          needHuman: needHuman,
          elapsedText: result.data.elapsedMs ? (result.data.elapsedMs / 1000).toFixed(1) + 's' : '',
          qa_id: result.data.qa_id || ''
        })

        if (result.data.conversationId) {
          this.setData({ currentConversationId: result.data.conversationId })
        }
        this.loadConversations()
      } else {
        this.updateLastAiMessage({
          text: (result && result.message) || '服务返回异常，请稍后重试。',
          references: null
        })
      }
    } catch (err) {
      console.error('问答失败:', err)
      this.updateLastAiMessage({
        text: '当前服务暂不可用，请稍后再试。',
        references: null
      })
      showToast('服务暂时不可用')
    } finally {
      this.setData({ isSending: false, statusText: '' })
    }
  },

  async onFeedbackTap(e) {
    const { qaid, type } = e.currentTarget.dataset
    console.log('[feedback] qa_id:', qaid, 'type:', type)
    if (!qaid) {
      showToast('反馈提交失败')
      return
    }

    try {
      const result = await submitFeedback(qaid, type)
      console.log('[feedback] result:', JSON.stringify(result))
      if (result && result.success) {
        const messages = this.data.messages.map((m) => {
          if (m.qa_id === qaid) return { ...m, feedbackGiven: type }
          return m
        })
        this.setData({ messages })
        showToast(type === 'helpful' ? '感谢反馈' : '已记录，我们会改进')
      } else {
        console.error('反馈提交失败:', result)
        showToast((result && result.message) || '反馈提交失败')
      }
    } catch (err) {
      console.error('反馈提交异常:', err)
      showToast('反馈提交失败')
    }
  },

  onNewChat() {
    this.setData({
      messages: [buildWelcomeMessage()],
      currentConversationId: '',
      inputValue: '',
      statusText: '',
      scrollIntoView: 'msg-welcome'
    })
  },

  toggleRefs(e) {
    const idx = e.currentTarget.dataset.idx
    const key = `messages[${idx}].showRefs`
    this.setData({ [key]: !this.data.messages[idx].showRefs })
  },

  // 展开/收起某条参考文献的 snippet（命中文本块/指南原文）
  toggleLitDetail(e) {
    const idx = Number(e.currentTarget.dataset.idx)
    const litIdx = Number(e.currentTarget.dataset.lit)
    const message = this.data.messages[idx]
    if (!message || !message.references || !message.references.literature) {
      return
    }
    const current = message.references.literature[litIdx]
    if (!current || !current.snippet) {
      return
    }
    const key = `messages[${idx}].references.literature[${litIdx}].expanded`
    this.setData({ [key]: !current.expanded })
  },

  // 点击 KG/SN 节点 → 跳转图谱页并聚焦该节点（高亮节点+邻居，弱化其余）
  onRefNodeTap(e) {
    const label = e.currentTarget.dataset.label
    const type = e.currentTarget.dataset.type
    if (!label) {
      return
    }
    const base = 'https://fudan-hiv-kg-sn.cloud/kg-sn.html'
    const url = `${base}?focus=${encodeURIComponent(label)}&type=${encodeURIComponent(type || '')}`
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(url)
    })
  },

  toggleThinking(e) {
    const idx = e.currentTarget.dataset.idx
    const key = `messages[${idx}].showThinking`
    this.setData({ [key]: !this.data.messages[idx].showThinking })
  },

  onContactHuman() {
    this.setData({ showServiceModal: true })
    if (!this.data.serviceQrcode || this.data.serviceQrcodeStatus === 'error') {
      this.loadServiceQrcode()
    }
  },

  onServiceQrcodeLoad() {
    this.setData({ serviceQrcodeStatus: 'loaded' })
  },

  onServiceQrcodeError(e) {
    console.warn('加载客服二维码失败:', e.detail)
    this.setData({ serviceQrcodeStatus: 'error' })
  },

  loadServiceQrcode() {
    this.setData({
      serviceQrcodeStatus: 'loading',
      serviceQrcode: ''
    })
    wx.cloud.downloadFile({
      fileID: SERVICE_QRCODE_FILE_ID,
      success: (res) => {
        if (!res.tempFilePath) {
          console.warn('下载客服二维码失败: 未返回临时文件路径')
          this.setData({ serviceQrcodeStatus: 'error' })
          return
        }
        this.setData({ serviceQrcode: res.tempFilePath })
      },
      fail: (err) => {
        console.warn('下载客服二维码失败:', err)
        this.setData({ serviceQrcodeStatus: 'error' })
      }
    })
  },

  onRetryServiceQrcode() {
    this.loadServiceQrcode()
  },

  onCloseServiceModal() {
    this.setData({ showServiceModal: false })
  },

  onShareAppMessage() {
    return {
      title: '健康问答 — 有HIV健康问题，随时问一问',
      path: '/pages/qa/qa'
    }
  },

  onShareTimeline() {
    return {
      title: '健康问答 — 有HIV健康问题，随时问一问'
    }
  }
})
