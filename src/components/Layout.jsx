// Основной лейаут: сайдбар + навбар + контентная область
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Закрываем сайдбар при изменении размера окна до десктопа
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Верхняя тёмная панель */}
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />

      {/* Основная область: сайдбар + контент */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
