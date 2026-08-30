#################################################
## 0. 环境准备
#################################################
setwd("D:/R/1212")

library(bootnet)
library(qgraph)
library(ggplot2)
library(dplyr)
library(magrittr)
library(networktools)

#################################################
## 1. 数据读取
#################################################

myData <- read.csv("YSQsymptom1.csv",header = TRUE)
nrow(myData)

# 缺失值处理
sum(is.na(myData))
myData[is.na(myData)] <- 0

#################################################
## 2. 症状标签
#################################################

symptom_labels <- c(
  "疲乏","头晕","头痛","发热","注意力难以集中",
  "反应变慢","健忘","理解上存在困难","变得更加糊涂",
  "咳嗽","嗜睡或难以入睡","视力模糊",
  "皮疹","口腔溃疡","肌肉关节疼痛","手脚发麻",
  "食欲下降","腹胀腹痛腹泻","恶心呕吐",
  "脂肪堆积","消瘦体重减轻","性欲下降",
  "掉发","感到无法控制焦虑","感到紧张或焦虑",
  "做事提不起兴趣","感到心情低落"
)

#################################################
## 3. 症状分组
#################################################

groups_list <- list(
  Cluster1 = 5:9,
  Cluster2 = 24:27,
  Cluster3 = c(4,17:19,21),
  Cluster4 = c(2,3),
  Cluster5 = 13:16,
  Cluster6 = c(1,10:12,20,22,23)
)
groups_list <- list(
  "Cognitive symptoms" = 5:9,
  "Psychological symptoms" = 24:27,
  "Gastrointestinal symptoms" = c(4,17:19,21),
  "Neurological symptoms" = c(2,3),
  "Skin & joint symptoms" = 13:16,
  "Systemic symptoms" = c(1,10:12,20,22,23)
)
# bridge 需要向量格式
groups <- rep(NA,27)

groups[5:9] <- "Group1"
groups[24:27] <- "Group2"
groups[c(4,17:19,21)] <- "Group3"
groups[c(2,3)] <- "Group4"
groups[13:16] <- "Group5"
groups[c(1,10:12,20,22,23)] <- "Group6"

#################################################
## 4. 构建网络
#################################################

network <- estimateNetwork(
  myData,
  default = "EBICglasso",
  corMethod = "spearman"
)

#################################################
## 5. 绘制网络图
#################################################

jpeg("symptom_network.jpg",width=10,height=10,res=800,units="in")

g <- plot(
  network,
  layout = "spring",
  labels = symptom_labels,
  groups = groups_list,
  label.cex = 1.4,
  label.color = "black",
  negDashed = TRUE,
  maximum = 0.45,
  minimum = 0.03,
  legend = FALSE,
  color = c("#E69F00","#56B4E9","#009E73","#F0E442","#CC79A7","#0072B2")
)

dev.off()
#################################################
## 6. 中心性分析
#################################################

centrality(g)

jpeg("centrality.jpg",width=10,height=10,res=800,units="in")

centralityPlot(
  g,
  include=c("Strength","Closeness","Betweenness")
)

dev.off()

#################################################
## 7. Bridge 中心性
#################################################

b <- bridge(
  cor(myData),
  communities = groups,
  directed = FALSE
)

plot(b,
     include=c(
       "Bridge Expected Influence (1-step)",
       "Bridge Strength",
       "Bridge Closeness"
     ))

#################################################
## 8. 精确性分析
#################################################

nonParametricBoot <- bootnet(
  myData,
  nBoots = 1000,
  default = "EBICglasso",
  type = "nonparametric"
)

plot(nonParametricBoot,labels=FALSE,order="sample")

#################################################
## 9. 稳定性分析
#################################################

caseDroppingBoot <- bootnet(
  myData,
  nBoots = 1000,
  default = "EBICglasso",
  type = "case"
)

corStability(caseDroppingBoot)

plot(caseDroppingBoot,statistics="Strength")