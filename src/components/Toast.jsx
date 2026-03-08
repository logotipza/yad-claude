// Компонент одного тоста (уведомления)
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ICONS = {
  success: <CheckCircle size={18} className="text-green-500" />,
  error: <AlertCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-blue-500" />,
  warning: <AlertTriangle size={18} className="text-yellow-500" />,
}

const BORDERS = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  warning: 'border-l-yellow-400',
}

export default function Toast({ id, message, type = 'info', duration = 4000, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onRemove])

  return (
    <motion.div
      layout
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`flex items-start gap-3 bg-white rounded-xl shadow-lg border border-[#EEEEEE] border-l-4 ${BORDERS[type]} p-4 min-w-[280px] max-w-[340px]`}
    >
      <div className="mt-0.5 flex-shrink-0">{ICONS[type]}</div>
      <p className="flex-1 text-sm text-[#111111] leading-snug">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-[#AAAAAA] hover:text-[#111111] transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}
