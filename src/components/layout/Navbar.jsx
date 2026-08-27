import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, User, Menu, X, LogOut, Search, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { logout } from '../../store/slices/authSlice'
import BrandLogo from '../common/BrandLogo'
import categoryService from '../../services/category.service'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCatDropdown, setShowCatDropdown] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const catTimeout = useRef(null)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories().then(res => res.data.data)
  })

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') { setSearchOpen(false); setShowCatDropdown(false) } }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleLogout = () => { dispatch(logout()); navigate('/') }
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const categories = categoriesData || []

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) { navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery('') }
  }

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            {/* Left - Logo */}
            <div className="shrink-0">
              <BrandLogo imageClassName="h-16 sm:h-20 w-auto" />
            </div>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center justify-center gap-1">
              <Link to="/" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50/50 transition-all">Home</Link>
              <div className="relative"
                onMouseEnter={() => { clearTimeout(catTimeout.current); setShowCatDropdown(true) }}
                onMouseLeave={() => { catTimeout.current = setTimeout(() => setShowCatDropdown(false), 150) }}>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50/50 transition-all">
                  Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCatDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden">
                    <Link to="/products" onClick={() => setShowCatDropdown(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-500 hover:bg-primary-50 transition-colors">All Products</Link>
                    <div className="border-t border-gray-50 mx-4 my-1" />
                    {categories.map(cat => (
                      <Link key={cat._id} to={`/products?category=${encodeURIComponent(cat.name)}`} onClick={() => setShowCatDropdown(false)} className="block px-4 py-2.5 text-sm text-slate-600 hover:text-primary-500 hover:bg-primary-50 transition-colors">{cat.name}</Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/products?sort=-createdAt" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50/50 transition-all">New Arrivals</Link>
              <Link to="/about" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50/50 transition-all">About</Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50/50 transition-all">Contact</Link>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center gap-0.5">
              <button onClick={() => setSearchOpen(true)} aria-label="Open search" className="p-2.5 text-slate-600 hover:text-primary-500 hover:bg-primary-50/50 rounded-lg transition-all"><Search className="w-5 h-5" /></button>

              <Link to="/cart" className="relative p-2.5 text-slate-600 hover:text-primary-500 hover:bg-primary-50/50 rounded-lg transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 leading-none shadow-sm">{cartCount}</span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 text-slate-600 hover:text-primary-500 rounded-lg hover:bg-primary-50/50 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-sm"><span className="text-xs font-bold text-white">{user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span></div>
                  </button>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1.5">
                    <div className="px-4 py-2.5 border-b border-gray-50 mb-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-primary-500 hover:bg-primary-50">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-primary-500 hover:bg-primary-50">My Orders</Link>
                    {user?.role === 'admin' && <Link to="/admin" className="block px-4 py-2.5 text-sm text-primary-500 hover:bg-primary-50 font-medium">Admin Dashboard</Link>}
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="p-2.5 text-slate-600 hover:text-primary-500 hover:bg-primary-50/50 rounded-lg transition-all">
                  <User className="w-5 h-5" />
                </Link>
              )}

              <button className="lg:hidden p-2.5 text-slate-600 hover:text-primary-500 hover:bg-primary-50/50 rounded-lg transition-all" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-800 hover:text-primary-500 rounded-lg hover:bg-primary-50">Home</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50">Shop</Link>
              {categories.map(cat => (<Link key={cat._id} to={`/products?category=${encodeURIComponent(cat.name)}`} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-500 hover:text-primary-500 rounded-lg hover:bg-primary-50 pl-7">{cat.name}</Link>))}
              <Link to="/products?sort=-createdAt" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50">New Arrivals</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50">About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-500 rounded-lg hover:bg-primary-50">Contact</Link>
              <div className="border-t border-gray-100 my-2" />
              {isAuthenticated ? (
                <><Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm text-slate-600 hover:text-primary-500 rounded-lg hover:bg-primary-50">Profile</Link><Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm text-slate-600 hover:text-primary-500 rounded-lg hover:bg-primary-50">My Orders</Link>{user?.role === 'admin' && <Link to="/admin" className="block px-3 py-2.5 text-sm text-primary-500 font-medium rounded-lg hover:bg-primary-50">Admin Dashboard</Link>}<button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg">Sign Out</button></>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm text-primary-500 font-medium rounded-lg hover:bg-primary-50">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {searchOpen && (
        <div className="search-overlay z-50 flex flex-col items-center pt-16 sm:pt-20 px-4">
          <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><X className="w-6 h-6" /></button>
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input ref={searchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-12 pr-4 py-4 text-xl border-b-2 border-primary-500 bg-transparent text-slate-800 outline-none placeholder:text-slate-400" />
            </div>
            <p className="text-sm text-slate-400 mt-4 text-center">Press Enter to search or Esc to close</p>
          </form>
        </div>
      )}
    </>
  )
}

export default Navbar