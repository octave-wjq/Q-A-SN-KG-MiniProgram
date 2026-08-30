const { callCloud } = require('../../utils/api')

const ADMIN_OPENIDS = ['oQ0UG7ooFWi9ekMxXK9bO9HM9OOY']

const SN_DATASETS = [
  { action: 'import_sn_graph', label: '症状网络图', file: 'sn_graph' },
  { action: 'import_sn_centrality', label: '中心性排名', file: 'sn_centrality' },
  { action: 'import_sn_simulation', label: '干预仿真', file: 'sn_simulation' },
  { action: 'import_sn_spillover', label: '外溢效应', file: 'sn_spillover' }
]

const KG_NODE_CHUNKS = 15
const KG_EDGE_CHUNKS = 16

function loadSnData(file) {
  const map = {
    sn_graph: require('./datasets/sn_graph'),
    sn_centrality: require('./datasets/sn_centrality'),
    sn_simulation: require('./datasets/sn_simulation'),
    sn_spillover: require('./datasets/sn_spillover')
  }
  return map[file]
}

function loadKgNodeChunk(i) {
  const chunks = [
    require('./datasets/kg_nodes_0'), require('./datasets/kg_nodes_1'),
    require('./datasets/kg_nodes_2'), require('./datasets/kg_nodes_3'),
    require('./datasets/kg_nodes_4'), require('./datasets/kg_nodes_5'),
    require('./datasets/kg_nodes_6'), require('./datasets/kg_nodes_7'),
    require('./datasets/kg_nodes_8'), require('./datasets/kg_nodes_9'),
    require('./datasets/kg_nodes_10'), require('./datasets/kg_nodes_11'),
    require('./datasets/kg_nodes_12'), require('./datasets/kg_nodes_13'),
    require('./datasets/kg_nodes_14')
  ]
  return chunks[i]
}

function loadKgEdgeChunk(i) {
  const chunks = [
    require('./datasets/kg_edges_0'), require('./datasets/kg_edges_1'),
    require('./datasets/kg_edges_2'), require('./datasets/kg_edges_3'),
    require('./datasets/kg_edges_4'), require('./datasets/kg_edges_5'),
    require('./datasets/kg_edges_6'), require('./datasets/kg_edges_7'),
    require('./datasets/kg_edges_8'), require('./datasets/kg_edges_9'),
    require('./datasets/kg_edges_10'), require('./datasets/kg_edges_11'),
    require('./datasets/kg_edges_12'), require('./datasets/kg_edges_13'),
    require('./datasets/kg_edges_14'), require('./datasets/kg_edges_15')
  ]
  return chunks[i]
}

function timeStr() {
  const d = new Date()
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`
}

Page({
  data: {
    snDatasets: SN_DATASETS.map(d => ({ ...d, loading: false, status: '', statusText: '未导入' })),
    kgNodesStatus: { loading: false, status: '', statusText: '未导入 (2806节点, 15批)' },
    kgEdgesStatus: { loading: false, status: '', statusText: '未导入 (3717边, 15批)' },
    batchLoading: false,
    logs: []
  },

  onLoad() {
    const openid = wx.getStorageSync('openid') || ''
    if (!ADMIN_OPENIDS.includes(openid)) {
      wx.showToast({ title: '无权限访问', icon: 'error' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  addLog(msg, type) {
    const logs = [{ time: timeStr(), msg, type }, ...this.data.logs].slice(0, 50)
    this.setData({ logs })
  },

  // 核验云数据库各集合实际总数
  async onCheckCount() {
    this.addLog('正在核验云数据库总数...', '')
    try {
      const res = await callCloud('import_data', { action: 'count' })
      const c = (res && res.data) || {}
      this.addLog(`核验结果：kg_nodes=${c.kg_nodes}，kg_edges=${c.kg_edges}`, 'success')
      this.addLog(`sn_graph=${c.sn_graph}，sn_centrality=${c.sn_centrality}，sn_simulation=${c.sn_simulation}，sn_spillover=${c.sn_spillover}`, '')
    } catch (err) {
      this.addLog(`核验失败：${err.message || '请重试'}`, 'error')
    }
  },

  async onSnImport(e) {
    const { index } = e.currentTarget.dataset
    const ds = SN_DATASETS[index]
    this.setData({ [`snDatasets[${index}].loading`]: true, [`snDatasets[${index}].statusText`]: '导入中...' })
    this.addLog(`开始导入: ${ds.label}`, '')
    try {
      const data = loadSnData(ds.file)
      const res = await callCloud('import_data', { action: ds.action, data })
      if (res && res.code === 0) {
        this.setData({ [`snDatasets[${index}].status`]: 'success', [`snDatasets[${index}].statusText`]: '导入成功' })
        this.addLog(`${ds.label} 导入成功`, 'success')
      } else {
        throw new Error((res && res.message) || '导入失败')
      }
    } catch (err) {
      this.setData({ [`snDatasets[${index}].status`]: 'error', [`snDatasets[${index}].statusText`]: err.message })
      this.addLog(`${ds.label} 失败: ${err.message}`, 'error')
    }
    this.setData({ [`snDatasets[${index}].loading`]: false })
  },

  async onKgNodesImport() {
    this.setData({ 'kgNodesStatus.loading': true, 'kgNodesStatus.statusText': '导入中 0/15...' })
    this.addLog('开始导入知识图谱节点 (15批)...', '')
    try {
      for (let i = 0; i < KG_NODE_CHUNKS; i++) {
        this.setData({ 'kgNodesStatus.statusText': `导入中 ${i+1}/${KG_NODE_CHUNKS}...` })
        const data = loadKgNodeChunk(i)
        const res = await callCloud('import_data', { action: 'import_kg_nodes', data, batch: i })
        if (!res || res.code !== 0) throw new Error(`批次${i}失败: ${(res && res.message) || ''}`)
      }
      this.setData({ 'kgNodesStatus.status': 'success', 'kgNodesStatus.statusText': '导入成功 (2806节点)' })
      this.addLog('知识图谱节点全部导入成功', 'success')
    } catch (err) {
      this.setData({ 'kgNodesStatus.status': 'error', 'kgNodesStatus.statusText': err.message })
      this.addLog(`KG节点导入失败: ${err.message}`, 'error')
    }
    this.setData({ 'kgNodesStatus.loading': false })
  },

  async onKgEdgesImport() {
    this.setData({ 'kgEdgesStatus.loading': true, 'kgEdgesStatus.statusText': '导入中 0/15...' })
    this.addLog('开始导入知识图谱边 (15批)...', '')
    try {
      for (let i = 0; i < KG_EDGE_CHUNKS; i++) {
        this.setData({ 'kgEdgesStatus.statusText': `导入中 ${i+1}/${KG_EDGE_CHUNKS}...` })
        const data = loadKgEdgeChunk(i)
        const res = await callCloud('import_data', { action: 'import_kg_edges', data, batch: i })
        if (!res || res.code !== 0) throw new Error(`批次${i}失败: ${(res && res.message) || ''}`)
      }
      this.setData({ 'kgEdgesStatus.status': 'success', 'kgEdgesStatus.statusText': '导入成功 (3717边)' })
      this.addLog('知识图谱边全部导入成功', 'success')
    } catch (err) {
      this.setData({ 'kgEdgesStatus.status': 'error', 'kgEdgesStatus.statusText': err.message })
      this.addLog(`KG边导入失败: ${err.message}`, 'error')
    }
    this.setData({ 'kgEdgesStatus.loading': false })
  },

  async onImportAll() {
    this.setData({ batchLoading: true })
    this.addLog('开始全量导入...', '')

    for (let i = 0; i < SN_DATASETS.length; i++) {
      const ds = SN_DATASETS[i]
      this.setData({ [`snDatasets[${i}].loading`]: true, [`snDatasets[${i}].statusText`]: '导入中...' })
      try {
        const data = loadSnData(ds.file)
        const res = await callCloud('import_data', { action: ds.action, data })
        if (res && res.code === 0) {
          this.setData({ [`snDatasets[${i}].status`]: 'success', [`snDatasets[${i}].statusText`]: '导入成功' })
        } else {
          throw new Error((res && res.message) || '失败')
        }
      } catch (err) {
        this.setData({ [`snDatasets[${i}].status`]: 'error', [`snDatasets[${i}].statusText`]: err.message })
      }
      this.setData({ [`snDatasets[${i}].loading`]: false })
    }

    await this.onKgNodesImport()
    await this.onKgEdgesImport()

    this.addLog('全量导入完成', 'success')
    this.setData({ batchLoading: false })
  }
})
