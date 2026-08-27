import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { checkAuth } from './store/slices/authSlice'

import SplashScreen from './components/common/SplashScreen'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/layout/AdminLayout'

// Pages
import Home from './pages/Home/Home'
import ProductList from './pages/ProductList/ProductList'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Cart from './pages/Home/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import OrderSuccess from './pages/OrderSuccess/OrderSuccess'
import OrderHistory from './pages/OrderHistory/OrderHistory'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Profile from './pages/Profile/Profile'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard/Dashboard'
import AdminProducts from './pages/Admin/Products/Products'
import AdminOrders from './pages/Admin/Orders/Orders'
import AdminCustomers from './pages/Admin/Customers/Customers'
import AdminCategories from './pages/Admin/Categories/Categories'

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'

function App() {
  const dispatch = useDispatch()

  const [showSplash, setShowSplash] = useState(() => {
    try { return !sessionStorage.getItem('wf_splash_seen') } catch { return true }
  })

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  const handleSplashComplete = () => {
    try { sessionStorage.setItem('wf_splash_seen', '1') } catch { /* storage unavailable */ }
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home/>} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment/verify" element={<OrderSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>
      </Route>
    </Routes>
    </>
  )
}

export default App