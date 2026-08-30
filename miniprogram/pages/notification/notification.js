const { callCloud } = require('../../utils/api');
const { showToast } = require('../../utils/util');

Page({
  data: {
    activeFilter: 'all',
    medications: [],
    appointments: [],
    loading: false
  },

  onShow() {
    this.loadReminders();
  },

  async loadReminders() {
    this.setData({ loading: true });
    try {
      const res = await callCloud('health', { action: 'reminders_today' });
      if (res && res.code === 0 && res.data) {
        this.setData({
          medications: res.data.medications || [],
          appointments: res.data.appointments || []
        });
      } else {
        showToast((res && res.message) || '加载失败');
      }
    } catch (error) {
      showToast('加载提醒失败，请稍后重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  onFilterTap(e) {
    const filter = e.currentTarget.dataset.filter;
    if (filter && filter !== this.data.activeFilter) {
      this.setData({ activeFilter: filter });
    }
  },

  async onMarkTaken(e) {
    const { reminderId, medicationId } = e.currentTarget.dataset;
    try {
      const res = await callCloud('health', {
        action: 'medication_taken_add',
        reminderId,
        medicationId
      });
      if (res && res.code === 0) {
        showToast('已记录服药', 'success');
        this.loadReminders();
      } else {
        showToast((res && res.message) || '操作失败');
      }
    } catch (error) {
      showToast('操作失败，请稍后重试');
    }
  },

  async onMarkCompleted(e) {
    const { id } = e.currentTarget.dataset;
    try {
      const res = await callCloud('health', { action: 'appointment_complete', id });
      if (res && res.code === 0) {
        showToast('已完成', 'success');
        this.loadReminders();
      } else {
        showToast((res && res.message) || '操作失败');
      }
    } catch (error) {
      showToast('操作失败，请稍后重试');
    }
  }
});
