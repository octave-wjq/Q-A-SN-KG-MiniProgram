const DEFAULT_SERVER_BASE_URL = 'http://111.229.149.38:8000';

const getServerBaseUrl = () => {
  try {
    const app = getApp();
    if (app && app.globalData && app.globalData.serverBaseUrl) {
      return app.globalData.serverBaseUrl;
    }
  } catch (error) {
    return DEFAULT_SERVER_BASE_URL;
  }
  return DEFAULT_SERVER_BASE_URL;
};

const normalizePath = (path = '') => (path.startsWith('/') ? path : `/${path}`);

const callServer = (path, method = 'GET', data = {}) => {
  const url = `${getServerBaseUrl()}${normalizePath(path)}`;
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      timeout: 20000,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }
        reject(new Error((res.data && res.data.message) || `请求失败(${res.statusCode})`));
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

const callCloud = (name, data = {}, timeout = 60000) =>
  new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      config: { timeout },
      success: (res) => {
        resolve(res.result || res);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });

const callCoze = async (question) => {
  const content = String(question || '').trim();
  if (!content) {
    return {
      answer: '请输入你想咨询的问题。',
      sources: ['输入校验'],
      evidenceLevel: '待核实'
    };
  }

  try {
    const result = await callCloud('coze', { action: 'chat', question: content });
    if (result && result.code === 0 && result.data) {
      return {
        answer: result.data.answer || '未获取到有效回复。',
        sources: result.data.sources || ['Coze 知识库'],
        evidenceLevel: result.data.evidenceLevel || '待核实'
      };
    }
    return {
      answer: (result && result.message) || '服务返回异常，请稍后重试。',
      sources: ['系统提示'],
      evidenceLevel: '待核实'
    };
  } catch (error) {
    return {
      answer: `我已收到你的问题："${content}"。当前智能问答服务连接较慢，请稍后再试。`,
      sources: ['本地兜底回复'],
      evidenceLevel: '待核实'
    };
  }
};

module.exports = {
  callServer,
  callCloud,
  callCoze
};
