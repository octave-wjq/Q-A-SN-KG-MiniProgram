// 在微信开发者工具控制台中执行以下代码：
// 导入症状中心性数据
// event 大小: 2725 bytes (限制: 102400 bytes)
(async () => {
  try {
    const res = await wx.cloud.callFunction({
      name: 'import_data',
      data: {
        "action": "import_sn_centrality",
        "data": {
          "rankings": [
            {
              "name": "反应变慢",
              "strength": 1.102269,
              "closeness": 0.050669,
              "betweenness": 0.092308,
              "rank": 1
            },
            {
              "name": "食欲下降",
              "strength": 1.070246,
              "closeness": 0.056068,
              "betweenness": 0.110769,
              "rank": 2
            },
            {
              "name": "感到紧张或焦虑",
              "strength": 0.994385,
              "closeness": 0.046412,
              "betweenness": 0.061538,
              "rank": 3
            },
            {
              "name": "疲乏",
              "strength": 0.993412,
              "closeness": 0.059424,
              "betweenness": 0.110769,
              "rank": 4
            },
            {
              "name": "消瘦体重减轻",
              "strength": 0.990482,
              "closeness": 0.054206,
              "betweenness": 0.095385,
              "rank": 5
            },
            {
              "name": "健忘",
              "strength": 0.961274,
              "closeness": 0.049914,
              "betweenness": 0.055385,
              "rank": 6
            },
            {
              "name": "变得更加糊涂",
              "strength": 0.940118,
              "closeness": 0.046011,
              "betweenness": 0.033846,
              "rank": 7
            },
            {
              "name": "注意力难以集中",
              "strength": 0.933528,
              "closeness": 0.049677,
              "betweenness": 0.024615,
              "rank": 8
            },
            {
              "name": "做事提不起兴趣",
              "strength": 0.919657,
              "closeness": 0.052647,
              "betweenness": 0.110769,
              "rank": 9
            },
            {
              "name": "感到无法控制焦虑",
              "strength": 0.917601,
              "closeness": 0.044344,
              "betweenness": 0.021538,
              "rank": 10
            },
            {
              "name": "理解上存在困难",
              "strength": 0.888941,
              "closeness": 0.046542,
              "betweenness": 0.043077,
              "rank": 11
            },
            {
              "name": "头晕",
              "strength": 0.848614,
              "closeness": 0.05513,
              "betweenness": 0.073846,
              "rank": 12
            },
            {
              "name": "感到心情低落",
              "strength": 0.841441,
              "closeness": 0.050666,
              "betweenness": 0.055385,
              "rank": 13
            },
            {
              "name": "腹胀腹痛腹泻",
              "strength": 0.840229,
              "closeness": 0.052112,
              "betweenness": 0.043077,
              "rank": 14
            },
            {
              "name": "发热",
              "strength": 0.837052,
              "closeness": 0.05367,
              "betweenness": 0.092308,
              "rank": 15
            },
            {
              "name": "头痛",
              "strength": 0.811764,
              "closeness": 0.053383,
              "betweenness": 0.033846,
              "rank": 16
            },
            {
              "name": "肌肉关节疼痛",
              "strength": 0.791907,
              "closeness": 0.046448,
              "betweenness": 0.046154,
              "rank": 17
            },
            {
              "name": "恶心呕吐",
              "strength": 0.773764,
              "closeness": 0.052465,
              "betweenness": 0.006154,
              "rank": 18
            },
            {
              "name": "手脚发麻",
              "strength": 0.771906,
              "closeness": 0.045173,
              "betweenness": 0.030769,
              "rank": 19
            },
            {
              "name": "性欲下降",
              "strength": 0.729581,
              "closeness": 0.046951,
              "betweenness": 0.006154,
              "rank": 20
            },
            {
              "name": "皮疹",
              "strength": 0.698354,
              "closeness": 0.044994,
              "betweenness": 0.009231,
              "rank": 21
            },
            {
              "name": "视力模糊",
              "strength": 0.692003,
              "closeness": 0.045663,
              "betweenness": 0.027692,
              "rank": 22
            },
            {
              "name": "嗜睡或难以入睡",
              "strength": 0.652014,
              "closeness": 0.050387,
              "betweenness": 0.04,
              "rank": 23
            },
            {
              "name": "口腔溃疡",
              "strength": 0.620084,
              "closeness": 0.043779,
              "betweenness": 0.009231,
              "rank": 24
            },
            {
              "name": "脂肪堆积",
              "strength": 0.615473,
              "closeness": 0.044696,
              "betweenness": 0.015385,
              "rank": 25
            },
            {
              "name": "掉发",
              "strength": 0.506544,
              "closeness": 0.043295,
              "betweenness": 0.006154,
              "rank": 26
            },
            {
              "name": "咳嗽",
              "strength": 0.472744,
              "closeness": 0.042248,
              "betweenness": 0.009231,
              "rank": 27
            }
          ]
        }
      }
    })
    console.log('[done] import_sn_centrality', res)
  } catch (err) {
    console.error('[error] import_sn_centrality', err)
  }
})()
