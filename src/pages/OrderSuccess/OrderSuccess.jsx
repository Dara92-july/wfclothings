import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../../store/slices/cartSlice'
import { register } from '../../store/slices/authSlice'
import { CheckCircle, Package, ArrowRight, ShoppingBag, User } from 'lucide-react'
import toast from 'react-hot-toast'
import paymentService from '../../services/payment.service'

const OrderSuccess = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')

  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
  const [registering, setRegistering] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['paymentVerify', reference],
    queryFn: () => paymentService.verify(reference).then(res => res.data.data),
    enabled: !!reference,
    retry: false
  })

  useEffect(() => {
    if (data?.order) {
      dispatch(clearCart())
      if (data.order.guestInfo) {
        setRegisterForm({
          name: data.order.guestInfo.name || '',
          email: data.order.guestInfo.email || '',
          password: ''
        })
      }
    }
  }, [data, dispatch])

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast.error('Please fill in all fields')
      return
    }
    setRegistering(true)
    try {
      await dispatch(register(registerForm)).unwrap()
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error(error || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Verifying your payment...</p>
      </div>
    )
  }

  if (!reference) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5"><span className="text-red-500 text-3xl font-bold">!</span></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid payment reference</h2>
        <p className="text-slate-500 mb-6">We couldn&rsquo;t find a payment reference for this order. If you believe this is an error, please contact support.</p>
        <div className="flex justify-center gap-3"><Link to="/orders" className="btn-primary">View My Orders</Link><Link to="/products" className="btn-secondary">Continue Shopping</Link></div>
      </div>
    )
  }

  if (error || !data?.order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5"><span className="text-red-500 text-3xl font-bold">!</span></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment couldn&rsquo;t be verified</h2>
        <p className="text-slate-500 mb-6">We couldn&rsquo;t confirm your payment right now. If you were charged, contact support and we&rsquo;ll sort it out.</p>
        <div className="flex justify-center gap-3"><Link to="/orders" className="btn-primary">View My Orders</Link><Link to="/products" className="btn-secondary">Continue Shopping</Link></div>
      </div>
    )
  }

  const order = data.order

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-14 h-14 text-emerald-500" />
      </div>
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
      <p className="text-slate-500 mb-1">Thank you for your purchase. Your order has been confirmed.</p>
      <p className="text-primary-500 font-semibold text-lg mb-8">Order: {order.orderNumber}</p>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 text-left">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center"><Package className="w-5 h-5 text-purple-600" /></div>
          <span className="font-semibold text-slate-900">Order Summary</span>
        </div>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />}
                <div><p className="text-sm font-medium text-slate-800">{item.name}</p><p className="text-xs text-slate-500">&times; {item.quantity}</p></div>
              </div>
              <span className="text-sm font-bold text-slate-800">₦{((item.price * item.quantity) / 100).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between">
          <span className="font-semibold text-slate-900">Total Paid</span>
          <span className="font-bold text-lg text-primary-500">₦{(order.pricing?.total / 100).toLocaleString()}</span>
        </div>
        {order.deliveryAddress && (
          <div className="border-t border-slate-200 pt-3 mt-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Delivering to</p>
            <p className="text-sm text-slate-700">{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
          </div>
        )}
      </div>

      {!isAuthenticated && !showCreateAccount && (
        <div className="bg-linear-to from-primary-50 to-primary-100 rounded-xl border border-primary-200 p-6 mb-8 text-left">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
            <span className="font-semibold text-slate-900">Create an Account</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">Track your order, view your purchase history, save addresses, and enjoy faster checkout next time.</p>
          <button onClick={() => setShowCreateAccount(true)} className="btn-primary w-full flex items-center justify-center gap-2">
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
          <Link to="/products" className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-3">Skip, continue shopping</Link>
        </div>
      )}

      {!isAuthenticated && showCreateAccount && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 text-left">
          <h3 className="font-semibold text-lg text-slate-900 mb-1">Create Your Account</h3>
          <p className="text-sm text-slate-500 mb-5">Choose a password to complete your registration.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label><input type="text" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label><input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label><input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="input-field" placeholder="At least 6 characters" minLength={6} required /></div>
            <button type="submit" disabled={registering} className="btn-primary w-full flex items-center justify-center gap-2">
              {registering ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</span> : 'Create Account'}
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/orders" className="btn-primary flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> View Orders</Link>
        <Link to="/products" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  )
}

export default OrderSuccess