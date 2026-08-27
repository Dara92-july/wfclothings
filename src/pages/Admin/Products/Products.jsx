import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, X, Package, Image as ImageIcon } from 'lucide-react'
import productService from '../../../services/product.service'
import categoryService from '../../../services/category.service'
import uploadService from '../../../services/upload.service'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

const [formData, setFormData] = useState({
  name: '', description: '', price: '', discountPrice: '',
  stockQuantity: '', category: '', sku: '',
  featured: false, images: []
})

  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => productService.getProducts({ limit: 100 }).then(res => res.data.data)
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories().then(res => res.data.data)
  })

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts'])
      toast.success('Product created successfully')
      closeDrawer()
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Failed to create product')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts'])
      toast.success('Product updated successfully')
      closeDrawer()
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Failed to update product')
  })

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts'])
      toast.success('Product deleted')
    }
  })

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))
      const response = await uploadService.uploadImages(formData)
      const newImages = response.data.data.images
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }))
      toast.success('Images uploaded')
    } catch {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

const handleSubmit = (e) => {
  e.preventDefault()
  const payload = {
    name: formData.name,
    description: formData.description,
    price: Number(formData.price) * 100,
    discountPrice: formData.discountPrice ? Number(formData.discountPrice) * 100 : undefined,
    stockQuantity: Number(formData.stockQuantity),
    category: formData.category,
    sku: formData.sku,
    images: formData.images,
    featured: formData.featured
  }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const openDrawer = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: String(product.price / 100),
        discountPrice: product.discountPrice ? String(product.discountPrice / 100) : '',
        stockQuantity: String(product.stockQuantity),
        category: product.category?._id || product.category,
        sku: product.sku,
        featured: product.featured,
        images: product.images || []
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '', description: '', price: '', discountPrice: '',
        stockQuantity: '', category: '', sku: '',
        featured: false, images: []
      })
    }
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingProduct(null)
  }

  const products = data?.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const categories = categoriesData || []

  const formatPrice = (price) => `₦${(price / 100).toLocaleString()}`

  const getStockBarColor = (qty) => {
    if (qty === 0) return 'bg-red-500'
    if (qty < 10) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-9"
          />
        </div>
        <button onClick={() => openDrawer()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No products found</p>
          <button onClick={() => openDrawer()} className="btn-primary mt-4">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="text-center py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]?.url || product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate max-w-50">{product.name}</p>
                          {product.featured && <span className="badge-info text-[10px]">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 font-mono">{product.sku}</td>
                    <td className="text-right py-3 px-4">
                      <span className="text-sm font-bold text-slate-800">{formatPrice(product.effectivePrice || product.price)}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-slate-400 line-through ml-1">{formatPrice(product.price)}</span>
                      )}
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getStockBarColor(product.stockQuantity)}`}
                            style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${product.stockQuantity < 10 ? 'text-amber-600' : 'text-slate-500'}`}>
                          {product.stockQuantity}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.isActive ? 'badge-success' : 'badge-error'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openDrawer(product)} className="btn-ghost p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteMutation.mutate(product._id)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={closeDrawer} />
          <div className="drawer-panel animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-lg text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={closeDrawer} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field h-24 resize-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (₦)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Price (₦)</label>
                  <input type="number" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock Quantity</label>
                  <input type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="input-field" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Images</label>
                <div className="flex items-center gap-3 mb-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">\n                    <ImageIcon className="w-4 h-4" />
                    Upload Images
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  {uploading && <span className="text-sm text-slate-400">Uploading...</span>}
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100">
                        <img src={img?.url || img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">Featured Product</span>
              </label>
              <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
                <button type="button" onClick={closeDrawer} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminProducts
