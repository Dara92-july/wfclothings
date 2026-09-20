
import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { addToCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { getSwipedIndex, wrapIndex } from './imageCarousel'

const ProductImageCarousel = ({
  images,
  activeIndex,
  onChange,
  productName,
  onImageError,
  onImageClick
}) => {
  const dragStartX = useRef(null)
  const currentX = useRef(null)
  const isDragging = useRef(false)

  const total = images.length
  const canSwipe = total > 1

  const goTo = (index) => {
    if (!canSwipe) return

    const nextIndex = wrapIndex(index, total)

    if (nextIndex !== activeIndex) {
      onChange(nextIndex)
    }
  }

  const handlePointerDown = (event) => {
    if (!canSwipe) return

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    dragStartX.current = event.clientX
    currentX.current = event.clientX
    isDragging.current = false

    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (dragStartX.current === null || !canSwipe) {
      return
    }

    currentX.current = event.clientX

    const distance =
      currentX.current - dragStartX.current

    if (Math.abs(distance) > 10) {
      isDragging.current = true
    }
  }

  const handlePointerUp = (event) => {
    if (dragStartX.current === null || !canSwipe) {
      return
    }

    const distance =
      currentX.current - dragStartX.current

    if (isDragging.current && Math.abs(distance) >= 40) {
      const nextIndex = getSwipedIndex(
        activeIndex,
        distance,
        total
      )

      onChange(nextIndex)
    } else if (!isDragging.current) {
      onImageClick?.()
    }

    dragStartX.current = null
    currentX.current = null
    isDragging.current = false

    event.currentTarget.releasePointerCapture?.(
      event.pointerId
    )
  }

  const handlePointerCancel = (event) => {
    dragStartX.current = null
    currentX.current = null
    isDragging.current = false

    event.currentTarget.releasePointerCapture?.(
      event.pointerId
    )
  }

  const handlePrevious = (event) => {
    event.preventDefault()
    event.stopPropagation()

    goTo(activeIndex - 1)
  }

  const handleNext = (event) => {
    event.preventDefault()
    event.stopPropagation()

    goTo(activeIndex + 1)
  }

  const handleDotClick = (event, index) => {
    event.preventDefault()
    event.stopPropagation()

    goTo(index)
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden z-10 ${
        canSwipe
          ? 'cursor-grab active:cursor-grabbing touch-pan-y select-none'
          : 'cursor-pointer'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* Images */}
      {images.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={
            index === 0
              ? productName
              : `${productName} - view ${index + 1}`
          }
          loading={index < 2 ? 'eager' : 'lazy'}
          draggable={false}
          onError={onImageError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            index === activeIndex
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        />
      ))}

      {/* Controls */}
      {canSwipe && (
        <>
          {/* Previous */}
          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={handlePrevious}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-slate-800 shadow-md ring-1 ring-slate-900/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next */}
          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-slate-800 shadow-md ring-1 ring-slate-900/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full bg-slate-900/60 px-2.5 py-1.5 backdrop-blur-sm">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onPointerDown={(event) => {
                  event.stopPropagation()
                }}
                onClick={(event) =>
                  handleDotClick(event, index)
                }
                aria-label={`Go to image ${index + 1}`}
                aria-current={
                  index === activeIndex
                    ? 'true'
                    : 'false'
                }
                className={`rounded-full transition-all duration-200 ${
                  index === activeIndex
                    ? 'w-2.5 h-2.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
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
  const navigate = useNavigate()

  if (!product) return null

  const effectivePrice =
    product.effectivePrice || product.price

  const hasDiscount =
    product.discountPrice &&
    product.price > product.discountPrice

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) /
          product.price) *
          100
      )
    : 0

  const avgRating =
    product.ratings?.average || 0

  const ratingCount =
    product.ratings?.count || 0

  // Supports both:
  // product.images = ['image-url']
  // product.images = [{ url: 'image-url' }]
  const galleryImages = (product.images || [])
    .map((image) => image?.url || image)
    .filter(Boolean)

  const images =
    galleryImages.length > 0
      ? galleryImages
      : [product.image || '/placeholder.png']

  const currentIndex =
    activeIndex < images.length
      ? activeIndex
      : 0

  const availableStock =
    Number(product.stockQuantity || 0) -
    Number(product.reservedQuantity || 0)

  const outOfStock =
    availableStock <= 0

  const lowStock =
    !outOfStock &&
    availableStock <=
      Number(product.lowStockThreshold || 5)

  const productPath =
    `/products/${product.slug || product._id}`

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity: 1
      })
    )

    setAdded(true)
    toast.success('Added to cart')

    setTimeout(() => {
      setAdded(false)
    }, 1500)
  }

  const handleImageClick = () => {
    navigate(productPath)
  }

  return (
    <div className="group relative">

      {/* Product Image */}
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-50 mb-3 ring-1 ring-inset ring-slate-200/50 group-hover:ring-primary-500/30 transition-all">

        {!imgError ? (
          <ProductImageCarousel
            images={images}
            activeIndex={currentIndex}
            onChange={setActiveIndex}
            productName={product.name}
            onImageError={() => setImgError(true)}
            onImageClick={handleImageClick}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-slate-300 cursor-pointer"
            onClick={handleImageClick}
          >
            <span className="text-4xl font-bold">
              WF
            </span>
          </div>
        )}

        {/* Discount */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-20 pointer-events-none">
            -{discountPercent}%
          </div>
        )}

        {/* Out of Stock */}
        {outOfStock && (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full z-20 pointer-events-none">
            Out of Stock
          </div>
        )}

        {/* Low Stock */}
        {lowStock && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-amber-700 text-[11px] font-medium px-2.5 py-1 rounded-full z-20 pointer-events-none">
            Only {availableStock} left
          </div>
        )}

        {/* Rating */}
        {ratingCount > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 shadow-sm z-20 pointer-events-none">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />

            <span className="text-[11px] font-semibold text-slate-700">
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none z-20" />

      </div>

      {/* Product Information */}
      <div className="px-0.5">

        {/* Product Name */}
        <Link
          to={productPath}
          className="block"
        >
          <h3 className="font-medium text-sm text-slate-800 truncate leading-tight hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1 mb-2">
          <span className="font-bold text-base text-slate-900">
            ₦
            {(
              Number(effectivePrice || 0) / 100
            ).toLocaleString()}
          </span>

          {hasDiscount && (
            <span className="text-slate-400 text-xs line-through">
              ₦
              {(
                Number(product.price || 0) / 100
              ).toLocaleString()}
            </span>
          )}
        </div>

        {/* Add To Cart */}
        <button
          onClick={handleAddToCart}
          disabled={
            outOfStock ||
            !product.isActive
          }
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            added
              ? 'bg-emerald-500 text-white'
              : !outOfStock && product.isActive
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart
            className={`w-4 h-4 ${
              added ? 'animate-bounce' : ''
            }`}
          />

          {added
            ? 'Added!'
            : outOfStock
            ? 'Out of Stock'
            : 'Add to Cart'}
        </button>

      </div>
    </div>
  )
}

export default ProductCard

