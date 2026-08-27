import { useEffect, useState } from 'react'

const LOGO_URL = 'https://res.cloudinary.com/dzo14hk18/image/upload/v1783522991/ChatGPT_Image_Jul_8_2026_02_37_38_PM_bulab8-removebg-preview_gcqak1.png'

const SplashScreen = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fadeTimer = setTimeout(() => setExiting(true), 950)
    const doneTimer = setTimeout(() => onComplete(), 1330)
    return () => {
      document.body.style.overflow = ''
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#05070F]"
      style={{ opacity: exiting ? 0 : 1, transition: 'opacity 400ms ease-in-out' }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center text-center px-6 select-none">
        <img
          src={LOGO_URL}
          alt="Way Forward"
          className="splash-logo h-20 w-auto sm:h-24 md:h-28"
        />
        <h1 className="splash-title font-display text-white font-black tracking-[0.18em] mt-6 text-2xl sm:text-3xl md:text-4xl">
          WAY FORWARD
        </h1>
        <p className="splash-tagline text-primary-300 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.42em] mt-3">
          Streetwear for the fearless.
        </p>
        <div className="splash-dots flex items-center gap-2 mt-8">
          <span />
          <span style={{ animationDelay: '0.18s' }} />
          <span style={{ animationDelay: '0.36s' }} />
        </div>
      </div>
    </div>
  )
}

export default SplashScreen