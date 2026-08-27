import api from './api'

const paymentService = {
  initialize: (orderId) => api.post('/payments/initialize', { orderId }),
  verify: (reference) => api.get('/payments/verify', { params: { reference } }),
}

export default paymentService
