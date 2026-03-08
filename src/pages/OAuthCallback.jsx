// Страница OAuth авторизации через Яндекс
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Shield, Key, User } from 'lucide-react'
import { useToastCtx } from '../App'

const steps = [
  { icon: Shield, label: 'Проверяем токен авторизации' },
  { icon: Key, label: 'Получаем доступ к Директ API' },
  { icon: User, label: 'Загружаем профиль аккаунта' },
]

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const [visibleSteps, setVisibleSteps] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Показываем шаги с задержкой
    steps.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i])
      }, 600 + i * 700)
    })

    // После всех шагов — успех и редирект
    setTimeout(() => {
      setDone(true)
      setTimeout(() => {
        addToast({ message: 'Яндекс.Директ успешно подключён!', type: 'success' })
        navigate('/dashboard')
      }, 800)
    }, 600 + steps.length * 700 + 400)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center"
      >
        {/* Иконка / спиннер */}
        <div className="flex justify-center mb-6">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key="spinner"
                exit={{ scale: 0, opacity: 0 }}
                className="relative w-16 h-16"
              >
                {/* Внешнее кольцо */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-[#EEEEEE]"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-t-[#FFD600] border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                {/* Логотип Яндекса в центре */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#FC3F1D' }}
                  >
                    Я
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle size={64} className="text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Заголовок */}
        <motion.h2
          animate={{ opacity: done ? 0 : 1 }}
          className="text-lg font-semibold text-[#111111] mb-2"
        >
          Подключаемся к Яндекс.Директ...
        </motion.h2>
        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 font-semibold text-lg mb-2"
            >
              Успешно подключено!
            </motion.p>
          )}
        </AnimatePresence>
        <p className="text-[#888888] text-sm mb-8">
          {done ? 'Переходим в дашборд...' : 'Пожалуйста, подождите'}
        </p>

        {/* Шаги */}
        <div className="text-left space-y-3">
          <AnimatePresence>
            {steps.map((step, i) => (
              visibleSteps.includes(i) && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F0FDF4' }}
                  >
                    <step.icon size={14} className="text-green-500" />
                  </div>
                  <span className="text-[#111111]">{step.label}</span>
                  <CheckCircle size={14} className="text-green-500 ml-auto" />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
