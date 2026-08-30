const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command
const https = require('https')
const { COZE_API_TOKEN, WORKFLOW_ID } = require('./config')

// ---- 知识图谱全量缓存（模块级，跨调用复用）----
let _kgNodesCache = null
let _kgEdgesCache = null

// ---- HTTP 工具 ----
function makeHttpRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(body) })
        } catch (error) {
          reject(new Error('解析响应失败: ' + error.message))
        }
      })
    })
    req.on('error', reject)
    if (data) req.write(JSON.stringify(data))
    req.end()
  })
}

const cozeHeaders = {
  'Authorization': `Bearer ${COZE_API_TOKEN}`,
  'Content-Type': 'application/json'
}

function normalizeConversationId(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function buildConversationTitle(question) {
  return String(question || '').trim().slice(0, 20) || '新对话'
}

async function createConversationRecord(userId) {
  const now = new Date()
  const data = {
    userId,
    title: '新对话',
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    lastMessage: '',
    isActive: true
  }
  const addResult = await db.collection('conversations').add({ data })
  return { _id: addResult._id, ...data }
}

async function getUserConversation(conversationId, userId) {
  if (!conversationId) return null
  const result = await db.collection('conversations')
    .where({
      _id: conversationId,
      userId,
      isActive: _.neq(false)
    })
    .limit(1)
    .get()
  return (result.data && result.data[0]) || null
}

// ---- 加载全部 KG 节点（先 count 再分页并行拉取 + 模块级缓存）----
async function loadAllKgNodes() {
  if (_kgNodesCache) return _kgNodesCache
  const PAGE = 100
  const countRes = await db.collection('kg_nodes').count()
  const total = countRes.total || 0
  const tasks = []
  for (let i = 0; i * PAGE < total; i++) {
    tasks.push(db.collection('kg_nodes').skip(i * PAGE).limit(PAGE).get())
  }
  const results = await Promise.all(tasks)
  const all = []
  results.forEach(r => { if (r && r.data) all.push(...r.data) })
  _kgNodesCache = all
  return all
}

// ---- 加载全部 KG 边（先 count 再分页并行拉取 + 模块级缓存）----
async function loadAllKgEdges() {
  if (_kgEdgesCache) return _kgEdgesCache
  const PAGE = 100
  const countRes = await db.collection('kg_edges').count()
  const total = countRes.total || 0
  const tasks = []
  for (let i = 0; i * PAGE < total; i++) {
    tasks.push(db.collection('kg_edges').skip(i * PAGE).limit(PAGE).get())
  }
  const results = await Promise.all(tasks)
  const all = []
  results.forEach(r => { if (r && r.data) all.push(...r.data) })
  _kgEdgesCache = all
  return all
}

// ---- 图谱上下文构建 ----
// question: 原始用户问题（用于 thinking 文案、context 标题）
// matchText: 用于节点名匹配的文本，默认 = question。
//   传入 question + 回答正文 时，可识别出回答里实际涉及的 KG/SN 节点（更全）。
async function buildGraphContext(question, matchText) {
  const contextParts = []
  const references = { sn_nodes: [], kg_nodes: [], literature: [] }
  const thinking = { sn_matched: [], kg_matched: [], steps: [] }
  const q = String(matchText || question || '')
  let snHitCount = 0
  let kgHitCount = 0

  try {
    const snResult = await db.collection('sn_graph').doc('sn_graph_v1').get()
    if (snResult.data) {
      const nodes = snResult.data.nodes || []
      const edges = snResult.data.edges || []
      const matched = nodes.filter(nd => {
        const label = nd.label || nd.id || ''
        return label.length >= 2 && q.indexOf(label) !== -1
      })
      snHitCount = matched.length
      if (matched.length > 0) {
        const snRefs = matched.map(nd => {
          const strength = (nd.centrality && nd.centrality.strength) || 0
          const neighbors = edges
            .filter(e => e.source === nd.id || e.target === nd.id)
            .sort((a, b) => Math.abs(b.weight || 0) - Math.abs(a.weight || 0))
            .slice(0, 5)
            .map(e => {
              const other = e.source === nd.id ? e.target : e.source
              return { name: other, weight: +(e.weight || 0).toFixed(3) }
            })
          return {
            label: nd.label || nd.id,
            group: nd.group || '',
            strength: +strength.toFixed(3),
            neighbors
          }
        })
        references.sn_nodes = snRefs
        thinking.sn_matched = snRefs.map(r => r.label)
        const lines = snRefs.map(r =>
          `"${r.label}"(strength=${r.strength})，相关：${r.neighbors.map(n => `${n.name}(${n.weight})`).join('、')}`
        )
        contextParts.push(`[症状网络] ${lines.join('；')}`)
      }
    }
  } catch (e) {
    console.warn('[buildGraphContext] SN查询失败:', e.message)
  }

  try {
    const kgNodes = await loadAllKgNodes()
    const matchedKg = kgNodes.filter(nd => {
      const label = nd.label || ''
      return label.length >= 2 && q.indexOf(label) !== -1
    })
    kgHitCount = matchedKg.length
    if (matchedKg.length > 0) {
      const kgEdges = await loadAllKgEdges()
      const kgRefs = matchedKg.slice(0, 5).map(nd => {
        const nodeId = nd.node_id || nd.label
        const rels = kgEdges
          .filter(e => e.source === nodeId || e.target === nodeId)
          .slice(0, 6)
          .map(e => e.source === nodeId
            ? `→${e.relation}→${e.target}`
            : `${e.source}→${e.relation}→`)
        return {
          label: nd.label,
          type: nd.type || '',
          relations: rels
        }
      })
      references.kg_nodes = kgRefs
      thinking.kg_matched = kgRefs.map(r => r.label)
      const lines = kgRefs.map(r => `${r.label}(${r.type})：${r.relations.join('、')}`)
      contextParts.push(`[知识图谱] ${lines.join('；')}`)
    }
  } catch (e) {
    console.warn('[buildGraphContext] KG查询失败:', e.message)
  }

  // 生成「思考过程」步骤
  const snStep = snHitCount > 0
    ? `② 检索症状网络：命中 ${snHitCount} 个节点（${thinking.sn_matched.join('、')}）`
    : '② 检索症状网络：未命中相关节点'
  const kgStep = kgHitCount > 0
    ? `③ 检索知识图谱：命中 ${kgHitCount} 个节点（${thinking.kg_matched.join('、')}）`
    : '③ 检索知识图谱：未命中相关节点'
  thinking.steps = [
    '① 解析问题关键词',
    snStep,
    kgStep,
    '④ 注入检索到的节点与关系作为上下文',
    '⑤ 调用知识库生成专业回答'
  ]

  return { context: contextParts.join('\n'), references, thinking }
}

// ---- 证据等级中文映射 ----
function normalizeEvidenceLevel(raw) {
  const v = String(raw || '').trim().toUpperCase()
  if (v === 'A' || v.indexOf('高') !== -1) return 'A'
  if (v === 'B' || v.indexOf('中') !== -1) return 'B'
  if (v === 'C' || v.indexOf('低') !== -1) return 'C'
  return 'C'
}

// ---- 从回答中解析【参考文献】块（文本格式，向后兼容兜底）----
function parseLiterature(answer) {
  const text = String(answer || '')
  const markerIdx = text.indexOf('【参考文献】')
  if (markerIdx === -1) {
    return { cleanAnswer: text.trim(), literature: [] }
  }

  const cleanAnswer = text.slice(0, markerIdx).trim()
  const block = text.slice(markerIdx + '【参考文献】'.length)
  const literature = []

  block.split(/\r?\n/).forEach((line) => {
    const row = line.trim()
    if (!row) return
    // 形如 "1. 文献名称 | 证据等级:A"
    const m = row.match(/^(\d+)[\.\、\)]\s*(.+)$/)
    if (!m) return
    let title = m[2].trim()
    let evidenceLevel = 'C'
    const parts = title.split(/[|｜]/)
    if (parts.length >= 2) {
      title = parts[0].trim()
      const levelPart = parts.slice(1).join('|')
      const lm = levelPart.match(/证据等级\s*[:：]?\s*([A-Ca-c高中低]+)/)
      evidenceLevel = normalizeEvidenceLevel(lm ? lm[1] : levelPart)
    }
    if (title && title !== '暂无') {
      literature.push({ index: Number(m[1]), title, evidenceLevel })
    }
  })

  literature.sort((a, b) => a.index - b.index)
  return { cleanAnswer, literature }
}

// ---- 解析结构化 JSON 输出（优先方案）----
// 期望 Coze 结束节点输出形如：
// { "answer": "...", "references": [{ "title": "中国艾滋病诊疗指南2021", "evidence_level": "A", "snippet": "..." }], "need_human": false }
function parseStructured(raw) {
  let obj = null
  if (raw && typeof raw === 'object') {
    obj = raw
  } else if (typeof raw === 'string') {
    const text = raw.trim()
    // 直接尝试整体解析；失败则从第一个 { 做括号配平扫描找到匹配的结束 }，
    // 自动丢弃结尾多余字符（如模型误加的 ]），并跳过字符串内的括号。
    try {
      obj = JSON.parse(text)
    } catch (e) {
      const start = text.indexOf('{')
      if (start !== -1) {
        let depth = 0, inStr = false, esc = false, end = -1
        for (let i = start; i < text.length; i++) {
          const ch = text[i]
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
          try { obj = JSON.parse(text.slice(start, end + 1)) } catch (e2) { obj = null }
        }
      }
    }
  }

  if (!obj || typeof obj !== 'object' || typeof obj.answer !== 'string') {
    return null
  }

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
    cleanAnswer: obj.answer.trim(),
    literature,
    needHuman: obj.need_human === true || obj.needHuman === true
  }
}

// ---- 判断是否需要转人工 ----
function detectNeedHuman(answer) {
  const text = String(answer || '').trim()
  if (text.length < 8) return true
  if (text.length < 40 && /无法回答|暂时无法|抱歉/.test(text)) return true
  if (text.length < 30 && /我不确定|无法确定|建议咨询专业/.test(text)) return true
  return false
}
// ---- 调用 Workflow API（同步，一次拿结果）----
// question: 干净的用户问题（只此项进入意图分类节点，避免污染分类器）
// graphContext: 图谱检索上下文，作为独立参数 GRAPH_CONTEXT 传入，供"回答生成"节点引用
async function callWorkflow(question, graphContext, userId) {
  let resp
  try {
    resp = await makeHttpRequest({
      hostname: 'api.coze.cn',
      port: 443,
      path: '/v1/workflow/run',
      method: 'POST',
      headers: cozeHeaders
    }, {
      workflow_id: WORKFLOW_ID,
      parameters: {
        BOT_USER_INPUT: question,
        GRAPH_CONTEXT: graphContext || '',
        user_id: userId || 'anonymous'
      }
    })
  } catch (e) {
    return { answer: '', literature: [], needHuman: true, error: e.message }
  }

  if (resp.statusCode !== 200) {
    return { answer: '', literature: [], needHuman: true, error: `HTTP ${resp.statusCode}` }
  }

  const result = resp.data
  if (!result || result.code !== 0) {
    return { answer: '', literature: [], needHuman: true, error: (result && result.msg) || 'workflow error' }
  }

  // result.data 是 JSON 字符串，格式为 {"content_type":1,"data":"回答内容",...}
  let rawAnswer = ''
  try {
    const outer = typeof result.data === 'string' ? JSON.parse(result.data) : result.data
    rawAnswer = (outer && (outer.data || outer.output || outer.answer || outer.content || outer.result)) || ''
    if (typeof rawAnswer !== 'string') rawAnswer = JSON.stringify(rawAnswer)
    rawAnswer = rawAnswer.replace(/^\s*\+\s*/, '').trim()
  } catch (e) {
    rawAnswer = typeof result.data === 'string' ? result.data.trim() : ''
  }

  // 优先按结构化 JSON 解析；失败则回退到【参考文献】文本解析（向后兼容）
  const structured = parseStructured(rawAnswer)
  if (structured) {
    const needHuman = structured.needHuman || detectNeedHuman(structured.cleanAnswer)
    return { answer: structured.cleanAnswer, literature: structured.literature, needHuman }
  }

  const { cleanAnswer, literature } = parseLiterature(rawAnswer)
  const needHuman = detectNeedHuman(cleanAnswer)

  return { answer: cleanAnswer, literature, needHuman }
}

// ---- action: chat / 直接问答 ----
async function handleChat(params, openid) {
  const question = typeof params.question === 'string' ? params.question.trim() : ''
  if (!question) {
    return { code: 400, message: 'question 不能为空', data: null }
  }

  const requestedConversationId = normalizeConversationId(params.conversationId)
  let conversation = null

  if (requestedConversationId) {
    conversation = await getUserConversation(requestedConversationId, openid)
    if (!conversation) {
      return { code: 404, message: 'conversationId 无效或无权限', data: null }
    }
  } else {
    conversation = await createConversationRecord(openid)
  }

  const conversationId = conversation._id
  const isFirstMessage = Number(conversation.messageCount || 0) === 0

  const startTs = Date.now()

  // 构建图谱上下文，增强问答准确性
  let graphContext = ''
  let references = { sn_nodes: [], kg_nodes: [], literature: [] }
  let thinking = { sn_matched: [], kg_matched: [], steps: [] }
  try {
    // 第一遍：仅用问题匹配，生成注入工作流的 context（保持 GRAPH_CONTEXT 干净、聚焦问题）
    const graphResult = await buildGraphContext(question)
    graphContext = graphResult.context || ''
    references = graphResult.references
    thinking = graphResult.thinking || thinking
  } catch (e) {
    console.warn('[handleChat] 图谱上下文构建失败:', e.message)
  }

  // 注意：BOT_USER_INPUT 只传干净的用户问题，避免污染工作流的意图分类节点；
  // 图谱上下文通过独立参数 GRAPH_CONTEXT 传入，由"回答生成"节点引用。
  const workflowResult = await callWorkflow(question, graphContext, openid)
  const needHuman = !!workflowResult.needHuman
  let answer = workflowResult.answer
  references.literature = workflowResult.literature || []
  if (needHuman && !answer) {
    answer = '这个问题我暂时无法准确回答，建议你点击下方「转人工咨询」联系专业人员。'
  }

  // 第二遍：用「问题 + 回答正文」回扫节点，识别出回答里实际涉及的 KG/SN 节点（展示更全）。
  // 仅在有回答时执行；失败不影响主流程，沿用第一遍结果。
  if (answer) {
    try {
      const enriched = await buildGraphContext(question, `${question}\n${answer}`)
      const litBackup = references.literature
      references = enriched.references
      references.literature = litBackup
      thinking = enriched.thinking || thinking
    } catch (e) {
      console.warn('[handleChat] 回答正文节点回扫失败:', e.message)
    }
  }

  const elapsedMs = Date.now() - startTs
  const sources = references.literature.map(item => item.title)

  // 存入 qa_history
  const qaResult = await db.collection('qa_history').add({
    data: {
      _openid: openid,
      question,
      answer,
      sources,
      references,
      thinking,
      needHuman,
      elapsedMs,
      conversationId,
      timestamp: db.serverDate(),
      feedback: null
    }
  })

  const userMessageTime = new Date()
  await db.collection('messages').add({
    data: {
      conversationId,
      userId: openid,
      role: 'user',
      content: question,
      createdAt: userMessageTime
    }
  })

  const assistantMessageTime = new Date()
  await db.collection('messages').add({
    data: {
      conversationId,
      userId: openid,
      role: 'assistant',
      content: answer,
      createdAt: assistantMessageTime,
      qa_id: qaResult._id,
      sources,
      references,
      thinking,
      needHuman,
      elapsedMs
    }
  })

  const conversationUpdate = {
    updatedAt: assistantMessageTime,
    messageCount: _.inc(2),
    lastMessage: answer,
    isActive: true
  }
  if (isFirstMessage) {
    conversationUpdate.title = buildConversationTitle(question)
  }
  await db.collection('conversations').doc(conversationId).update({
    data: conversationUpdate
  })

  return {
    code: 0,
    message: 'success',
    data: { answer, references, thinking, needHuman, elapsedMs, qa_id: qaResult._id, conversationId }
  }
}

// ---- action: createConversation ----
async function handleCreateConversation(openid) {
  const record = await createConversationRecord(openid)
  return {
    success: true,
    data: {
      _id: record._id,
      conversationId: record._id,
      title: record.title,
      createdAt: record.createdAt
    }
  }
}

// ---- action: getConversations ----
async function handleGetConversations(openid) {
  const result = await db.collection('conversations')
    .where({
      userId: openid,
      isActive: _.neq(false)
    })
    .orderBy('updatedAt', 'desc')
    .limit(50)
    .get()

  return {
    success: true,
    data: result.data || []
  }
}

// ---- action: getMessages ----
async function handleGetMessages(params, openid) {
  const conversationId = normalizeConversationId(params.conversationId)
  if (!conversationId) {
    return { success: false, error: '缺少 conversationId' }
  }

  const conversation = await getUserConversation(conversationId, openid)
  if (!conversation) {
    return { success: false, error: '会话不存在或无权限' }
  }

  const pageSize = 100
  let skip = 0
  let done = false
  const rows = []

  while (!done) {
    const batch = await db.collection('messages')
      .where({ conversationId, userId: openid })
      .orderBy('createdAt', 'asc')
      .skip(skip)
      .limit(pageSize)
      .get()

    const list = batch.data || []
    rows.push(...list)
    if (list.length < pageSize) {
      done = true
    } else {
      skip += pageSize
    }
  }

  return {
    success: true,
    data: rows
  }
}

// ---- action: deleteConversation ----
async function handleDeleteConversation(params, openid) {
  const conversationId = normalizeConversationId(params.conversationId)
  if (!conversationId) {
    return { success: false, error: '缺少 conversationId' }
  }

  const conversation = await getUserConversation(conversationId, openid)
  if (!conversation) {
    return { success: false, error: '会话不存在或无权限' }
  }

  await db.collection('conversations').doc(conversationId).update({
    data: {
      isActive: false,
      updatedAt: new Date()
    }
  })
  return { success: true, data: { updated: true } }
}

async function handleRenameConversation(params, openid) {
  const conversationId = normalizeConversationId(params.conversationId)
  if (!conversationId) {
    return { success: false, error: '缺少 conversationId' }
  }
  const title = (params.title || '').trim()
  if (!title) {
    return { success: false, error: '缺少新标题' }
  }

  const conversation = await getUserConversation(conversationId, openid)
  if (!conversation) {
    return { success: false, error: '会话不存在或无权限' }
  }

  await db.collection('conversations').doc(conversationId).update({
    data: { title, updatedAt: new Date() }
  })
  return { success: true, data: { updated: true } }
}

// ---- action: history ----
async function handleHistory(params, openid) {
  const page = Math.max(1, parseInt(params.page) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(params.page_size) || 20))
  const skip = (page - 1) * pageSize

  const countResult = await db.collection('qa_history').where({ _openid: openid }).count()
  const listResult = await db.collection('qa_history')
    .where({ _openid: openid })
    .orderBy('timestamp', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return { success: true, data: { list: listResult.data, total: countResult.total } }
}

// ---- action: feedback ----
async function handleFeedback(params, openid) {
  const { qa_id, feedback_type, comment } = params
  if (!qa_id) return { success: false, error: '缺少 qa_id' }
  if (!['helpful', 'inaccurate'].includes(feedback_type)) {
    return { success: false, error: 'feedback_type 必须为 helpful 或 inaccurate' }
  }

  const feedbackData = { type: feedback_type, comment: comment || '', updatedAt: db.serverDate() }

  // 尝试更新 qa_history
  try {
    await db.collection('qa_history').doc(qa_id).update({
      data: { feedback: feedbackData }
    })
  } catch (e) {
    console.warn('[feedback] qa_history 更新失败，尝试直接写入:', e.message)
    // 文档可能不存在，直接创建反馈记录
    await db.collection('qa_feedback').add({
      data: {
        qa_id,
        _openid: openid,
        feedback_type,
        comment: comment || '',
        createdAt: db.serverDate()
      }
    })
  }

  // 同步写入 messages（不影响主流程）
  try {
    await db.collection('messages').where({ qa_id }).update({
      data: { feedback: feedbackData }
    })
  } catch (e) {
    console.warn('[feedback] messages 同步失败:', e.message)
  }

  return { success: true, data: { updated: true } }
}

// ---- 主入口 ----
exports.main = async (event = {}) => {
  const { action, ...params } = event
  const { OPENID } = cloud.getWXContext()

  try {
    // 兼容无 action 的直接问答调用（首页症状建议）
    if (!action) {
      if (typeof params.question === 'string' && params.question.trim()) {
        return await handleChat(params, OPENID)
      }
      return { success: false, error: '缺少 action 参数' }
    }

    switch (action) {
      case 'chat':               return await handleChat(params, OPENID)
      case 'createConversation': return await handleCreateConversation(OPENID)
      case 'getConversations':   return await handleGetConversations(OPENID)
      case 'getMessages':        return await handleGetMessages(params, OPENID)
      case 'deleteConversation': return await handleDeleteConversation(params, OPENID)
      case 'renameConversation': return await handleRenameConversation(params, OPENID)
      case 'history':            return await handleHistory(params, OPENID)
      case 'feedback':           return await handleFeedback(params, OPENID)
      default:                   return { success: false, error: `不支持的 action: ${action}` }
    }
  } catch (err) {
    console.error(`[coze] action=${action} error:`, err)
    return { code: 500, message: err.message || '服务异常', data: null }
  }
}
