import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { addToCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { getSwipedIndex } from './imageCarousel'

const ProductImageCarousel = ({
  images,
  activeIndex,
  onChange,
  productName,
  onImageError,
  swipeRef,
}) => {
  const dragStartX = useRef(null)
  const currentX = useRef(0)
  const isDragging = useRef(false)

  const total = images.length
  const canSwipe = total > 1

  const goTo = (index) => {
    if (total === 0) return

    const clampedIndex = Math.max(
      0,
      Math.min(index, total - 1)
    )

    if (clampedIndex !== activeIndex) {
      onChange(clampedIndex)
    }
  }

  const nextImage = () => {
    goTo(activeIndex + 1)
  }

  const previousImage = () => {
    goTo(activeIndex - 1)
  }

  // =========================================
  // POINTER EVENTS
  // =========================================

  const handlePointerDown = (event) => {
    if (!canSwipe) return

    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    dragStartX.current = event.clientX
    currentX.current = event.clientX
    isDragging.current = false

    if (swipeRef) {
      swipeRef.current = false
    }
  }

  const handlePointerMove = (event) => {
    if (
      dragStartX.current === null ||
      !canSwipe
    ) {
      return
    }

    const delta =
      event.clientX - currentX.current

    if (Math.abs(delta) > 10) {
      isDragging.current = true

      if (swipeRef) {
        swipeRef.current = true
      }
    }

    currentX.current = event.clientX
  }

  const handlePointerUp = () => {
    if (
      dragStartX.current === null ||
      !canSwipe
    ) {
      return
    }

    const delta =
      currentX.current - dragStartX.current

    dragStartX.current = null

    if (isDragging.current) {
      const nextIndex = getSwipedIndex(
        activeIndex,
        delta,
        total
      )

      goTo(nextIndex)
    }

    isDragging.current = false
  }

  // =========================================
  // TOUCH EVENTS
  // =========================================

  const handleTouchStart = (event) => {
    if (!canSwipe) return

    dragStartX.current =
      event.touches[0].clientX

    currentX.current =
      event.touches[0].clientX

    isDragging.current = false

    if (swipeRef) {
      swipeRef.current = false
    }
  }

  const handleTouchMove = (event) => {
    if (
      dragStartX.current === null ||
      !canSwipe
    ) {
      return
    }

    const currentTouchX =
      event.touches[0].clientX

    const delta =
      currentTouchX - dragStartX.current

    if (Math.abs(delta) > 10) {
      isDragging.current = true

      if (swipeRef) {
        swipeRef.current = true
      }
    }

    currentX.current = currentTouchX
  }

  const handleTouchEnd = () => {
    if (
      dragStartX.current === null ||
      !canSwipe
    ) {
      return
    }

    const delta =
      currentX.current - dragStartX.current

    dragStartX.current = null

    if (
      isDragging.current &&
      Math.abs(delta) >= 40
    ) {
      const nextIndex = getSwipedIndex(
        activeIndex,
        delta,
        total
      )

      goTo(nextIndex)
    }

    isDragging.current = false
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${
        canSwipe
          ? 'cursor-grab active:cursor-grabbing'
          : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: canSwipe
          ? 'pan-y'
          : 'auto',
      }}
    >
      {/* =========================================
          PRODUCT IMAGES
      ========================================= */}
      {images.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={
            index === 0
              ? productName
              : `${productName} - view ${index + 1}`
          }
          loading={
            index < 2 ? 'eager' : 'lazy'
          }
          draggable={false}
          onError={() => onImageError(index)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            index === activeIndex
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        />
      ))}

      {/* =========================================
          ARROWS + DOTS
      ========================================= */}
      {total > 1 && (
        <>
          {/* Previous */}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              previousImage()
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-slate-800 shadow-md ring-1 ring-slate-900/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              nextImage()
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-slate-800 shadow-md ring-1 ring-slate-900/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 rounded-full bg-slate-900/60 px-2 py-1.5 backdrop-blur-sm"
          >
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  goTo(index)
                }}
                aria-label={`Go to image ${
                  index + 1
                }`}
                className={`rounded-full w-2.5 h-2.5 transition-colors ${
                  index === activeIndex
                    ? 'bg-white'
                    : 'bg-white/40'
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
  const [added, setAdded] = useState(false)
  const [activeIndex, setActiveIndex] =
    useState(0)

  const [brokenImages, setBrokenImages] =
    useState([])

  const swipeRef = useRef(false)

  const dispatch = useDispatch()

  if (!product) return null

  // =========================================
  // PRICE
  // =========================================

  const effectivePrice =
    product.effectivePrice || product.price

  const hasDiscount =
    product.discountPrice &&
    product.price > product.discountPrice

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price -
          product.discountPrice) /
          product.price) *
          100
      )
    : 0

  // =========================================
  // RATINGS
  // =========================================

  const avgRating =
    product.ratings?.average || 0

  const ratingCount =
    product.ratings?.count || 0

  // =========================================
  // IMAGES
  // =========================================

  const getImageUrl = (image) => {
    if (!image) return null

    if (typeof image === 'string') {
      return image
    }

    if (typeof image === 'object') {
      return (
        image.url ||
        image.secure_url ||
        image.src ||
        null
      )
    }

    return null
  }

  const galleryImages = (
    product.images || []
  )
    .map(getImageUrl)
    .filter(Boolean)

  const fallbackImage =
    getImageUrl(product.image) ||
    '/placeholder.png'

  const images =
    galleryImages.length > 0
      ? galleryImages
      : [fallbackImage]

  // Remove broken images
  const validImages = images.filter(
    (_, index) =>
      !brokenImages.includes(index)
  )

  const finalImages =
    validImages.length > 0
      ? validImages
      : ['/placeholder.png']

  const currentIndex =
    activeIndex < finalImages.length
      ? activeIndex
      : 0

  // =========================================
  // STOCK
  // =========================================

  const availableStock =
    Number(product.stockQuantity || 0) -
    Number(product.reservedQuantity || 0)

  const outOfStock =
    availableStock <= 0

  const lowStock =
    !outOfStock &&
    availableStock <=
      Number(
        product.lowStockThreshold || 5
      )

  // =========================================
  // IMAGE ERROR
  // =========================================

  const handleImageError = (index) => {
    setBrokenImages((previous) => {
      if (previous.includes(index)) {
        return previous
      }

      return [...previous, index]
    })
  }

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    )

    setAdded(true)

    toast.success('Added to cart')

    setTimeout(() => {
      setAdded(false)
    }, 1500)
  }

  // =========================================
  // PRODUCT URL
  // =========================================

  const productUrl = `/products/${
    product.slug || product._id
  }`

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="group relative">

      {/* =====================================
          IMAGE
      ===================================== */}
      <Link
        to={productUrl}
        onClick={(event) => {
          if (swipeRef.current) {
            swipeRef.current = false
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        className="block relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 mb-3 ring-1 ring-inset ring-slate-200/50 group-hover:ring-primary-500/30 transition-all"
      >
        <ProductImageCarousel
          images={finalImages}
          activeIndex={currentIndex}
          onChange={setActiveIndex}
          productName={product.name}
          onImageError={handleImageError}
          swipeRef={swipeRef}
        />

        {/* =====================================
            DISCOUNT
        ===================================== */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-20">
            -{discountPercent}%
          </div>
        )}

        {/* =====================================
            OUT OF STOCK
        ===================================== */}
        {outOfStock && (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full z-20">
            Out of Stock
          </div>
        )}

        {/* =====================================
            LOW STOCK
        ===================================== */}
        {lowStock && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-amber-700 text-[11px] font-medium px-2.5 py-1 rounded-full z-20">
            Only {availableStock} left
          </div>
        )}

        {/* =====================================
            RATING
        ===================================== */}
        {ratingCount > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 shadow-sm z-20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />

            <span className="text-[11px] font-semibold text-slate-700">
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </Link>

      {/* =====================================
          PRODUCT INFO
      ===================================== */}
      <div className="px-0.5">

        {/* Product Name */}
        <Link
          to={productUrl}
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
              Number(effectivePrice || 0) /
              100
            ).toLocaleString()}
          </span>

          {hasDiscount && (
            <span className="text-slate-400 text-xs line-through">
              ₦
              {(
                Number(product.price || 0) /
                100
              ).toLocaleString()}
            </span>
          )}
        </div>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            outOfStock ||
            !product.isActive
          }
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            added
              ? 'bg-emerald-500 text-white'
              : !outOfStock &&
                product.isActive
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart
            className={`w-4 h-4 ${
              added
                ? 'animate-bounce'
                : ''
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