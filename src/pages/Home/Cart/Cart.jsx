import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { updateQuantity, removeFromCart } from '../../../store/slices/cartSlice'

const Cart = () => {
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price / 100)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Discover something you'll love.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

    <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-6">
      Shopping Cart
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">

      {/* ================= CART ITEMS ================= */}
      <div className="space-y-4">

        {items.map((item) => (
          <div
            key={`${item.product}-${item.size}`}
            className="flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm"
          >

            {/* Product Image */}
            <div className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">

              <div className="pr-1">

                <h3 className="font-semibold text-sm sm:text-base text-slate-800 leading-tight line-clamp-2">
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Size: {item.size}
                </p>

                <p className="font-bold text-primary-500 mt-1.5 text-sm sm:text-base">
                  {formatPrice(item.price)}
                </p>

              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mt-3">

                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product,
                          size: item.size,
                          quantity: item.quantity - 1
                        })
                      )
                    }
                    className="p-1.5 sm:p-2 hover:bg-slate-50 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 sm:w-9 text-center text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product,
                          size: item.size,
                          quantity: item.quantity + 1
                        })
                      )
                    }
                    disabled={item.quantity >= item.stockQuantity}
                    className="p-1.5 sm:p-2 hover:bg-slate-50 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        productId: item.product,
                        size: item.size
                      })
                    )
                  }
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>


      {/* ================= ORDER SUMMARY ================= */}
      <div className="self-start lg:sticky lg:top-24">

        <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm">

          <h2 className="font-semibold text-lg text-slate-900 mb-5">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-3">

              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">
                  Total
                </span>

                <span className="font-bold text-lg text-primary-500">
                  {formatPrice(total)}
                </span>
              </div>

            </div>

          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full btn-primary mt-5 flex items-center justify-center gap-2"
          >
            Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/products"
            className="block text-center text-sm text-primary-800 hover:text-primary-600 mt-3 font-medium"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  </div>
)
}

export default Cart