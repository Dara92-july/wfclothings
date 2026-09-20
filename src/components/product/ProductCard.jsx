import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { addToCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'

const SWIPE_THRESHOLD = 40

const ProductImageCarousel = ({ images, activeIndex, onChange, productName, onImageError }) => {
  const touchStartX = useRef(0)
  const swipeDistance = useRef(0)
  const didSwipe = useRef(false)

  const total = images.length
  const goTo = (index) => onChange(((index % total) + total) % total)

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
    swipeDistance.current = 0
    didSwipe.current = false
  }

  const handleTouchMove = (event) => {
    swipeDistance.current = event.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (Math.abs(swipeDistance.current) < SWIPE_THRESHOLD) return
    didSwipe.current = true
    goTo(activeIndex + (swipeDistance.current < 0 ? 1 : -1))
  }

  // Keep taps on the controls from following the surrounding product <Link>
  const handleControlClick = (event, index) => {
    event.preventDefault()
    event.stopPropagation()
    goTo(index)
  }

  return (
    <div
      className="absolute inset-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClickCapture={(event) => {
        if (!didSwipe.current) return
        didSwipe.current = false
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      {images.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={index === 0 ? productName : `${productName} - view ${index + 1}`}
          loading={index === 0 ? 'eager' : 'lazy'}
          onError={onImageError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => handleControlClick(event, activeIndex - 1)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 hover:bg-white transition-opacity duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(event) => handleControlClick(event, activeIndex + 1)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 hover:bg-white transition-opacity duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((src, index) => (
              <button
                key={`dot-${src}-${index}`}
                type="button"
                onClick={(event) => handleControlClick(event, index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  index === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()

  if (!product) return null

  const effectivePrice = product.effectivePrice || product.price
  const hasDiscount = product.discountPrice && product.price > product.discountPrice
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  const avgRating = product.ratings?.average || 0
  const ratingCount = product.ratings?.count || 0

  // Accept both plain URL strings and Cloudinary-style { url } objects
  const galleryImages = (product.images || [])
    .map((image) => (typeof image === 'string' ? image : image?.url))
    .filter(Boolean)
  const images = galleryImages.length > 0 ? galleryImages : [product.image || '/placeholder.png']
  const currentIndex = activeIndex < images.length ? activeIndex : 0

  const availableStock = Number(product.stockQuantity || 0) - Number(product.reservedQuantity || 0)
  const outOfStock = availableStock <= 0
  const lowStock = !outOfStock && availableStock <= Number(product.lowStockThreshold || 5)

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }))
    setAdded(true)
    toast.success('Added to cart')
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative">
      <Link
        to={`/products/${product.slug || product._id}`}
        className="block relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-50 mb-3 ring-1 ring-inset ring-slate-200/50 group-hover:ring-primary-500/30 transition-all"
      >
        {!imgError ? (
          <ProductImageCarousel
            images={images}
            activeIndex={currentIndex}
            onChange={setActiveIndex}
            productName={product.name}
            onImageError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <span className="text-4xl font-bold">WF</span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
            -{discountPercent}%
          </div>
        )}

        {outOfStock && (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full z-10">
            Out of Stock
          </div>
        )}
        {lowStock && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-amber-700 text-[11px] font-medium px-2.5 py-1 rounded-full z-10">
            Only {availableStock} left
          </div>
        )}

        {ratingCount > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 shadow-sm z-10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-700">{avgRating.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </Link>

      <div className="px-0.5">
        <div>
          <Link to={`/products/${product.slug || product._id}`} className="block">
            <h3 className="font-medium text-sm text-slate-800 truncate leading-tight hover:text-primary-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1 mb-2">
            <span className="font-bold text-base text-slate-900">₦{(Number(effectivePrice || 0) / 100).toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-slate-400 text-xs line-through">₦{(Number(product.price || 0) / 100).toLocaleString()}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock || !product.isActive}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            added
              ? 'bg-emerald-500 text-white'
              : !outOfStock && product.isActive
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className={`w-4 h-4 ${added ? 'animate-bounce' : ''}`} />
          {added ? 'Added!' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
