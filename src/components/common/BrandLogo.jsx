import { Link } from 'react-router-dom'

const BrandLogo = ({ className = '', imageClassName = 'h-20 w-auto sm:h-24', imageSrc = 'https://res.cloudinary.com/dzo14hk18/image/upload/v1783522991/ChatGPT_Image_Jul_8_2026_02_37_38_PM_bulab8-removebg-preview_gcqak1.png' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`} aria-label="Go to homepage">
      {imageSrc ? (
        <img src={imageSrc} alt="Way Forward" className={`drop-shadow-md ${imageClassName}`} />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-400 text-primary-900 shadow-sm">
          <span className="font-extrabold text-base">WF</span>
        </div>
      )}
    </Link>
  )
}

export default BrandLogo
