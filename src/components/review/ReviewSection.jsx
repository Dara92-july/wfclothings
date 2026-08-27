import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Star, MessageSquare, ChevronDown, User, Clock } from 'lucide-react'
import orderService from '../../services/order.service'
import reviewService from '../../services/review.service'
import toast from 'react-hot-toast'

const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)} className="p-0.5 group">
        <Star className={`w-7 h-7 transition-colors ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 group-hover:text-amber-300'}`} />
      </button>
    ))}
  </div>
)

const ReviewSection = ({ productId, initialReviews }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [selectedOrder, setSelectedOrder] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: ordersData } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderService.getMyOrders().then(res => res.data.data),
    enabled: isAuthenticated && showForm
  })

  const deliverableOrders = ordersData?.filter(o =>
    o.status === 'delivered' &&
    !o.isReviewed &&
    o.items.some(item => (item.product?._id || item.product)?.toString() === productId)
  ) || []

  const { data: fetchedReviews, refetch } = useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => reviewService.getProductReviews(productId).then(res => res.data.data),
    enabled: false
  })

  const reviews = fetchedReviews || initialReviews || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) { toast.error('Please select a rating'); return }
    if (!comment.trim()) { toast.error('Please write a review'); return }
    if (!selectedOrder) { toast.error('Please select an order'); return }

    setSubmitting(true)
    try {
      await reviewService.createReview({
        productId,
        orderId: selectedOrder,
        rating,
        title,
        comment
      })
      toast.success('Review submitted!')
      setShowForm(false)
      setRating(0)
      setTitle('')
      setComment('')
      setSelectedOrder('')
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="border-t border-slate-200 pt-10 mt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-600" />
          <h2 className="font-display text-xl font-bold text-slate-900">Customer Reviews</h2>
          <span className="text-sm text-slate-400">({reviews.length})</span>
        </div>
        {isAuthenticated && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {deliverableOrders.length === 0 ? (
              <p className="text-sm text-slate-500">You need a delivered order containing this product to leave a review.</p>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
                  <div className="relative">
                    <select value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)} className="input-field appearance-none pr-10" required>
                      <option value="">Select an order</option>
                      {deliverableOrders.map(o => (
                        <option key={o._id} value={o._id}>{o.orderNumber} — {formatDate(o.createdAt)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Rating</label>
                  <StarInput value={rating} onChange={setRating} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Title (optional)</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Great quality!" maxLength={100} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Review</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="input-field min-h-25" placeholder="Share your experience..." maxLength={2000} required />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500">No reviews yet.</p>
          {isAuthenticated && <p className="text-sm text-slate-400 mt-1">Be the first to review this product.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  {review.user?.avatar ? (
                    <img src={review.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-primary-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm">{review.user?.name || 'Anonymous'}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(review.createdAt)}</span>
                  </div>
                  {review.title && <p className="text-sm font-medium text-slate-700 mt-1">{review.title}</p>}
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewSection