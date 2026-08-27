import { useQuery } from '@tanstack/react-query'
import { TrendingUp, ShoppingBag, Rocket, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import analyticsService from '../../../services/analytics.service'
import { Link } from 'react-router-dom'

const formatPrice = (price) => {
  if (!price && price !== 0) return '₦0'
  return `₦${(price / 100).toLocaleString()}`
}

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface p-3 shadow-lg">
        <p className="text-sm font-medium text-on-surface-variant mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {formatPrice(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface p-3 shadow-lg">
        <p className="text-sm font-medium text-on-surface">
          {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

const COLORS = ['#fbbf24', '#f59e0b', '#fcd34d', '#d97706', '#b45309', '#fde68a']

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => analyticsService.getDashboardStats().then(res => res.data.data)
  })

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['salesOverTime'],
    queryFn: () => analyticsService.getSalesOverTime({ period: 'daily', limit: 30 }).then(res => res.data.data)
  })

  const { data: lowStockProducts } = useQuery({
    queryKey: ['lowStock'],
    queryFn: () => analyticsService.getLowStock().then(res => res.data.data)
  })

  const isLoading = statsLoading || salesLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
        <div className="skeleton h-72" />
      </div>
    )
  }

  const pieData = stats?.statusCounts
    ? Object.entries(stats.statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    : []

  return (
    <div className="bento-grid">
      <div className="col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">System Overview</h2>
          <p className="text-sm text-on-surface-variant">Monitoring propulsion metrics for Way Forward Operations.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/categories" className="bg-surface border-2 border-on-background text-on-background px-6 py-2.5 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-1">
            <span className="text-[20px] leading-none">+</span>
            Manage Categories
          </Link>
          <Link to="/admin/products" className="bg-primary-50 text-primary-800 px-6 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1 border border-primary-500/30">
            <span className="text-[20px] leading-none">+</span>
            Add New Product
          </Link>
        </div>
      </div>

      <div className="bento-item col-span-12 md:col-span-4 card flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-50 p-2 rounded-xl flex items-center justify-center">
  <span className="text-xl font-bold text-primary-500">₦</span>
</div>
            <span className="text-green-600 text-[11px] font-semibold bg-green-50 px-2 py-0.5 rounded-full">+12.4%</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Total Revenue</p>
        </div>
        <div className="mt-4">
          <h3 className="text-display-lg-mobile font-extrabold text-on-surface">{formatPrice(stats?.totalRevenue || 0)}</h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary-500 h-full rounded-full" style={{ width: '78%' }} />
          </div>
        </div>
      </div>

      <div className="bento-item col-span-12 md:col-span-4 card flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-50 p-2 rounded-xl flex items-center justify-center">
             <span className="text-xl font-bold text-primary-500">₦</span>
            </div>
            <span className="text-on-surface-variant text-[11px] font-semibold bg-surface-container px-2 py-0.5 rounded-full">Weekly</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant">Total Orders</p>
        </div>
        <div className="mt-4">
          <h3 className="text-display-lg-mobile font-extrabold text-on-surface">{stats?.totalOrders || 0}</h3>
          <p className="text-xs text-on-surface-variant mt-2">Active deliveries: {stats?.pendingOrders || 0}</p>
        </div>
      </div>

      <div className="bento-item col-span-12 md:col-span-4 card flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-container flex items-center justify-center">
          <Rocket className="w-10 h-10 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-on-surface-variant">Best Seller</p>
          <h4 className="text-headline-md font-bold text-on-surface mb-1">Top Product</h4>
          <span className="bg-primary-50 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">New Record</span>
        </div>
      </div>

      <div className="bento-item col-span-12 md:col-span-8 card">
        <div className="flex justify-between items-center mb-gutter">
          <h3 className="text-headline-md font-bold text-on-surface">Sales Growth</h3>
          <div className="flex gap-1">
            <button className="p-1 px-3 py-1 bg-surface-container rounded-md text-[11px] font-semibold text-on-surface">7D</button>
            <button className="px-3 py-1 hover:bg-surface-container-high rounded-md text-[11px] font-semibold text-on-surface-variant">30D</button>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#da3437" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#da3437" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce2f7" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#7d7761' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#7d7761' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#da3437" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bento-item col-span-12 md:col-span-4 flex flex-col gap-4">
        <div className="bg-inverse-surface text-inverse-on-surface p-6 rounded-2xl flex-1 flex flex-col justify-center">
          <p className="text-xs font-medium opacity-80 mb-1">Target Velocity</p>
          <div className="flex items-baseline gap-1">
            <span className="text-display-lg-mobile font-extrabold">92%</span>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-xs mt-4 opacity-70">On track to exceed goals by 4.2%</p>
        </div>
        <div className="bg-primary-50 text-primary-800 p-6 rounded-2xl flex-1 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold">New Customers</p>
            <h4 className="text-headline-md font-bold">+{stats?.totalCustomers || 0}</h4>
          </div>
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary-50 bg-slate-200" />
            <div className="w-10 h-10 rounded-full border-2 border-primary-50 bg-slate-200" />
            <div className="w-10 h-10 rounded-full border-2 border-primary-50 bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white">+{Math.min(stats?.totalCustomers || 0, 99)}</div>
          </div>
        </div>
      </div>

      <div className="bento-item col-span-12 card overflow-hidden p-0">
        <div className="p-gutter flex justify-between items-center border-b border-outline-variant">
          <h3 className="text-headline-md font-bold text-on-surface">Recent Orders</h3>
          <button className="text-primary-500 text-xs font-medium hover:underline">View All Activities</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Order ID</th>
                <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Customer</th>
                <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Amount</th>
                <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order, idx) => {
                const initials = order.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '--'
                return (
                  <tr key={idx} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-gutter py-4 font-bold text-on-surface">{order.orderNumber || `#WF-${idx + 1}`}</td>
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center font-bold text-[10px] text-primary-800">{initials}</div>
                        <span className="text-sm">{order.user?.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="px-gutter py-4 text-headline-md text-[18px] text-primary-500">{formatPrice(order.pricing?.total || 0)}</td>
                    <td className="px-gutter py-4">
                      <span className={`badge-${order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'error' : 'info'}`}>{order.status}</span>
                    </td>
                    <td className="px-gutter py-4">
                      <button className="text-on-surface-variant hover:text-primary-500 transition-colors">...</button>
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={5} className="px-gutter py-8 text-center text-on-surface-variant">No recent orders</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {lowStockProducts?.length > 0 && (
        <div className="bento-item col-span-12 card overflow-hidden p-0">
          <div className="p-gutter flex justify-between items-center border-b border-outline-variant">
            <h3 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Low Stock Alerts
            </h3>
            <Link to="/admin/products" className="text-primary-500 text-xs font-medium hover:underline">Manage Products</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Product</th>
                  <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">SKU</th>
                  <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Stock</th>
                  <th className="px-gutter py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {lowStockProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          {product.images?.[0] && (
                            <img src={product.images[0]?.url || product.images[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-sm text-on-surface">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-gutter py-4 text-sm text-on-surface-variant font-mono">{product.sku}</td>
                    <td className="px-gutter py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${product.stockQuantity === 0 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                        {product.stockQuantity === 0 ? 'Out of Stock' : product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-gutter py-4 text-sm text-on-surface-variant">{product.lowStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
