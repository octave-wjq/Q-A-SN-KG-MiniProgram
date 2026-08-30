// 在微信开发者工具控制台中执行以下代码：
// 一次性串行导入全部数据（共 6 次 callFunction）
const tasks = [
  {
    "file": "01_sn_graph.js",
    "label": "导入症状网络图数据",
    "action": "import_sn_graph",
    "eventBytes": 16942,
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
  },
  {
    "file": "02_sn_centrality.js",
    "label": "导入症状中心性数据",
    "action": "import_sn_centrality",
    "eventBytes": 2725,
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
  },
  {
    "file": "03_sn_simulation.js",
    "label": "导入症状网络仿真数据",
    "action": "import_sn_simulation",
    "eventBytes": 11458,
    "data": [
      {
        "node_id": "疲乏",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -6.28115,
        "pct_change": -170.106058,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -6.585001,
          -5.977299
        ],
        "valid": false
      },
      {
        "node_id": "疲乏",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 24.455476,
        "pct_change": 172.955903,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          24.150623,
          24.760329
        ],
        "valid": true
      },
      {
        "node_id": "头晕",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -2.018622,
        "pct_change": -122.530525,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -2.3524,
          -1.684843
        ],
        "valid": false
      },
      {
        "node_id": "头晕",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 20.32833,
        "pct_change": 126.891426,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          19.999645,
          20.657016
        ],
        "valid": true
      },
      {
        "node_id": "头痛",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -0.03137,
        "pct_change": -100.350136,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -0.375023,
          0.312282
        ],
        "valid": false
      },
      {
        "node_id": "头痛",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 18.159273,
        "pct_change": 102.681837,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          17.814714,
          18.503832
        ],
        "valid": true
      },
      {
        "node_id": "发热",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -2.109025,
        "pct_change": -123.539542,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -2.450532,
          -1.767517
        ],
        "valid": false
      },
      {
        "node_id": "发热",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 20.271738,
        "pct_change": 126.259779,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          19.933182,
          20.610294
        ],
        "valid": true
      },
      {
        "node_id": "注意力难以集中",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -1.986941,
        "pct_change": -122.176923,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -2.298268,
          -1.675613
        ],
        "valid": false
      },
      {
        "node_id": "注意力难以集中",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 20.314831,
        "pct_change": 126.740756,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          20.006622,
          20.62304
        ],
        "valid": true
      },
      {
        "node_id": "反应变慢",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -3.098032,
        "pct_change": -134.578187,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -3.401395,
          -2.794668
        ],
        "valid": false
      },
      {
        "node_id": "反应变慢",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 21.517073,
        "pct_change": 140.159391,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          21.213242,
          21.820905
        ],
        "valid": true
      },
      {
        "node_id": "健忘",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -4.067536,
        "pct_change": -145.399157,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -4.379281,
          -3.755791
        ],
        "valid": false
      },
      {
        "node_id": "健忘",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 22.068117,
        "pct_change": 146.309778,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          21.758352,
          22.377882
        ],
        "valid": true
      },
      {
        "node_id": "理解上存在困难",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -0.150583,
        "pct_change": -101.680713,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -0.464603,
          0.163436
        ],
        "valid": false
      },
      {
        "node_id": "理解上存在困难",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 17.728121,
        "pct_change": 97.869604,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          17.412343,
          18.0439
        ],
        "valid": true
      },
      {
        "node_id": "变得更加糊涂",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": 0.70013,
        "pct_change": -92.185605,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          0.379967,
          1.020294
        ],
        "valid": false
      },
      {
        "node_id": "变得更加糊涂",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 17.399773,
        "pct_change": 94.204804,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          17.077535,
          17.722012
        ],
        "valid": true
      },
      {
        "node_id": "咳嗽",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": 2.645528,
        "pct_change": -70.472364,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          2.272314,
          3.018741
        ],
        "valid": false
      },
      {
        "node_id": "咳嗽",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 15.748685,
        "pct_change": 75.776442,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          15.376996,
          16.120374
        ],
        "valid": true
      },
      {
        "node_id": "嗜睡或难以入睡",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -3.634922,
        "pct_change": -140.570608,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -3.973673,
          -3.296172
        ],
        "valid": false
      },
      {
        "node_id": "嗜睡或难以入睡",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 22.063783,
        "pct_change": 146.261404,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          21.728862,
          22.398704
        ],
        "valid": true
      },
      {
        "node_id": "视力模糊",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": 0.037899,
        "pct_change": -99.576991,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -0.308894,
          0.384693
        ],
        "valid": false
      },
      {
        "node_id": "视力模糊",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 17.826364,
        "pct_change": 98.966125,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          17.483062,
          18.169666
        ],
        "valid": true
      },
      {
        "node_id": "皮疹",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": 0.913415,
        "pct_change": -89.805059,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          0.548394,
          1.278437
        ],
        "valid": false
      },
      {
        "node_id": "皮疹",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 17.304301,
        "pct_change": 93.139208,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          16.94821,
          17.660393
        ],
        "valid": true
      },
      {
        "node_id": "口腔溃疡",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": 2.597817,
        "pct_change": -71.004879,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          2.239997,
          2.955637
        ],
        "valid": false
      },
      {
        "node_id": "口腔溃疡",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 15.438311,
        "pct_change": 72.31225,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          15.083329,
          15.793292
        ],
        "valid": true
      },
      {
        "node_id": "肌肉关节疼痛",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -1.423622,
        "pct_change": -115.889529,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -1.759033,
          -1.08821
        ],
        "valid": false
      },
      {
        "node_id": "肌肉关节疼痛",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 19.550807,
        "pct_change": 118.213223,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          19.217875,
          19.88374
        ],
        "valid": true
      },
      {
        "node_id": "手脚发麻",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -0.550107,
        "pct_change": -106.139936,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -0.886002,
          -0.214213
        ],
        "valid": false
      },
      {
        "node_id": "手脚发麻",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 18.485588,
        "pct_change": 106.323954,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          18.147207,
          18.823969
        ],
        "valid": true
      },
      {
        "node_id": "食欲下降",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -2.59952,
        "pct_change": -129.014133,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -2.925731,
          -2.27331
        ],
        "valid": false
      },
      {
        "node_id": "食欲下降",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 20.730509,
        "pct_change": 131.380281,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          20.393095,
          21.067924
        ],
        "valid": true
      },
      {
        "node_id": "腹胀腹痛腹泻",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -1.267901,
        "pct_change": -114.151471,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -1.603204,
          -0.932597
        ],
        "valid": false
      },
      {
        "node_id": "腹胀腹痛腹泻",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 19.031332,
        "pct_change": 112.415179,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          18.690377,
          19.372286
        ],
        "valid": true
      },
      {
        "node_id": "恶心呕吐",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": 1.389369,
        "pct_change": -84.492781,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          1.045614,
          1.733123
        ],
        "valid": false
      },
      {
        "node_id": "恶心呕吐",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 16.895233,
        "pct_change": 88.573453,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          16.54882,
          17.241645
        ],
        "valid": true
      },
      {
        "node_id": "脂肪堆积",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": 4.690236,
        "pct_change": -47.650679,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          4.318222,
          5.062249
        ],
        "valid": false
      },
      {
        "node_id": "脂肪堆积",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 13.413715,
        "pct_change": 49.715051,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          13.035442,
          13.791989
        ],
        "valid": true
      },
      {
        "node_id": "消瘦体重减轻",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -0.929956,
        "pct_change": -110.379555,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -1.288858,
          -0.571054
        ],
        "valid": false
      },
      {
        "node_id": "消瘦体重减轻",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 19.331901,
        "pct_change": 115.769942,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          18.984822,
          19.678981
        ],
        "valid": true
      },
      {
        "node_id": "性欲下降",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -1.45115,
        "pct_change": -116.196774,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -1.796703,
          -1.105596
        ],
        "valid": false
      },
      {
        "node_id": "性欲下降",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 19.298491,
        "pct_change": 115.397039,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          18.957904,
          19.639078
        ],
        "valid": true
      },
      {
        "node_id": "掉发",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -0.418525,
        "pct_change": -104.671303,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -0.771478,
          -0.065573
        ],
        "valid": false
      },
      {
        "node_id": "掉发",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 17.965413,
        "pct_change": 100.518103,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          17.605231,
          18.325595
        ],
        "valid": true
      },
      {
        "node_id": "感到无法控制焦虑",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -0.966913,
        "pct_change": -110.792046,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -1.289256,
          -0.64457
        ],
        "valid": false
      },
      {
        "node_id": "感到无法控制焦虑",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 18.809999,
        "pct_change": 109.94481,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          18.478117,
          19.141881
        ],
        "valid": true
      },
      {
        "node_id": "感到紧张或焦虑",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -1.680144,
        "pct_change": -118.752658,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -1.994735,
          -1.365553
        ],
        "valid": false
      },
      {
        "node_id": "感到紧张或焦虑",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 20.280664,
        "pct_change": 126.359405,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          19.962909,
          20.598419
        ],
        "valid": true
      },
      {
        "node_id": "做事提不起兴趣",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -3.214839,
        "pct_change": -135.881913,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -3.530014,
          -2.899664
        ],
        "valid": false
      },
      {
        "node_id": "做事提不起兴趣",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 21.179678,
        "pct_change": 136.393606,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          20.868738,
          21.490618
        ],
        "valid": true
      },
      {
        "node_id": "感到心情低落",
        "intervention_type": "alleviate",
        "baseline_burden": 8.959497,
        "intervened_burden": -2.363855,
        "pct_change": -126.383786,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          -2.680666,
          -2.047043
        ],
        "valid": false
      },
      {
        "node_id": "感到心情低落",
        "intervention_type": "aggravate",
        "baseline_burden": 8.959497,
        "intervened_burden": 20.294427,
        "pct_change": 126.513021,
        "p_value": 0,
        "p_adjusted": 0,
        "ci_95": [
          19.977212,
          20.611643
        ],
        "valid": true
      }
    ]
  },
  {
    "file": "04_sn_spillover.js",
    "label": "导入症状网络外溢效应数据",
    "action": "import_sn_spillover",
    "eventBytes": 14441,
    "data": [
      {
        "intervention_type": "alleviate",
        "node_names": [
          "疲乏",
          "头晕",
          "头痛",
          "发热",
          "注意力难以集中",
          "反应变慢",
          "健忘",
          "理解上存在困难",
          "变得更加糊涂",
          "咳嗽",
          "嗜睡或难以入睡",
          "视力模糊",
          "皮疹",
          "口腔溃疡",
          "肌肉关节疼痛",
          "手脚发麻",
          "食欲下降",
          "腹胀腹痛腹泻",
          "恶心呕吐",
          "脂肪堆积",
          "消瘦体重减轻",
          "性欲下降",
          "掉发",
          "感到无法控制焦虑",
          "感到紧张或焦虑",
          "做事提不起兴趣",
          "感到心情低落"
        ],
        "matrix": [
          [
            0,
            -0.720114,
            -0.571624,
            -0.580001,
            -0.632795,
            -0.6565,
            -0.534207,
            -0.517211,
            -0.515169,
            -0.332277,
            -0.562159,
            -0.427781,
            -0.374136,
            -0.393496,
            -0.488017,
            -0.470584,
            -0.634312,
            -0.529038,
            -0.479254,
            -0.240303,
            -0.526328,
            -0.562766,
            -0.392155,
            -0.584481,
            -0.587274,
            -0.716482,
            -0.604179
          ],
          [
            -0.575378,
            0,
            -0.671095,
            -0.373097,
            -0.476059,
            -0.468336,
            -0.407246,
            -0.399462,
            -0.459977,
            -0.21411,
            -0.358116,
            -0.359806,
            -0.247978,
            -0.249305,
            -0.38627,
            -0.352,
            -0.344727,
            -0.335711,
            -0.365494,
            -0.18259,
            -0.301253,
            -0.294324,
            -0.273361,
            -0.373705,
            -0.396448,
            -0.403399,
            -0.390761
          ],
          [
            -0.413925,
            -0.610567,
            0,
            -0.418514,
            -0.348266,
            -0.326805,
            -0.321446,
            -0.328999,
            -0.343312,
            -0.207605,
            -0.325821,
            -0.267409,
            -0.234216,
            -0.217697,
            -0.348873,
            -0.308647,
            -0.272952,
            -0.270764,
            -0.347371,
            -0.127168,
            -0.227673,
            -0.236949,
            -0.210271,
            -0.275683,
            -0.277035,
            -0.284457,
            -0.276915
          ],
          [
            -0.519821,
            -0.3919,
            -0.514801,
            0,
            -0.35984,
            -0.352178,
            -0.334557,
            -0.328218,
            -0.352632,
            -0.43394,
            -0.401744,
            -0.282697,
            -0.393049,
            -0.357545,
            -0.411839,
            -0.318605,
            -0.502373,
            -0.362624,
            -0.341421,
            -0.160363,
            -0.473537,
            -0.359583,
            -0.271813,
            -0.32352,
            -0.32003,
            -0.367577,
            -0.368146
          ],
          [
            -0.476628,
            -0.432226,
            -0.339443,
            -0.265799,
            0,
            -0.750169,
            -0.639782,
            -0.556134,
            -0.552834,
            -0.191123,
            -0.360581,
            -0.360913,
            -0.23084,
            -0.259045,
            -0.356552,
            -0.408096,
            -0.280419,
            -0.385454,
            -0.301151,
            -0.204802,
            -0.269745,
            -0.333898,
            -0.273567,
            -0.361372,
            -0.391361,
            -0.437723,
            -0.359974
          ],
          [
            -0.53536,
            -0.439751,
            -0.328961,
            -0.312792,
            -0.826596,
            0,
            -0.816885,
            -0.673042,
            -0.65098,
            -0.212916,
            -0.388146,
            -0.422025,
            -0.247215,
            -0.281819,
            -0.358529,
            -0.387745,
            -0.294651,
            -0.364497,
            -0.277819,
            -0.259967,
            -0.285174,
            -0.393466,
            -0.306807,
            -0.381802,
            -0.408757,
            -0.520135,
            -0.406852
          ],
          [
            -0.479733,
            -0.477789,
            -0.391128,
            -0.364574,
            -0.754008,
            -0.870524,
            0,
            -0.731956,
            -0.727751,
            -0.223245,
            -0.480767,
            -0.472445,
            -0.296306,
            -0.287065,
            -0.43327,
            -0.444225,
            -0.310525,
            -0.442749,
            -0.304917,
            -0.286163,
            -0.28919,
            -0.389909,
            -0.426888,
            -0.422976,
            -0.4199,
            -0.474744,
            -0.416701
          ],
          [
            -0.325663,
            -0.315123,
            -0.293849,
            -0.262334,
            -0.512783,
            -0.536402,
            -0.522703,
            0,
            -0.618312,
            -0.159203,
            -0.296908,
            -0.313898,
            -0.207624,
            -0.231123,
            -0.28947,
            -0.285051,
            -0.22572,
            -0.267564,
            -0.203832,
            -0.22387,
            -0.179256,
            -0.247278,
            -0.239502,
            -0.305943,
            -0.354277,
            -0.368314,
            -0.348027
          ],
          [
            -0.3072,
            -0.321616,
            -0.279332,
            -0.216932,
            -0.438153,
            -0.495025,
            -0.472348,
            -0.581413,
            0,
            -0.137137,
            -0.282487,
            -0.355396,
            -0.199989,
            -0.23306,
            -0.298721,
            -0.270906,
            -0.200327,
            -0.247556,
            -0.180085,
            -0.171441,
            -0.165346,
            -0.229188,
            -0.203692,
            -0.249522,
            -0.266976,
            -0.27468,
            -0.263352
          ],
          [
            -0.243238,
            -0.182506,
            -0.222653,
            -0.363128,
            -0.190052,
            -0.185785,
            -0.177276,
            -0.168232,
            -0.177235,
            0,
            -0.231,
            -0.169785,
            -0.198057,
            -0.238568,
            -0.221344,
            -0.185211,
            -0.276962,
            -0.189612,
            -0.209494,
            -0.132196,
            -0.238893,
            -0.163915,
            -0.134673,
            -0.13284,
            -0.163073,
            -0.163409,
            -0.152906
          ],
          [
            -0.558141,
            -0.431785,
            -0.397767,
            -0.424315,
            -0.503787,
            -0.509018,
            -0.538731,
            -0.435463,
            -0.450505,
            -0.304805,
            0,
            -0.440881,
            -0.315678,
            -0.292057,
            -0.532657,
            -0.428125,
            -0.398374,
            -0.395077,
            -0.349327,
            -0.237093,
            -0.382353,
            -0.396679,
            -0.403909,
            -0.480617,
            -0.468367,
            -0.503802,
            -0.451709
          ],
          [
            -0.324511,
            -0.351683,
            -0.277625,
            -0.236191,
            -0.379277,
            -0.399861,
            -0.395569,
            -0.36513,
            -0.443612,
            -0.169647,
            -0.370935,
            0,
            -0.282007,
            -0.263082,
            -0.324513,
            -0.407068,
            -0.222842,
            -0.250321,
            -0.199708,
            -0.202955,
            -0.194425,
            -0.240003,
            -0.27317,
            -0.265076,
            -0.274503,
            -0.290502,
            -0.29268
          ],
          [
            -0.280486,
            -0.251128,
            -0.230979,
            -0.339736,
            -0.251287,
            -0.250719,
            -0.265371,
            -0.233105,
            -0.241221,
            -0.188402,
            -0.266417,
            -0.237719,
            0,
            -0.328129,
            -0.298531,
            -0.255172,
            -0.270671,
            -0.277384,
            -0.264665,
            -0.169887,
            -0.29508,
            -0.301594,
            -0.263317,
            -0.26882,
            -0.267377,
            -0.243742,
            -0.255603
          ],
          [
            -0.215335,
            -0.172523,
            -0.193647,
            -0.241234,
            -0.196855,
            -0.2171,
            -0.213726,
            -0.235092,
            -0.23553,
            -0.182748,
            -0.188559,
            -0.199291,
            -0.295967,
            0,
            -0.216593,
            -0.24059,
            -0.202451,
            -0.227759,
            -0.188221,
            -0.157329,
            -0.225676,
            -0.187838,
            -0.182071,
            -0.193506,
            -0.196832,
            -0.204512,
            -0.209045
          ],
          [
            -0.402589,
            -0.369907,
            -0.365419,
            -0.372953,
            -0.383864,
            -0.381726,
            -0.405501,
            -0.376195,
            -0.395859,
            -0.24952,
            -0.392021,
            -0.347553,
            -0.319678,
            -0.264005,
            0,
            -0.648456,
            -0.310682,
            -0.356083,
            -0.315425,
            -0.182805,
            -0.270153,
            -0.301681,
            -0.295218,
            -0.364361,
            -0.363341,
            -0.344523,
            -0.33303
          ],
          [
            -0.355735,
            -0.322669,
            -0.320903,
            -0.258248,
            -0.386829,
            -0.383336,
            -0.405216,
            -0.332283,
            -0.356773,
            -0.223673,
            -0.338263,
            -0.400198,
            -0.26562,
            -0.287769,
            -0.610274,
            0,
            -0.255224,
            -0.334866,
            -0.276421,
            -0.162581,
            -0.245156,
            -0.287982,
            -0.255109,
            -0.333835,
            -0.325688,
            -0.310813,
            -0.291194
          ],
          [
            -0.563842,
            -0.354037,
            -0.331515,
            -0.498445,
            -0.366538,
            -0.361918,
            -0.329072,
            -0.292807,
            -0.294432,
            -0.341009,
            -0.395802,
            -0.274279,
            -0.299784,
            -0.284014,
            -0.338046,
            -0.323246,
            0,
            -0.54587,
            -0.649645,
            -0.114632,
            -0.700836,
            -0.468048,
            -0.294001,
            -0.38173,
            -0.382865,
            -0.460446,
            -0.490222
          ],
          [
            -0.442794,
            -0.334142,
            -0.303363,
            -0.32381,
            -0.393556,
            -0.390877,
            -0.384768,
            -0.326535,
            -0.3479,
            -0.222593,
            -0.338886,
            -0.281612,
            -0.33647,
            -0.281785,
            -0.377948,
            -0.339304,
            -0.477009,
            0,
            -0.49175,
            -0.19673,
            -0.376664,
            -0.327515,
            -0.315302,
            -0.318856,
            -0.341116,
            -0.3652,
            -0.335782
          ],
          [
            -0.294411,
            -0.300606,
            -0.296041,
            -0.240508,
            -0.246483,
            -0.24118,
            -0.221446,
            -0.198062,
            -0.211053,
            -0.207098,
            -0.253973,
            -0.182135,
            -0.23993,
            -0.174421,
            -0.25714,
            -0.223024,
            -0.482,
            -0.409096,
            0,
            -0.14287,
            -0.283981,
            -0.222687,
            -0.175397,
            -0.233976,
            -0.243436,
            -0.288835,
            -0.24906
          ],
          [
            -0.125903,
            -0.117876,
            -0.095507,
            -0.087448,
            -0.158902,
            -0.183516,
            -0.197611,
            -0.189134,
            -0.181925,
            -0.09315,
            -0.128538,
            -0.159848,
            -0.145358,
            -0.127284,
            -0.140133,
            -0.131271,
            -0.062738,
            -0.13717,
            -0.124677,
            0,
            0.010542,
            -0.140182,
            -0.140294,
            -0.145979,
            -0.152135,
            -0.132242,
            -0.140714
          ],
          [
            -0.46582,
            -0.268198,
            -0.253324,
            -0.446063,
            -0.302018,
            -0.300655,
            -0.285309,
            -0.261635,
            -0.254301,
            -0.271203,
            -0.343477,
            -0.213281,
            -0.267012,
            -0.296868,
            -0.287085,
            -0.267992,
            -0.691535,
            -0.411743,
            -0.38414,
            0.0149,
            0,
            -0.477925,
            -0.352228,
            -0.316295,
            -0.314099,
            -0.408225,
            -0.350858
          ],
          [
            -0.469722,
            -0.31722,
            -0.29693,
            -0.348576,
            -0.403611,
            -0.408946,
            -0.351813,
            -0.341499,
            -0.319595,
            -0.214866,
            -0.350582,
            -0.248493,
            -0.312474,
            -0.265524,
            -0.30757,
            -0.319371,
            -0.444425,
            -0.339815,
            -0.363638,
            -0.194362,
            -0.479745,
            0,
            -0.313246,
            -0.37576,
            -0.394248,
            -0.463404,
            -0.409069
          ],
          [
            -0.371111,
            -0.303961,
            -0.242474,
            -0.262207,
            -0.35238,
            -0.347943,
            -0.391849,
            -0.3371,
            -0.359295,
            -0.191416,
            -0.359465,
            -0.297291,
            -0.287562,
            -0.252454,
            -0.329726,
            -0.327844,
            -0.289388,
            -0.318701,
            -0.257041,
            -0.210724,
            -0.32816,
            -0.300416,
            0,
            -0.327486,
            -0.318267,
            -0.347119,
            -0.30447
          ],
          [
            -0.436291,
            -0.308447,
            -0.258676,
            -0.260395,
            -0.366205,
            -0.386217,
            -0.344855,
            -0.330567,
            -0.336138,
            -0.150591,
            -0.350129,
            -0.262738,
            -0.252235,
            -0.231862,
            -0.332472,
            -0.311936,
            -0.290635,
            -0.287535,
            -0.24096,
            -0.208333,
            -0.24793,
            -0.311835,
            -0.237257,
            0,
            -0.825925,
            -0.603772,
            -0.623114
          ],
          [
            -0.429356,
            -0.370468,
            -0.292603,
            -0.264963,
            -0.392559,
            -0.413104,
            -0.350559,
            -0.367337,
            -0.337659,
            -0.181305,
            -0.376245,
            -0.298837,
            -0.241285,
            -0.256341,
            -0.342374,
            -0.34019,
            -0.307399,
            -0.30633,
            -0.260833,
            -0.215506,
            -0.272735,
            -0.319613,
            -0.268086,
            -0.861964,
            0,
            -0.681154,
            -0.692904
          ],
          [
            -0.593062,
            -0.400101,
            -0.32648,
            -0.323337,
            -0.50286,
            -0.559333,
            -0.468147,
            -0.431728,
            -0.432579,
            -0.18962,
            -0.415321,
            -0.354447,
            -0.263668,
            -0.281427,
            -0.351422,
            -0.348284,
            -0.421403,
            -0.37962,
            -0.336161,
            -0.216831,
            -0.36545,
            -0.419053,
            -0.311506,
            -0.682745,
            -0.731282,
            0,
            -0.768722
          ],
          [
            -0.485092,
            -0.37356,
            -0.323715,
            -0.302229,
            -0.394082,
            -0.43005,
            -0.397068,
            -0.387245,
            -0.376458,
            -0.175358,
            -0.363083,
            -0.308066,
            -0.261545,
            -0.335047,
            -0.323395,
            -0.322447,
            -0.423373,
            -0.312359,
            -0.290794,
            -0.209866,
            -0.337627,
            -0.38348,
            -0.287912,
            -0.688536,
            -0.759711,
            -0.776273,
            0
          ]
        ]
      },
      {
        "intervention_type": "aggravate",
        "node_names": [
          "疲乏",
          "头晕",
          "头痛",
          "发热",
          "注意力难以集中",
          "反应变慢",
          "健忘",
          "理解上存在困难",
          "变得更加糊涂",
          "咳嗽",
          "嗜睡或难以入睡",
          "视力模糊",
          "皮疹",
          "口腔溃疡",
          "肌肉关节疼痛",
          "手脚发麻",
          "食欲下降",
          "腹胀腹痛腹泻",
          "恶心呕吐",
          "脂肪堆积",
          "消瘦体重减轻",
          "性欲下降",
          "掉发",
          "感到无法控制焦虑",
          "感到紧张或焦虑",
          "做事提不起兴趣",
          "感到心情低落"
        ],
        "matrix": [
          [
            0,
            0.728548,
            0.574025,
            0.590967,
            0.654969,
            0.668936,
            0.579135,
            0.532357,
            0.528972,
            0.326304,
            0.555468,
            0.461599,
            0.375907,
            0.38287,
            0.503027,
            0.480582,
            0.637016,
            0.537151,
            0.487269,
            0.231458,
            0.518414,
            0.564633,
            0.412575,
            0.568244,
            0.559423,
            0.716176,
            0.566036
          ],
          [
            0.588285,
            0,
            0.681249,
            0.388675,
            0.506545,
            0.50257,
            0.440236,
            0.416121,
            0.471364,
            0.211666,
            0.369334,
            0.386751,
            0.251449,
            0.257576,
            0.395804,
            0.364628,
            0.344737,
            0.336269,
            0.378554,
            0.183593,
            0.258315,
            0.299393,
            0.280661,
            0.379986,
            0.402282,
            0.424806,
            0.383954
          ],
          [
            0.42617,
            0.596464,
            0,
            0.438755,
            0.352686,
            0.334753,
            0.302887,
            0.332541,
            0.347885,
            0.200531,
            0.304238,
            0.242233,
            0.191097,
            0.242982,
            0.347599,
            0.321929,
            0.301834,
            0.26682,
            0.313929,
            0.142078,
            0.258823,
            0.234611,
            0.18884,
            0.285182,
            0.305217,
            0.324618,
            0.287627
          ],
          [
            0.525112,
            0.385582,
            0.514799,
            0,
            0.353684,
            0.360035,
            0.350263,
            0.3287,
            0.363681,
            0.419431,
            0.394033,
            0.271665,
            0.379641,
            0.349285,
            0.413697,
            0.35908,
            0.50634,
            0.338674,
            0.364694,
            0.150085,
            0.463663,
            0.374313,
            0.265635,
            0.331548,
            0.349079,
            0.412432,
            0.377004
          ],
          [
            0.481375,
            0.447853,
            0.348978,
            0.300579,
            0,
            0.762971,
            0.626634,
            0.582229,
            0.568627,
            0.204078,
            0.392444,
            0.3672,
            0.233193,
            0.247603,
            0.355192,
            0.376003,
            0.29716,
            0.374175,
            0.297243,
            0.242297,
            0.261766,
            0.367341,
            0.276254,
            0.388988,
            0.400987,
            0.44928,
            0.392159
          ],
          [
            0.532403,
            0.480299,
            0.358481,
            0.330562,
            0.825675,
            0,
            0.790023,
            0.681623,
            0.661084,
            0.232864,
            0.409414,
            0.425805,
            0.283454,
            0.267196,
            0.398211,
            0.390131,
            0.326378,
            0.407003,
            0.309256,
            0.236675,
            0.277516,
            0.397724,
            0.304244,
            0.415003,
            0.437361,
            0.532441,
            0.425989
          ],
          [
            0.478819,
            0.448025,
            0.390233,
            0.321096,
            0.777785,
            0.889513,
            0,
            0.726652,
            0.725602,
            0.209115,
            0.498204,
            0.442671,
            0.285884,
            0.307335,
            0.465327,
            0.439212,
            0.350755,
            0.431548,
            0.309942,
            0.288539,
            0.299042,
            0.373582,
            0.392171,
            0.393396,
            0.413862,
            0.486919,
            0.409889
          ],
          [
            0.322914,
            0.326089,
            0.26308,
            0.227339,
            0.502089,
            0.524717,
            0.521735,
            0,
            0.614983,
            0.107133,
            0.246485,
            0.2843,
            0.183638,
            0.238003,
            0.283151,
            0.277397,
            0.19285,
            0.261967,
            0.209,
            0.190049,
            0.16788,
            0.242166,
            0.241131,
            0.294283,
            0.323679,
            0.312514,
            0.288085
          ],
          [
            0.301936,
            0.323495,
            0.27732,
            0.226826,
            0.456323,
            0.480158,
            0.474796,
            0.584014,
            0,
            0.154394,
            0.268499,
            0.332913,
            0.203918,
            0.203315,
            0.294462,
            0.286981,
            0.193759,
            0.223227,
            0.19912,
            0.186356,
            0.178264,
            0.223833,
            0.203468,
            0.253842,
            0.268403,
            0.311024,
            0.266228
          ],
          [
            0.261193,
            0.208032,
            0.212731,
            0.334328,
            0.208144,
            0.203381,
            0.192783,
            0.178962,
            0.193292,
            0,
            0.248809,
            0.189487,
            0.196297,
            0.239757,
            0.248814,
            0.223992,
            0.28606,
            0.205052,
            0.219722,
            0.114721,
            0.225499,
            0.170332,
            0.158084,
            0.160129,
            0.184017,
            0.180307,
            0.197416
          ],
          [
            0.585386,
            0.429834,
            0.406197,
            0.415097,
            0.5384,
            0.534924,
            0.57396,
            0.458856,
            0.472027,
            0.303952,
            0,
            0.471309,
            0.351406,
            0.317923,
            0.494781,
            0.439914,
            0.409283,
            0.405378,
            0.379542,
            0.239586,
            0.378996,
            0.401232,
            0.400495,
            0.51092,
            0.493869,
            0.510925,
            0.470777
          ],
          [
            0.331877,
            0.323161,
            0.264487,
            0.234877,
            0.382694,
            0.4005,
            0.387439,
            0.338628,
            0.422611,
            0.189443,
            0.350167,
            0,
            0.245077,
            0.222644,
            0.331741,
            0.420226,
            0.235926,
            0.250225,
            0.217864,
            0.193682,
            0.21356,
            0.226598,
            0.246607,
            0.247782,
            0.254257,
            0.286637,
            0.277533
          ],
          [
            0.290244,
            0.264412,
            0.2385,
            0.310742,
            0.25402,
            0.266673,
            0.240589,
            0.228716,
            0.256111,
            0.220227,
            0.270117,
            0.271669,
            0,
            0.328836,
            0.289538,
            0.253613,
            0.298145,
            0.299707,
            0.252711,
            0.18225,
            0.269722,
            0.284896,
            0.277028,
            0.287226,
            0.283999,
            0.273165,
            0.256487
          ],
          [
            0.231199,
            0.200595,
            0.197772,
            0.247294,
            0.216297,
            0.228951,
            0.214423,
            0.214901,
            0.244156,
            0.198435,
            0.184415,
            0.199587,
            0.251575,
            0,
            0.22786,
            0.242507,
            0.197782,
            0.217026,
            0.190039,
            0.135769,
            0.214876,
            0.185832,
            0.17208,
            0.205382,
            0.193701,
            0.165896,
            0.212897
          ],
          [
            0.387381,
            0.37935,
            0.374535,
            0.371453,
            0.362147,
            0.395835,
            0.39405,
            0.360612,
            0.415809,
            0.239242,
            0.414221,
            0.359668,
            0.316265,
            0.270192,
            0,
            0.635991,
            0.298314,
            0.36638,
            0.320178,
            0.188064,
            0.271163,
            0.302248,
            0.27377,
            0.380984,
            0.365925,
            0.378585,
            0.352459
          ],
          [
            0.355025,
            0.32576,
            0.320306,
            0.311513,
            0.39599,
            0.360848,
            0.367389,
            0.318492,
            0.384069,
            0.209533,
            0.336016,
            0.397723,
            0.246821,
            0.281471,
            0.593063,
            0,
            0.265675,
            0.286277,
            0.246032,
            0.168537,
            0.223556,
            0.276036,
            0.268809,
            0.32278,
            0.321019,
            0.311703,
            0.302784
          ],
          [
            0.578742,
            0.376903,
            0.360471,
            0.501255,
            0.364145,
            0.364958,
            0.34664,
            0.315727,
            0.328021,
            0.346393,
            0.386269,
            0.270184,
            0.327062,
            0.279486,
            0.320704,
            0.294084,
            0,
            0.559371,
            0.64263,
            0.113405,
            0.682919,
            0.414286,
            0.303344,
            0.387457,
            0.384557,
            0.478653,
            0.475493
          ],
          [
            0.42109,
            0.314769,
            0.307577,
            0.344696,
            0.387821,
            0.369614,
            0.378704,
            0.31685,
            0.314058,
            0.223042,
            0.321065,
            0.282143,
            0.288629,
            0.270327,
            0.361642,
            0.327505,
            0.498785,
            0,
            0.486418,
            0.191213,
            0.372582,
            0.310312,
            0.289531,
            0.317563,
            0.325339,
            0.33948,
            0.310029
          ],
          [
            0.328331,
            0.314221,
            0.299459,
            0.241831,
            0.260012,
            0.264832,
            0.228243,
            0.22766,
            0.229452,
            0.192687,
            0.24631,
            0.194712,
            0.216627,
            0.182028,
            0.244281,
            0.196059,
            0.493197,
            0.404236,
            0,
            0.138319,
            0.302508,
            0.277233,
            0.189236,
            0.249917,
            0.255789,
            0.301247,
            0.260112
          ],
          [
            0.13068,
            0.128217,
            0.115172,
            0.08816,
            0.180937,
            0.18095,
            0.184626,
            0.188168,
            0.162713,
            0.096151,
            0.123301,
            0.159898,
            0.135292,
            0.127454,
            0.13719,
            0.143059,
            0.087213,
            0.153996,
            0.140886,
            0,
            -0.016314,
            0.132159,
            0.120054,
            0.146054,
            0.143473,
            0.154793,
            0.123748
          ],
          [
            0.462538,
            0.302684,
            0.302504,
            0.430945,
            0.299661,
            0.311388,
            0.290137,
            0.244225,
            0.260748,
            0.26901,
            0.389668,
            0.219845,
            0.305728,
            0.31285,
            0.307827,
            0.305057,
            0.698681,
            0.421653,
            0.39541,
            0.000254,
            0,
            0.480955,
            0.34674,
            0.341175,
            0.324889,
            0.408165,
            0.380685
          ],
          [
            0.447857,
            0.293186,
            0.299762,
            0.347668,
            0.400929,
            0.413966,
            0.35266,
            0.324182,
            0.322724,
            0.204469,
            0.343066,
            0.266594,
            0.311964,
            0.248194,
            0.317494,
            0.325413,
            0.40131,
            0.312451,
            0.351806,
            0.206616,
            0.458426,
            0,
            0.304208,
            0.37708,
            0.366145,
            0.443383,
            0.395379
          ],
          [
            0.331,
            0.276046,
            0.241156,
            0.248543,
            0.322018,
            0.321642,
            0.363144,
            0.291909,
            0.277209,
            0.165117,
            0.345937,
            0.279041,
            0.290877,
            0.269642,
            0.309278,
            0.315511,
            0.281178,
            0.332619,
            0.241904,
            0.209063,
            0.305768,
            0.302978,
            0,
            0.292741,
            0.291923,
            0.313187,
            0.278396
          ],
          [
            0.422709,
            0.321973,
            0.27933,
            0.270187,
            0.328356,
            0.333355,
            0.32822,
            0.326891,
            0.306787,
            0.133422,
            0.351844,
            0.252656,
            0.219977,
            0.219575,
            0.344843,
            0.312575,
            0.291151,
            0.265233,
            0.231876,
            0.197639,
            0.268646,
            0.303836,
            0.250458,
            0,
            0.821436,
            0.58533,
            0.606918
          ],
          [
            0.472184,
            0.401661,
            0.321861,
            0.27857,
            0.421267,
            0.420842,
            0.379613,
            0.402023,
            0.368074,
            0.174787,
            0.376199,
            0.280135,
            0.261514,
            0.256742,
            0.365306,
            0.320963,
            0.356494,
            0.325034,
            0.292637,
            0.248348,
            0.295032,
            0.38472,
            0.266953,
            0.892286,
            0,
            0.697959,
            0.716109
          ],
          [
            0.589886,
            0.395656,
            0.321121,
            0.326098,
            0.495987,
            0.51534,
            0.453536,
            0.428172,
            0.397091,
            0.191537,
            0.401914,
            0.318245,
            0.251818,
            0.296887,
            0.342347,
            0.367029,
            0.435837,
            0.355085,
            0.342852,
            0.217656,
            0.380419,
            0.434581,
            0.302249,
            0.699594,
            0.746994,
            0,
            0.766584
          ],
          [
            0.495689,
            0.365894,
            0.303372,
            0.301471,
            0.40174,
            0.438788,
            0.417152,
            0.394328,
            0.368909,
            0.174352,
            0.351912,
            0.313869,
            0.255309,
            0.306251,
            0.333237,
            0.317224,
            0.413116,
            0.313123,
            0.288653,
            0.189414,
            0.343261,
            0.369981,
            0.282448,
            0.662159,
            0.742065,
            0.750312,
            0
          ]
        ]
      }
    ]
  },
  {
    "file": "05_kg_nodes.js",
    "label": "导入知识图谱节点数据",
    "action": "import_kg_nodes",
    "eventBytes": 5524,
    "data": [
      {
        "node_id": "CD4细胞计数",
        "label": "CD4细胞计数",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "CT",
        "label": "CT",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "IFN-γ",
        "label": "IFN-γ",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "LAMP",
        "label": "LAMP",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "MRI",
        "label": "MRI",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "PCR",
        "label": "PCR",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "PET",
        "label": "PET",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "SPECT",
        "label": "SPECT",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "cART",
        "label": "cART",
        "type": "干预",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "mNGS",
        "label": "mNGS",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "免疫过氧化物酶染色",
        "label": "免疫过氧化物酶染色",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "共济失调",
        "label": "共济失调",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "发热",
        "label": "发热",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "头痛",
        "label": "头痛",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "头颅 CT",
        "label": "头颅 CT",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "实时定量PCR",
        "label": "实时定量PCR",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "局灶性神经系统缺陷",
        "label": "局灶性神经系统缺陷",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "巢式PCR",
        "label": "巢式PCR",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "弓形虫再激活感染",
        "label": "弓形虫再激活感染",
        "type": "疾病",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "弓形虫感染",
        "label": "弓形虫感染",
        "type": "疾病",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "弓形虫抗原检测",
        "label": "弓形虫抗原检测",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "弓形虫特异性抗体检测",
        "label": "弓形虫特异性抗体检测",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "弓形虫脑病",
        "label": "弓形虫脑病",
        "type": "疾病",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "意识模糊",
        "label": "意识模糊",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "抗弓形虫治疗",
        "label": "抗弓形虫治疗",
        "type": "干预",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "昏迷",
        "label": "昏迷",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "核磁共振成像",
        "label": "核磁共振成像",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "活动受限",
        "label": "活动受限",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "癫痫发作",
        "label": "癫痫发作",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "精神运动",
        "label": "精神运动",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "精神错乱",
        "label": "精神错乱",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "脑活检",
        "label": "脑活检",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "脑组织活检",
        "label": "脑组织活检",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "脑脊液 mNGS 检测",
        "label": "脑脊液 mNGS 检测",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "脑脊液常规检查",
        "label": "脑脊液常规检查",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "脑脊液检查",
        "label": "脑脊液检查",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "艾滋病患者",
        "label": "艾滋病患者",
        "type": "人群",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "血清弓形虫免疫球蛋白 G（IgG）抗体",
        "label": "血清弓形虫免疫球蛋白 G（IgG）抗体",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "血清弓形虫抗体阳性",
        "label": "血清弓形虫抗体阳性",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "行为变化",
        "label": "行为变化",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "视觉异常",
        "label": "视觉异常",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "计算机断层扫描",
        "label": "计算机断层扫描",
        "type": "检测",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "预防性磺胺类药物",
        "label": "预防性磺胺类药物",
        "type": "药物",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "预防性磺胺类药物治疗",
        "label": "预防性磺胺类药物治疗",
        "type": "干预",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      },
      {
        "node_id": "颅神经麻痹",
        "label": "颅神经麻痹",
        "type": "症状",
        "description": "",
        "evidence_level": "B",
        "aliases": []
      }
    ]
  },
  {
    "file": "06_kg_edges.js",
    "label": "导入知识图谱边数据",
    "action": "import_kg_edges",
    "eventBytes": 6019,
    "data": [
      {
        "source": "CD4细胞计数",
        "target": "弓形虫再激活感染",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "CT",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "IFN-γ",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "LAMP",
        "target": "弓形虫感染",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "MRI",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "PCR",
        "target": "弓形虫感染",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "PET",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "SPECT",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "cART",
        "target": "弓形虫脑病",
        "relation": "干预对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "mNGS",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "免疫过氧化物酶染色",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "头颅 CT",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "实时定量PCR",
        "target": "弓形虫感染",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "巢式PCR",
        "target": "弓形虫感染",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫抗原检测",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫特异性抗体检测",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "共济失调",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "发热",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "头痛",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "局灶性神经系统缺陷",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "意识模糊",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "昏迷",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "活动受限",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "癫痫发作",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "精神运动",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "精神错乱",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "艾滋病患者",
        "relation": "易感人群",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "行为变化",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "视觉异常",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "弓形虫脑病",
        "target": "颅神经麻痹",
        "relation": "具有症状",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "抗弓形虫治疗",
        "target": "弓形虫脑病",
        "relation": "干预对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "核磁共振成像",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "脑活检",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "脑组织活检",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "脑脊液 mNGS 检测",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "脑脊液常规检查",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "脑脊液检查",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "血清弓形虫免疫球蛋白 G（IgG）抗体",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "血清弓形虫抗体阳性",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "计算机断层扫描",
        "target": "弓形虫脑病",
        "relation": "检测对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "预防性磺胺类药物",
        "target": "弓形虫脑病",
        "relation": "干预对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      },
      {
        "source": "预防性磺胺类药物治疗",
        "target": "弓形虫脑病",
        "relation": "干预对象",
        "evidence_level": "B",
        "source_literature": [],
        "confidence": 0.8
      }
    ]
  }
]

(async () => {
  for (const task of tasks) {
    console.log('[start]', task.file, task.eventBytes + ' bytes')
    const res = await wx.cloud.callFunction({
      name: 'import_data',
      data: { action: task.action, data: task.data }
    })
    console.log('[done]', task.action, res)
  }
  console.log('[done] all imports finished')
})().catch((err) => {
  console.error('[error] import_all failed', err)
})
