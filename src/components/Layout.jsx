// Основной лейаут: сайдбар + навбар + контентная область
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Верхняя тёмная панель */}
      <Navbar />

      {/* Основная область: сайдбар + контент */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Контентная область с анимацией */}
        <motion.main
          key="layout-main"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 overflow-y-auto bg-[#F5F5F7]"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
