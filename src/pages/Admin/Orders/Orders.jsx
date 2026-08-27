import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, X, Package, Truck, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'
import orderService from '../../../services/order.service'
import toast from 'react-hot-toast'

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20', icon: Clock },
  paid: { label: 'Paid', color: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 ring-1 ring-red-600/20', icon: XCircle },
}

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [trackingForm, setTrackingForm] = useState({ carrier: '', trackingNumber: '' })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', activeTab],
    queryFn: () => orderService.getAllOrders({ status: activeTab || undefined }).then(res => res.data)
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, tracking }) => orderService.updateStatus(id, { status, tracking }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders'])
      toast.success('Order status updated')
      setSelectedOrder(null)
    }
  })

  const handleStatusUpdate = (orderId, newStatus) => {
    const payload = { status: newStatus }
    if (newStatus === 'shipped' && trackingForm.trackingNumber) {
      payload.tracking = trackingForm
    }
    updateStatusMutation.mutate({ id: orderId, ...payload })
  }

  const formatPrice = (price) => `₦${(price / 100).toLocaleString()}`
  const orders = data?.data || []

  const statusCounts = statusOptions.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === '' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          All ({orders.length})
        </button>
        {statusOptions.map(status => {
          const cfg = statusConfig[status]
          const count = statusCounts[status] || 0
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize whitespace-nowrap transition-all ${
                activeTab === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cfg.label} ({count})
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const cfg = statusConfig[order.status]
                  const StatusIcon = cfg.icon
                  const initials = order.user?.name
                    ? order.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : '--'
                  return (
                    <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-slate-800">{order.orderNumber}</p>
                        <p className="text-xs text-slate-400">{order.items?.length || 0} items</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-linear-to from-primary-50 to-primary-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary-800">{initials}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{order.user?.name || 'Guest'}</p>
                            <p className="text-xs text-slate-400 truncate">{order.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-bold text-sm text-slate-800">
                        {formatPrice(order.pricing?.total || 0)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setTrackingForm({
                              carrier: order.tracking?.carrier || '',
                              trackingNumber: order.tracking?.trackingNumber || ''
                            })
                          }}
                          className="btn-ghost p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedOrder(null)} />
          <div className="drawer-panel">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="font-semibold text-lg text-slate-900">Order Details</h2>
                <p className="text-sm text-slate-500">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Delivery Address</h3>
                <p className="text-sm text-slate-600">
                  {selectedOrder.deliveryAddress?.street}<br />
                  {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}<br />
                  {selectedOrder.deliveryAddress?.country}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{formatPrice((item.price || 0) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Status Timeline</h3>
                <div className="space-y-3">
                  {statusOptions.map((status, idx) => {
                    const cfg = statusConfig[status]
                    const StatusIcon = cfg.icon
                    const isActive = selectedOrder.status === status
                    const isPast = statusOptions.indexOf(selectedOrder.status) >= idx ||
                      ['delivered', 'cancelled'].includes(selectedOrder.status)

                    return (
                      <div key={status} className="flex items-start gap-3">
                        <div className={`timeline-dot ${isActive ? 'bg-primary-500 shadow-primary-500/25' : isPast ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          <StatusIcon className={`w-4 h-4 ${isActive || isPast ? 'text-white' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className={`text-sm font-medium ${isActive ? 'text-primary-800' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                            {cfg.label}
                          </p>
                          {isActive && selectedOrder.tracking?.trackingNumber && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {selectedOrder.tracking.carrier}: {selectedOrder.tracking.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map(status => {
                    const cfg = statusConfig[status]
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          selectedOrder.status === status
                            ? 'border-primary-500 bg-primary-50 text-primary-800'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped') && (
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">Tracking Information</h3>
                  <input
                    type="text"
                    placeholder="Carrier (e.g. DHL)"
                    value={trackingForm.carrier}
                    onChange={e => setTrackingForm({...trackingForm, carrier: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Tracking Number"
                    value={trackingForm.trackingNumber}
                    onChange={e => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                    className="input-field"
                  />
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'shipped')}
                    className="btn-primary w-full text-sm"
                  >
                    Save & Mark Shipped
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminOrders
