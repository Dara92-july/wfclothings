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
      className="fixed bottom-5 right-5 z-40 flex h-10 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-full bg-primary-500 px-3.5 sm:px-4 text-white shadow-md shadow-primary-500/20 transition-all hover:bg-primary-600 hover:scale-105 active:scale-95"
    >
      <WhatsAppIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      <span className="text-xs sm:text-sm font-semibold">Chat with us</span>
    </a>
  )
}

export default FloatingWhatsApp