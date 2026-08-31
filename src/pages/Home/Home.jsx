import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import productService from '../../services/product.service'
import categoryService from '../../services/category.service'
import ProductCard from '../../components/product/ProductCard'
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton'
import ErrorState from '../../components/common/ErrorState'

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const sliderRef = useRef(null)

  const { data: allProducts, isLoading, isError, refetch } = useQuery({
    queryKey: ['homeProducts'],
    queryFn: () => productService.getProducts({ limit: 50 }).then(res => res.data.data),
    retry: 2,
    staleTime: 30000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories().then(res => res.data.data),
    retry: 2,
    staleTime: 30000
  })

  const { data: featuredProducts } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productService.getFeatured().then(res => res.data.data)
  })

  const { data: newArrivals, isLoading: newArrivalsLoading } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: () => productService.getProducts({ limit: 10, sort: '-createdAt' }).then(res => res.data.data)
  })

  const categories = categoriesData || []
  const products = allProducts || []
  const displayProducts = activeCategory === 'all' ? products : products.filter(p =>
    p.category?._id === activeCategory || p.category === activeCategory
  )

  const scrollSlider = (dir) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8
      sliderRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div>
      {/* ====== HERO BANNER ====== */}
      <section className="relative h-[55vh] sm:h-[65vh] lg:h-[70vh] min-h-95 sm:min-h-115 overflow-hidden">
        <div className="absolute inset-0">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="https://res.cloudinary.com/dzo14hk18/image/upload/f_auto,q_auto,c_fill,g_auto,w_600,h_800/v1784644210/hero_e2kncs.png"
            />
            <img
              src="https://res.cloudinary.com/dzo14hk18/image/upload/f_auto,q_auto,c_fill,g_auto,w_1920/v1784644210/hero_e2kncs.png"
              alt="Way Forward collection"
              className="w-full h-full object-cover object-[center_30%] sm:object-[center_30%] object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent sm:from-black/60 sm:via-black/30 sm:to-transparent from-black/50 via-black/20 to-black/10" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white rounded-full px-4 py-1.5 text-sm font-medium mb-5 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> Made in Lagos <span className="text-white/60">🇳🇬</span>
            </div>
            <h1 className="text-white leading-none mb-4" style={{ fontSize: 'clamp(40px, 10vw, 72px)', fontWeight: 900, letterSpacing: '-2px' }}>
              WAY FORWARD
            </h1>
            <p className="text-lg sm:text-xl text-white/80 font-medium mb-2">Streetwear for the fearless.</p>
            <p className="text-sm sm:text-base text-white/50 mb-8 max-w-md leading-relaxed">
              &ldquo;Wear the mindset. No backward steps. Only forward moves.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 bg-primary-500 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-primary-600 transition-all shadow-xl hover:shadow-primary-500/25">
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/products?sort=-createdAt" className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white hover:text-slate-900 transition-all">
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CATEGORY NAVIGATION ====== */}
      <section className="sticky top-16 sm:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ALL
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat._id
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRODUCTS GRID ====== */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {activeCategory === 'all' ? 'All Products' : categories.find(c => c._id === activeCategory)?.name || 'Products'}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{isLoading ? 'Loading…' : `${displayProducts.length} items`}</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <ErrorState
              title="Couldn't load products"
              message="Please check your connection and try again."
              actionLabel="Try Again"
              onAction={refetch}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5" key={activeCategory}>
              {displayProducts.length > 0 ? (
                displayProducts.slice(0, 8).map(product => (
                  <div key={product._id} className="animate-fadeIn">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-slate-300">WF</span>
                  </div>
                  <p className="text-slate-500 font-medium">No products in this category yet</p>
                  <p className="text-sm text-slate-400 mt-1">Check back soon for new drops</p>
                </div>
              )}
            </div>
          )}

          {displayProducts.length > 8 && (
            <div className="text-center mt-8">
              <Link to={`/products${activeCategory !== 'all' ? `?category=${encodeURIComponent(categories.find(c => c._id === activeCategory)?.name || '')}` : ''}`} className="btn-secondary inline-flex items-center gap-2">
                View All {displayProducts.length} Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ====== NEW ARRIVALS ====== */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-700 rounded-full px-3 py-1 text-[11px] font-semibold mb-3">
                Fresh Drops
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">New Arrivals</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollSlider(-1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollSlider(1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={sliderRef} className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {newArrivalsLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="shrink-0 w-55 sm:w-55 snap-start">
                    <ProductCardSkeleton />
                  </div>
                ))
              : (newArrivals || []).map(product => (
                  <div key={product._id} className="shrink-0 w-55 sm:w-55 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ====== BEST SELLERS ====== */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-3 py-1 text-[11px] font-semibold mb-3">
                  Top Rated
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">Best Sellers</h2>
              </div>
              <Link to="/products?featured=true" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredProducts.slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== CTA ====== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tighter">MEMBERS ONLY</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">More than a store. Become part of the Way Forward movement. Early access, exclusive drops, member pricing.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-primary-500 transition-all shadow-xl">Join the Movement <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/products" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-full text-sm hover:border-primary-500 hover:text-primary-500 transition-all">Browse Collection</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home