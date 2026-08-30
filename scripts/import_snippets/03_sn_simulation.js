// 在微信开发者工具控制台中执行以下代码：
// 导入症状网络仿真数据
// event 大小: 11458 bytes (限制: 102400 bytes)
(async () => {
  try {
    const res = await wx.cloud.callFunction({
      name: 'import_data',
      data: {
        "action": "import_sn_simulation",
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
      }
    })
    console.log('[done] import_sn_simulation', res)
  } catch (err) {
    console.error('[error] import_sn_simulation', err)
  }
})()
