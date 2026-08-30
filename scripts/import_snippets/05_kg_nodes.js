// 在微信开发者工具控制台中执行以下代码：
// 导入知识图谱节点数据
// event 大小: 5524 bytes (限制: 102400 bytes)
(async () => {
  try {
    const res = await wx.cloud.callFunction({
      name: 'import_data',
      data: {
        "action": "import_kg_nodes",
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
      }
    })
    console.log('[done] import_kg_nodes', res)
  } catch (err) {
    console.error('[error] import_kg_nodes', err)
  }
})()
