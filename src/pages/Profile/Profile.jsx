import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import authService from '../../services/auth.service'
import { checkAuth } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '', city: user?.addresses?.[0]?.city || '', state: user?.addresses?.[0]?.state || ''
  })

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '--'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.updateProfile({ name: formData.name, phone: formData.phone, addresses: [{ label: 'Home', street: formData.street, city: formData.city, state: formData.state, country: 'Nigeria', isDefault: true }] })
      dispatch(checkAuth())
      toast.success('Profile updated successfully')
    } catch (error) { toast.error('Failed to update profile') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">My Profile</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center shadow-sm"><span className="text-xl font-bold text-white">{initials}</span></div>
          <div><h2 className="text-xl font-bold text-slate-900">{user?.name}</h2><p className="text-sm text-slate-500">{user?.email}</p>{user?.role === 'admin' && <span className="badge-info text-xs mt-1 inline-block">Admin</span>}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5"><User className="w-4 h-4 inline mr-1.5 text-slate-400" />Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5"><Mail className="w-4 h-4 inline mr-1.5 text-slate-400" />Email</label><input type="email" value={user?.email || ''} disabled className="input-field bg-slate-50 text-slate-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5"><Phone className="w-4 h-4 inline mr-1.5 text-slate-400" />Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" /></div>
          </div>
          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-base text-slate-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-500" /> Default Address</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address</label><input type="text" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">City</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">State</label><input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="input-field" /></div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" />{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  )
}

export default Profile
