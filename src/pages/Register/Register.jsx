import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus } from 'lucide-react'
import { register } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return }
    const result = await dispatch(register(formData))
    if (result.meta.requestStatus === 'fulfilled') { toast.success('Account created successfully!'); navigate('/') }
    else { toast.error(result.payload || 'Registration failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center mx-auto mb-3"><span className="text-white font-bold text-xl">WF</span></div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join the Way Forward community</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { icon: User, name: 'name', type: 'text', placeholder: 'John Doe' },
              { icon: Mail, name: 'email', type: 'email', placeholder: 'you@example.com' },
              { icon: Phone, name: 'phone', type: 'tel', placeholder: '+234 800 000 0000' },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 capitalize">{field.name}</label>
                <div className="relative"><field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={field.type} value={formData[field.name]} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} className="input-field pl-10" placeholder={field.placeholder} required={field.name !== 'phone'} /></div>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field pl-10 pr-10" placeholder="Min 6 characters" required minLength={6} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="input-field pl-10" placeholder="Confirm your password" required /></div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</span> : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="text-primary-800 font-medium hover:text-primary-600">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
