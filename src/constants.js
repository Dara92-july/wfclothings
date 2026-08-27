export const WHATSAPP_NUMBER = '2349038332574'
export const WHATSAPP_MESSAGE = 'Hi Way Forward, I have a question about...'
export const CONTACT_EMAIL = 'wayforward19940@gmail.com'
export const CONTACT_PHONE = '+234 903 833 2574'

export const whatsappLink = (message = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`