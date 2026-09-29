import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  SlidersHorizontal,
  X,
  Grid3X3,
  List
} from 'lucide-react'

import productService from '../../services/product.service'
import categoryService from '../../services/category.service'
import ProductCard from '../../components/product/ProductCard'
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton'
import ErrorState from '../../components/common/ErrorState'

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // =========================
  // URL FILTERS
  // =========================

  const category = searchParams.get('category') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const inStock = searchParams.get('inStock') || ''
  const featured = searchParams.get('featured') || ''
  const page = searchParams.get('page') || '1'

  // IMPORTANT:
  // New Arrivals from Navbar sends:
  // /products?sort=-createdAt
  //
  // If there is no sort in the URL, we leave it empty.
  // That allows the Shop page to use the backend's normal ordering.
  const sortBy = searchParams.get('sort') || ''

  // =========================
  // QUERY PARAMS
  // =========================

  const queryParams = {
    category: category || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    inStock: inStock || undefined,
    featured: featured || undefined,
    page,
    search: searchQuery || undefined,
    sort: sortBy || undefined
  }

  // Remove undefined values
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === undefined) {
      delete queryParams[key]
    }
  })

  // =========================
  // PRODUCTS QUERY
  // =========================

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['products', queryParams],

    queryFn: () =>
      productService
        .getProducts(queryParams)
        .then((res) => res.data)
  })

  // =========================
  // CATEGORIES QUERY
  // =========================

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],

    queryFn: () =>
      categoryService
        .getCategories()
        .then((res) => res.data.data)
  })

  // =========================
  // UPDATE FILTER
  // =========================

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)

    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }

    // Whenever a filter changes,
    // go back to page 1.
    if (key !== 'page') {
      newParams.set('page', '1')
    }

    setSearchParams(newParams)
  }

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearchParams({})
    setSearchQuery('')
  }

  // =========================
  // DATA
  // =========================

  const products = data?.data || []
  const pagination = data?.pagination
  const categories = categoriesData || []

  const hasActiveFilters =
    category ||
    minPrice ||
    maxPrice ||
    inStock ||
    featured ||
    searchQuery

  // =========================
  // PAGE TITLE
  // =========================

  const getPageTitle = () => {
    if (featured) {
      return 'Featured Products'
    }

    if (sortBy === '-createdAt') {
      return 'New Arrivals'
    }

    if (category) {
      return category
    }

    return 'All Products'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            {getPageTitle()}
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            {pagination?.total || products.length} products
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* VIEW MODE */}

          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">

            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm'
                  : ''
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4 text-slate-600" />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm'
                  : ''
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4 text-slate-600" />
            </button>

          </div>

          {/* SORT */}

          <select
            value={sortBy}
            onChange={(e) =>
              updateFilter('sort', e.target.value)
            }
            className="input-field w-40 text-sm"
          >
            <option value="">Default</option>
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>

          {/* MOBILE FILTER BUTTON */}

          <button
            onClick={() => setShowMobileFilters(true)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

        </div>
      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <div className="flex gap-8">

        {/* =======================================
            DESKTOP SIDEBAR
        ======================================= */}

        <aside className="hidden sm:block w-56 shrink-0">

          <div className="sticky top-16 lg:top-20 space-y-6">

            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateFilter('search', searchQuery)
                  }
                }}
                placeholder="Search..."
                className="input-field pl-9 text-sm"
              />

            </div>

            {/* CATEGORIES */}

            <div>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Categories
              </h3>

              <div className="space-y-1.5">

                {/* ALL */}

                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)

                    params.delete('category')
                    params.delete('page')

                    setSearchParams(params)
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !category
                      ? 'bg-primary-50 text-primary-800 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>

                {/* CATEGORY LIST */}

                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() =>
                      updateFilter('category', cat.name)
                    }
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat.name
                        ? 'bg-primary-50 text-primary-800 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}

              </div>
            </div>

            {/* PRICE RANGE */}

            <div>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Price Range
              </h3>

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) =>
                    updateFilter('minPrice', e.target.value)
                  }
                  className="input-field text-sm w-full"
                  placeholder="Min"
                />

                <span className="text-slate-400">
                  -
                </span>

                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) =>
                    updateFilter('maxPrice', e.target.value)
                  }
                  className="input-field text-sm w-full"
                  placeholder="Max"
                />

              </div>
            </div>

            {/* IN STOCK */}

            <label className="flex items-center gap-2.5 cursor-pointer">

              <input
                type="checkbox"
                checked={inStock === 'true'}
                onChange={(e) =>
                  updateFilter(
                    'inStock',
                    e.target.checked ? 'true' : ''
                  )
                }
                className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
              />

              <span className="text-sm text-slate-700">
                In Stock Only
              </span>

            </label>

            {/* CLEAR FILTERS */}

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            )}

          </div>

        </aside>

        {/* =======================================
            MOBILE FILTER DRAWER
        ======================================= */}

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 sm:hidden">

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowMobileFilters(false)}
            />

            {/* DRAWER */}

            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 overflow-y-auto">

              <div className="flex items-center justify-between mb-6">

                <h2 className="font-semibold text-lg">
                  Filters
                </h2>

                <button
                  onClick={() =>
                    setShowMobileFilters(false)
                  }
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <div className="space-y-6">

                {/* MOBILE SEARCH */}

                <div className="relative">

                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateFilter('search', searchQuery)
                        setShowMobileFilters(false)
                      }
                    }}
                    placeholder="Search..."
                    className="input-field pl-9 text-sm"
                  />

                </div>

                {/* MOBILE CATEGORIES */}

                <div>

                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Categories
                  </h3>

                  <div className="space-y-1.5">

                    <button
                      onClick={() => {
                        const params = new URLSearchParams(
                          searchParams
                        )

                        params.delete('category')
                        params.set('page', '1')

                        setSearchParams(params)
                        setShowMobileFilters(false)
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        !category
                          ? 'bg-primary-50 text-primary-800 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      All
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          updateFilter(
                            'category',
                            cat.name
                          )

                          setShowMobileFilters(false)
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                          category === cat.name
                            ? 'bg-primary-50 text-primary-800 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}

                  </div>

                </div>

                {/* MOBILE PRICE */}

                <div>

                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Price Range
                  </h3>

                  <div className="flex items-center gap-2">

                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) =>
                        updateFilter(
                          'minPrice',
                          e.target.value
                        )
                      }
                      className="input-field text-sm w-full"
                      placeholder="Min"
                    />

                    <span className="text-slate-400">
                      -
                    </span>

                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) =>
                        updateFilter(
                          'maxPrice',
                          e.target.value
                        )
                      }
                      className="input-field text-sm w-full"
                      placeholder="Max"
                    />

                  </div>

                </div>

                {/* MOBILE STOCK */}

                <label className="flex items-center gap-2.5 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={inStock === 'true'}
                    onChange={(e) =>
                      updateFilter(
                        'inStock',
                        e.target.checked ? 'true' : ''
                      )
                    }
                    className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                  />

                  <span className="text-sm text-slate-700">
                    In Stock Only
                  </span>

                </label>

                {/* MOBILE CLEAR */}

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

        {/* =======================================
            PRODUCTS AREA
        ======================================= */}

        <div className="flex-1">

          {/* ERROR */}

          {isError ? (
            <ErrorState
              title="Couldn't load products"
              message="Please check your connection and try again."
              actionLabel="Try Again"
              onAction={refetch}
            />

          ) : isLoading ? (

            /* LOADING */

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}

            </div>

          ) : products.length === 0 ? (

            /* EMPTY */

            <div className="text-center py-20">

              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">

                <Search className="w-7 h-7 text-slate-400" />

              </div>

              <p className="text-slate-500 text-lg font-medium">
                No products found
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Try another search or browse our collections.
              </p>

              <button
                onClick={clearFilters}
                className="btn-primary mt-4"
              >
                Browse All Products
              </button>

            </div>

          ) : (

            /* PRODUCTS */

            <>

              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >

                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

              </div>

              {/* PAGINATION */}

              {pagination && pagination.pages > 1 && (

                <div className="flex items-center justify-center gap-2 mt-8">

                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => (

                      <button
                        key={i + 1}
                        onClick={() =>
                          updateFilter(
                            'page',
                            String(i + 1)
                          )
                        }
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          Number(page) === i + 1
                            ? 'bg-primary-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {i + 1}
                      </button>

                    )
                  )}

                </div>

              )}

            </>

          )}

        </div>

      </div>

    </div>
  )
}

export default ProductList