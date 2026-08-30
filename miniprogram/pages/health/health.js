const { callCloud } = require('../../utils/api')
const { showToast, isLoggedIn, requireLogin } = require('../../utils/util')

const TABS = [
  { key: 'medication', label: '用药提醒' },
  { key: 'appointment', label: '复诊提醒' },
  { key: 'exercise', label: '运动记录' },
  { key: 'diet', label: '饮食记录' },
  { key: 'calorie', label: '热量计算' }
]

const FREQUENCY_OPTIONS = ['每日一次', '每日两次', '每日三次', '每周一次', '按需']
const INTENSITY_OPTIONS = ['低', '中', '高']
const MEAL_OPTIONS = ['早餐', '午餐', '晚餐', '加餐']

// 频次 → 推荐提醒时间，与云函数 health 的 FREQ_TIMES 保持一致
const FREQ_TIMES = {
  '每日一次': ['08:00'],
  '每日两次': ['08:00', '16:00'],
  '每日三次': ['08:00', '12:00', '18:00'],
  '每周一次': ['08:00'],
  '按需': []
}

const APPOINTMENT_REMINDER_OPTIONS = ['提前1天', '提前3天', '提前7天']
const APPOINTMENT_REMINDER_DAYS = [1, 3, 7]

const CALORIE_CATEGORIES = [
  { id: 0, name: '全部' },
  { id: 1, name: '主食' },
  { id: 2, name: '蔬菜' },
  { id: 3, name: '水果' },
  { id: 4, name: '肉类' },
  { id: 5, name: '零食' },
  { id: 6, name: '饮品' }
]

const CALORIE_FOOD_DATABASE = [
  // 主食类
  { id: 1, name: '米饭', calories: 116, category: 1 },
  { id: 2, name: '面条', calories: 109, category: 1 },
  { id: 3, name: '馒头', calories: 223, category: 1 },
  { id: 4, name: '面包', calories: 312, category: 1 },
  { id: 5, name: '粥', calories: 46, category: 1 },

  // 蔬菜类
  { id: 6, name: '白菜', calories: 17, category: 2 },
  { id: 7, name: '菠菜', calories: 28, category: 2 },
  { id: 8, name: '西红柿', calories: 19, category: 2 },
  { id: 9, name: '黄瓜', calories: 15, category: 2 },
  { id: 10, name: '土豆', calories: 76, category: 2 },
  { id: 11, name: '胡萝卜', calories: 25, category: 2 },

  // 水果类
  { id: 12, name: '苹果', calories: 54, category: 3 },
  { id: 13, name: '香蕉', calories: 93, category: 3 },
  { id: 14, name: '橙子', calories: 48, category: 3 },
  { id: 15, name: '葡萄', calories: 44, category: 3 },
  { id: 16, name: '西瓜', calories: 25, category: 3 },

  // 肉类
  { id: 17, name: '猪肉', calories: 395, category: 4 },
  { id: 18, name: '牛肉', calories: 125, category: 4 },
  { id: 19, name: '鸡肉', calories: 167, category: 4 },
  { id: 20, name: '鸡蛋', calories: 144, category: 4 },
  { id: 21, name: '鱼肉', calories: 104, category: 4 },

  // 零食类
  { id: 22, name: '薯片', calories: 548, category: 5 },
  { id: 23, name: '巧克力', calories: 589, category: 5 },
  { id: 24, name: '饼干', calories: 433, category: 5 },
  { id: 25, name: '坚果', calories: 594, category: 5 },

  // 饮品类
  { id: 26, name: '牛奶', calories: 54, category: 6 },
  { id: 27, name: '豆浆', calories: 31, category: 6 },
  { id: 28, name: '果汁', calories: 51, category: 6 },
  { id: 29, name: '可乐', calories: 43, category: 6 },
  { id: 30, name: '茶', calories: 1, category: 6 }
]

const CALORIE_ACTIVITY_LEVELS = [
  {
    name: '极轻体力活动',
    desc: '坐着工作，不需要特别紧张肌肉活动者',
    examples: '行动不便，卧床，极度缺乏活动的特殊人群(阅读、写字)'
  },
  {
    name: '轻体力活动',
    desc: '站着工作伴有步行的，或坐着工作但伴有不十分紧张的肌肉活动',
    examples: '办公室职员、钟表维修工等以坐为主的职业'
  },
  {
    name: '中体力活动',
    desc: '肌肉活动较多或较为紧张者',
    examples: '长时间走动，或全身都会活动到的，比如服务员、外科医生、电工等。或者长时间跑外勤的人员'
  },
  {
    name: '重体力活动',
    desc: '肌肉活动多或紧张者',
    examples: '建筑工、搬运工、职业运动员、舞蹈演员等'
  }
]

const CALORIE_ENERGY_SUPPLY_TABLE = {
  '消瘦': {
    '极轻体力活动': 30,
    '轻体力活动': 35,
    '中体力活动': 40,
    '重体力活动': 42.5
  },
  '正常': {
    '极轻体力活动': 22.5,
    '轻体力活动': 27.5,
    '中体力活动': 32.5,
    '重体力活动': 37.5
  },
  '超重&肥胖': {
    '极轻体力活动': 17.5,
    '轻体力活动': 22.5,
    '中体力活动': 27.5,
    '重体力活动': 32.5
  }
}

function pad(value) {
  return value < 10 ? `0${value}` : `${value}`
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatDateTime(date) {
  return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// 用 UTC 毫秒 + 8 小时偏移计算中国时间，避免依赖设备本地时区
function getChinaNow() {
  const now = new Date()
  const chinaMs = now.getTime() + 8 * 3600000
  const c = new Date(chinaMs)
  const y = c.getUTCFullYear()
  const mo = c.getUTCMonth() + 1
  const d = c.getUTCDate()
  const h = c.getUTCHours()
  const mi = c.getUTCMinutes()

  return {
    y,
    mo,
    d,
    h,
    mi,
    dateStr: `${y}-${pad(mo)}-${pad(d)}`,
    hm: `${pad(h)}:${pad(mi)}`,
    ts: chinaMs
  }
}

function hmToMinutes(hm) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(hm || ''))
  if (!match) {
    return null
  }
  return Number(match[1]) * 60 + Number(match[2])
}

function toTrimmedString(value) {
  return String(value || '').trim()
}

function parseFoodsInput(text) {
  const source = String(text || '')
    .split(/[，,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)

  const foods = []

  for (const item of source) {
    const parts = item.split(/[:：]/)
    const name = toTrimmedString(parts[0])
    if (!name) {
      continue
    }

    const amount = toTrimmedString(parts.slice(1).join(':'))
    const row = { name }
    if (amount) {
      row.amount = amount
    }
    foods.push(row)
  }

  return foods
}

function formatFoods(foods) {
  if (!Array.isArray(foods) || !foods.length) {
    return '-'
  }

  return foods
    .map((item) => {
      const name = toTrimmedString(item.name)
      const amount = toTrimmedString(item.amount)
      if (!name) {
        return ''
      }
      return amount ? `${name}(${amount})` : name
    })
    .filter(Boolean)
    .join('、')
}

function buildDietStatusList(meals = {}, recordsByMeal = {}) {
  return MEAL_OPTIONS.map((label) => ({
    label,
    done: !!meals[label],
    count: Number(recordsByMeal[label]) || 0
  }))
}

function getDefaultMedicationForm() {
  return {
    name: '',
    dosage: '',
    frequencyIndex: 0,
    frequencyLabel: FREQUENCY_OPTIONS[0],
    times: ['08:00'],
    // 标记 times 是否仍为频次自动填入的默认值（用户手动增删后置为 false，避免被联动覆盖）
    timesAuto: true,
    startDate: formatDate(new Date()),
    endDate: '',
    notes: ''
  }
}

function getDefaultAppointmentForm() {
  return {
    doctor: '',
    hospital: '',
    date: formatDate(new Date()),
    time: '09:00',
    department: '',
    reminderDaysIndex: 2,
    reminderDays: APPOINTMENT_REMINDER_DAYS[2],
    notes: ''
  }
}

function getDefaultExerciseForm() {
  return {
    type: '',
    durationMin: '',
    intensityIndex: 1,
    intensityLabel: INTENSITY_OPTIONS[1],
    date: formatDate(new Date()),
    notes: ''
  }
}

function getDefaultDietForm() {
  return {
    mealIndex: 0,
    mealLabel: MEAL_OPTIONS[0],
    foodsText: '',
    date: formatDate(new Date()),
    notes: ''
  }
}

function mapMedication(item) {
  const startDate = toTrimmedString(item.startDate)
  const endDate = toTrimmedString(item.endDate)
  const times = Array.isArray(item.times) ? item.times : []
  const reminders = Array.isArray(item.reminders)
    ? item.reminders.map((r) => ({
        reminderId: r.id || r._id || '',
        time: toTrimmedString(r.time),
        isActive: r.isActive !== false,
        taken: !!r.takenToday
      })).filter((r) => r.reminderId && r.time)
    : []

  return {
    id: item.id || item._id || '',
    name: toTrimmedString(item.name) || '未命名药物',
    dosage: toTrimmedString(item.dosage) || '-',
    frequency: toTrimmedString(item.frequency) || '-',
    times,
    timesText: times.length ? times.join(' / ') : '-',
    reminders,
    startDate,
    endDate,
    periodText: endDate ? `${startDate || '--'} 至 ${endDate}` : `${startDate || '--'} 起`,
    notes: toTrimmedString(item.notes),
    lastTakenText: toTrimmedString(item.last_taken_at)
  }
}

function mapAppointment(item) {
  const date = toTrimmedString(item.date)
  const time = toTrimmedString(item.time)

  return {
    id: item.id || item._id || '',
    doctor: toTrimmedString(item.doctor) || '-',
    hospital: toTrimmedString(item.hospital) || '-',
    date,
    time,
    datetimeText: `${date || '--'} ${time || '--:--'}`,
    department: toTrimmedString(item.department) || '-',
    reminderDays: Number(item.reminderDays) || 7,
    isCompleted: item.isCompleted === true,
    notes: toTrimmedString(item.notes)
  }
}

function getIntensityClass(intensity) {
  if (intensity === '高') {
    return 'intensity-high'
  }
  if (intensity === '中') {
    return 'intensity-mid'
  }
  return 'intensity-low'
}

function mapExercise(item) {
  return {
    id: item.id || item._id || '',
    type: toTrimmedString(item.type) || '-',
    durationText: `${Number(item.duration_min) || 0} 分钟`,
    intensity: toTrimmedString(item.intensity) || '-',
    intensityClass: getIntensityClass(toTrimmedString(item.intensity)),
    date: toTrimmedString(item.date) || '-',
    notes: toTrimmedString(item.notes)
  }
}

function mapDiet(item) {
  return {
    id: item.id || item._id || '',
    mealType: toTrimmedString(item.meal_type) || '-',
    foodsText: formatFoods(item.foods),
    date: toTrimmedString(item.date) || '-',
    notes: toTrimmedString(item.notes)
  }
}

Page({
  data: {
    tabs: TABS,
    activeTab: 'medication',
    isLogin: true,

    reminderList: [],
    lastRemindKey: '',

    frequencyOptions: FREQUENCY_OPTIONS,
    intensityOptions: INTENSITY_OPTIONS,
    mealOptions: MEAL_OPTIONS,
    appointmentReminderOptions: APPOINTMENT_REMINDER_OPTIONS,

    medicationLoading: false,
    medicationList: [],
    showMedicationForm: false,
    medicationForm: getDefaultMedicationForm(),

    appointmentLoading: false,
    appointmentList: [],
    showAppointmentForm: false,
    appointmentForm: getDefaultAppointmentForm(),

    exerciseLoading: false,
    exerciseLoadingMore: false,
    exerciseList: [],
    exercisePage: 1,
    exercisePageSize: 10,
    exerciseHasMore: false,
    exerciseStats: {
      week: { totalDuration: 0, count: 0 },
      month: { totalDuration: 0, count: 0 }
    },
    showExerciseForm: false,
    exerciseForm: getDefaultExerciseForm(),

    dietLoading: false,
    dietLoadingMore: false,
    dietList: [],
    dietPage: 1,
    dietPageSize: 10,
    dietHasMore: false,
    dietStats: {
      date: formatDate(new Date()),
      completed: 0,
      total: MEAL_OPTIONS.length
    },
    dietStatusList: buildDietStatusList(),
    showDietForm: false,
    dietForm: getDefaultDietForm(),

    // 热量计算
    calorieDate: formatDate(new Date()),
    recommendedIntake: 2000,
    totalCalories: 0,
    calorieProgress: 0,
    todayFoods: [],

    foodDatabase: CALORIE_FOOD_DATABASE,
    categories: CALORIE_CATEGORIES,
    currentCategory: 0,
    searchKeyword: '',
    filteredFoods: CALORIE_FOOD_DATABASE,

    activityLevels: CALORIE_ACTIVITY_LEVELS,
    energySupplyTable: CALORIE_ENERGY_SUPPLY_TABLE,

    calculateForm: {
      gender: 'male',
      age: '',
      weight: '',
      height: '',
      activityIndex: 0
    },

    standardWeight: 0,
    bmi: 0,
    bmiCategory: '',
    energyPerKgDisplay: 0,

    showCalculateModal: false,
    showAddFoodModal: false,
    foodForm: {
      name: '',
      portion: '',
      caloriesPer100g: ''
    },
    calculatedCalories: 0
  },

  onShow() {
    const logged = isLoggedIn()
    this.setData({ isLogin: logged })
    if (!logged) {
      // 未登录：不加载任何健康数据，清空展示，显示登录引导
      this.setData({
        medicationList: [],
        appointmentList: [],
        exerciseList: [],
        dietList: [],
        reminderList: []
      })
      return
    }
    this.loadActiveTabData()
    this.checkReminders()
  },

  onTabTap(event) {
    const key = event.currentTarget.dataset.key
    if (!key || key === this.data.activeTab) {
      return
    }

    this.setData({ activeTab: key })
    this.loadActiveTabData()
  },

  async loadActiveTabData() {
    const tab = this.data.activeTab

    if (tab === 'medication') {
      await this.loadMedicationList()
      return
    }

    if (tab === 'appointment') {
      await this.loadAppointmentList()
      return
    }

    if (tab === 'exercise') {
      await Promise.all([this.loadExerciseList(true), this.loadExerciseStats()])
      return
    }

    if (tab === 'diet') {
      await Promise.all([this.loadDietList(true), this.loadDietStats()])
      return
    }

    if (tab === 'calorie') {
      await Promise.all([this.loadCalorieProfile(), this.loadCalorieRecords()])
    }
  },

  async checkReminders() {
    const china = getChinaNow()

    // 由云函数按北京时间计算今日提醒，前端直接展示
    const data = await this.requestHealth('reminders_today')
    if (!data) {
      return
    }

    const medsDue = Array.isArray(data.medications) ? data.medications : []
    const apptsDue = Array.isArray(data.appointments) ? data.appointments : []

    const reminders = []

    // 到点用药（云端已过滤为已到时间且今日未服）
    for (const med of medsDue) {
      reminders.push({
        key: `med-${med.reminderId}`,
        type: 'medication',
        title: toTrimmedString(med.medicationName) || '用药',
        desc: `用药 ${toTrimmedString(med.time)}${med.dosage ? ' · ' + toTrimmedString(med.dosage) : ''}`
      })
    }

    // 复诊（云端已过滤为提前提醒窗口内）
    for (const appt of apptsDue) {
      const daysLeft = Number(appt.daysLeft)
      const dayText = daysLeft === 0 ? '就在今天' : `还有 ${daysLeft} 天`
      reminders.push({
        key: `appt-${appt.id}`,
        type: 'appointment',
        title: toTrimmedString(appt.hospital) || '复诊',
        desc: `复诊 ${toTrimmedString(appt.department)} ${toTrimmedString(appt.date)} ${dayText}`
      })
    }

    this.setData({ reminderList: reminders })

    // 仅当有到点用药时弹窗提醒，同批当天只弹一次
    if (!medsDue.length) {
      return
    }

    const remindKey = `${china.dateStr}|${medsDue.map((m) => m.reminderId).join(',')}`
    if (remindKey === this.data.lastRemindKey) {
      return
    }

    const content = medsDue
      .map((m) => `· ${toTrimmedString(m.medicationName)}（${toTrimmedString(m.time)}）`)
      .join('\n')
    this.setData({ lastRemindKey: remindKey })

    wx.showModal({
      title: '用药提醒',
      content,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#2DC97E'
    })
  },

  async requestHealth(action, payload = {}) {
    try {
      const result = await callCloud('health', {
        action,
        ...payload
      })

      if (!result || result.code !== 0) {
        throw new Error((result && result.message) || '请求失败')
      }

      return result.data || {}
    } catch (error) {
      showToast(error.message || '请求失败')
      return null
    }
  },

  confirmAction(content) {
    return new Promise((resolve) => {
      wx.showModal({
        title: '提示',
        content,
        confirmColor: '#2DC97E',
        success: (res) => resolve(!!res.confirm),
        fail: () => resolve(false)
      })
    })
  },

  onToggleForm(event) {
    const key = event.currentTarget.dataset.key
    if (!key) {
      return
    }

    this.setData({ [key]: !this.data[key] })
  },

  onInputChange(event) {
    const form = event.currentTarget.dataset.form
    const field = event.currentTarget.dataset.field
    if (!form || !field) {
      return
    }

    this.setData({
      [`${form}.${field}`]: event.detail.value
    })
  },

  onDateChange(event) {
    const form = event.currentTarget.dataset.form
    const field = event.currentTarget.dataset.field
    if (!form || !field) {
      return
    }

    this.setData({
      [`${form}.${field}`]: event.detail.value
    })
  },

  onTimeChange(event) {
    const form = event.currentTarget.dataset.form
    const field = event.currentTarget.dataset.field
    if (!form || !field) {
      return
    }

    this.setData({
      [`${form}.${field}`]: event.detail.value
    })
  },

  onPickerIndexChange(event) {
    const form = event.currentTarget.dataset.form
    const indexField = event.currentTarget.dataset.indexField
    const labelField = event.currentTarget.dataset.labelField
    const optionKey = event.currentTarget.dataset.optionKey

    if (!form || !indexField || !labelField || !optionKey) {
      return
    }

    const options = this.data[optionKey] || []
    const index = Number(event.detail.value)
    const safeIndex = Number.isInteger(index) && index >= 0 ? index : 0
    const label = options[safeIndex] || options[0] || ''

    this.setData({
      [`${form}.${indexField}`]: safeIndex,
      [`${form}.${labelField}`]: label
    })
  },

  onClearMedicationEndDate() {
    this.setData({
      'medicationForm.endDate': ''
    })
  },

  // 频次选择联动：自动填入推荐提醒时间（仅当 times 仍为默认值时覆盖，避免冲掉用户手改）
  onFrequencyChange(event) {
    const options = this.data.frequencyOptions || []
    const index = Number(event.detail.value)
    const safeIndex = Number.isInteger(index) && index >= 0 ? index : 0
    const label = options[safeIndex] || options[0] || ''

    const patch = {
      'medicationForm.frequencyIndex': safeIndex,
      'medicationForm.frequencyLabel': label
    }

    if (this.data.medicationForm.timesAuto) {
      const recommended = FREQ_TIMES[label]
      if (Array.isArray(recommended)) {
        patch['medicationForm.times'] = recommended.slice()
      }
    }

    this.setData(patch)
  },

  onAddMedTime(event) {
    const value = String(event.detail.value || '')
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      showToast('时间格式应为 HH:mm')
      return
    }

    const times = this.data.medicationForm.times || []
    if (times.indexOf(value) !== -1) {
      showToast('该时间已添加')
      return
    }

    const next = times.concat(value).sort()
    this.setData({
      'medicationForm.times': next,
      'medicationForm.timesAuto': false
    })
  },

  onRemoveMedTime(event) {
    const time = event.currentTarget.dataset.time
    const times = (this.data.medicationForm.times || []).filter((item) => item !== time)
    this.setData({
      'medicationForm.times': times,
      'medicationForm.timesAuto': false
    })
  },

  async loadMedicationList() {
    this.setData({ medicationLoading: true })

    const data = await this.requestHealth('medication_list')
    if (data) {
      const list = Array.isArray(data.list) ? data.list.map(mapMedication) : []
      this.setData({ medicationList: list })
    }

    this.setData({ medicationLoading: false })
  },

  async onSubmitMedication() {
    const form = this.data.medicationForm
    const name = toTrimmedString(form.name)
    const dosage = toTrimmedString(form.dosage)
    const frequency = toTrimmedString(form.frequencyLabel)
    const startDate = toTrimmedString(form.startDate)
    const endDate = toTrimmedString(form.endDate)
    const notes = toTrimmedString(form.notes)

    const times = Array.isArray(form.times) ? form.times.slice() : []

    if (!name) {
      showToast('请输入药名')
      return
    }
    if (!dosage) {
      showToast('请输入剂量')
      return
    }
    if (!frequency) {
      showToast('请选择频率')
      return
    }
    if (!startDate) {
      showToast('请选择开始日期')
      return
    }
    if (!times.length) {
      showToast('请至少添加一个提醒时间')
      return
    }

    const payload = {
      name,
      dosage,
      frequency,
      times,
      startDate,
      notes
    }
    if (endDate) {
      payload.endDate = endDate
    }

    const data = await this.requestHealth('medication_add', payload)
    if (!data) {
      return
    }

    showToast('添加成功', 'success')
    this.setData({
      showMedicationForm: false,
      medicationForm: getDefaultMedicationForm()
    })

    this.loadMedicationList()
  },

  async onMedicationTaken(event) {
    const reminderId = event.currentTarget.dataset.reminderId
    const medicationId = event.currentTarget.dataset.medicationId
    if (!reminderId) {
      return
    }

    const data = await this.requestHealth('medication_taken_add', {
      reminderId,
      medicationId
    })

    if (!data) {
      return
    }

    showToast('已记录服药', 'success')
    this.loadMedicationList()
  },

  async onDeleteMedication(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }

    const confirmed = await this.confirmAction('确认删除该用药提醒？')
    if (!confirmed) {
      return
    }

    const data = await this.requestHealth('medication_delete', { id })
    if (!data) {
      return
    }

    showToast('已删除', 'success')
    this.loadMedicationList()
  },

  async loadAppointmentList() {
    this.setData({ appointmentLoading: true })

    const data = await this.requestHealth('appointment_list')
    if (data) {
      const list = Array.isArray(data.list) ? data.list.map(mapAppointment) : []
      this.setData({ appointmentList: list })
    }

    this.setData({ appointmentLoading: false })
  },

  onAppointmentReminderChange(event) {
    const index = Number(event.detail.value)
    const safeIndex = Number.isInteger(index) && index >= 0 && index < APPOINTMENT_REMINDER_DAYS.length ? index : 2
    this.setData({
      'appointmentForm.reminderDaysIndex': safeIndex,
      'appointmentForm.reminderDays': APPOINTMENT_REMINDER_DAYS[safeIndex]
    })
  },

  async onSubmitAppointment() {
    const form = this.data.appointmentForm
    const doctor = toTrimmedString(form.doctor)
    const hospital = toTrimmedString(form.hospital)
    const date = toTrimmedString(form.date)
    const time = toTrimmedString(form.time)
    const department = toTrimmedString(form.department)
    const notes = toTrimmedString(form.notes)
    const reminderDays = Number(form.reminderDays) || APPOINTMENT_REMINDER_DAYS[2]

    if (!doctor) {
      showToast('请输入医生姓名')
      return
    }
    if (!hospital) {
      showToast('请输入医院名称')
      return
    }
    if (!date) {
      showToast('请选择复诊日期')
      return
    }
    if (!time) {
      showToast('请选择复诊时间')
      return
    }
    if (!department) {
      showToast('请输入科室')
      return
    }

    const data = await this.requestHealth('appointment_add', {
      doctor,
      hospital,
      date,
      time,
      department,
      reminderDays,
      notes
    })

    if (!data) {
      return
    }

    showToast('添加成功', 'success')
    this.setData({
      showAppointmentForm: false,
      appointmentForm: getDefaultAppointmentForm()
    })

    this.loadAppointmentList()
  },

  async onCompleteAppointment(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }

    const confirmed = await this.confirmAction('确认将该复诊标记为已完成？')
    if (!confirmed) {
      return
    }

    const data = await this.requestHealth('appointment_complete', { id })
    if (!data) {
      return
    }

    showToast('已标记完成', 'success')
    this.loadAppointmentList()
  },

  async onDeleteAppointment(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }

    const confirmed = await this.confirmAction('确认删除该复诊提醒？')
    if (!confirmed) {
      return
    }

    const data = await this.requestHealth('appointment_delete', { id })
    if (!data) {
      return
    }

    showToast('已删除', 'success')
    this.loadAppointmentList()
  },

  async loadExerciseList(reset) {
    if (reset) {
      this.setData({ exerciseLoading: true })
    } else {
      if (this.data.exerciseLoadingMore || !this.data.exerciseHasMore) {
        return
      }
      this.setData({ exerciseLoadingMore: true })
    }

    const page = reset ? 1 : this.data.exercisePage + 1
    const data = await this.requestHealth('exercise_list', {
      page,
      pageSize: this.data.exercisePageSize
    })

    if (data) {
      const list = Array.isArray(data.list) ? data.list.map(mapExercise) : []
      const merged = reset ? list : this.data.exerciseList.concat(list)

      this.setData({
        exerciseList: merged,
        exercisePage: page,
        exerciseHasMore: !!data.hasMore
      })
    }

    if (reset) {
      this.setData({ exerciseLoading: false })
    } else {
      this.setData({ exerciseLoadingMore: false })
    }
  },

  async loadExerciseStats() {
    const data = await this.requestHealth('exercise_stats')
    if (!data) {
      return
    }

    const week = data.week || {}
    const month = data.month || {}

    this.setData({
      exerciseStats: {
        week: {
          totalDuration: Number(week.totalDuration) || 0,
          count: Number(week.count) || 0
        },
        month: {
          totalDuration: Number(month.totalDuration) || 0,
          count: Number(month.count) || 0
        }
      }
    })
  },

  async onSubmitExercise() {
    const form = this.data.exerciseForm
    const type = toTrimmedString(form.type)
    const duration = Number(form.durationMin)
    const intensity = toTrimmedString(form.intensityLabel)
    const date = toTrimmedString(form.date)
    const notes = toTrimmedString(form.notes)

    if (!type) {
      showToast('请输入运动类型')
      return
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      showToast('时长需为正数')
      return
    }
    if (!intensity) {
      showToast('请选择运动强度')
      return
    }
    if (!date) {
      showToast('请选择运动日期')
      return
    }

    const data = await this.requestHealth('exercise_add', {
      type,
      duration_min: duration,
      intensity,
      date,
      notes
    })

    if (!data) {
      return
    }

    showToast('添加成功', 'success')
    this.setData({
      showExerciseForm: false,
      exerciseForm: getDefaultExerciseForm()
    })

    await Promise.all([this.loadExerciseList(true), this.loadExerciseStats()])
  },

  onLoadMoreExercise() {
    this.loadExerciseList(false)
  },

  async onDeleteExercise(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }

    const confirmed = await this.confirmAction('确认删除该运动记录？')
    if (!confirmed) {
      return
    }

    const data = await this.requestHealth('exercise_delete', { id })
    if (!data) {
      return
    }

    showToast('已删除', 'success')
    await Promise.all([this.loadExerciseList(true), this.loadExerciseStats()])
  },

  async loadDietList(reset) {
    if (reset) {
      this.setData({ dietLoading: true })
    } else {
      if (this.data.dietLoadingMore || !this.data.dietHasMore) {
        return
      }
      this.setData({ dietLoadingMore: true })
    }

    const page = reset ? 1 : this.data.dietPage + 1
    const data = await this.requestHealth('diet_list', {
      page,
      pageSize: this.data.dietPageSize
    })

    if (data) {
      const list = Array.isArray(data.list) ? data.list.map(mapDiet) : []
      const merged = reset ? list : this.data.dietList.concat(list)

      this.setData({
        dietList: merged,
        dietPage: page,
        dietHasMore: !!data.hasMore
      })
    }

    if (reset) {
      this.setData({ dietLoading: false })
    } else {
      this.setData({ dietLoadingMore: false })
    }
  },

  async loadDietStats() {
    const data = await this.requestHealth('diet_stats')
    if (!data) {
      return
    }

    this.setData({
      dietStats: {
        date: toTrimmedString(data.date) || formatDate(new Date()),
        completed: Number(data.completed) || 0,
        total: Number(data.total) || MEAL_OPTIONS.length
      },
      dietStatusList: buildDietStatusList(data.meals, data.recordsByMeal)
    })
  },

  async onSubmitDiet() {
    const form = this.data.dietForm
    const mealType = toTrimmedString(form.mealLabel)
    const foods = parseFoodsInput(form.foodsText)
    const date = toTrimmedString(form.date)
    const notes = toTrimmedString(form.notes)

    if (!mealType) {
      showToast('请选择餐次')
      return
    }
    if (!foods.length) {
      showToast('请输入食物，格式：鸡蛋:1个, 牛奶:250ml')
      return
    }
    if (!date) {
      showToast('请选择日期')
      return
    }

    const data = await this.requestHealth('diet_add', {
      meal_type: mealType,
      foods,
      date,
      notes
    })

    if (!data) {
      return
    }

    showToast('添加成功', 'success')
    this.setData({
      showDietForm: false,
      dietForm: getDefaultDietForm()
    })

    await Promise.all([this.loadDietList(true), this.loadDietStats()])
  },

  onLoadMoreDiet() {
    this.loadDietList(false)
  },

  async onDeleteDiet(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }

    const confirmed = await this.confirmAction('确认删除该饮食记录？')
    if (!confirmed) {
      return
    }

    const data = await this.requestHealth('diet_delete', { id })
    if (!data) {
      return
    }

    showToast('已删除', 'success')
    await Promise.all([this.loadDietList(true), this.loadDietStats()])
  },

  async loadCalorieProfile() {
    const data = await this.requestHealth('calorie_profile_get')
    if (!data) {
      return
    }

    const profile = data.profile
    if (!profile) {
      return
    }

    const activityIndex = Number(profile.activityLevel)

    this.setData({
      calculateForm: {
        gender: profile.gender || 'male',
        age: profile.age ? String(profile.age) : '',
        weight: profile.weight ? String(profile.weight) : '',
        height: profile.height ? String(profile.height) : '',
        activityIndex: Number.isInteger(activityIndex) && activityIndex >= 0 ? activityIndex : 0
      },
      standardWeight: Number(profile.standardWeight) || 0,
      bmi: Number(profile.bmi) || 0,
      bmiCategory: profile.bmiCategory || '',
      recommendedIntake: Number(profile.recommendedIntake) || 2000
    })

    this.updateCalorieProgress()
  },

  async loadCalorieRecords() {
    const data = await this.requestHealth('calorie_record_list', { date: this.data.calorieDate })
    if (!data) {
      return
    }

    const todayFoods = Array.isArray(data.list) ? data.list : []
    const totalCalories = Number(data.totalCalories) || 0

    this.setData({
      todayFoods,
      totalCalories
    })

    this.updateCalorieProgress()
  },

  updateCalorieProgress() {
    const recommended = Number(this.data.recommendedIntake) || 0
    const total = Number(this.data.totalCalories) || 0
    const progress = recommended > 0 ? Math.min((total / recommended) * 100, 100) : 0

    this.setData({
      calorieProgress: Math.round(progress)
    })
  },

  showCalculateModal() {
    this.setData({ showCalculateModal: true })
  },

  showAddFoodModal() {
    this.setData({
      showAddFoodModal: true,
      foodForm: {
        name: '',
        portion: '',
        caloriesPer100g: ''
      },
      calculatedCalories: 0
    })
  },

  closeModal() {
    this.setData({
      showCalculateModal: false,
      showAddFoodModal: false
    })
  },

  onGenderChange(e) {
    this.setData({ 'calculateForm.gender': e.detail.value })
  },

  onAgeInput(e) {
    this.setData({ 'calculateForm.age': e.detail.value })
  },

  onWeightInput(e) {
    this.setData({ 'calculateForm.weight': e.detail.value })
  },

  onHeightInput(e) {
    this.setData({ 'calculateForm.height': e.detail.value })
  },

  onActivityLevelChange(e) {
    this.setData({ 'calculateForm.activityIndex': parseInt(e.detail.value, 10) })
  },

  async calculateCalories() {
    const { gender, age, weight, height, activityIndex } = this.data.calculateForm

    if (!weight || !height) {
      showToast('请填写身高和体重')
      return
    }

    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)

    if (!Number.isFinite(weightNum) || weightNum <= 0 || !Number.isFinite(heightNum) || heightNum <= 0) {
      showToast('身高体重需为正数')
      return
    }

    // 标准体重 = 身高 - 105
    const standardWeight = heightNum - 105

    // BMI = 体重 / 身高(m)²
    const heightM = heightNum / 100
    const bmi = weightNum / (heightM * heightM)

    // 按 BMI 分体型
    let bmiCategory = ''
    let bodyType = ''
    if (bmi < 18.5) {
      bmiCategory = '消瘦'
      bodyType = '消瘦'
    } else if (bmi >= 18.5 && bmi <= 23.9) {
      bmiCategory = '正常'
      bodyType = '正常'
    } else {
      bmiCategory = '超重&肥胖'
      bodyType = '超重&肥胖'
    }

    const activityLevel = this.data.activityLevels[activityIndex] || this.data.activityLevels[0]
    const activityName = activityLevel.name

    const energyPerKg = this.data.energySupplyTable[bodyType][activityName]
    const dailyCalories = Math.round(standardWeight * energyPerKg)

    const roundedStandardWeight = Math.round(standardWeight)
    const roundedBmi = Math.round(bmi * 10) / 10

    this.setData({
      standardWeight: roundedStandardWeight,
      bmi: roundedBmi,
      bmiCategory,
      energyPerKgDisplay: energyPerKg,
      recommendedIntake: dailyCalories,
      showCalculateModal: false
    })

    const data = await this.requestHealth('calorie_profile_save', {
      gender,
      age: parseFloat(age) || 0,
      height: heightNum,
      weight: weightNum,
      activityLevel: activityIndex,
      standardWeight: roundedStandardWeight,
      bmi: roundedBmi,
      bmiCategory,
      recommendedIntake: dailyCalories
    })

    if (!data) {
      return
    }

    this.updateCalorieProgress()

    wx.showModal({
      title: '计算完成',
      content: `标准体重: ${roundedStandardWeight}kg\nBMI指数: ${roundedBmi} (${bmiCategory})\n每日需摄入热量: ${dailyCalories}kcal`,
      showCancel: false,
      confirmText: '确定'
    })
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    this.filterFoods()
  },

  onCategoryChange(e) {
    const index = parseInt(e.currentTarget.dataset.index, 10)
    this.setData({ currentCategory: Number.isInteger(index) ? index : 0 })
    this.filterFoods()
  },

  filterFoods() {
    const { searchKeyword, currentCategory, foodDatabase } = this.data

    let filtered = foodDatabase

    if (currentCategory > 0) {
      filtered = filtered.filter((food) => food.category === currentCategory)
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter((food) => food.name.toLowerCase().includes(keyword))
    }

    this.setData({ filteredFoods: filtered })
  },

  addFoodToToday(e) {
    const food = e.currentTarget.dataset.food

    wx.showModal({
      title: '添加食物',
      content: '请输入食用量（克）',
      editable: true,
      placeholderText: '100',
      success: (res) => {
        if (res.confirm && res.content) {
          const portion = parseFloat(res.content)
          if (!isNaN(portion) && portion > 0) {
            this.addFoodFromDatabase(food, portion)
          } else {
            showToast('请输入有效数字')
          }
        }
      }
    })
  },

  async addFoodFromDatabase(food, portion) {
    const calories = Math.round((portion * food.calories) / 100)

    const data = await this.requestHealth('calorie_record_add', {
      date: this.data.calorieDate,
      name: food.name,
      portion,
      caloriesPer100g: food.calories,
      calories
    })

    if (!data) {
      return
    }

    showToast('添加成功', 'success')
    await this.loadCalorieRecords()
  },

  onFoodNameInput(e) {
    this.setData({ 'foodForm.name': e.detail.value })
  },

  onPortionInput(e) {
    this.setData({ 'foodForm.portion': e.detail.value })
    this.calculateFoodCalories()
  },

  onCaloriesInput(e) {
    this.setData({ 'foodForm.caloriesPer100g': e.detail.value })
    this.calculateFoodCalories()
  },

  calculateFoodCalories() {
    const { portion, caloriesPer100g } = this.data.foodForm
    if (portion && caloriesPer100g) {
      const calories = Math.round((parseFloat(portion) * parseFloat(caloriesPer100g)) / 100)
      this.setData({ calculatedCalories: calories })
    } else {
      this.setData({ calculatedCalories: 0 })
    }
  },

  async addFood() {
    const { name, portion, caloriesPer100g } = this.data.foodForm

    if (!name || !portion || !caloriesPer100g) {
      showToast('请填写完整信息')
      return
    }

    const portionNum = parseFloat(portion)
    const caloriesPer100gNum = parseFloat(caloriesPer100g)

    if (!Number.isFinite(portionNum) || portionNum <= 0) {
      showToast('食用量需为正数')
      return
    }
    if (!Number.isFinite(caloriesPer100gNum) || caloriesPer100gNum < 0) {
      showToast('热量需为非负数')
      return
    }

    const calories = Math.round((portionNum * caloriesPer100gNum) / 100)

    const data = await this.requestHealth('calorie_record_add', {
      date: this.data.calorieDate,
      name: toTrimmedString(name),
      portion: portionNum,
      caloriesPer100g: caloriesPer100gNum,
      calories
    })

    if (!data) {
      return
    }

    showToast('添加成功', 'success')
    this.setData({ showAddFoodModal: false })
    await this.loadCalorieRecords()
  },

  async deleteFood(e) {
    const id = e.currentTarget.dataset.id
    if (!id) {
      return
    }

    const data = await this.requestHealth('calorie_record_delete', { id })
    if (!data) {
      return
    }

    showToast('已删除', 'success')
    await this.loadCalorieRecords()
  },

  // 跳转通知中心
  goNotification() {
    if (!requireLogin('登录后查看消息通知')) return
    wx.navigateTo({ url: '/pages/notification/notification' })
  },

  goLogin() {
    wx.switchTab({ url: '/pages/profile/profile' })
  },

  // 阻止弹窗内容区点击冒泡到遮罩（避免点输入框误触关闭弹窗）
  noop() {},

  onShareAppMessage() {
    return {
      title: '健康管理 — 用药复诊提醒、运动饮食热量记录',
      path: '/pages/health/health'
    }
  },

  onShareTimeline() {
    return {
      title: '健康管理 — 用药复诊提醒、运动饮食热量记录'
    }
  }
})
