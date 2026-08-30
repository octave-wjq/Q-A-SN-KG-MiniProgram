const { showToast, showLoading, hideLoading } = require('../../utils/util');
const { callCloud } = require('../../utils/api');
const { createConversation, sendAndGetReply } = require('../../utils/cozeChat');

const SEVERITY_LABELS = ['无', '轻微', '中等', '较重', '严重'];

// 严重程度可选档位（1-4），用于分段按钮，含配色等级
const SEVERITY_OPTIONS = [
  { value: 1, label: '轻微', cls: 'sev-1' },
  { value: 2, label: '中等', cls: 'sev-2' },
  { value: 3, label: '较重', cls: 'sev-3' },
  { value: 4, label: '严重', cls: 'sev-4' }
];

const SYMPTOM_GROUPS = [
  {
    key: '认知',
    title: '认知',
    symptoms: [
      { name: '注意力难以集中' },
      { name: '反应变慢' },
      { name: '健忘' },
      { name: '理解上存在困难' },
      { name: '变得更加糊涂' }
    ]
  },
  {
    key: '心理',
    title: '心理',
    symptoms: [
      { name: '感到无法控制焦虑' },
      { name: '感到紧张或焦虑' },
      { name: '做事提不起兴趣' },
      { name: '感到心情低落' }
    ]
  },
  {
    key: '消化',
    title: '消化',
    symptoms: [
      { name: '食欲下降' },
      { name: '腹胀腹痛腹泻' },
      { name: '恶心呕吐' }
    ]
  },
  {
    key: '神经',
    title: '神经',
    symptoms: [
      { name: '头晕' },
      { name: '头痛' },
      { name: '视力模糊' },
      { name: '手脚发麻' }
    ]
  },
  {
    key: '皮肤关节',
    title: '皮肤关节',
    symptoms: [
      { name: '皮疹' },
      { name: '口腔溃疡' },
      { name: '肌肉关节疼痛' },
      { name: '掉发' }
    ]
  },
  {
    key: '全身',
    title: '全身',
    symptoms: [
      { name: '疲乏' },
      { name: '发热' },
      { name: '咳嗽' },
      { name: '嗜睡或难以入睡' },
      { name: '脂肪堆积' },
      { name: '消瘦体重减轻' },
      { name: '性欲下降' }
    ]
  }
];

const ADVICE_CLASS_MAP = {
  紧急: 'advice-urgent',
  随访: 'advice-followup',
  日常: 'advice-daily'
};

function clampSeverity(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 1;
  }
  const rounded = Math.round(parsed);
  return Math.max(0, Math.min(4, rounded));
}

function buildSelectedSet(symptomNames) {
  const selectedSet = {};
  (symptomNames || []).forEach((name) => {
    if (name) {
      selectedSet[name] = true;
    }
  });
  return selectedSet;
}

function pickEdgeWeight(edge) {
  const value = Number(edge && edge.weight);
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.abs(value);
}

Page({
  data: {
    greeting: '你好，朋友',
    isLogin: false,
    userAvatar: '/images/default-avatar.png',
    shortcuts: [
      {
        title: '健康问答',
        desc: '随时咨询用药与症状问题',
        icon: '💬',
        type: 'tab',
        path: '/pages/qa/qa'
      },
      {
        title: '症状网络',
        desc: '查看症状关联与关键节点',
        icon: '🕸️',
        type: 'tab',
        path: '/pages/graph/graph'
      },
      {
        title: '知识图谱',
        desc: '查询疾病知识与干预关系',
        icon: '🧠',
        type: 'tab',
        path: '/pages/graph/graph'
      },
      {
        title: '健康管理',
        desc: '用药复诊运动饮食记录',
        icon: '📋',
        type: 'tab',
        path: '/pages/health/health'
      }
    ],
    tips: [
      '按时服药是控制病毒载量最关键的环节。',
      '均衡饮食与规律运动有助于提升免疫状态。',
      '出现持续发热、腹泻等症状请及时就医。'
    ],
    symptomGroups: SYMPTOM_GROUPS,
    severityLabels: SEVERITY_LABELS,
    severityOptions: SEVERITY_OPTIONS,
    selectedSymptoms: [],
    selectedSet: {},
    severityMap: {},
    isSubmitting: false,
    resultVisible: false,
    predictedSymptoms: [],
    adviceSections: [],
    adviceText: '',
    hasUrgent: false,
    generatedQuestion: ''
  },

  onShow() {
    const app = getApp();
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || null;
    const openid = wx.getStorageSync('openid') || '';
    const isLogin = !!(userInfo && openid);
    const hour = new Date().getHours();
    const period = hour < 12 ? '上午好' : hour < 18 ? '下午好' : '晚上好';

    if (isLogin) {
      const nickname = (userInfo && userInfo.nickName) || '朋友';
      const avatar = (userInfo && userInfo.avatarUrl) || this.data.userAvatar;
      this.setData({
        isLogin: true,
        greeting: `${period}，${nickname}`,
        userAvatar: avatar
      });
    } else {
      this.setData({
        isLogin: false,
        greeting: `${period}，游客`,
        userAvatar: '/images/default-avatar.png'
      });
    }
  },

  handleShortcutTap(event) {
    const index = event.currentTarget.dataset.index;
    const item = this.data.shortcuts[index];
    if (!item) {
      return;
    }

    // 快捷入口直接跳对应 tab，登录校验交给目标页面处理
    if (item.type === 'tab' && item.path) {
      wx.switchTab({ url: item.path });
      return;
    }

    showToast(item.tip || '功能建设中');
  },

  onSymptomCheckChange(event) {
    const selectedSymptoms = (event.detail && event.detail.value) || [];
    const severityMap = { ...this.data.severityMap };
    selectedSymptoms.forEach((name) => {
      if (severityMap[name] === undefined) {
        severityMap[name] = 1;
      }
    });

    this.setData({
      selectedSymptoms,
      selectedSet: buildSelectedSet(selectedSymptoms),
      severityMap,
      resultVisible: false
    });
  },

  onSeverityChange(event) {
    const symptomName = event.currentTarget.dataset.name;
    if (!symptomName) {
      return;
    }
    const nextValue = clampSeverity(event.detail.value);
    this.setData({
      [`severityMap.${symptomName}`]: nextValue
    });
  },

  // 分段按钮点选严重程度
  onSeverityTap(event) {
    const symptomName = event.currentTarget.dataset.name;
    const value = clampSeverity(event.currentTarget.dataset.value);
    if (!symptomName) {
      return;
    }
    this.setData({
      [`severityMap.${symptomName}`]: value
    });
  },

  buildSymptomPayload() {
    const severityMap = this.data.severityMap || {};
    return (this.data.selectedSymptoms || []).map((name) => ({
      name,
      severity: clampSeverity(severityMap[name])
    }));
  },

  formatSymptomSummary(symptoms) {
    return (symptoms || [])
      .map((item) => `${item.name}（${SEVERITY_LABELS[clampSeverity(item.severity)]}）`)
      .join('、');
  },

  buildAdviceQuestion(symptoms) {
    const summary = this.formatSymptomSummary(symptoms);
    return `我目前有以下症状：${summary}。请根据这些症状给出健康管理建议，包括：1.需要紧急就医的情况 2.需要随访关注的症状 3.日常自我管理建议。请使用以下固定格式输出：\n【紧急】...\n【随访】...\n【日常】...`;
  },

  getTodayDate() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = `${now.getMonth() + 1}`.padStart(2, '0');
    const dd = `${now.getDate()}`.padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  buildRelatedSymptomWarnings(graphData, selectedSymptoms) {
    const selectedSet = new Set((selectedSymptoms || []).map((item) => item.name));
    const severityMap = new Map((selectedSymptoms || []).map((item) => [item.name, clampSeverity(item.severity)]));
    const edges = (graphData && graphData.edges) || [];
    const warningMap = new Map();

    const mergeWarning = (name, fromName, score) => {
      if (!name || selectedSet.has(name)) {
        return;
      }
      const current = warningMap.get(name) || { name, score: 0, linkedFromSet: new Set() };
      current.score += score;
      if (fromName) {
        current.linkedFromSet.add(fromName);
      }
      warningMap.set(name, current);
    };

    edges.forEach((edge) => {
      const source = edge && edge.source;
      const target = edge && edge.target;
      const weight = pickEdgeWeight(edge);
      if (!source || !target || weight <= 0) {
        return;
      }

      if (selectedSet.has(source) && !selectedSet.has(target)) {
        const factor = 1 + (severityMap.get(source) || 0) / 4;
        mergeWarning(target, source, weight * factor);
      }
      if (selectedSet.has(target) && !selectedSet.has(source)) {
        const factor = 1 + (severityMap.get(target) || 0) / 4;
        mergeWarning(source, target, weight * factor);
      }
    });

    return Array.from(warningMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => ({
        name: item.name,
        score: item.score,
        scoreText: item.score.toFixed(2),
        linkedFrom: Array.from(item.linkedFromSet),
        linkedFromText: Array.from(item.linkedFromSet).join('、')
      }));
  },

  buildAdviceSection(level, text) {
    return {
      level,
      text,
      className: ADVICE_CLASS_MAP[level] || 'advice-daily'
    };
  },

  parseAdviceSections(text) {
    const answerText = String(text || '').trim();
    if (!answerText) {
      return [];
    }

    const markerRegex = /【(紧急|随访|日常)】([\s\S]*?)(?=【(?:紧急|随访|日常)】|$)/g;
    const markerSections = [];
    let markerMatch = markerRegex.exec(answerText);
    while (markerMatch) {
      const level = markerMatch[1];
      const content = (markerMatch[2] || '').trim();
      if (content) {
        markerSections.push(this.buildAdviceSection(level, content));
      }
      markerMatch = markerRegex.exec(answerText);
    }
    if (markerSections.length) {
      return markerSections;
    }

    const fallbackNumbered = [
      { level: '紧急', regex: /(?:^|\n)\s*(?:1[\.、]|一[、\.]|①)\s*([\s\S]*?)(?=\n\s*(?:2[\.、]|二[、\.]|②)|$)/ },
      { level: '随访', regex: /(?:^|\n)\s*(?:2[\.、]|二[、\.]|②)\s*([\s\S]*?)(?=\n\s*(?:3[\.、]|三[、\.]|③)|$)/ },
      { level: '日常', regex: /(?:^|\n)\s*(?:3[\.、]|三[、\.]|③)\s*([\s\S]*?)$/ }
    ];
    const numberedSections = [];
    fallbackNumbered.forEach((item) => {
      const match = answerText.match(item.regex);
      if (match && match[1]) {
        const content = String(match[1]).trim();
        if (content) {
          numberedSections.push(this.buildAdviceSection(item.level, content));
        }
      }
    });
    if (numberedSections.length) {
      return numberedSections;
    }

    const keywordRegex = /(紧急|随访|日常)\s*[：:]\s*([\s\S]*?)(?=(?:紧急|随访|日常)\s*[：:]|$)/g;
    const keywordSections = [];
    let keywordMatch = keywordRegex.exec(answerText);
    while (keywordMatch) {
      const level = keywordMatch[1];
      const content = String(keywordMatch[2] || '').trim();
      if (content) {
        keywordSections.push(this.buildAdviceSection(level, content));
      }
      keywordMatch = keywordRegex.exec(answerText);
    }
    if (keywordSections.length) {
      return keywordSections;
    }

    return [this.buildAdviceSection('日常', answerText)];
  },

  async fetchManagementAdvice(question) {
    try {
      const directResult = await callCloud('coze', { question });
      if (directResult && directResult.code === 0 && directResult.data && directResult.data.answer) {
        return String(directResult.data.answer || '').trim();
      }
      if (directResult && directResult.success && directResult.data && directResult.data.reply) {
        return String(directResult.data.reply || '').trim();
      }
    } catch (error) {
      console.warn('[index] direct coze call failed, fallback to conversation flow:', error);
    }

    const conversation = await createConversation();
    const result = await sendAndGetReply({
      conversationId: conversation.conversationId,
      localConversationId: conversation._id,
      message: question
    });
    return String((result && result.reply) || '').trim();
  },

  async onSubmitSymptomCheck() {
    if (this.data.isSubmitting) {
      return;
    }

    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录后使用症状自查功能',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/profile/profile' });
          }
        }
      });
      return;
    }

    const symptomPayload = this.buildSymptomPayload();
    if (!symptomPayload.length) {
      showToast('请先选择至少 1 个症状');
      return;
    }

    const date = this.getTodayDate();
    const question = this.buildAdviceQuestion(symptomPayload);

    this.setData({
      isSubmitting: true
    });
    showLoading('正在生成建议');

    try {
      const saveResult = await callCloud('health', {
        action: 'symptom_record',
        symptoms: symptomPayload,
        date
      });
      if (!saveResult || saveResult.code !== 0) {
        throw new Error((saveResult && saveResult.message) || '症状记录保存失败');
      }

      const graphResult = await callCloud('sn', { action: 'graph' });
      if (!graphResult || graphResult.code !== 0) {
        throw new Error((graphResult && graphResult.message) || '症状网络加载失败');
      }

      const predictedSymptoms = this.buildRelatedSymptomWarnings(graphResult.data, symptomPayload);
      const adviceText = await this.fetchManagementAdvice(question);
      if (!adviceText) {
        throw new Error('管理建议生成失败，请稍后再试');
      }
      const adviceSections = this.parseAdviceSections(adviceText);
      const hasUrgent = adviceSections.some((s) => s.level === '紧急' && s.text && s.text.trim() && s.text.trim() !== '无' && s.text.trim() !== '暂无');

      wx.setStorageSync('qa_prefill_message', question);
      wx.setStorageSync('qa_prefill_auto_send', true);
      wx.setStorageSync('symptom_self_check_latest', {
        date,
        symptoms: symptomPayload,
        question,
        adviceText,
        adviceSections,
        predictedSymptoms,
        updatedAt: Date.now()
      });

      this.setData({
        predictedSymptoms,
        adviceText,
        adviceSections,
        hasUrgent,
        generatedQuestion: question,
        resultVisible: true
      }, () => {
        // 明确提示已生成，并滚动到结果区，避免用户以为没反应
        showToast('建议已生成，请查看下方', 'none');
        wx.pageScrollTo({
          selector: '.result-wrap',
          duration: 400,
          fail: () => {
            wx.pageScrollTo({ scrollTop: 100000, duration: 400 });
          }
        });
      });
    } catch (error) {
      console.error('[index] symptom self-check failed:', error);
      showToast(error.message || '获取管理建议失败');
    } finally {
      hideLoading();
      this.setData({ isSubmitting: false });
    }
  },

  onCallEmergency() {
    wx.showModal({
      title: '紧急就医提醒',
      content: '你的部分症状可能需要尽快就医。是否拨打急救电话 120？',
      confirmText: '拨打120',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '120' });
        }
      }
    });
  },

  onAskInQa() {
    const question = this.data.generatedQuestion;
    if (!question) {
      showToast('请先生成管理建议');
      return;
    }
    wx.setStorageSync('qa_prefill_message', question);
    wx.setStorageSync('qa_prefill_auto_send', true);
    wx.switchTab({ url: '/pages/qa/qa' });
  },

  onShareAppMessage() {
    return {
      title: '艾滋病健康管理助手 — 智能问答与健康管理',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '艾滋病健康管理助手 — 智能问答与健康管理'
    };
  }
});
