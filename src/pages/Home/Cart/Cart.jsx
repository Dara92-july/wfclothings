import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import { updateQuantity, removeFromCart } from '../../../store/slices/cartSlice'

const Cart = () => {
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = subtotal > 500000 ? 0 : 250000
  const total = subtotal + deliveryFee
  const freeDeliveryRemaining = subtotal < 500000 ? 500000 - subtotal : 0
  const deliveryProgress = subtotal > 0 ? Math.min((subtotal / 500000) * 100, 100) : 0

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price / 100)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Discover something you&rsquo;ll love.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-6">Shopping Cart</h1>

      {subtotal < 500000 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">Add {formatPrice(freeDeliveryRemaining)} more for free delivery!</p>
          </div>
          <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${deliveryProgress}%` }} />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={`${item.product}-${item.size}`} className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="grow min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm md:text-base truncate">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Size: {item.size}</p>
                <p className="font-bold text-primary-500 mt-1 text-sm md:text-base">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => dispatch(removeFromCart({ productId: item.product, size: item.size }))} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button onClick={() => dispatch(updateQuantity({ productId: item.product, size: item.size, quantity: item.quantity - 1 }))} className="p-1.5 hover:bg-slate-50 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ productId: item.product, size: item.size, quantity: item.quantity + 1 }))} className="p-1.5 hover:bg-slate-50 transition-colors" disabled={item.quantity >= item.stockQuantity}><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-16 lg:top-20">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium text-slate-800">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : 'text-slate-800'}>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span></div>
              <div className="border-t border-slate-100 pt-3 mt-3"><div className="flex justify-between"><span className="font-semibold text-slate-900">Total</span><span className="font-bold text-lg text-primary-500">{formatPrice(total)}</span></div></div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary mt-6 flex items-center justify-center gap-2">Checkout <ArrowRight className="w-4 h-4" /></button>
            <Link to="/products" className="block text-center text-sm text-primary-800 hover:text-primary-600 mt-3 font-medium">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
