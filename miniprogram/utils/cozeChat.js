/**
 * Coze 对话管理工具
 * 封装 发送消息 → 轮询状态 → 获取回复 的完整流程
 */
const { callCloud } = require('./api')

const POLL_INTERVAL = 1500   // 轮询间隔 ms
const MAX_POLLS = 40         // 最多轮询次数（约 60 秒）

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 创建 Coze 会话
async function createConversation() {
  const result = await callCloud('coze', { action: 'createConversation' })
  if (!result || !result.success) {
    throw new Error((result && result.error) || '创建会话失败')
  }
  return result.data // { _id, conversationId, title, createdAt }
}

// 发送消息并轮询获取回复（完整流程）
async function sendAndGetReply({ conversationId, localConversationId, message, onStatusChange }) {
  // 第一步：发送消息
  if (onStatusChange) onStatusChange('sending')
  const sendResult = await callCloud('coze', {
    action: 'sendMessage',
    conversationId,
    localConversationId,
    message
  })
  if (!sendResult || !sendResult.success) {
    throw new Error((sendResult && sendResult.error) || '发送消息失败')
  }
  const chatId = sendResult.data.chatId

  // 第二步：轮询状态
  if (onStatusChange) onStatusChange('thinking')
  let status = 'in_progress'
  let pollCount = 0

  while (status === 'in_progress' && pollCount < MAX_POLLS) {
    await sleep(POLL_INTERVAL)
    pollCount++
    try {
      const statusResult = await callCloud('coze', {
        action: 'checkStatus',
        chatId,
        conversationId
      })
      if (statusResult && statusResult.success) {
        status = statusResult.data.status
      }
    } catch (e) {
      console.warn(`轮询第${pollCount}次出错:`, e.message)
    }
  }

  if (status !== 'completed') {
    return {
      reply: '正在为您查询相关信息，请稍等片刻后重试...',
      chatId,
      timeout: true
    }
  }

  // 第三步：获取回复
  if (onStatusChange) onStatusChange('replying')
  const replyResult = await callCloud('coze', {
    action: 'getReply',
    chatId,
    conversationId,
    localConversationId,
    question: message
  })
  if (!replyResult || !replyResult.success) {
    throw new Error((replyResult && replyResult.error) || '获取回复失败')
  }

  return {
    reply: replyResult.data.reply,
    chatId,
    qa_id: replyResult.data.qa_id,
    timeout: false
  }
}

// 获取会话列表
async function getConversations() {
  const result = await callCloud('coze', { action: 'getConversations' })
  if (!result || !result.success) return []
  return result.data
}

// 获取会话消息
async function getMessages(conversationId) {
  const result = await callCloud('coze', { action: 'getMessages', conversationId })
  if (!result || !result.success) return []
  return result.data
}

// 删除会话
async function deleteConversation(conversationId) {
  return callCloud('coze', { action: 'deleteConversation', conversationId })
}

// 提交反馈
async function submitFeedback(qa_id, feedback_type, comment) {
  return callCloud('coze', { action: 'feedback', qa_id, feedback_type, comment })
}

// 获取问答历史
async function getHistory(page, page_size) {
  const result = await callCloud('coze', { action: 'history', page, page_size })
  if (!result || !result.success) return { list: [], total: 0 }
  return result.data
}

module.exports = {
  createConversation,
  sendAndGetReply,
  getConversations,
  getMessages,
  deleteConversation,
  submitFeedback,
  getHistory
}
