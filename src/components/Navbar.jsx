// Верхняя тёмная навигационная панель
import { Bell, Menu } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar({ onMenuClick }) {
  return (
    <header
      style={{ backgroundColor: '#111111' }}
      className="h-14 flex items-center justify-between px-6 flex-shrink-0"
    >
      {/* Левая часть: гамбургер (мобайл) + логотип */}
      <div className="flex items-center gap-3">
        {/* Гамбургер — только на мобайле */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-400 hover:text-white transition-colors p-1 -ml-1"
          aria-label="Открыть меню"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            Я
          </div>
          <span className="text-white font-semibold text-sm tracking-tight hidden sm:block">ЯД Оптимизатор</span>
        </div>
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-4">
        {/* Колокольчик уведомлений */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative text-gray-400 hover:text-white transition-colors"
        >
          <Bell size={20} />
          {/* Бейдж с числом непрочитанных */}
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: '#FF4444', color: 'white' }}
          >
            2
          </span>
        </motion.button>

        {/* Email пользователя */}
        <span className="text-gray-400 text-sm hidden md:block">user@company.ru</span>

        {/* Аватар */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
          style={{ backgroundColor: '#FFD600', color: '#111111' }}
        >
          U
        </motion.div>
      </div>
    </header>
  )
}
