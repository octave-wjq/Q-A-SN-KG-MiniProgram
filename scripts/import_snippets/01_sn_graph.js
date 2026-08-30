// 在微信开发者工具控制台中执行以下代码：
// 导入症状网络图数据
// event 大小: 16942 bytes (限制: 102400 bytes)
(async () => {
  try {
    const res = await wx.cloud.callFunction({
      name: 'import_data',
      data: {
        "action": "import_sn_graph",
        "data": {
          "nodes": [
            {
              "id": "疲乏",
              "label": "疲乏",
              "centrality": {
                "strength": 0.993412,
                "closeness": 0.059424,
                "betweenness": 0.110769
              },
              "frequency": 1197,
              "group": "全身症状",
              "group_color": "#0072B2"
            },
            {
              "id": "头晕",
              "label": "头晕",
              "centrality": {
                "strength": 0.848614,
                "closeness": 0.05513,
                "betweenness": 0.073846
              },
              "frequency": 988,
              "group": "神经症状",
              "group_color": "#F0E442"
            },
            {
              "id": "头痛",
              "label": "头痛",
              "centrality": {
                "strength": 0.811764,
                "closeness": 0.053383,
                "betweenness": 0.033846
              },
              "frequency": 589,
              "group": "神经症状",
              "group_color": "#F0E442"
            },
            {
              "id": "发热",
              "label": "发热",
              "centrality": {
                "strength": 0.837052,
                "closeness": 0.05367,
                "betweenness": 0.092308
              },
              "frequency": 650,
              "group": "消化症状",
              "group_color": "#009E73"
            },
            {
              "id": "注意力难以集中",
              "label": "注意力难以集中",
              "centrality": {
                "strength": 0.933528,
                "closeness": 0.049677,
                "betweenness": 0.024615
              },
              "frequency": 749,
              "group": "认知症状",
              "group_color": "#E69F00"
            },
            {
              "id": "反应变慢",
              "label": "反应变慢",
              "centrality": {
                "strength": 1.102269,
                "closeness": 0.050669,
                "betweenness": 0.092308
              },
              "frequency": 945,
              "group": "认知症状",
              "group_color": "#E69F00"
            },
            {
              "id": "健忘",
              "label": "健忘",
              "centrality": {
                "strength": 0.961274,
                "closeness": 0.049914,
                "betweenness": 0.055385
              },
              "frequency": 1036,
              "group": "认知症状",
              "group_color": "#E69F00"
            },
            {
              "id": "理解上存在困难",
              "label": "理解上存在困难",
              "centrality": {
                "strength": 0.888941,
                "closeness": 0.046542,
                "betweenness": 0.043077
              },
              "frequency": 465,
              "group": "认知症状",
              "group_color": "#E69F00"
            },
            {
              "id": "变得更加糊涂",
              "label": "变得更加糊涂",
              "centrality": {
                "strength": 0.940118,
                "closeness": 0.046011,
                "betweenness": 0.033846
              },
              "frequency": 388,
              "group": "认知症状",
              "group_color": "#E69F00"
            },
            {
              "id": "咳嗽",
              "label": "咳嗽",
              "centrality": {
                "strength": 0.472744,
                "closeness": 0.042248,
                "betweenness": 0.009231
              },
              "frequency": 683,
              "group": "全身症状",
              "group_color": "#0072B2"
            },
            {
              "id": "嗜睡或难以入睡",
              "label": "嗜睡或难以入睡",
              "centrality": {
                "strength": 0.652014,
                "closeness": 0.050387,
                "betweenness": 0.04
              },
              "frequency": 1086,
              "group": "全身症状",
              "group_color": "#0072B2"
            },
            {
              "id": "视力模糊",
              "label": "视力模糊",
              "centrality": {
                "strength": 0.692003,
                "closeness": 0.045663,
                "betweenness": 0.027692
              },
              "frequency": 665,
              "group": "全身症状",
              "group_color": "#0072B2"
            },
            {
              "id": "皮疹",
              "label": "皮疹",
              "centrality": {
                "strength": 0.698354,
                "closeness": 0.044994,
                "betweenness": 0.009231
              },
              "frequency": 646,
              "group": "皮肤关节症状",
              "group_color": "#CC79A7"
            },
            {
              "id": "口腔溃疡",
              "label": "口腔溃疡",
              "centrality": {
                "strength": 0.620084,
                "closeness": 0.043779,
                "betweenness": 0.009231
              },
              "frequency": 342,
              "group": "皮肤关节症状",
              "group_color": "#CC79A7"
            },
            {
              "id": "肌肉关节疼痛",
              "label": "肌肉关节疼痛",
              "centrality": {
                "strength": 0.791907,
                "closeness": 0.046448,
                "betweenness": 0.046154
              },
              "frequency": 744,
              "group": "皮肤关节症状",
              "group_color": "#CC79A7"
            },
            {
              "id": "手脚发麻",
              "label": "手脚发麻",
              "centrality": {
                "strength": 0.771906,
                "closeness": 0.045173,
                "betweenness": 0.030769
              },
              "frequency": 644,
              "group": "皮肤关节症状",
              "group_color": "#CC79A7"
            },
            {
              "id": "食欲下降",
              "label": "食欲下降",
              "centrality": {
                "strength": 1.070246,
                "closeness": 0.056068,
                "betweenness": 0.110769
              },
              "frequency": 805,
              "group": "消化症状",
              "group_color": "#009E73"
            },
            {
              "id": "腹胀腹痛腹泻",
              "label": "腹胀腹痛腹泻",
              "centrality": {
                "strength": 0.840229,
                "closeness": 0.052112,
                "betweenness": 0.043077
              },
              "frequency": 661,
              "group": "消化症状",
              "group_color": "#009E73"
            },
            {
              "id": "恶心呕吐",
              "label": "恶心呕吐",
              "centrality": {
                "strength": 0.773764,
                "closeness": 0.052465,
                "betweenness": 0.006154
              },
              "frequency": 469,
              "group": "消化症状",
              "group_color": "#009E73"
            },
            {
              "id": "脂肪堆积",
              "label": "脂肪堆积",
              "centrality": {
                "strength": 0.615473,
                "closeness": 0.044696,
                "betweenness": 0.015385
              },
              "frequency": 360,
              "group": "全身症状",
              "group_color": "#0072B2"
            },
            {
              "id": "消瘦体重减轻",
              "label": "消瘦体重减轻",
              "centrality": {
                "strength": 0.990482,
                "closeness": 0.054206,
                "betweenness": 0.095385
              },
              "frequency": 684,
              "group": "消化症状",
              "group_color": "#009E73"
            },
            {
              "id": "性欲下降",
              "label": "性欲下降",
              "centrality": {
                "strength": 0.729581,
                "closeness": 0.046951,
                "betweenness": 0.006154
              },
              "frequency": 596,
              "group": "全身症状",
              "group_color": "#0072B2"
            },
            {
              "id": "掉发",
              "label": "掉发",
              "centrality": {
                "strength": 0.506544,
                "closeness": 0.043295,
                "betweenness": 0.006154
              },
              "frequency": 745,
              "group": "全身症状",
              "group_color": "#0072B2"
            },
            {
              "id": "感到无法控制焦虑",
              "label": "感到无法控制焦虑",
              "centrality": {
                "strength": 0.917601,
                "closeness": 0.044344,
                "betweenness": 0.021538
              },
              "frequency": 602,
              "group": "心理症状",
              "group_color": "#56B4E9"
            },
            {
              "id": "感到紧张或焦虑",
              "label": "感到紧张或焦虑",
              "centrality": {
                "strength": 0.994385,
                "closeness": 0.046412,
                "betweenness": 0.061538
              },
              "frequency": 716,
              "group": "心理症状",
              "group_color": "#56B4E9"
            },
            {
              "id": "做事提不起兴趣",
              "label": "做事提不起兴趣",
              "centrality": {
                "strength": 0.919657,
                "closeness": 0.052647,
                "betweenness": 0.110769
              },
              "frequency": 804,
              "group": "心理症状",
              "group_color": "#56B4E9"
            },
            {
              "id": "感到心情低落",
              "label": "感到心情低落",
              "centrality": {
                "strength": 0.841441,
                "closeness": 0.050666,
                "betweenness": 0.055385
              },
              "frequency": 773,
              "group": "心理症状",
              "group_color": "#56B4E9"
            }
          ],
          "edges": [
            {
              "source": "疲乏",
              "target": "头晕",
              "weight": 0.178135,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "头痛",
              "weight": 0.042954,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "发热",
              "weight": 0.093859,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "注意力难以集中",
              "weight": 0.054629,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "反应变慢",
              "weight": 0.060617,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "嗜睡或难以入睡",
              "weight": 0.081701,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "食欲下降",
              "weight": 0.111017,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "腹胀腹痛腹泻",
              "weight": 0.067223,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "消瘦体重减轻",
              "weight": 0.038745,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "性欲下降",
              "weight": 0.070917,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "感到无法控制焦虑",
              "weight": 0.030921,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "做事提不起兴趣",
              "weight": 0.13175,
              "is_negative": false
            },
            {
              "source": "疲乏",
              "target": "感到心情低落",
              "weight": 0.030944,
              "is_negative": false
            },
            {
              "source": "头晕",
              "target": "头痛",
              "weight": 0.329489,
              "is_negative": false
            },
            {
              "source": "头晕",
              "target": "注意力难以集中",
              "weight": 0.064651,
              "is_negative": false
            },
            {
              "source": "头晕",
              "target": "反应变慢",
              "weight": 0.039987,
              "is_negative": false
            },
            {
              "source": "头晕",
              "target": "变得更加糊涂",
              "weight": 0.057155,
              "is_negative": false
            },
            {
              "source": "头晕",
              "target": "视力模糊",
              "weight": 0.063106,
              "is_negative": false
            },
            {
              "source": "头晕",
              "target": "恶心呕吐",
              "weight": 0.069277,
              "is_negative": false
            },
            {
              "source": "头晕",
              "target": "感到紧张或焦虑",
              "weight": 0.046814,
              "is_negative": false
            },
            {
              "source": "头痛",
              "target": "发热",
              "weight": 0.171348,
              "is_negative": false
            },
            {
              "source": "头痛",
              "target": "理解上存在困难",
              "weight": 0.035771,
              "is_negative": false
            },
            {
              "source": "头痛",
              "target": "变得更加糊涂",
              "weight": 0.030979,
              "is_negative": false
            },
            {
              "source": "头痛",
              "target": "嗜睡或难以入睡",
              "weight": 0.031555,
              "is_negative": false
            },
            {
              "source": "头痛",
              "target": "肌肉关节疼痛",
              "weight": 0.052896,
              "is_negative": false
            },
            {
              "source": "头痛",
              "target": "手脚发麻",
              "weight": 0.039932,
              "is_negative": false
            },
            {
              "source": "头痛",
              "target": "恶心呕吐",
              "weight": 0.076839,
              "is_negative": false
            },
            {
              "source": "发热",
              "target": "咳嗽",
              "weight": 0.138539,
              "is_negative": false
            },
            {
              "source": "发热",
              "target": "嗜睡或难以入睡",
              "weight": 0.044538,
              "is_negative": false
            },
            {
              "source": "发热",
              "target": "皮疹",
              "weight": 0.081177,
              "is_negative": false
            },
            {
              "source": "发热",
              "target": "口腔溃疡",
              "weight": 0.047348,
              "is_negative": false
            },
            {
              "source": "发热",
              "target": "肌肉关节疼痛",
              "weight": 0.07169,
              "is_negative": false
            },
            {
              "source": "发热",
              "target": "食欲下降",
              "weight": 0.090243,
              "is_negative": false
            },
            {
              "source": "发热",
              "target": "消瘦体重减轻",
              "weight": 0.09831,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "反应变慢",
              "weight": 0.321705,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "健忘",
              "weight": 0.111978,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "理解上存在困难",
              "weight": 0.10197,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "变得更加糊涂",
              "weight": 0.079727,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "手脚发麻",
              "weight": 0.056429,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "腹胀腹痛腹泻",
              "weight": 0.060458,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "性欲下降",
              "weight": 0.046453,
              "is_negative": false
            },
            {
              "source": "注意力难以集中",
              "target": "做事提不起兴趣",
              "weight": 0.035528,
              "is_negative": false
            },
            {
              "source": "反应变慢",
              "target": "健忘",
              "weight": 0.298267,
              "is_negative": false
            },
            {
              "source": "反应变慢",
              "target": "理解上存在困难",
              "weight": 0.127085,
              "is_negative": false
            },
            {
              "source": "反应变慢",
              "target": "变得更加糊涂",
              "weight": 0.081785,
              "is_negative": false
            },
            {
              "source": "反应变慢",
              "target": "视力模糊",
              "weight": 0.046012,
              "is_negative": false
            },
            {
              "source": "反应变慢",
              "target": "性欲下降",
              "weight": 0.043076,
              "is_negative": false
            },
            {
              "source": "反应变慢",
              "target": "做事提不起兴趣",
              "weight": 0.083734,
              "is_negative": false
            },
            {
              "source": "健忘",
              "target": "理解上存在困难",
              "weight": 0.1247,
              "is_negative": false
            },
            {
              "source": "健忘",
              "target": "变得更加糊涂",
              "weight": 0.125586,
              "is_negative": false
            },
            {
              "source": "健忘",
              "target": "嗜睡或难以入睡",
              "weight": 0.092244,
              "is_negative": false
            },
            {
              "source": "健忘",
              "target": "视力模糊",
              "weight": 0.037708,
              "is_negative": false
            },
            {
              "source": "健忘",
              "target": "腹胀腹痛腹泻",
              "weight": 0.063878,
              "is_negative": false
            },
            {
              "source": "健忘",
              "target": "脂肪堆积",
              "weight": 0.033718,
              "is_negative": false
            },
            {
              "source": "健忘",
              "target": "掉发",
              "weight": 0.073194,
              "is_negative": false
            },
            {
              "source": "理解上存在困难",
              "target": "变得更加糊涂",
              "weight": 0.363836,
              "is_negative": false
            },
            {
              "source": "理解上存在困难",
              "target": "口腔溃疡",
              "weight": 0.041155,
              "is_negative": false
            },
            {
              "source": "理解上存在困难",
              "target": "脂肪堆积",
              "weight": 0.058689,
              "is_negative": false
            },
            {
              "source": "理解上存在困难",
              "target": "感到紧张或焦虑",
              "weight": 0.035735,
              "is_negative": false
            },
            {
              "source": "变得更加糊涂",
              "target": "视力模糊",
              "weight": 0.109705,
              "is_negative": false
            },
            {
              "source": "变得更加糊涂",
              "target": "口腔溃疡",
              "weight": 0.037303,
              "is_negative": false
            },
            {
              "source": "变得更加糊涂",
              "target": "肌肉关节疼痛",
              "weight": 0.054041,
              "is_negative": false
            },
            {
              "source": "咳嗽",
              "target": "嗜睡或难以入睡",
              "weight": 0.053019,
              "is_negative": false
            },
            {
              "source": "咳嗽",
              "target": "皮疹",
              "weight": 0.037747,
              "is_negative": false
            },
            {
              "source": "咳嗽",
              "target": "口腔溃疡",
              "weight": 0.076678,
              "is_negative": false
            },
            {
              "source": "咳嗽",
              "target": "手脚发麻",
              "weight": 0.032554,
              "is_negative": false
            },
            {
              "source": "咳嗽",
              "target": "食欲下降",
              "weight": 0.067643,
              "is_negative": false
            },
            {
              "source": "咳嗽",
              "target": "恶心呕吐",
              "weight": 0.036107,
              "is_negative": false
            },
            {
              "source": "咳嗽",
              "target": "脂肪堆积",
              "weight": 0.030456,
              "is_negative": false
            },
            {
              "source": "嗜睡或难以入睡",
              "target": "视力模糊",
              "weight": 0.094632,
              "is_negative": false
            },
            {
              "source": "嗜睡或难以入睡",
              "target": "肌肉关节疼痛",
              "weight": 0.08557,
              "is_negative": false
            },
            {
              "source": "嗜睡或难以入睡",
              "target": "消瘦体重减轻",
              "weight": 0.042556,
              "is_negative": false
            },
            {
              "source": "嗜睡或难以入睡",
              "target": "掉发",
              "weight": 0.068966,
              "is_negative": false
            },
            {
              "source": "嗜睡或难以入睡",
              "target": "感到无法控制焦虑",
              "weight": 0.057232,
              "is_negative": false
            },
            {
              "source": "视力模糊",
              "target": "皮疹",
              "weight": 0.060181,
              "is_negative": false
            },
            {
              "source": "视力模糊",
              "target": "口腔溃疡",
              "weight": 0.03091,
              "is_negative": false
            },
            {
              "source": "视力模糊",
              "target": "手脚发麻",
              "weight": 0.138124,
              "is_negative": false
            },
            {
              "source": "视力模糊",
              "target": "脂肪堆积",
              "weight": 0.049172,
              "is_negative": false
            },
            {
              "source": "视力模糊",
              "target": "掉发",
              "weight": 0.032372,
              "is_negative": false
            },
            {
              "source": "视力模糊",
              "target": "感到心情低落",
              "weight": 0.030082,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "口腔溃疡",
              "weight": 0.116487,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "肌肉关节疼痛",
              "weight": 0.0577,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "腹胀腹痛腹泻",
              "weight": 0.054206,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "恶心呕吐",
              "weight": 0.045254,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "脂肪堆积",
              "weight": 0.043009,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "消瘦体重减轻",
              "weight": 0.030785,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "性欲下降",
              "weight": 0.06945,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "掉发",
              "weight": 0.061767,
              "is_negative": false
            },
            {
              "source": "皮疹",
              "target": "感到无法控制焦虑",
              "weight": 0.040591,
              "is_negative": false
            },
            {
              "source": "口腔溃疡",
              "target": "手脚发麻",
              "weight": 0.061587,
              "is_negative": false
            },
            {
              "source": "口腔溃疡",
              "target": "腹胀腹痛腹泻",
              "weight": 0.034806,
              "is_negative": false
            },
            {
              "source": "口腔溃疡",
              "target": "脂肪堆积",
              "weight": 0.046225,
              "is_negative": false
            },
            {
              "source": "口腔溃疡",
              "target": "消瘦体重减轻",
              "weight": 0.062426,
              "is_negative": false
            },
            {
              "source": "口腔溃疡",
              "target": "感到心情低落",
              "weight": 0.065159,
              "is_negative": false
            },
            {
              "source": "肌肉关节疼痛",
              "target": "手脚发麻",
              "weight": 0.333196,
              "is_negative": false
            },
            {
              "source": "肌肉关节疼痛",
              "target": "腹胀腹痛腹泻",
              "weight": 0.061248,
              "is_negative": false
            },
            {
              "source": "肌肉关节疼痛",
              "target": "恶心呕吐",
              "weight": 0.036953,
              "is_negative": false
            },
            {
              "source": "肌肉关节疼痛",
              "target": "感到无法控制焦虑",
              "weight": 0.038613,
              "is_negative": false
            },
            {
              "source": "手脚发麻",
              "target": "腹胀腹痛腹泻",
              "weight": 0.033741,
              "is_negative": false
            },
            {
              "source": "手脚发麻",
              "target": "性欲下降",
              "weight": 0.0351,
              "is_negative": false
            },
            {
              "source": "手脚发麻",
              "target": "掉发",
              "weight": 0.041243,
              "is_negative": false
            },
            {
              "source": "食欲下降",
              "target": "腹胀腹痛腹泻",
              "weight": 0.127213,
              "is_negative": false
            },
            {
              "source": "食欲下降",
              "target": "恶心呕吐",
              "weight": 0.245786,
              "is_negative": false
            },
            {
              "source": "食欲下降",
              "target": "消瘦体重减轻",
              "weight": 0.276848,
              "is_negative": false
            },
            {
              "source": "食欲下降",
              "target": "性欲下降",
              "weight": 0.035703,
              "is_negative": false
            },
            {
              "source": "食欲下降",
              "target": "做事提不起兴趣",
              "weight": 0.032741,
              "is_negative": false
            },
            {
              "source": "食欲下降",
              "target": "感到心情低落",
              "weight": 0.083053,
              "is_negative": false
            },
            {
              "source": "腹胀腹痛腹泻",
              "target": "恶心呕吐",
              "weight": 0.185551,
              "is_negative": false
            },
            {
              "source": "腹胀腹痛腹泻",
              "target": "脂肪堆积",
              "weight": 0.043128,
              "is_negative": false
            },
            {
              "source": "腹胀腹痛腹泻",
              "target": "消瘦体重减轻",
              "weight": 0.04567,
              "is_negative": false
            },
            {
              "source": "腹胀腹痛腹泻",
              "target": "掉发",
              "weight": 0.063105,
              "is_negative": false
            },
            {
              "source": "恶心呕吐",
              "target": "脂肪堆积",
              "weight": 0.04134,
              "is_negative": false
            },
            {
              "source": "恶心呕吐",
              "target": "性欲下降",
              "weight": 0.036659,
              "is_negative": false
            },
            {
              "source": "脂肪堆积",
              "target": "消瘦体重减轻",
              "weight": -0.125232,
              "is_negative": true
            },
            {
              "source": "脂肪堆积",
              "target": "性欲下降",
              "weight": 0.061514,
              "is_negative": false
            },
            {
              "source": "脂肪堆积",
              "target": "掉发",
              "weight": 0.047521,
              "is_negative": false
            },
            {
              "source": "脂肪堆积",
              "target": "感到紧张或焦虑",
              "weight": 0.03547,
              "is_negative": false
            },
            {
              "source": "消瘦体重减轻",
              "target": "性欲下降",
              "weight": 0.158775,
              "is_negative": false
            },
            {
              "source": "消瘦体重减轻",
              "target": "掉发",
              "weight": 0.07351,
              "is_negative": false
            },
            {
              "source": "消瘦体重减轻",
              "target": "做事提不起兴趣",
              "weight": 0.037624,
              "is_negative": false
            },
            {
              "source": "性欲下降",
              "target": "掉发",
              "weight": 0.044866,
              "is_negative": false
            },
            {
              "source": "性欲下降",
              "target": "感到无法控制焦虑",
              "weight": 0.031197,
              "is_negative": false
            },
            {
              "source": "性欲下降",
              "target": "做事提不起兴趣",
              "weight": 0.058312,
              "is_negative": false
            },
            {
              "source": "性欲下降",
              "target": "感到心情低落",
              "weight": 0.037561,
              "is_negative": false
            },
            {
              "source": "感到无法控制焦虑",
              "target": "感到紧张或焦虑",
              "weight": 0.49761,
              "is_negative": false
            },
            {
              "source": "感到无法控制焦虑",
              "target": "做事提不起兴趣",
              "weight": 0.103096,
              "is_negative": false
            },
            {
              "source": "感到无法控制焦虑",
              "target": "感到心情低落",
              "weight": 0.118341,
              "is_negative": false
            },
            {
              "source": "感到紧张或焦虑",
              "target": "做事提不起兴趣",
              "weight": 0.169664,
              "is_negative": false
            },
            {
              "source": "感到紧张或焦虑",
              "target": "感到心情低落",
              "weight": 0.209092,
              "is_negative": false
            },
            {
              "source": "做事提不起兴趣",
              "target": "感到心情低落",
              "weight": 0.267209,
              "is_negative": false
            }
          ]
        }
      }
    })
    console.log('[done] import_sn_graph', res)
  } catch (err) {
    console.error('[error] import_sn_graph', err)
  }
})()
