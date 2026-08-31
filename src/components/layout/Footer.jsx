import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import BrandLogo from '../common/BrandLogo'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { whatsappLink } from '../../constants'

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/wayforward2026', icon: (c) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { label: 'Facebook', href: '#', icon: (c) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { label: 'TikTok', href: '#', icon: (c) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
  { label: 'Pinterest', href: '#', icon: (c) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M12 2a10 10 0 0 0-3.27 19.44c.08-.36.15-.72.22-1.09.3-1.28.82-3.27.82-3.27s-.21-.42-.21-1.04c0-.97.56-1.7 1.26-1.7.6 0 .88.45.88.99 0 .6-.38 1.5-.58 2.34-.17.7.35 1.27 1.04 1.27 1.25 0 2.21-1.32 2.21-3.22 0-1.68-1.21-2.86-2.93-2.86a3.03 3.03 0 0 0-3.15 3.03c0 .6.23 1.24.52 1.59a.38.38 0 0 1 .09.37c-.06.25-.2.85-.25.97-.04.17-.16.21-.37.13-1.05-.5-1.71-2.04-1.71-3.3 0-2.68 1.95-5.14 5.61-5.14 2.94 0 5.23 2.1 5.23 4.9 0 2.93-1.85 5.29-4.41 5.29-.86 0-1.67-.45-1.95-.98l-.53 2.02c-.19.74-.52 1.48-.84 2.06A10 10 0 1 0 12 2z"/></svg> },
  { label: 'X', href: '#', icon: (c) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M4 4l11.73 16H20L8.27 4z"/><path d="M20 4L8.27 16H4l11.73-16z"/></svg> },
]

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10 grid grid-cols-1 md:grid-cols-[45%_25%_30%] gap-8">
          <div>
            <BrandLogo />
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">Streetwear for the fearless. Unisex. Lagos, Nigeria.</p>
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white transition-all" aria-label={s.label}>
                  {s.icon('w-4 h-4')}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs text-primary-800 uppercase tracking-widest font-semibold mb-4">Shop</h3>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-sm text-gray-700 hover:text-primary-500 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Summer%20Armless" className="text-sm text-gray-700 hover:text-primary-500 transition-colors">Summer Armless</Link></li>
              <li><Link to="/products?category=Jersey" className="text-sm text-gray-700 hover:text-primary-500 transition-colors">Jersey</Link></li>
              <li><Link to="/products?category=Urban%20Edge%20Cap" className="text-sm text-gray-700 hover:text-primary-500 transition-colors">Urban Edge Cap</Link></li>
              <li><Link to="/products?featured=true" className="text-sm text-gray-700 hover:text-primary-500 transition-colors">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs text-primary-800 uppercase tracking-widest font-semibold mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-500 min-w-0"><Mail className="w-4 h-4 text-gray-400 shrink-0" /> <span className="break-all">wayforward19940@gmail.com</span></li>
              <li className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-4 h-4 text-gray-400 shrink-0" /> +234 903 833 2574</li>
              <li className="flex items-start gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /> Lagos, Nigeria</li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#25D366] transition-colors">
                  <WhatsAppIcon className="w-4 h-4 text-gray-400 shrink-0" /> WhatsApp &mdash; Chat with us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Way Forward. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer