const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

const DEFAULT_PATH_DEPTH = 3
const MAX_PATH_DEPTH = 5
const MAX_QUERY_LIMIT = 100

const ok = (data) => ({ code: 0, message: 'success', data })
const badRequest = (message) => ({ code: 400, message, data: null })

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const normalizeStringArray = (value, fieldName) => {
  if (value === undefined || value === null) {
    return { valid: true, value: null }
  }
  if (!Array.isArray(value)) {
    return { valid: false, message: `${fieldName} must be an array of strings` }
  }

  const normalized = []
  for (const item of value) {
    if (typeof item !== 'string' || !item.trim()) {
      return { valid: false, message: `${fieldName} must be an array of non-empty strings` }
    }
    normalized.push(item.trim())
  }

  return { valid: true, value: Array.from(new Set(normalized)) }
}

const parseMaxDepth = (value) => {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: DEFAULT_PATH_DEPTH }
  }

  const depth = Number(value)
  if (!Number.isInteger(depth)) {
    return { valid: false, message: 'max_depth must be an integer' }
  }
  if (depth < 1) {
    return { valid: false, message: 'max_depth must be >= 1' }
  }
  if (depth > MAX_PATH_DEPTH) {
    return { valid: false, message: `max_depth must be <= ${MAX_PATH_DEPTH}` }
  }

  return { valid: true, value: depth }
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getAllNodes = async () => {
  const result = await db.collection('kg_nodes').limit(MAX_QUERY_LIMIT).get()
  return result.data || []
}

const getAllEdges = async () => {
  const result = await db.collection('kg_edges').limit(MAX_QUERY_LIMIT).get()
  return result.data || []
}

const getNodesByIds = async (nodeIds = []) => {
  const ids = Array.from(new Set(nodeIds.filter((id) => typeof id === 'string' && id)))
  if (!ids.length) {
    return []
  }

  const result = await db.collection('kg_nodes').where({
    node_id: _.in(ids)
  }).limit(MAX_QUERY_LIMIT).get()

  return result.data || []
}

async function handleGraph(params) {
  const entityIdsCheck = normalizeStringArray(params.entity_ids, 'entity_ids')
  if (!entityIdsCheck.valid) {
    return badRequest(entityIdsCheck.message)
  }

  const relationTypesCheck = normalizeStringArray(params.relation_types, 'relation_types')
  if (!relationTypesCheck.valid) {
    return badRequest(relationTypesCheck.message)
  }

  const entityIds = entityIdsCheck.value
  const relationTypes = relationTypesCheck.value
  const hasEntityFilter = Array.isArray(entityIds) && entityIds.length > 0
  const hasRelationFilter = Array.isArray(relationTypes) && relationTypes.length > 0

  const [allNodes, allEdges] = await Promise.all([getAllNodes(), getAllEdges()])

  if (!hasEntityFilter && !hasRelationFilter) {
    return ok({ nodes: allNodes, edges: allEdges })
  }

  let edges = allEdges
  if (hasEntityFilter) {
    const entitySet = new Set(entityIds)
    edges = edges.filter((edge) => entitySet.has(edge.source) || entitySet.has(edge.target))
  }
  if (hasRelationFilter) {
    const relationSet = new Set(relationTypes)
    edges = edges.filter((edge) => relationSet.has(edge.relation))
  }

  const nodeIds = new Set()
  if (hasEntityFilter) {
    entityIds.forEach((id) => nodeIds.add(id))
  }
  edges.forEach((edge) => {
    nodeIds.add(edge.source)
    nodeIds.add(edge.target)
  })

  const nodes = allNodes.filter((node) => nodeIds.has(node.node_id))
  return ok({ nodes, edges })
}

async function handleNeighbors(params) {
  const entityId = typeof params.entity_id === 'string' ? params.entity_id.trim() : ''
  if (!entityId) {
    return badRequest('entity_id is required')
  }

  const centerResult = await db.collection('kg_nodes').where({
    node_id: entityId
  }).limit(1).get()
  const center = (centerResult.data || [])[0] || null
  if (!center) {
    return badRequest(`entity_id not found: ${entityId}`)
  }

  const edgeResult = await db.collection('kg_edges').where(_.or([
    { source: entityId },
    { target: entityId }
  ])).limit(MAX_QUERY_LIMIT).get()
  const edges = edgeResult.data || []

  const neighborIds = new Set()
  for (const edge of edges) {
    if (edge.source === entityId && edge.target) {
      neighborIds.add(edge.target)
    } else if (edge.target === entityId && edge.source) {
      neighborIds.add(edge.source)
    }
  }

  const nodes = await getNodesByIds(Array.from(neighborIds))
  return ok({ center, nodes, edges })
}

const buildAdjacency = (edges) => {
  const adjacency = new Map()

  const addNeighbor = (from, to, edge) => {
    if (!adjacency.has(from)) {
      adjacency.set(from, [])
    }
    adjacency.get(from).push({ node: to, edge })
  }

  for (const edge of edges) {
    const { source, target } = edge
    if (!isNonEmptyString(source) || !isNonEmptyString(target)) {
      continue
    }
    addNeighbor(source, target, edge)
    addNeighbor(target, source, edge)
  }

  return adjacency
}

const bfsShortestPath = (source, target, maxDepth, adjacency) => {
  if (source === target) {
    return { nodeIds: [source], edges: [] }
  }

  const queue = [source]
  const depthMap = new Map([[source, 0]])
  const visited = new Set([source])
  const parent = new Map()

  let found = false
  let cursor = 0

  while (cursor < queue.length && !found) {
    const current = queue[cursor++]
    const currentDepth = depthMap.get(current) || 0
    if (currentDepth >= maxDepth) {
      continue
    }

    const neighbors = adjacency.get(current) || []
    for (const next of neighbors) {
      if (visited.has(next.node)) {
        continue
      }

      visited.add(next.node)
      parent.set(next.node, { prev: current, edge: next.edge })
      depthMap.set(next.node, currentDepth + 1)

      if (next.node === target) {
        found = true
        break
      }
      queue.push(next.node)
    }
  }

  if (!found) {
    return null
  }

  const nodeIds = []
  const edges = []
  let current = target

  while (current !== source) {
    nodeIds.push(current)
    const trace = parent.get(current)
    if (!trace) {
      return null
    }
    edges.push(trace.edge)
    current = trace.prev
  }

  nodeIds.push(source)
  nodeIds.reverse()
  edges.reverse()

  return { nodeIds, edges }
}

async function handlePath(params) {
  const source = typeof params.source === 'string' ? params.source.trim() : ''
  const target = typeof params.target === 'string' ? params.target.trim() : ''
  if (!source || !target) {
    return badRequest('source and target are required')
  }

  const maxDepthCheck = parseMaxDepth(params.max_depth)
  if (!maxDepthCheck.valid) {
    return badRequest(maxDepthCheck.message)
  }
  const maxDepth = maxDepthCheck.value

  const edges = await getAllEdges()
  const adjacency = buildAdjacency(edges)
  const path = bfsShortestPath(source, target, maxDepth, adjacency)

  if (!path) {
    return ok({ paths: [] })
  }

  const pathNodes = await getNodesByIds(path.nodeIds)
  const nodeMap = new Map(pathNodes.map((node) => [node.node_id, node]))
  const orderedNodes = path.nodeIds.map((id) => nodeMap.get(id) || { node_id: id, label: id })

  return ok({
    paths: [{
      nodes: orderedNodes,
      edges: path.edges
    }]
  })
}

async function handleSearch(params) {
  const keyword = typeof params.keyword === 'string' ? params.keyword.trim() : ''
  if (!keyword) {
    return badRequest('keyword is required')
  }

  const result = await db.collection('kg_nodes').where({
    label: db.RegExp({
      regexp: escapeRegex(keyword),
      options: 'i'
    })
  }).limit(MAX_QUERY_LIMIT).get()

  return ok({ results: result.data || [] })
}

exports.main = async (event = {}, context) => {
  const { action, ...params } = event
  try {
    switch (action) {
      case 'graph':
        return await handleGraph(params)
      case 'neighbors':
        return await handleNeighbors(params)
      case 'path':
        return await handlePath(params)
      case 'search':
        return await handleSearch(params)
      default:
        return { code: 400, message: `Unknown action: ${action}`, data: null }
    }
  } catch (err) {
    return { code: 500, message: err.message, data: null }
  }
}
