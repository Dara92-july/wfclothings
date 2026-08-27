import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import WhatsAppIcon from '../../components/common/WhatsAppIcon'
import { whatsappLink, CONTACT_EMAIL, CONTACT_PHONE } from '../../constants'

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mb-4">GET IN TOUCH</h1>
        <div className="w-16 h-1 bg-primary-500 mx-auto mb-6 rounded-full" />
        <p className="text-lg text-slate-500 leading-relaxed">Have a question about an order, product, size, or delivery? We&rsquo;re here to help.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center hover:border-[#25D366]/50 hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mx-auto mb-5 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <WhatsAppIcon className="w-8 h-8" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-1">WhatsApp</h2>
            <p className="text-sm text-slate-500 mb-6">Chat with us instantly</p>
            <span className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full text-sm group-hover:shadow-lg group-hover:shadow-[#25D366]/30 transition-all">
              Chat on WhatsApp
            </span>
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center hover:border-primary-500/40 hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Email</h2>
            <p className="text-sm text-slate-500 mb-6">For detailed enquiries, email us directly</p>
            <span className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white font-semibold px-6 py-3 rounded-full text-sm group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all">
              Send Email
            </span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { icon: Mail, label: 'Email', value: CONTACT_EMAIL },
            { icon: Phone, label: 'Phone', value: CONTACT_PHONE },
            { icon: MapPin, label: 'Location', value: 'Lagos, Nigeria' },
            { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{item.label}</p>
                <p className="text-xs font-medium text-slate-700 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Contact