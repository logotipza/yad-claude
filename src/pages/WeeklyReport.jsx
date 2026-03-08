// Еженедельный ИИ отчёт — карточки рекомендаций с принятием/отклонением
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Check, X, ChevronRight, Sparkles } from 'lucide-react'
import { useToastCtx } from '../App'

const CATEGORIES = {
  'Объявления': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Ставки': { bg: '#FFF9E6', text: '#D97706', border: '#FDE68A' },
  'Минус-слова': { bg: '#FFF1F1', text: '#DC2626', border: '#FECACA' },
  'Креативы': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  'Бюджет': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
}

const RECOMMENDATIONS = [
  {
    id: 1,
    category: 'Объявления',
    campaign: 'Смартфоны — Поиск',
    title: 'Обновить заголовок объявления №3',
    desc: 'CTR объявления «Смартфоны от 5999 ₽» упал до 1.2%. Рекомендуем заменить на вариант с упоминанием бренда.',
    effect: '+0.8% CTR',
  },
  {
    id: 2,
    category: 'Ставки',
    campaign: 'iPhone — РСЯ',
    title: 'Повысить ставку по ключу «купить айфон»',
    desc: 'Ключевик «купить айфон» приносит 34% всех конверсий при доле расходов 18%. Рекомендуем поднять ставку на 15%.',
    effect: '+23% конверсий',
  },
  {
    id: 3,
    category: 'Минус-слова',
    campaign: 'Смартфоны — Поиск',
    title: 'Добавить минус-слова: «бу», «подержанный», «ремонт»',
    desc: 'Обнаружены нерелевантные показы по запросам о б/у технике. Добавление минус-слов сократит нецелевые клики.',
    effect: '-18% пустых кликов',
  },
  {
    id: 4,
    category: 'Креативы',
    campaign: 'Xiaomi — Поиск',
    title: 'Сгенерировать новые тексты объявлений',
    desc: 'Все текущие объявления старше 45 дней. Свежие тексты помогут избежать «баннерной слепоты».',
    effect: '+12% вовлечённость',
  },
  {
    id: 5,
    category: 'Бюджет',
    campaign: 'Смартфоны — Поиск',
    title: 'Перераспределить бюджет в пользу выходных',
    desc: 'Анализ показывает, что конверсии в выходные в 2.3 раза выше, но бюджет распределён равномерно.',
    effect: '+31% эффективность',
  },
  {
    id: 6,
    category: 'Ставки',
    campaign: 'iPhone — РСЯ',
    title: 'Снизить ставки ночью с 1:00 до 6:00',
    desc: 'CTR в ночные часы составляет 0.4%, что вдвое ниже дневного. Оптимизация расходов — до 8% бюджета.',
    effect: '-8% расходов/ночь',
  },
  {
    id: 7,
    category: 'Объявления',
    campaign: 'Xiaomi — Поиск',
    title: 'Добавить быстрые ссылки в объявления',
    desc: 'Объявления без быстрых ссылок получают на 25% меньше кликов. Предлагаем добавить 4 варианта ссылок.',
    effect: '+25% CTR',
  },
]

export default function WeeklyReport() {
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const [statuses, setStatuses] = useState({}) // accepted | rejected | undefined
  const [applying, setApplying] = useState(false)

  const accepted = Object.entries(statuses).filter(([, v]) => v === 'accepted').length
  const rejected = Object.entries(statuses).filter(([, v]) => v === 'rejected').length

  const accept = (id) => setStatuses(prev => ({ ...prev, [id]: 'accepted' }))
  const reject = (id) => setStatuses(prev => ({ ...prev, [id]: 'rejected' }))

  const acceptAll = () => {
    const next = {}
    RECOMMENDATIONS.forEach(r => { next[r.id] = 'accepted' })
    setStatuses(next)
  }
  const skipAll = () => {
    const next = {}
    RECOMMENDATIONS.forEach(r => { next[r.id] = 'rejected' })
    setStatuses(next)
  }

  const handleApply = async () => {
    setApplying(true)
    await new Promise(r => setTimeout(r, 2000))
    setApplying(false)
    addToast({ message: `Применено ${accepted} рекомендаций ИИ`, type: 'success' })
    navigate('/dashboard')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Тёмный баннер */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} style={{ color: '#FFD600' }} />
            <h1 className="text-white font-bold text-xl">ИИ проанализировал ваши кампании</h1>
          </div>
          <p className="text-gray-400 text-sm mb-4">Еженедельный отчёт за 1–7 марта 2026</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: '7 рекомендаций', color: '#FFD600' },
              { label: '3 кампании проверено', color: '#86EFAC' },
              { label: 'до +31% эффективности', color: '#C4B5FD' },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: color + '20', color, border: `1px solid ${color}40` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        {/* Декоративный элемент */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: '#FFD600' }}
        />
      </motion.div>

      {/* Панель массовых действий */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#EEEEEE] px-5 py-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#888888]">
            Принято: <span className="font-semibold text-green-600">{accepted}</span> &nbsp;|&nbsp;
            Пропущено: <span className="font-semibold text-[#AAAAAA]">{rejected}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={acceptAll}
            className="px-4 py-2 rounded-lg text-sm font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
          >
            Принять все
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={skipAll}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#888888] border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
          >
            Пропустить все
          </motion.button>
          {accepted > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApply}
              disabled={applying}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-70"
              style={{ backgroundColor: '#FFD600', color: '#111111' }}
            >
              {applying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full"
                  />
                  Применяем...
                </>
              ) : (
                <>
                  Применить выбранное ({accepted})
                  <ChevronRight size={14} />
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Карточки рекомендаций */}
      <div className="space-y-3">
        {RECOMMENDATIONS.map((rec, i) => {
          const status = statuses[rec.id]
          const cat = CATEGORIES[rec.category]

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-white rounded-2xl border-2 p-5 transition-all ${
                status === 'accepted'
                  ? 'border-green-400 bg-green-50/30'
                  : status === 'rejected'
                  ? 'border-[#EEEEEE] opacity-50'
                  : 'border-[#EEEEEE] hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Чекбокс */}
                <motion.div
                  animate={{
                    backgroundColor: status === 'accepted' ? '#22C55E' : '#EEEEEE',
                    borderColor: status === 'accepted' ? '#22C55E' : '#DDDDDD',
                  }}
                  onClick={() => status === 'accepted' ? reject(rec.id) : accept(rec.id)}
                  className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer flex-shrink-0 mt-0.5 transition-colors"
                >
                  {status === 'accepted' && <Check size={11} className="text-white" />}
                </motion.div>

                {/* Контент */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {/* Категория */}
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-md border"
                      style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.border }}
                    >
                      {rec.category}
                    </span>
                    <span className="text-xs text-[#AAAAAA]">{rec.campaign}</span>
                  </div>

                  <h3
                    className={`font-semibold text-sm mb-1 ${status === 'rejected' ? 'line-through text-[#AAAAAA]' : 'text-[#111111]'}`}
                  >
                    {rec.title}
                  </h3>
                  <p className="text-sm text-[#888888] leading-relaxed mb-3">{rec.desc}</p>

                  {/* Ожидаемый эффект */}
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                    <TrendingUp size={14} />
                    {rec.effect}
                  </div>
                </div>

                {/* Кнопки */}
                {!status && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => accept(rec.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <Check size={13} />
                      Принять
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => reject(rec.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#888888] border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <X size={13} />
                      Пропустить
                    </motion.button>
                  </div>
                )}

                {/* Статус принято */}
                {status === 'accepted' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-green-600 flex-shrink-0"
                  >
                    <Check size={16} />
                    Принято
                  </motion.div>
                )}

                {/* Статус пропущено */}
                {status === 'rejected' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 text-sm text-[#AAAAAA] flex-shrink-0"
                  >
                    <X size={16} />
                    Пропущено
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
