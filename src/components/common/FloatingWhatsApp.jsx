import WhatsAppIcon from './WhatsAppIcon'
import { whatsappLink } from '../../constants'

const FloatingWhatsApp = () => {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-primary-500 px-5 text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 hover:scale-105 active:scale-95"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="text-sm font-semibold">Chat with us</span>
    </a>
  )
}

export default FloatingWhatsApp