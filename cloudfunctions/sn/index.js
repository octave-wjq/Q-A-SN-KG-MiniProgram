const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const PAGE_SIZE = 100
const VALID_INTERVENTION_TYPES = ['alleviate', 'aggravate']

function ok(data) {
  return { code: 0, message: 'success', data }
}

function badRequest(message) {
  return { code: 400, message, data: null }
}

function isValidInterventionType(interventionType) {
  return VALID_INTERVENTION_TYPES.includes(interventionType)
}

function normalizeStrength(item) {
  const raw = Number(item?.strength ?? item?.score ?? 0)
  return Number.isFinite(raw) ? raw : 0
}

async function handleGraph() {
  const result = await db.collection('sn_graph').doc('sn_graph_v1').get()
  const data = result.data || {}

  return ok({
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    edges: Array.isArray(data.edges) ? data.edges : []
  })
}

async function handleCentrality(params) {
  const { top_n } = params
  let topN

  if (top_n !== undefined) {
    topN = Number(top_n)
    if (!Number.isInteger(topN) || topN <= 0) {
      return badRequest('top_n must be a positive integer')
    }
  }

  const result = await db.collection('sn_centrality').doc('sn_centrality_v1').get()
  const rankings = Array.isArray(result.data?.rankings) ? result.data.rankings.slice() : []

  rankings.sort((a, b) => normalizeStrength(b) - normalizeStrength(a))

  return ok({
    rankings: topN ? rankings.slice(0, topN) : rankings
  })
}

async function handleSimulate(params) {
  const { node_id, intervention_type } = params

  if (!node_id || typeof node_id !== 'string') {
    return badRequest('node_id is required and must be a string')
  }
  if (!isValidInterventionType(intervention_type)) {
    return badRequest('intervention_type must be alleviate or aggravate')
  }

  const docId = `sim_${node_id}_${intervention_type}`
  const result = await db.collection('sn_simulation').doc(docId).get()

  return ok(result.data || {})
}

async function queryAllSimulations(interventionType) {
  const all = []
  let skip = 0

  while (true) {
    const result = await db.collection('sn_simulation')
      .where({ intervention_type: interventionType })
      .skip(skip)
      .limit(PAGE_SIZE)
      .get()

    const batch = result.data || []
    all.push(...batch)

    if (batch.length < PAGE_SIZE) {
      break
    }
    skip += PAGE_SIZE
  }

  return all
}

async function handleSimulateBatch(params) {
  const { intervention_type } = params

  if (!isValidInterventionType(intervention_type)) {
    return badRequest('intervention_type must be alleviate or aggravate')
  }

  const simulations = await queryAllSimulations(intervention_type)
  simulations.sort((a, b) => Math.abs(Number(b.pct_change) || 0) - Math.abs(Number(a.pct_change) || 0))

  return ok({ rankings: simulations })
}

async function handleSpillover(params) {
  const { intervention_type } = params

  if (!isValidInterventionType(intervention_type)) {
    return badRequest('intervention_type must be alleviate or aggravate')
  }

  const docId = `spillover_${intervention_type}`
  const result = await db.collection('sn_spillover').doc(docId).get()
  const data = result.data || {}

  return ok({
    node_names: Array.isArray(data.node_names) ? data.node_names : [],
    matrix: Array.isArray(data.matrix) ? data.matrix : []
  })
}

exports.main = async (event, context) => {
  const { action, ...params } = event || {}

  try {
    switch (action) {
      case 'graph':
        return await handleGraph(params)
      case 'centrality':
        return await handleCentrality(params)
      case 'simulate':
        return await handleSimulate(params)
      case 'simulate_batch':
        return await handleSimulateBatch(params)
      case 'spillover':
        return await handleSpillover(params)
      default:
        return badRequest(`Unknown action: ${action}`)
    }
  } catch (err) {
    return { code: 500, message: err.message, data: null }
  }
}
