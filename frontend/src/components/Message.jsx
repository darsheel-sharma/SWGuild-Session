import { AlertCircle, XCircle, Info } from 'lucide-react'

const VARIANTS = {
  error: {
    icon: XCircle,
    className: 'border-red-500/30 bg-red-500/[0.06] text-red-300',
    iconClass: 'text-red-400',
  },
  warning: {
    icon: AlertCircle,
    className: 'border-amber-500/30 bg-amber-500/[0.06] text-amber-300',
    iconClass: 'text-amber-400',
  },
  info: {
    icon: Info,
    className: 'border-blue-500/30 bg-blue-500/[0.06] text-blue-300',
    iconClass: 'text-blue-400',
  },
}

export default function Message({ type = 'error', message }) {
  const { icon: Icon, className, iconClass } = VARIANTS[type] || VARIANTS.info
  if (!message) return null

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 animate-fade-in ${className}`}>
      <Icon size={15} className={`${iconClass} flex-shrink-0 mt-0.5`} />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  )
}
