const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

const MAX_BATCH_SIZE = 100
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

const COLLECTIONS = {
  medication: 'health_medications',
  medicationRecord: 'health_medication_records',
  medicationReminder: 'health_medication_reminders',
  medicationTaken: 'health_medication_taken',
  appointment: 'health_appointments',
  exercise: 'health_exercises',
  diet: 'health_diets',
  symptom: 'health_symptoms',
  calorieProfile: 'health_calorie_profile',
  calorieRecord: 'health_calorie_records'
}

const EXERCISE_INTENSITY = ['低', '中', '高']
const DIET_MEAL_TYPES = ['早餐', '午餐', '晚餐', '加餐']

const ok = (data = {}) => ({ code: 0, message: 'success', data })
const fail = (code, message) => ({ code, message, data: null })

function toText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function isDateText(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isTimeText(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
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

function parseDateTime(dateText, timeText) {
  if (!isDateText(dateText)) {
    return null
  }

  const safeTime = isTimeText(timeText) ? timeText : '00:00'
  const [year, month, day] = dateText.split('-').map(Number)
  const [hour, minute] = safeTime.split(':').map(Number)
  const parsed = new Date(year, month - 1, day, hour, minute, 0, 0)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

function getChinaParts() {
  const c = new Date(Date.now() + 8 * 3600000)
  const y = c.getUTCFullYear()
  const mo = c.getUTCMonth() + 1
  const d = c.getUTCDate()
  const h = c.getUTCHours()
  const mi = c.getUTCMinutes()
  const padNum = (n) => (n < 10 ? `0${n}` : `${n}`)
  return {
    y,
    mo,
    d,
    h,
    mi,
    dateStr: `${y}-${padNum(mo)}-${padNum(d)}`,
    hm: `${padNum(h)}:${padNum(mi)}`,
    minutes: h * 60 + mi
  }
}

function hmToMinutes(hm) {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(hm || ''))
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

function dateStrToDays(dateStr) {
  if (!isDateText(dateStr)) {
    return null
  }
  const [y, mo, d] = dateStr.split('-').map(Number)
  return Math.floor(Date.UTC(y, mo - 1, d) / 86400000)
}

const FREQ_TIMES = {
  '每日一次': ['08:00'],
  '每日两次': ['08:00', '16:00'],
  '每日三次': ['08:00', '12:00', '18:00'],
  '每周一次': ['08:00'],
  '按需': []
}

function getWeekStart(date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const day = start.getDay()
  const offset = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + offset)

  return start
}

function roundOne(value) {
  return Math.round(value * 10) / 10
}

function parsePagination(pageValue, pageSizeValue) {
  let page = 1
  let pageSize = DEFAULT_PAGE_SIZE

  if (pageValue !== undefined) {
    page = Number(pageValue)
    if (!Number.isInteger(page) || page <= 0) {
      return { valid: false, message: 'page must be a positive integer' }
    }
  }

  if (pageSizeValue !== undefined) {
    pageSize = Number(pageSizeValue)
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      return { valid: false, message: 'pageSize must be a positive integer' }
    }
  }

  return {
    valid: true,
    page,
    pageSize: Math.min(pageSize, MAX_PAGE_SIZE)
  }
}

function normalizeTimes(times) {
  if (!Array.isArray(times) || !times.length) {
    return { valid: false, message: 'times must be a non-empty array' }
  }

  const normalized = []

  for (const value of times) {
    const text = toText(value)
    if (!isTimeText(text)) {
      return { valid: false, message: 'times must be in HH:mm format' }
    }
    normalized.push(text)
  }

  return {
    valid: true,
    value: Array.from(new Set(normalized))
  }
}

function normalizeFoods(foods) {
  if (!Array.isArray(foods) || !foods.length) {
    return { valid: false, message: 'foods must be a non-empty array' }
  }

  const list = []

  for (const item of foods) {
    if (typeof item === 'string') {
      const name = toText(item)
      if (name) {
        list.push({ name })
      }
      continue
    }

    if (item && typeof item === 'object') {
      const name = toText(item.name)
      const amount = toText(item.amount)
      if (!name) {
        continue
      }
      const row = { name }
      if (amount) {
        row.amount = amount
      }
      list.push(row)
    }
  }

  if (!list.length) {
    return { valid: false, message: 'foods must contain at least one valid item' }
  }

  return { valid: true, value: list }
}

async function fetchAllByWhere(collectionName, where, orderField, orderDirection) {
  const all = []
  let skip = 0

  while (true) {
    let query = db.collection(collectionName).where(where)
    if (orderField) {
      query = query.orderBy(orderField, orderDirection || 'asc')
    }

    const result = await query.skip(skip).limit(MAX_BATCH_SIZE).get()
    const batch = result.data || []

    all.push(...batch)

    if (batch.length < MAX_BATCH_SIZE) {
      break
    }

    skip += MAX_BATCH_SIZE
  }

  return all
}

async function getOwnedDoc(collectionName, id, openid) {
  const result = await db.collection(collectionName).where({ _id: id, openid }).limit(1).get()
  return (result.data || [])[0] || null
}

function mapMedication(item) {
  return {
    id: item._id,
    name: item.name || '',
    dosage: item.dosage || '',
    frequency: item.frequency || '',
    times: Array.isArray(item.times) ? item.times : [],
    startDate: item.startDate || '',
    endDate: item.endDate || '',
    notes: item.notes || '',
    last_taken_at: item.last_taken_at || ''
  }
}

function mapReminder(item) {
  return {
    id: item._id,
    medicationId: item.medicationId || '',
    medicationName: item.medicationName || '',
    dosage: item.dosage || '',
    time: item.time || '',
    isActive: item.isActive !== false
  }
}

function mapAppointment(item) {
  return {
    id: item._id,
    doctor: item.doctor || '',
    hospital: item.hospital || '',
    date: item.date || '',
    time: item.time || '',
    department: item.department || '',
    notes: item.notes || '',
    reminderDays: Number.isFinite(Number(item.reminderDays)) ? Number(item.reminderDays) : 7,
    isCompleted: item.isCompleted === true
  }
}

function mapExercise(item) {
  return {
    id: item._id,
    type: item.type || '',
    duration_min: Number(item.duration_min) || 0,
    intensity: item.intensity || '',
    date: item.date || '',
    notes: item.notes || ''
  }
}

function mapDiet(item) {
  return {
    id: item._id,
    meal_type: item.meal_type || '',
    foods: Array.isArray(item.foods) ? item.foods : [],
    date: item.date || '',
    notes: item.notes || ''
  }
}

function mapSymptom(item) {
  return {
    id: item._id,
    symptoms: Array.isArray(item.symptoms) ? item.symptoms : [],
    date: item.date || '',
    createdAt: item.createdAt || ''
  }
}

async function medicationAdd(params, openid) {
  const name = toText(params.name)
  const dosage = toText(params.dosage)
  const frequency = toText(params.frequency)
  const startDate = toText(params.startDate)
  const endDate = toText(params.endDate)
  const notes = toText(params.notes)

  if (!name) {
    return fail(400, 'name is required')
  }
  if (!dosage) {
    return fail(400, 'dosage is required')
  }
  if (!frequency) {
    return fail(400, 'frequency is required')
  }
  if (!isDateText(startDate)) {
    return fail(400, 'startDate must be YYYY-MM-DD')
  }
  if (endDate && !isDateText(endDate)) {
    return fail(400, 'endDate must be YYYY-MM-DD')
  }
  if (endDate && endDate < startDate) {
    return fail(400, 'endDate must be >= startDate')
  }

  let times
  if (Array.isArray(params.times) && params.times.length) {
    const timesCheck = normalizeTimes(params.times)
    if (!timesCheck.valid) {
      return fail(400, timesCheck.message)
    }
    times = timesCheck.value
  } else {
    times = FREQ_TIMES[frequency] || ['08:00']
  }

  const result = await db.collection(COLLECTIONS.medication).add({
    data: {
      openid,
      name,
      dosage,
      frequency,
      times,
      startDate,
      endDate: endDate || '',
      notes: notes || '',
      last_taken_at: '',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })

  const medicationId = result._id

  let reminderCount = 0
  for (const time of times) {
    await db.collection(COLLECTIONS.medicationReminder).add({
      data: {
        openid,
        medicationId,
        medicationName: name,
        dosage,
        time,
        isActive: true,
        createdAt: db.serverDate()
      }
    })
    reminderCount += 1
  }

  return ok({ id: medicationId, reminderCount })
}

async function medicationList(params, openid) {
  const china = getChinaParts()
  const today = china.dateStr
  const records = await fetchAllByWhere(COLLECTIONS.medication, { openid }, 'startDate', 'desc')
  const reminders = await fetchAllByWhere(COLLECTIONS.medicationReminder, { openid }, 'time', 'asc')
  const takenRecords = await fetchAllByWhere(COLLECTIONS.medicationTaken, { openid, date: today }, 'createdAt', 'asc')
  const takenSet = new Set(takenRecords.map((item) => item.reminderId).filter(Boolean))

  const remindersByMed = {}
  for (const item of reminders) {
    const key = item.medicationId
    if (!remindersByMed[key]) {
      remindersByMed[key] = []
    }
    const mapped = mapReminder(item)
    mapped.takenToday = takenSet.has(item._id)
    remindersByMed[key].push(mapped)
  }

  const list = records.map((item) => {
    const mapped = mapMedication(item)
    mapped.reminders = remindersByMed[item._id] || []
    return mapped
  })

  return ok({ list })
}

async function medicationUpdate(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.medication, id, openid)
  if (!current) {
    return fail(404, 'medication not found')
  }

  const updateData = {}

  if (params.name !== undefined) {
    const value = toText(params.name)
    if (!value) {
      return fail(400, 'name cannot be empty')
    }
    updateData.name = value
  }
  if (params.dosage !== undefined) {
    const value = toText(params.dosage)
    if (!value) {
      return fail(400, 'dosage cannot be empty')
    }
    updateData.dosage = value
  }
  if (params.frequency !== undefined) {
    const value = toText(params.frequency)
    if (!value) {
      return fail(400, 'frequency cannot be empty')
    }
    updateData.frequency = value
  }
  if (params.startDate !== undefined) {
    const value = toText(params.startDate)
    if (!isDateText(value)) {
      return fail(400, 'startDate must be YYYY-MM-DD')
    }
    updateData.startDate = value
  }
  if (params.endDate !== undefined) {
    const value = toText(params.endDate)
    if (value && !isDateText(value)) {
      return fail(400, 'endDate must be YYYY-MM-DD')
    }
    updateData.endDate = value
  }
  if (params.notes !== undefined) {
    updateData.notes = toText(params.notes)
  }
  if (params.times !== undefined) {
    const timesCheck = normalizeTimes(params.times)
    if (!timesCheck.valid) {
      return fail(400, timesCheck.message)
    }
    updateData.times = timesCheck.value
  }

  if (!Object.keys(updateData).length) {
    return fail(400, 'no updatable fields provided')
  }

  const nextStartDate = updateData.startDate || current.startDate || ''
  const nextEndDate = Object.prototype.hasOwnProperty.call(updateData, 'endDate')
    ? updateData.endDate
    : (current.endDate || '')

  if (nextEndDate && nextStartDate && nextEndDate < nextStartDate) {
    return fail(400, 'endDate must be >= startDate')
  }

  updateData.updatedAt = db.serverDate()

  await db.collection(COLLECTIONS.medication).doc(id).update({ data: updateData })
  return ok({ id })
}

async function medicationDelete(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.medication, id, openid)
  if (!current) {
    return fail(404, 'medication not found')
  }

  await db.collection(COLLECTIONS.medication).doc(id).remove()
  await db.collection(COLLECTIONS.medicationReminder).where({ openid, medicationId: id }).remove()
  await db.collection(COLLECTIONS.medicationTaken).where({ openid, medicationId: id }).remove()
  return ok({ id })
}

async function medicationRecord(params, openid) {
  const medicationId = toText(params.medication_id)
  if (!medicationId) {
    return fail(400, 'medication_id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.medication, medicationId, openid)
  if (!current) {
    return fail(404, 'medication not found')
  }

  const takenAt = toText(params.taken_at) || formatDateTime(new Date())

  await db.collection(COLLECTIONS.medicationRecord).add({
    data: {
      openid,
      medication_id: medicationId,
      taken_at: takenAt,
      createdAt: db.serverDate()
    }
  })

  await db.collection(COLLECTIONS.medication).doc(medicationId).update({
    data: {
      last_taken_at: takenAt,
      updatedAt: db.serverDate()
    }
  })

  return ok({ medication_id: medicationId, taken_at: takenAt })
}

async function medicationReminderList(params, openid) {
  const where = { openid }
  const medicationId = toText(params.medicationId)
  if (medicationId) {
    where.medicationId = medicationId
  }

  const records = await fetchAllByWhere(COLLECTIONS.medicationReminder, where, 'time', 'asc')
  return ok({ list: records.map(mapReminder) })
}

async function medicationReminderAdd(params, openid) {
  const medicationId = toText(params.medicationId)
  const time = toText(params.time)

  if (!medicationId) {
    return fail(400, 'medicationId is required')
  }
  if (!isTimeText(time)) {
    return fail(400, 'time must be HH:mm')
  }

  const medication = await getOwnedDoc(COLLECTIONS.medication, medicationId, openid)
  if (!medication) {
    return fail(404, 'medication not found')
  }

  const result = await db.collection(COLLECTIONS.medicationReminder).add({
    data: {
      openid,
      medicationId,
      medicationName: medication.name || '',
      dosage: medication.dosage || '',
      time,
      isActive: true,
      createdAt: db.serverDate()
    }
  })

  return ok({ id: result._id })
}

async function medicationReminderDelete(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.medicationReminder, id, openid)
  if (!current) {
    return fail(404, 'reminder not found')
  }

  await db.collection(COLLECTIONS.medicationReminder).doc(id).remove()
  return ok({ id })
}

async function medicationReminderToggle(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.medicationReminder, id, openid)
  if (!current) {
    return fail(404, 'reminder not found')
  }

  const nextActive = params.isActive !== undefined ? !!params.isActive : current.isActive === false

  await db.collection(COLLECTIONS.medicationReminder).doc(id).update({
    data: { isActive: nextActive }
  })

  return ok({ id, isActive: nextActive })
}

async function medicationTakenAdd(params, openid) {
  const reminderId = toText(params.reminderId)
  if (!reminderId) {
    return fail(400, 'reminderId is required')
  }

  const reminder = await getOwnedDoc(COLLECTIONS.medicationReminder, reminderId, openid)
  if (!reminder) {
    return fail(404, 'reminder not found')
  }

  const china = getChinaParts()
  const date = china.dateStr

  const existing = await db
    .collection(COLLECTIONS.medicationTaken)
    .where({ openid, reminderId, date })
    .limit(1)
    .get()

  if ((existing.data || []).length) {
    return ok({ reminderId, date, taken: true })
  }

  await db.collection(COLLECTIONS.medicationTaken).add({
    data: {
      openid,
      reminderId,
      medicationId: reminder.medicationId || '',
      date,
      takenAt: china.hm,
      createdAt: db.serverDate()
    }
  })

  return ok({ reminderId, date, taken: true })
}

async function medicationTakenToday(params, openid) {
  const date = getChinaParts().dateStr
  const records = await fetchAllByWhere(COLLECTIONS.medicationTaken, { openid, date }, 'createdAt', 'asc')
  const reminderIds = records.map((item) => item.reminderId).filter(Boolean)
  return ok({ date, reminderIds: Array.from(new Set(reminderIds)) })
}

async function appointmentAdd(params, openid) {
  const doctor = toText(params.doctor)
  const hospital = toText(params.hospital)
  const date = toText(params.date)
  const time = toText(params.time)
  const department = toText(params.department)
  const notes = toText(params.notes)

  if (!doctor) {
    return fail(400, 'doctor is required')
  }
  if (!hospital) {
    return fail(400, 'hospital is required')
  }
  if (!isDateText(date)) {
    return fail(400, 'date must be YYYY-MM-DD')
  }
  if (!isTimeText(time)) {
    return fail(400, 'time must be HH:mm')
  }
  if (!department) {
    return fail(400, 'department is required')
  }

  let reminderDays = 7
  if (params.reminderDays !== undefined) {
    reminderDays = Number(params.reminderDays)
    if (!Number.isInteger(reminderDays) || reminderDays <= 0) {
      return fail(400, 'reminderDays must be a positive integer')
    }
  }

  const result = await db.collection(COLLECTIONS.appointment).add({
    data: {
      openid,
      doctor,
      hospital,
      date,
      time,
      department,
      notes: notes || '',
      reminderDays,
      isCompleted: false,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })

  return ok({ id: result._id })
}

async function appointmentList(params, openid) {
  const today = formatDate(new Date())
  const now = new Date()

  const records = await fetchAllByWhere(
    COLLECTIONS.appointment,
    { openid, date: _.gte(today) },
    'date',
    'asc'
  )

  const upcoming = records
    .filter((item) => {
      const time = parseDateTime(item.date, item.time)
      return !!time && time.getTime() >= now.getTime()
    })
    .sort((a, b) => {
      const timeA = parseDateTime(a.date, a.time)
      const timeB = parseDateTime(b.date, b.time)
      return (timeA ? timeA.getTime() : 0) - (timeB ? timeB.getTime() : 0)
    })

  return ok({ list: upcoming.map(mapAppointment) })
}

async function appointmentUpdate(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.appointment, id, openid)
  if (!current) {
    return fail(404, 'appointment not found')
  }

  const updateData = {}

  if (params.doctor !== undefined) {
    const value = toText(params.doctor)
    if (!value) {
      return fail(400, 'doctor cannot be empty')
    }
    updateData.doctor = value
  }
  if (params.hospital !== undefined) {
    const value = toText(params.hospital)
    if (!value) {
      return fail(400, 'hospital cannot be empty')
    }
    updateData.hospital = value
  }
  if (params.date !== undefined) {
    const value = toText(params.date)
    if (!isDateText(value)) {
      return fail(400, 'date must be YYYY-MM-DD')
    }
    updateData.date = value
  }
  if (params.time !== undefined) {
    const value = toText(params.time)
    if (!isTimeText(value)) {
      return fail(400, 'time must be HH:mm')
    }
    updateData.time = value
  }
  if (params.department !== undefined) {
    const value = toText(params.department)
    if (!value) {
      return fail(400, 'department cannot be empty')
    }
    updateData.department = value
  }
  if (params.notes !== undefined) {
    updateData.notes = toText(params.notes)
  }
  if (params.reminderDays !== undefined) {
    const value = Number(params.reminderDays)
    if (!Number.isInteger(value) || value <= 0) {
      return fail(400, 'reminderDays must be a positive integer')
    }
    updateData.reminderDays = value
  }
  if (params.isCompleted !== undefined) {
    updateData.isCompleted = !!params.isCompleted
  }

  if (!Object.keys(updateData).length) {
    return fail(400, 'no updatable fields provided')
  }

  updateData.updatedAt = db.serverDate()

  await db.collection(COLLECTIONS.appointment).doc(id).update({ data: updateData })
  return ok({ id })
}

async function appointmentComplete(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.appointment, id, openid)
  if (!current) {
    return fail(404, 'appointment not found')
  }

  await db.collection(COLLECTIONS.appointment).doc(id).update({
    data: { isCompleted: true, updatedAt: db.serverDate() }
  })
  return ok({ id, isCompleted: true })
}

async function appointmentDelete(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.appointment, id, openid)
  if (!current) {
    return fail(404, 'appointment not found')
  }

  await db.collection(COLLECTIONS.appointment).doc(id).remove()
  return ok({ id })
}

async function exerciseAdd(params, openid) {
  const type = toText(params.type)
  const intensity = toText(params.intensity)
  const date = toText(params.date)
  const notes = toText(params.notes)
  const duration = Number(params.duration_min)

  if (!type) {
    return fail(400, 'type is required')
  }
  if (!Number.isFinite(duration) || duration <= 0) {
    return fail(400, 'duration_min must be a positive number')
  }
  if (!EXERCISE_INTENSITY.includes(intensity)) {
    return fail(400, 'intensity must be one of 低/中/高')
  }
  if (!isDateText(date)) {
    return fail(400, 'date must be YYYY-MM-DD')
  }

  const result = await db.collection(COLLECTIONS.exercise).add({
    data: {
      openid,
      type,
      duration_min: roundOne(duration),
      intensity,
      date,
      notes: notes || '',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })

  return ok({ id: result._id })
}

async function exerciseList(params, openid) {
  const pagination = parsePagination(params.page, params.pageSize)
  if (!pagination.valid) {
    return fail(400, pagination.message)
  }

  const { page, pageSize } = pagination
  const skip = (page - 1) * pageSize
  const where = { openid }

  const [countResult, listResult] = await Promise.all([
    db.collection(COLLECTIONS.exercise).where(where).count(),
    db.collection(COLLECTIONS.exercise)
      .where(where)
      .orderBy('date', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
  ])

  const total = countResult.total || 0

  return ok({
    list: (listResult.data || []).map(mapExercise),
    page,
    pageSize,
    total,
    hasMore: page * pageSize < total
  })
}

async function exerciseStats(params, openid) {
  const now = new Date()
  const weekStartText = formatDate(getWeekStart(now))
  const monthStartText = formatDate(new Date(now.getFullYear(), now.getMonth(), 1))

  const records = await fetchAllByWhere(
    COLLECTIONS.exercise,
    { openid, date: _.gte(monthStartText) },
    'date',
    'desc'
  )

  let weekDuration = 0
  let weekCount = 0
  let monthDuration = 0
  let monthCount = 0

  for (const item of records) {
    const date = toText(item.date)
    const duration = Number(item.duration_min) || 0

    if (!isDateText(date) || duration <= 0) {
      continue
    }

    monthDuration += duration
    monthCount += 1

    if (date >= weekStartText) {
      weekDuration += duration
      weekCount += 1
    }
  }

  return ok({
    week: {
      startDate: weekStartText,
      totalDuration: roundOne(weekDuration),
      count: weekCount
    },
    month: {
      startDate: monthStartText,
      totalDuration: roundOne(monthDuration),
      count: monthCount
    }
  })
}

async function exerciseDelete(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.exercise, id, openid)
  if (!current) {
    return fail(404, 'exercise not found')
  }

  await db.collection(COLLECTIONS.exercise).doc(id).remove()
  return ok({ id })
}

async function dietAdd(params, openid) {
  const mealType = toText(params.meal_type)
  const date = toText(params.date)
  const notes = toText(params.notes)

  if (!DIET_MEAL_TYPES.includes(mealType)) {
    return fail(400, 'meal_type must be one of 早餐/午餐/晚餐/加餐')
  }
  if (!isDateText(date)) {
    return fail(400, 'date must be YYYY-MM-DD')
  }

  const foodsCheck = normalizeFoods(params.foods)
  if (!foodsCheck.valid) {
    return fail(400, foodsCheck.message)
  }

  const result = await db.collection(COLLECTIONS.diet).add({
    data: {
      openid,
      meal_type: mealType,
      foods: foodsCheck.value,
      date,
      notes: notes || '',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })

  return ok({ id: result._id })
}

async function dietList(params, openid) {
  const pagination = parsePagination(params.page, params.pageSize)
  if (!pagination.valid) {
    return fail(400, pagination.message)
  }

  const { page, pageSize } = pagination
  const skip = (page - 1) * pageSize
  const where = { openid }

  const [countResult, listResult] = await Promise.all([
    db.collection(COLLECTIONS.diet).where(where).count(),
    db.collection(COLLECTIONS.diet)
      .where(where)
      .orderBy('date', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
  ])

  const total = countResult.total || 0

  return ok({
    list: (listResult.data || []).map(mapDiet),
    page,
    pageSize,
    total,
    hasMore: page * pageSize < total
  })
}

async function dietStats(params, openid) {
  const today = formatDate(new Date())
  const records = await fetchAllByWhere(COLLECTIONS.diet, { openid, date: today }, 'createdAt', 'desc')

  const meals = {}
  const recordsByMeal = {}

  for (const meal of DIET_MEAL_TYPES) {
    meals[meal] = false
    recordsByMeal[meal] = 0
  }

  for (const item of records) {
    const mealType = toText(item.meal_type)
    if (Object.prototype.hasOwnProperty.call(recordsByMeal, mealType)) {
      recordsByMeal[mealType] += 1
      meals[mealType] = true
    }
  }

  const completed = DIET_MEAL_TYPES.reduce((sum, meal) => sum + (meals[meal] ? 1 : 0), 0)

  return ok({
    date: today,
    meals,
    recordsByMeal,
    completed,
    total: DIET_MEAL_TYPES.length
  })
}

async function dietDelete(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.diet, id, openid)
  if (!current) {
    return fail(404, 'diet record not found')
  }

  await db.collection(COLLECTIONS.diet).doc(id).remove()
  return ok({ id })
}

function clampSeverity(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) {
    return 1
  }
  return Math.min(4, Math.max(0, Math.round(num)))
}

async function symptomRecord(params, openid) {
  const date = toText(params.date)

  if (!isDateText(date)) {
    return fail(400, 'date must be YYYY-MM-DD')
  }
  if (!Array.isArray(params.symptoms) || !params.symptoms.length) {
    return fail(400, 'symptoms must be a non-empty array')
  }

  const symptoms = []
  for (const item of params.symptoms) {
    if (!item || typeof item !== 'object') {
      continue
    }
    const name = toText(item.name)
    if (!name) {
      continue
    }
    symptoms.push({ name, severity: clampSeverity(item.severity) })
  }

  if (!symptoms.length) {
    return fail(400, 'symptoms must contain at least one valid item')
  }

  const result = await db.collection(COLLECTIONS.symptom).add({
    data: {
      openid,
      symptoms,
      date,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })

  return ok({ id: result._id, date, symptoms })
}

async function symptomList(params, openid) {
  const pagination = parsePagination(params.page, params.page_size !== undefined ? params.page_size : params.pageSize)
  if (!pagination.valid) {
    return fail(400, pagination.message)
  }

  const { page, pageSize } = pagination
  const skip = (page - 1) * pageSize
  const where = { openid }

  const [countResult, listResult] = await Promise.all([
    db.collection(COLLECTIONS.symptom).where(where).count(),
    db.collection(COLLECTIONS.symptom)
      .where(where)
      .orderBy('date', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
  ])

  const total = countResult.total || 0

  return ok({
    list: (listResult.data || []).map(mapSymptom),
    page,
    pageSize,
    total,
    hasMore: page * pageSize < total
  })
}

function mapCalorieProfile(item) {
  return {
    gender: toText(item.gender) || 'male',
    age: Number(item.age) || 0,
    height: Number(item.height) || 0,
    weight: Number(item.weight) || 0,
    activityLevel: Number(item.activityLevel) || 0,
    standardWeight: Number(item.standardWeight) || 0,
    bmi: Number(item.bmi) || 0,
    bmiCategory: toText(item.bmiCategory) || '',
    recommendedIntake: Number(item.recommendedIntake) || 0
  }
}

function mapCalorieRecord(item) {
  return {
    id: item._id,
    date: toText(item.date) || '',
    name: toText(item.name) || '',
    portion: Number(item.portion) || 0,
    caloriesPer100g: Number(item.caloriesPer100g) || 0,
    calories: Number(item.calories) || 0,
    createdAt: item.createdAt || ''
  }
}

async function calorieProfileGet(params, openid) {
  const result = await db.collection(COLLECTIONS.calorieProfile).where({ openid }).limit(1).get()
  const doc = (result.data || [])[0] || null
  return ok({ profile: doc ? mapCalorieProfile(doc) : null })
}

async function calorieProfileSave(params, openid) {
  const gender = toText(params.gender) || 'male'
  const age = Number(params.age)
  const height = Number(params.height)
  const weight = Number(params.weight)
  const activityLevel = Number(params.activityLevel)
  const standardWeight = Number(params.standardWeight)
  const bmi = Number(params.bmi)
  const bmiCategory = toText(params.bmiCategory)
  const recommendedIntake = Number(params.recommendedIntake)

  if (!Number.isFinite(height) || height <= 0) {
    return fail(400, 'height must be a positive number')
  }
  if (!Number.isFinite(weight) || weight <= 0) {
    return fail(400, 'weight must be a positive number')
  }
  if (!Number.isFinite(recommendedIntake) || recommendedIntake <= 0) {
    return fail(400, 'recommendedIntake must be a positive number')
  }

  const profileData = {
    gender,
    age: Number.isFinite(age) ? age : 0,
    height,
    weight,
    activityLevel: Number.isFinite(activityLevel) ? activityLevel : 0,
    standardWeight: Number.isFinite(standardWeight) ? standardWeight : 0,
    bmi: Number.isFinite(bmi) ? bmi : 0,
    bmiCategory: bmiCategory || '',
    recommendedIntake
  }

  const existing = await db.collection(COLLECTIONS.calorieProfile).where({ openid }).limit(1).get()
  const current = (existing.data || [])[0] || null

  if (current) {
    await db.collection(COLLECTIONS.calorieProfile).doc(current._id).update({
      data: {
        ...profileData,
        updatedAt: db.serverDate()
      }
    })
  } else {
    await db.collection(COLLECTIONS.calorieProfile).add({
      data: {
        openid,
        ...profileData,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
  }

  return ok({ profile: profileData })
}

async function calorieRecordAdd(params, openid) {
  const date = toText(params.date)
  const name = toText(params.name)
  const portion = Number(params.portion)
  const caloriesPer100g = Number(params.caloriesPer100g)
  const calories = Number(params.calories)

  if (!isDateText(date)) {
    return fail(400, 'date must be YYYY-MM-DD')
  }
  if (!name) {
    return fail(400, 'name is required')
  }
  if (!Number.isFinite(portion) || portion <= 0) {
    return fail(400, 'portion must be a positive number')
  }
  if (!Number.isFinite(caloriesPer100g) || caloriesPer100g < 0) {
    return fail(400, 'caloriesPer100g must be a non-negative number')
  }
  if (!Number.isFinite(calories) || calories < 0) {
    return fail(400, 'calories must be a non-negative number')
  }

  const result = await db.collection(COLLECTIONS.calorieRecord).add({
    data: {
      openid,
      date,
      name,
      portion,
      caloriesPer100g,
      calories,
      createdAt: db.serverDate()
    }
  })

  return ok({ id: result._id })
}

async function calorieRecordList(params, openid) {
  const date = toText(params.date)
  if (!isDateText(date)) {
    return fail(400, 'date must be YYYY-MM-DD')
  }

  const records = await fetchAllByWhere(COLLECTIONS.calorieRecord, { openid, date }, 'createdAt', 'asc')
  const list = records.map(mapCalorieRecord)
  const totalCalories = list.reduce((sum, item) => sum + (Number(item.calories) || 0), 0)

  return ok({ list, totalCalories })
}

async function calorieRecordDelete(params, openid) {
  const id = toText(params.id)
  if (!id) {
    return fail(400, 'id is required')
  }

  const current = await getOwnedDoc(COLLECTIONS.calorieRecord, id, openid)
  if (!current) {
    return fail(404, 'calorie record not found')
  }

  await db.collection(COLLECTIONS.calorieRecord).doc(id).remove()
  return ok({ success: true })
}

async function remindersToday(params, openid) {
  const china = getChinaParts()
  const today = china.dateStr
  const todayDays = dateStrToDays(today)

  const [reminders, medications, takenRecords, appointments] = await Promise.all([
    fetchAllByWhere(COLLECTIONS.medicationReminder, { openid }, 'time', 'asc'),
    fetchAllByWhere(COLLECTIONS.medication, { openid }, 'startDate', 'desc'),
    fetchAllByWhere(COLLECTIONS.medicationTaken, { openid, date: today }, 'createdAt', 'asc'),
    fetchAllByWhere(COLLECTIONS.appointment, { openid }, 'date', 'asc')
  ])

  const medById = {}
  for (const med of medications) {
    medById[med._id] = med
  }

  const takenSet = new Set(takenRecords.map((item) => item.reminderId).filter(Boolean))

  const medsDue = []
  for (const reminder of reminders) {
    if (reminder.isActive === false) {
      continue
    }

    const med = medById[reminder.medicationId]
    if (!med) {
      continue
    }

    const startDate = toText(med.startDate)
    const endDate = toText(med.endDate)
    if (startDate && today < startDate) {
      continue
    }
    if (endDate && today > endDate) {
      continue
    }

    const reminderMinutes = hmToMinutes(reminder.time)
    if (reminderMinutes === null || china.minutes < reminderMinutes) {
      continue
    }

    if (takenSet.has(reminder._id)) {
      continue
    }

    medsDue.push({
      reminderId: reminder._id,
      medicationId: reminder.medicationId,
      medicationName: reminder.medicationName || (med.name || ''),
      dosage: reminder.dosage || (med.dosage || ''),
      time: reminder.time || '',
      taken: false
    })
  }

  const apptsDue = []
  for (const appt of appointments) {
    if (appt.isCompleted === true) {
      continue
    }

    const apptDays = dateStrToDays(toText(appt.date))
    if (apptDays === null || todayDays === null) {
      continue
    }

    const reminderDays = Number.isInteger(Number(appt.reminderDays)) && Number(appt.reminderDays) > 0
      ? Number(appt.reminderDays)
      : 7

    const daysLeft = apptDays - todayDays
    if (daysLeft < 0 || daysLeft > reminderDays) {
      continue
    }

    apptsDue.push({
      id: appt._id,
      hospital: appt.hospital || '',
      department: appt.department || '',
      doctor: appt.doctor || '',
      date: appt.date || '',
      time: appt.time || '',
      reminderDays,
      daysLeft
    })
  }

  return ok({
    date: today,
    medications: medsDue,
    appointments: apptsDue,
    takenCount: takenSet.size
  })
}

const ACTION_MAP = {
  medication_add: medicationAdd,
  medication_list: medicationList,
  medication_update: medicationUpdate,
  medication_delete: medicationDelete,
  medication_record: medicationRecord,

  medication_reminder_list: medicationReminderList,
  medication_reminder_add: medicationReminderAdd,
  medication_reminder_delete: medicationReminderDelete,
  medication_reminder_toggle: medicationReminderToggle,
  medication_taken_add: medicationTakenAdd,
  medication_taken_today: medicationTakenToday,

  appointment_add: appointmentAdd,
  appointment_list: appointmentList,
  appointment_update: appointmentUpdate,
  appointment_delete: appointmentDelete,
  appointment_complete: appointmentComplete,

  reminders_today: remindersToday,

  exercise_add: exerciseAdd,
  exercise_list: exerciseList,
  exercise_stats: exerciseStats,
  exercise_delete: exerciseDelete,

  diet_add: dietAdd,
  diet_list: dietList,
  diet_stats: dietStats,
  diet_delete: dietDelete,

  symptom_record: symptomRecord,
  symptom_list: symptomList,

  calorie_profile_get: calorieProfileGet,
  calorie_profile_save: calorieProfileSave,
  calorie_record_add: calorieRecordAdd,
  calorie_record_list: calorieRecordList,
  calorie_record_delete: calorieRecordDelete
}

exports.main = async (event = {}) => {
  const { action, ...params } = event
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return fail(401, 'openid not found')
  }
  if (!action || typeof action !== 'string') {
    return fail(400, 'action is required')
  }

  const handler = ACTION_MAP[action]
  if (!handler) {
    return fail(400, `Unknown action: ${action}`)
  }

  try {
    return await handler(params, OPENID)
  } catch (error) {
    return fail(500, error.message || 'internal error')
  }
}
