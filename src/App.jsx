// Корневой компонент приложения с роутингом и системой тостов
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { useToast } from './hooks/useToast'
import ToastContainer from './components/ToastContainer'
import Layout from './components/Layout'

// Страницы без лейаута (полноэкранные)
import Welcome from './pages/Welcome'
import OAuthCallback from './pages/OAuthCallback'
import Analyzing from './pages/Analyzing'

// Страницы с лейаутом (сайдбар + навбар)
import Dashboard from './pages/Dashboard'
import Results from './pages/Results'
import CampaignDetail from './pages/CampaignDetail'
import CampaignCreate from './pages/CampaignCreate'
import WeeklyReport from './pages/WeeklyReport'
import Hypotheses from './pages/Hypotheses'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Создаём контекст тостов для доступа из любой страницы
import { createContext, useContext } from 'react'
export const ToastContext = createContext(null)
export const useToastCtx = () => useContext(ToastContext)

// Компонент-обёртка с лейаутом
function WithLayout({ children }) {
  return <Layout>{children}</Layout>
}

export default function App() {
  const { toasts, addToast, removeToast } = useToast()
  const location = useLocation()

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Полноэкранные страницы */}
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<OAuthCallback />} />
          <Route path="/analyzing" element={<Analyzing />} />

          {/* Страницы с лейаутом */}
          <Route path="/dashboard" element={<WithLayout><Dashboard /></WithLayout>} />
          <Route path="/results" element={<WithLayout><Results /></WithLayout>} />
          <Route path="/campaign/create" element={<WithLayout><CampaignCreate /></WithLayout>} />
          <Route path="/campaign/:id" element={<WithLayout><CampaignDetail /></WithLayout>} />
          <Route path="/report" element={<WithLayout><WeeklyReport /></WithLayout>} />
          <Route path="/hypotheses" element={<WithLayout><Hypotheses /></WithLayout>} />
          <Route path="/settings" element={<WithLayout><Settings /></WithLayout>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      {/* Контейнер уведомлений */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}
