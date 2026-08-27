import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { logout } from '../../store/slices/authSlice'

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => { dispatch(logout()); navigate('/') }
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'
  const currentPage = menuItems.find(item => item.path === location.pathname)
  const pageTitle = currentPage?.label || 'Admin'

  return (
    <div className="min-h-screen bg-slate-50 flex pt-16">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-16 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="font-display font-bold text-lg text-slate-900">Admin Panel</p>
            <p className="text-xs text-slate-400">Way Forward Hub</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-slate-100 p-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 lg:px-6 sticky top-16 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-400"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 text-sm text-slate-500"><span>Admin</span><span>/</span><span className="font-semibold text-slate-800">{pageTitle}</span></div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto"><Outlet /></main>
      </div>
    </div>
  )
}

export default AdminLayout
