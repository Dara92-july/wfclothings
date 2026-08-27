import api from './api'

const analyticsService = {
  getDashboardStats: (params) => api.get('/analytics/dashboard', { params }),
  getSalesOverTime: (params) => api.get('/analytics/sales', { params }),
  getLowStock: () => api.get('/analytics/low-stock'),
}

export default analyticsService
