// Страница 404
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-[120px] font-bold leading-none mb-4"
          style={{ color: '#FFD600' }}
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold text-[#111111] mb-2">Страница не найдена</h1>
        <p className="text-[#888888] text-sm mb-8 max-w-xs mx-auto">
          Кажется, эта страница переехала или никогда не существовала
        </p>
        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-[#EEEEEE] bg-white text-[#888888] hover:bg-[#F5F5F7] transition-colors"
          >
            <ArrowLeft size={16} />
            Назад
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            <Home size={16} />
            На главную
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
