import { AlertTriangle, RefreshCw } from 'lucide-react'

const ErrorState = ({ title = 'Something went wrong', message = "We couldn't load this right now.", actionLabel = 'Try Again', onAction, className = '' }) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">{message}</p>
      {onAction && (
        <button onClick={onAction} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> {actionLabel}
        </button>
      )}
    </div>
  )
}

export default ErrorState