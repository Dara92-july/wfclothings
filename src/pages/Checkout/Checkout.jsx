import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, CreditCard, Truck, ArrowRight, Package, Lock, User, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import orderService from '../../services/order.service'
import paymentService from '../../services/payment.service'

const Checkout = () => {
  const { items } = useSelector((state) => state.cart)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [guestMode, setGuestMode] = useState(!!isAuthenticated)
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' })
  const [formData, setFormData] = useState({
    street: user?.addresses?.[0]?.street || '', city: user?.addresses?.[0]?.city || '', state: user?.addresses?.[0]?.state || '', country: 'Nigeria',
  })
  const [loading, setLoading] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = subtotal > 500000 ? 0 : 250000
  const total = subtotal + deliveryFee

  const formatPrice = (price) => `₦${(price / 100).toLocaleString()}`

  const handleCreateOrder = async () => {
    if (!formData.street || !formData.city || !formData.state) { toast.error('Please fill in all delivery details'); return }
    if (!isAuthenticated && (!guestInfo.name || !guestInfo.email)) { toast.error('Please fill in your name and email'); return }
    setLoading(true)
    try {
      const orderPayload = {
        items: items.map(item => ({ product: item.product, quantity: item.quantity, size: item.size })),
        deliveryAddress: formData
      }
      if (!isAuthenticated) {
        orderPayload.guestInfo = guestInfo
      }
      const response = await orderService.createOrder(orderPayload)
      const order = response.data.data
      const paymentResponse = await paymentService.initialize(order._id)
      window.location.href = paymentResponse.data.data.authorizationUrl
    } catch (error) {
      toast.error(error.response?.data?.error || 'Checkout failed')
      setLoading(false)
    }
  }

  if (items.length === 0) { navigate('/cart'); return null }

  if (!isAuthenticated && !guestMode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Choose how you'd like to proceed with your order.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <button onClick={() => setGuestMode(true)} className="flex-1 btn-primary py-4 text-base flex items-center justify-center gap-2">
            <User className="w-5 h-5" /> Continue as Guest
          </button>
          <Link to="/login?redirect=/checkout" className="flex-1 btn-secondary py-4 text-base flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" /> Sign In
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-6">Guest checkout is quick and easy. No account required.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {!isAuthenticated && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center"><User className="w-5 h-5 text-primary-500" /></div>
                <h2 className="font-semibold text-lg text-slate-900">Your Information</h2>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label><input type="text" value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} className="input-field" placeholder="John Doe" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label><input type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} className="input-field" placeholder="john@example.com" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label><input type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })} className="input-field" placeholder="+234 800 000 0000" /></div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary-500" /></div>
              <h2 className="font-semibold text-lg text-slate-900">Delivery Information</h2>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address</label><input type="text" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} className="input-field" placeholder="123 Main Street" required /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">City</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="input-field" placeholder="Lagos" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">State</label><input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="input-field" placeholder="Lagos State" required /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label><input type="text" value={formData.country} disabled className="input-field bg-slate-50 text-slate-500" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center"><CreditCard className="w-5 h-5 text-emerald-600" /></div>
              <h2 className="font-semibold text-lg text-slate-900">Payment Method</h2>
            </div>
            <div className="flex items-center gap-3 p-4 border border-primary-200 bg-primary-50 rounded-xl">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-primary-800 text-sm shadow-sm">PS</div>
              <div className="flex-1"><p className="font-semibold text-slate-800 text-sm">Paystack</p><p className="text-xs text-slate-500">Card, Bank Transfer, USSD, Mobile Money</p></div>
              <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-primary-500" /></div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3"><Lock className="w-3 h-3" /> Secured by Paystack</div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-16 lg:top-20">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center"><Package className="w-5 h-5 text-purple-600" /></div>
              <h2 className="font-semibold text-lg text-slate-900">Order Summary</h2>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.product}-${item.size}`} className="flex gap-3 p-2.5 bg-slate-50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  <div className="grow min-w-0"><p className="text-sm font-medium text-slate-800 truncate">{item.name}</p><p className="text-xs text-slate-500">Size: {item.size} &times; {item.quantity}</p><p className="text-sm font-bold text-primary-500 mt-0.5">{formatPrice(item.price * item.quantity)}</p></div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Delivery</span><span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200"><span className="text-slate-900">Total</span><span className="text-primary-500">{formatPrice(total)}</span></div>
            </div>
            <button onClick={handleCreateOrder} disabled={loading} className="w-full btn-primary mt-6 flex items-center justify-center gap-2">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</span> : <>Pay {formatPrice(total)} <ArrowRight className="w-5 h-5" /></>}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 justify-center"><Truck className="w-3.5 h-3.5" /> Free delivery on orders over &#x20A6;5,000</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
