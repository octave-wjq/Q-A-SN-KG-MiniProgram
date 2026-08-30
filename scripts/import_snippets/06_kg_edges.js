// 在微信开发者工具控制台中执行以下代码：
// 导入知识图谱边数据
// event 大小: 6019 bytes (限制: 102400 bytes)
(async () => {
  try {
    const res = await wx.cloud.callFunction({
      name: 'import_data',
      data: {
        "action": "import_kg_edges",
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
    })
    console.log('[done] import_kg_edges', res)
  } catch (err) {
    console.error('[error] import_kg_edges', err)
  }
})()
