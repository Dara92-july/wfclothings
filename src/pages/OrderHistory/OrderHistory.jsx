import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import orderService from '../../services/order.service'

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
  paid: { icon: CheckCircle, color: 'text-sky-600', bg: 'bg-sky-50', label: 'Paid' },
  processing: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' }
}

const OrderHistory = () => {
  const [expandedOrder, setExpandedOrder] = useState(null)
  const { data, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderService.getMyOrders().then(res => res.data.data)
  })

  const formatPrice = (price) => `₦${(price / 100).toLocaleString()}`
  const orders = data || []

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5"><Package className="w-10 h-10 text-slate-400" /></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status]
            const StatusIcon = status.icon
            const isExpanded = expandedOrder === order._id
            return (
              <div key={order._id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div><p className="font-semibold text-slate-900">{order.orderNumber}</p><p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg}`}><StatusIcon className={`w-4 h-4 ${status.color}`} /><span className={`text-xs font-semibold ${status.color}`}>{status.label}</span></div>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="shrink-0 flex items-center gap-2.5 bg-slate-50 rounded-lg p-2">
                        {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />}
                        <div><p className="text-sm font-medium text-slate-800">{item.name}</p><p className="text-xs text-slate-500">&times; {item.quantity}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <button onClick={() => setExpandedOrder(isExpanded ? null : order._id)} className="text-xs text-primary-800 hover:text-primary-600 font-medium flex items-center gap-1">{isExpanded ? 'Less' : 'More'} details {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</button>
                    <div className="text-right"><p className="text-xs text-slate-500">Total</p><p className="font-bold text-primary-500">{formatPrice(order.pricing?.total || 0)}</p></div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
                    {order.deliveryAddress && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Delivery Address</p><p className="text-sm text-slate-700">{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}</p></div>}
                    {order.tracking?.trackingNumber && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tracking</p><p className="text-sm text-slate-700">{order.tracking.carrier}: {order.tracking.trackingNumber}</p></div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
