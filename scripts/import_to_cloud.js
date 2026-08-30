const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(rootDir, 'data')
const snippetsDir = path.join(__dirname, 'import_snippets')
const EVENT_MAX_BYTES = 100 * 1024

const datasets = [
  {
    label: '导入症状网络图数据',
    action: 'import_sn_graph',
    file: 'sn_graph.json',
    output: '01_sn_graph.js'
  },
  {
    label: '导入症状中心性数据',
    action: 'import_sn_centrality',
    file: 'sn_centrality.json',
    output: '02_sn_centrality.js'
  },
  {
    label: '导入症状网络仿真数据',
    action: 'import_sn_simulation',
    file: 'sn_simulation.json',
    output: '03_sn_simulation.js'
  },
  {
    label: '导入症状网络外溢效应数据',
    action: 'import_sn_spillover',
    file: 'sn_spillover.json',
    output: '04_sn_spillover.js'
  },
  {
    label: '导入知识图谱节点数据',
    action: 'import_kg_nodes',
    file: 'kg_nodes.json',
    output: '05_kg_nodes.js'
  },
  {
    label: '导入知识图谱边数据',
    action: 'import_kg_edges',
    file: 'kg_edges.json',
    output: '06_kg_edges.js'
  }
]

function readJson(fileName) {
  const filePath = path.join(dataDir, fileName)
  const content = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(content)
}

function buildEventDataBlock(action, payload, indent) {
  const eventData = JSON.stringify({ action, data: payload }, null, 2).split('\n')
  return eventData
    .map((line, index) => (index === 0 ? `${indent}data: ${line}` : `${indent}${line}`))
    .join('\n')
}

function getEventSizeBytes(action, payload) {
  return Buffer.byteLength(JSON.stringify({ action, data: payload }), 'utf8')
}

function buildSingleSnippet(entry) {
  const { dataset, payload, eventBytes } = entry
  const eventDataBlock = buildEventDataBlock(dataset.action, payload, '      ')

  return [
    '// 在微信开发者工具控制台中执行以下代码：',
    `// ${dataset.label}`,
    `// event 大小: ${eventBytes} bytes (限制: ${EVENT_MAX_BYTES} bytes)`,
    '(async () => {',
    '  try {',
    '    const res = await wx.cloud.callFunction({',
    "      name: 'import_data',",
    eventDataBlock,
    '    })',
    `    console.log('[done] ${dataset.action}', res)`,
    '  } catch (err) {',
    `    console.error('[error] ${dataset.action}', err)`,
    '  }',
    '})()'
  ].join('\n')
}

function buildImportAllSnippet(entries) {
  const tasks = entries.map((entry) => ({
    file: entry.dataset.output,
    label: entry.dataset.label,
    action: entry.dataset.action,
    eventBytes: entry.eventBytes,
    data: entry.payload
  }))

  return [
    '// 在微信开发者工具控制台中执行以下代码：',
    '// 一次性串行导入全部数据（共 6 次 callFunction）',
    `const tasks = ${JSON.stringify(tasks, null, 2)}`,
    '',
    '(async () => {',
    '  for (const task of tasks) {',
    "    console.log('[start]', task.file, task.eventBytes + ' bytes')",
    '    const res = await wx.cloud.callFunction({',
    "      name: 'import_data',",
    '      data: { action: task.action, data: task.data }',
    '    })',
    "    console.log('[done]', task.action, res)",
    '  }',
    "  console.log('[done] all imports finished')",
    '})().catch((err) => {',
    "  console.error('[error] import_all failed', err)",
    '})'
  ].join('\n')
}

function buildStdoutOutput(entries) {
  const output = ['// 在微信开发者工具控制台中执行以下代码：']
  entries.forEach((entry, index) => {
    output.push(`// ${index + 1}. ${entry.dataset.label}`)
    output.push(buildSingleSnippet(entry))
    if (index < entries.length - 1) {
      output.push('')
    }
  })
  output.push('')
  output.push('// 00. 一次性串行导入全部数据')
  output.push(buildImportAllSnippet(entries))
  return output.join('\n')
}

function writeSnippets(entries) {
  fs.mkdirSync(snippetsDir, { recursive: true })
  entries.forEach((entry) => {
    const filePath = path.join(snippetsDir, entry.dataset.output)
    fs.writeFileSync(filePath, `${buildSingleSnippet(entry)}\n`, 'utf8')
  })
  const importAllPath = path.join(snippetsDir, '00_import_all.js')
  fs.writeFileSync(importAllPath, `${buildImportAllSnippet(entries)}\n`, 'utf8')
}

function collectEntries() {
  return datasets.map((dataset) => {
    const payload = readJson(dataset.file)
    const eventBytes = getEventSizeBytes(dataset.action, payload)
    if (eventBytes > EVENT_MAX_BYTES) {
      throw new Error(
        `${dataset.file} 对应 event 大小 ${eventBytes} bytes，超过云函数限制 ${EVENT_MAX_BYTES} bytes`
      )
    }
    return { dataset, payload, eventBytes }
  })
}

function hasStdoutFlag() {
  return process.argv.includes('--stdout')
}

function main() {
  const entries = collectEntries()
  writeSnippets(entries)
  if (hasStdoutFlag()) {
    console.log(buildStdoutOutput(entries))
    return
  }
  console.log(`已生成 7 个导入脚本到: ${snippetsDir}`)
}

try {
  main()
} catch (err) {
  console.error('生成导入代码失败:', err.message)
  process.exit(1)
}
