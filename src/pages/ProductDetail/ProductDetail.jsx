import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { Star, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw, ChevronLeft, X } from 'lucide-react'
import productService from '../../services/product.service'
import { addToCart } from '../../store/slices/cartSlice'
import ReviewSection from '../../components/review/ReviewSection'
import ErrorState from '../../components/common/ErrorState'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProduct(slug).then(res => res.data.data)
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="bg-slate-200 rounded-xl h-96" />
          <div className="space-y-4"><div className="bg-slate-200 h-8 rounded w-3/4" /><div className="bg-slate-200 h-4 rounded w-1/2" /><div className="bg-slate-200 h-8 rounded w-1/3" /><div className="bg-slate-200 h-32 rounded" /></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState
          title="Couldn't load this product"
          message="Please check your connection and try again."
          actionLabel="Try Again"
          onAction={refetch}
        />
      </div>
    )
  }

  const product = data
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-slate-300">WF</span>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Product not found</h2>
      <p className="text-sm text-slate-500 mb-6">This product may have been removed or is no longer available.</p>
      <button onClick={() => navigate('/products')} className="btn-primary">Continue Shopping</button>
    </div>
  )

  const sizeAttribute = product.attributes?.find(a => a.key === 'size')
  const sizes = sizeAttribute?.values || ['M', 'L', 'XL', 'XXL']
  const selectedSizeValue = selectedSize || sizes[0]
  const effectivePrice = product.effectivePrice || product.price
  const hasDiscount = product.discountPrice && product.price > product.discountPrice
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0
  const formatPrice = (price) => `₦${(price / 100).toLocaleString()}`
  const availableStock = (product.stockQuantity || 0) - (product.reservedQuantity || 0)
  const outOfStock = availableStock <= 0

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity, size: selectedSizeValue }))
    toast.success('Added to cart!')
  }

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity, size: selectedSizeValue }))
    navigate('/checkout')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-3">
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-zoom-in" onClick={() => setShowLightbox(true)}>
            <img src={product.images?.[selectedImage]?.url || product.images?.[selectedImage]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images?.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${selectedImage === idx ? 'border-primary-500' : 'border-transparent hover:border-slate-200'}`}>
                  <img src={img?.url || img} alt="" className="w-full h-full object-cover" />
                </button>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < (product.ratings?.average || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}</div>
              <span className="text-sm text-slate-500">({product.ratings?.count || 0} reviews)</span>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-500 font-display">{formatPrice(effectivePrice)}</span>
            {hasDiscount && <><span className="text-lg text-slate-400 line-through">{formatPrice(product.price)}</span><span className="badge-sale text-xs">-{discountPercent}% OFF</span></>}
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">{product.description}</p>
          {sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
              <div className="flex gap-2">{sizes.map(size => <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-lg font-medium text-sm border-2 transition-all ${selectedSizeValue === size ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>{size}</button>)}</div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-slate-50 transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-slate-50 transition-colors" disabled={quantity >= product.stockQuantity}><Plus className="w-4 h-4" /></button>
              </div>
<span className={`text-sm ${availableStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{availableStock > 0 ? `${availableStock} available` : 'Out of Stock'}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAddToCart} disabled={outOfStock} className="flex-1 btn-secondary flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> {outOfStock ? 'Out of Stock' : 'Add to Cart'}</button>
              <button onClick={handleBuyNow} disabled={outOfStock} className="flex-1 btn-primary">{outOfStock ? 'Out of Stock' : 'Buy Now'}</button>
            </div>
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-200">
            <div className="text-center p-3 bg-slate-50 rounded-lg"><Truck className="w-5 h-5 mx-auto text-primary-500 mb-1" /><p className="text-[11px] text-slate-600 font-medium">Free Delivery</p></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><Shield className="w-5 h-5 mx-auto text-primary-500 mb-1" /><p className="text-[11px] text-slate-600 font-medium">Secure Payment</p></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><RefreshCw className="w-5 h-5 mx-auto text-primary-500 mb-1" /><p className="text-[11px] text-slate-600 font-medium">7-Day Returns</p></div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl">
        <ReviewSection productId={product._id} initialReviews={product.reviews} />
      </div>
      {showLightbox && product.images?.[selectedImage] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 text-white/60 hover:text-white"><X className="w-8 h-8" /></button>
          <img src={product.images[selectedImage]?.url || product.images[selectedImage]} alt="" className="max-w-full max-h-[90vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default ProductDetail
