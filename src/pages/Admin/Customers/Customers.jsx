import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Mail, Phone, ShoppingBag, Calendar, Eye, X, DollarSign } from 'lucide-react'
import userService from '../../../services/user.service'

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['adminCustomers', searchQuery],
    queryFn: () => userService.getAllUsers({ search: searchQuery }).then(res => res.data)
  })

  const customers = data?.data || []

  const formatPrice = (price) => `₦${(price / 100).toLocaleString()}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers..."
            className="input-field pl-9"
          />
        </div>
        <p className="text-sm text-slate-500">{customers.length} customers</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => {
                  const initials = customer.name
                    ? customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : '--'
                  return (
                    <tr key={customer._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-to from-primary-500 to-primary-600 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-white">{initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{customer.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="text-sm text-slate-600 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> {customer.email}
                          </p>
                          {customer.phone && (
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" /> {customer.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                          {customer.orders?.length || 0}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
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

      {selectedCustomer && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedCustomer(null)} />
          <div className="drawer-panel">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-lg text-slate-900">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-linear-to from-primary-500 to-primary-600 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-white">
                    {selectedCustomer.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-slate-500">{selectedCustomer.email}</p>
                  {selectedCustomer.phone && <p className="text-sm text-slate-500">{selectedCustomer.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <ShoppingBag className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-800">{selectedCustomer.orders?.length || 0}</p>
                  <p className="text-xs text-slate-500">Total Orders</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-800">{formatPrice(selectedCustomer.totalSpent || 0)}</p>
                  <p className="text-xs text-slate-500">Total Spent</p>
                </div>
              </div>

              {selectedCustomer.addresses?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Addresses</h3>
                  {selectedCustomer.addresses.map((addr, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                      <p>{addr.label && <span className="font-medium">{addr.label}: </span>}{addr.street}</p>
                      <p>{addr.city}, {addr.state}</p>
                      <p>{addr.country}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomer.orders?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Recent Orders</h3>
                  <div className="space-y-2">
                    {selectedCustomer.orders.slice(0, 5).map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{order.orderNumber}</p>
                          <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{formatPrice(order.pricing?.total || 0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminCustomers
