const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;
const userCollection = db.collection('users');

const getProfile = async (openid) => {
  // 兼容两种存储：系统字段 _openid 和业务字段 openid
  const result = await userCollection
    .where(_.or([{ _openid: openid }, { openid: openid }]))
    .limit(1)
    .get();
  if (!result.data.length) {
    return {
      success: true,
      profile: null
    };
  }

  return {
    success: true,
    profile: result.data[0]
  };
};

const updateProfile = async (openid, profile = {}) => {
  const payload = {
    nickName: profile.nickName || '',
    avatarUrl: profile.avatarUrl || '',
    gender: profile.gender || 0,
    country: profile.country || '',
    province: profile.province || '',
    city: profile.city || '',
    language: profile.language || 'zh_CN',
    openid,
    updatedAt: db.serverDate()
  };

  const current = await userCollection
    .where(_.or([{ _openid: openid }, { openid: openid }]))
    .limit(1)
    .get();
  if (current.data.length) {
    await userCollection.doc(current.data[0]._id).update({
      data: payload
    });

    return {
      success: true,
      updated: true
    };
  }

  await userCollection.add({
    data: {
      ...payload,
      createdAt: db.serverDate()
    }
  });

  return {
    success: true,
    updated: false
  };
};

const submitFeedback = async (openid, content, contact) => {
  const text = String(content || '').trim();
  if (!text) {
    return { success: false, message: '反馈内容不能为空' };
  }
  if (text.length > 1000) {
    return { success: false, message: '反馈内容过长（最多1000字）' };
  }
  await db.collection('user_feedback').add({
    data: {
      openid,
      content: text,
      contact: String(contact || '').trim().slice(0, 100),
      status: 'pending',
      createdAt: db.serverDate()
    }
  });
  return { success: true };
};

exports.main = async (event = {}) => {
  const { action, profile, content, contact } = event;
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!action) {
    return {
      success: false,
      message: '缺少 action 参数'
    };
  }

  if (action === 'getProfile') {
    return getProfile(openid);
  }

  if (action === 'updateProfile') {
    return updateProfile(openid, profile);
  }

  if (action === 'submitFeedback') {
    return submitFeedback(openid, content, contact);
  }

  return {
    success: false,
    message: '不支持的 action'
  };
};
