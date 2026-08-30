const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

const ADMIN_OPENIDS = ['oQ0UG7ooFWi9ekMxXK9bO9HM9OOY']

const ok = (imported) => ({
  code: 0,
  message: 'success',
  data: { imported }
})

const badRequest = (message) => ({
  code: 400,
  message,
  data: null
})

const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value)

async function upsertById(collectionName, docId, payload) {
  if (typeof docId !== 'string' || !docId) {
    throw new Error(`invalid _id for ${collectionName}`)
  }

  const collection = db.collection(collectionName)
  await collection.doc(docId).remove().catch(() => {})
  await collection.doc(docId).set({ data: payload })
}

async function importSingleDoc(collectionName, docId, data) {
  if (!isPlainObject(data)) {
    throw new Error(`${collectionName} data must be an object`)
  }

  await upsertById(collectionName, docId, data)
  return { [collectionName]: 1 }
}

async function importArrayDocs(collectionName, data, buildDocId, offset) {
  if (!Array.isArray(data)) {
    throw new Error(`${collectionName} data must be an array`)
  }

  await Promise.all(data.map((item, index) => {
    if (!isPlainObject(item)) {
      throw new Error(`${collectionName}[${index}] must be an object`)
    }

    const docId = buildDocId(item, index, offset || 0)
    return upsertById(collectionName, docId, item)
  }))

  return { [collectionName]: data.length }
}

const buildSimulationId = (item, index) => {
  const nodeId = typeof item.node_id === 'string' ? item.node_id : ''
  const interventionType = typeof item.intervention_type === 'string' ? item.intervention_type : ''

  if (!nodeId || !interventionType) {
    throw new Error(`sn_simulation[${index}] missing node_id or intervention_type`)
  }

  return `sim_${nodeId}_${interventionType}`
}

const buildSpilloverId = (item, index) => {
  const interventionType = typeof item.intervention_type === 'string' ? item.intervention_type : ''

  if (!interventionType) {
    throw new Error(`sn_spillover[${index}] missing intervention_type`)
  }

  return `spillover_${interventionType}`
}

const buildKgNodeId = (item) => `kg_node_${item.node_id || item.label}`
const buildKgEdgeId = (item, index, offset) => `kg_edge_${offset + index + 1}`

async function importSnGraph(data) {
  return importSingleDoc('sn_graph', 'sn_graph_v1', data)
}

async function importSnCentrality(data) {
  return importSingleDoc('sn_centrality', 'sn_centrality_v1', data)
}

async function importSnSimulation(data) {
  return importArrayDocs('sn_simulation', data, buildSimulationId)
}

async function importSnSpillover(data) {
  return importArrayDocs('sn_spillover', data, buildSpilloverId)
}

async function importKgNodes(data) {
  return importArrayDocs('kg_nodes', data, buildKgNodeId, 0)
}

async function importKgEdges(data, batch) {
  const offset = (batch || 0) * 250
  return importArrayDocs('kg_edges', data, buildKgEdgeId, offset)
}

async function importAll(data) {
  if (!isPlainObject(data)) {
    throw new Error('import_all data must be an object')
  }

  const imported = {}

  Object.assign(imported, await importSnGraph(data.sn_graph))
  Object.assign(imported, await importSnCentrality(data.sn_centrality))
  Object.assign(imported, await importSnSimulation(data.sn_simulation))
  Object.assign(imported, await importSnSpillover(data.sn_spillover))
  Object.assign(imported, await importKgNodes(data.kg_nodes))
  Object.assign(imported, await importKgEdges(data.kg_edges))

  return imported
}

exports.main = async (event = {}) => {
  const { action, data, batch } = event
  const { OPENID } = cloud.getWXContext()

  if (!ADMIN_OPENIDS.includes(OPENID)) {
    return { code: 403, message: '无权限执行此操作', data: null }
  }

  try {
    let imported = null

    switch (action) {
      case 'import_sn_graph':
        imported = await importSnGraph(data)
        break
      case 'import_sn_centrality':
        imported = await importSnCentrality(data)
        break
      case 'import_sn_simulation':
        imported = await importSnSimulation(data)
        break
      case 'import_sn_spillover':
        imported = await importSnSpillover(data)
        break
      case 'import_kg_nodes':
        imported = await importKgNodes(data)
        break
      case 'import_kg_edges':
        imported = await importKgEdges(data, batch)
        break
      case 'import_all':
        imported = await importAll(data)
        break
      case 'count': {
        // 返回各集合实际文档总数，供导入后核验
        const names = ['kg_nodes', 'kg_edges', 'sn_graph', 'sn_centrality', 'sn_simulation', 'sn_spillover']
        const counts = {}
        await Promise.all(names.map(async (n) => {
          try {
            const r = await db.collection(n).count()
            counts[n] = r.total
          } catch (e) {
            counts[n] = -1
          }
        }))
        return ok(counts)
      }
      default:
        return badRequest(`Unknown action: ${action}`)
    }

    return ok(imported)
  } catch (err) {
    return {
      code: 500,
      message: err.message || 'import failed',
      data: null
    }
  }
}
