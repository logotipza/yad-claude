// Страница анализа сайта — тёмный фон, анимированные шаги
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, Circle } from 'lucide-react'

const STEPS = [
  { label: 'Сканирование страниц', duration: 1200 },
  { label: 'Извлечение тематики', duration: 1000 },
  { label: 'Запрос Wordstat API', duration: 1500 },
  { label: 'Генерация рекомендаций', duration: 800 },
]

function StepIcon({ status }) {
  if (status === 'done') return <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
  if (status === 'active')
    return (
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600] dot-1" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600] dot-2" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600] dot-3" />
      </div>
    )
  return <Circle size={18} className="text-gray-600 flex-shrink-0" />
}

export default function Analyzing() {
  const navigate = useNavigate()
  const url = sessionStorage.getItem('analyzeUrl') || 'https://example.ru'
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])

  useEffect(() => {
    let elapsed = 0
    const totalTime = STEPS.reduce((s, st) => s + st.duration, 0)

    // Прогресс-бар
    const interval = setInterval(() => {
      elapsed += 50
      setProgress(Math.min((elapsed / totalTime) * 100, 98))
    }, 50)

    // Последовательный показ шагов
    let stepTime = 0
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i)
      }, stepTime)
      stepTime += step.duration
      setTimeout(() => {
        setDoneSteps(prev => [...prev, i])
      }, stepTime - 100)
    })

    // Финальный редирект
    setTimeout(() => {
      setProgress(100)
      clearInterval(interval)
      setTimeout(() => navigate('/results'), 600)
    }, totalTime + 200)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Карточка */}
        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {/* URL бейдж */}
          <div className="flex justify-center mb-8">
            <span
              className="text-xs font-mono px-4 py-1.5 rounded-full truncate max-w-[280px]"
              style={{ backgroundColor: 'rgba(255,214,0,0.12)', color: '#FFD600', border: '1px solid rgba(255,214,0,0.25)' }}
            >
              {url}
            </span>
          </div>

          {/* Круговой прогресс */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#FFD600"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="text-white text-xl font-bold text-center mb-2">Анализируем сайт</h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            Это займёт около 2 минут
          </p>

          {/* Прогресс-бар */}
          <div className="mb-8">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #FFD600, #FF9500)',
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Список шагов */}
          <div className="space-y-3">
            <AnimatePresence>
              {STEPS.map((step, i) => {
                const status = doneSteps.includes(i)
                  ? 'done'
                  : currentStep === i
                  ? 'active'
                  : i < currentStep
                  ? 'done'
                  : 'pending'

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: i <= currentStep ? 1 : 0.35, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <StepIcon status={status} />
                    <span
                      className="text-sm"
                      style={{
                        color: status === 'done'
                          ? '#86efac'
                          : status === 'active'
                          ? '#FFD600'
                          : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {step.label}
                      {status === 'active' && (
                        <span className="text-gray-500">
                          <span className="dot-1">.</span>
                          <span className="dot-2">.</span>
                          <span className="dot-3">.</span>
                        </span>
                      )}
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Не закрывайте страницу
        </p>
      </motion.div>
    </div>
  )
}
