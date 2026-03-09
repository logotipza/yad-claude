// Еженедельный ИИ отчёт — детализированный по сайтам
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Check, X, ChevronRight, Sparkles,
  Eye, MousePointerClick, Wallet, Percent, Globe,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle, BarChart2,
  Edit3
} from 'lucide-react'
import { useToastCtx } from '../App'

// ─── Данные ─────────────────────────────────────────────────────────────────

const PERIOD = '3–9 марта 2026'

const HEADER_STATS = [
  { label: 'Показы', value: '↑ +12%', color: '#22C55E' },
  { label: 'Клики', value: '↑ +8%', color: '#22C55E' },
  { label: 'Расход', value: '41 280 ₽', color: '#FFD600' },
]

const OVERVIEW_CARDS = [
  { label: 'Показы', value: 284190, prev: 253700, delta: '+12%', positive: true, icon: Eye, color: '#2563EB' },
  { label: 'Клики', value: 8432, prev: 7807, delta: '+8%', positive: true, icon: MousePointerClick, color: '#22C55E' },
  { label: 'CTR', value: '2.97%', prev: '3.08%', delta: '-0.3%', positive: false, icon: Percent, color: '#FF9500' },
  { label: 'Расход', value: '41 280 ₽', prev: '38 900 ₽', delta: '+6%', positive: false, icon: Wallet, color: '#7C3AED' },
]

const SITES = [
  {
    id: 's1',
    name: 'rogikopyta.ru',
    campaigns: [
      { name: 'Шины — Поиск', impressions: 98200, clicks: 2840, ctr: '2.89%', spend: 13200, budget: 15000 },
      { name: 'Запчасти — РСЯ', impressions: 67400, clicks: 1920, ctr: '2.85%', spend: 8600, budget: 10000 },
      { name: 'Бренд — Поиск', impressions: 21400, clicks: 890, ctr: '4.16%', spend: 1900, budget: 3000 },
    ],
    topAds: [
      { title: 'Шины по лучшим ценам!', ctr: '4.8%', clicks: 420 },
      { title: 'Запчасти с доставкой', ctr: '3.2%', clicks: 280 },
    ],
    worstAds: [
      { title: 'Интернет-магазин rogikopyta', ctr: '0.9%', clicks: 42 },
    ],
    budgetUtil: 79,
  },
  {
    id: 's2',
    name: 'shop.example.ru',
    campaigns: [
      { name: 'Каталог — Поиск', impressions: 76500, clicks: 2340, ctr: '3.06%', spend: 11200, budget: 14000 },
      { name: 'Ретаргетинг — РСЯ', impressions: 20690, clicks: 442, ctr: '2.13%', spend: 3380, budget: 5000 },
    ],
    topAds: [
      { title: 'Скидки до 40% в магазине', ctr: '5.1%', clicks: 390 },
    ],
    worstAds: [
      { title: 'Добро пожаловать в shop.example', ctr: '0.7%', clicks: 28 },
    ],
    budgetUtil: 77,
  },
]

const AUDIT_ITEMS = [
  { text: 'Скорость загрузки rogikopyta.ru: 3.2 сек', severity: 'важно' },
  { text: 'Отсутствует форма обратного звонка на rogikopyta.ru', severity: 'рекомендация' },
  { text: 'Мобильная версия shop.example.ru работает корректно', severity: 'ок' },
  { text: 'Нет SSL на поддомене m.rogikopyta.ru', severity: 'критично' },
  { text: 'Слишком мало уникального контента на главной shop.example.ru', severity: 'рекомендация' },
]

const CATEGORIES = {
  'Объявления': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Ставки': { bg: '#FFF9E6', text: '#D97706', border: '#FDE68A' },
  'Минус-слова': { bg: '#FFF1F1', text: '#DC2626', border: '#FECACA' },
  'Креативы': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  'Бюджет': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
}

const RECOMMENDATIONS = [
  {
    id: 1, category: 'Объявления', site: 'rogikopyta.ru', campaign: 'Шины — Поиск',
    title: 'Обновить заголовок объявления №3',
    desc: 'CTR объявления «Шины недорого» упал до 1.2%. Рекомендуем заменить на вариант с упоминанием срока доставки.',
    why: 'Объявления с конкретными УТП показывают CTR выше на 35–60% по данным Яндекс.Директ.',
    data: 'CTR объявления №3: 1.2% (средний по кампании: 2.89%)',
    confidence: 87,
    effect: '+0.8% CTR',
    budgetImpact: null,
  },
  {
    id: 2, category: 'Ставки', site: 'rogikopyta.ru', campaign: 'Запчасти — РСЯ',
    title: 'Повысить ставку по ключу «купить запчасти»',
    desc: 'Ключевик «купить запчасти» приносит 34% всех конверсий при доле расходов 18%. Рекомендуем поднять ставку на 15%.',
    why: 'Недооценённые ключи при высокой конверсии — частая причина потери прибыли.',
    data: 'Конверсии: 34% / Доля бюджета: 18% / Период: 3–9 марта',
    confidence: 91,
    effect: '+23% конверсий',
    budgetImpact: { current: 8600, proposed: 9890 },
  },
  {
    id: 3, category: 'Минус-слова', site: 'rogikopyta.ru', campaign: 'Шины — Поиск',
    title: 'Добавить минус-слова: «бу», «подержанный», «ремонт»',
    desc: 'Обнаружены нерелевантные показы по запросам о б/у технике. Добавление минус-слов сократит нецелевые клики.',
    why: 'Нерелевантные клики расходуют до 18% бюджета без конверсий.',
    data: 'Нецелевые запросы за период: 234 клика, расход 1 840 ₽',
    confidence: 95,
    effect: '-18% нецелевых кликов',
    budgetImpact: null,
  },
  {
    id: 4, category: 'Бюджет', site: 'rogikopyta.ru', campaign: 'Шины — Поиск',
    title: 'Перераспределить бюджет в пользу выходных',
    desc: 'Анализ показывает, что конверсии в выходные в 2.3 раза выше, но бюджет распределён равномерно.',
    why: 'Сезонность спроса на автозапчасти: пик активности пятница–воскресенье.',
    data: 'Конверсии вых/буд: 2.3x / CTR вых: 4.1% / CTR буд: 1.8%',
    confidence: 82,
    effect: '+31% эффективность',
    budgetImpact: { current: 13200, proposed: 15600 },
  },
  {
    id: 5, category: 'Ставки', site: 'shop.example.ru', campaign: 'Ретаргетинг — РСЯ',
    title: 'Снизить ставки ночью с 1:00 до 6:00',
    desc: 'CTR в ночные часы составляет 0.4%, что вдвое ниже дневного. Оптимизация расходов — до 8% бюджета.',
    why: 'Ночная аудитория конвертируется значительно хуже для товаров данной категории.',
    data: 'Ночной CTR: 0.4% / Дневной CTR: 2.1% / Ночной расход: 271 ₽',
    confidence: 89,
    effect: '-8% расходов/ночь',
    budgetImpact: { current: 3380, proposed: 3109 },
  },
  {
    id: 6, category: 'Объявления', site: 'shop.example.ru', campaign: 'Каталог — Поиск',
    title: 'Добавить быстрые ссылки в объявления',
    desc: 'Объявления без быстрых ссылок получают на 25% меньше кликов. Предлагаем добавить 4 варианта ссылок.',
    why: 'Расширения увеличивают площадь объявления и улучшают видимость в результатах поиска.',
    data: 'Объявлений без ссылок: 5 из 8 / Потеря кликов: ~25%',
    confidence: 78,
    effect: '+25% CTR',
    budgetImpact: null,
  },
  {
    id: 7, category: 'Креативы', site: 'rogikopyta.ru', campaign: 'Запчасти — РСЯ',
    title: 'Сгенерировать новые баннеры для РСЯ',
    desc: 'Все текущие баннеры старше 45 дней. Обновление креативов поможет избежать «баннерной слепоты».',
    why: 'Согласно исследованиям Яндекса, эффективность баннеров снижается на 40% через 30–45 дней.',
    data: 'Возраст баннеров: 45–67 дней / CTR за период: -12% к прошлой неделе',
    confidence: 74,
    effect: '+12% вовлечённость',
    budgetImpact: null,
  },
]

// ─── Вспомогательные компоненты ─────────────────────────────────────────────

// Мини спарклайн
function Sparkline({ values, color }) {
  const max = Math.max(...values), min = Math.min(...values)
  const w = 60, h = 24, pad = 2
  const px = (i) => pad + (i / (values.length - 1)) * (w - pad * 2)
  const py = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
  const path = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-15 h-6" style={{ width: 60, height: 24 }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Аккордеон сайта
function SiteAccordion({ site }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F5F5F7] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Globe size={16} className="text-[#888]" />
          <span className="font-semibold text-[#111] text-sm">{site.name}</span>
          <span className="text-xs text-[#AAAAAA]">{site.campaigns.length} кампании</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#AAAAAA]">Утилизация бюджета</span>
            <div className="w-24 h-1.5 bg-[#EEEEEE] rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${site.budgetUtil}%`,
                  backgroundColor: site.budgetUtil > 85 ? '#FF4444' : '#22C55E',
                }}
              />
            </div>
          </div>
          {open ? <ChevronUp size={16} className="text-[#888]" /> : <ChevronDown size={16} className="text-[#888]" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#EEEEEE]">
              {/* Таблица кампаний */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#EEEEEE]">
                      {['Кампания', 'Показы', 'Клики', 'CTR', 'Расход', 'Бюджет'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-5 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {site.campaigns.map((c, i) => (
                      <tr key={i} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#F5F5F7] transition-colors">
                        <td className="px-5 py-3 font-medium text-[#111]">{c.name}</td>
                        <td className="px-5 py-3 text-[#555]">{c.impressions.toLocaleString('ru-RU')}</td>
                        <td className="px-5 py-3 text-[#555]">{c.clicks.toLocaleString('ru-RU')}</td>
                        <td className="px-5 py-3 text-[#555]">{c.ctr}</td>
                        <td className="px-5 py-3 text-[#555]">{c.spend.toLocaleString('ru-RU')} ₽</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#555] text-xs">{c.budget.toLocaleString('ru-RU')} ₽</span>
                            <div className="w-16 h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(c.spend / c.budget) * 100}%`,
                                  backgroundColor: (c.spend / c.budget) > 0.85 ? '#FF4444' : '#22C55E',
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Лучшие/худшие объявления */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 py-4 border-t border-[#EEEEEE] bg-[#FAFAFA]">
                <div>
                  <p className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Лучшие объявления</p>
                  {site.topAds.map((ad, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-[#111] truncate mr-3">{ad.title}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-green-600 font-semibold">{ad.ctr}</span>
                        <span className="text-xs text-[#AAAAAA]">{ad.clicks} кл.</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Слабые объявления</p>
                  {site.worstAds.map((ad, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-[#111] truncate mr-3">{ad.title}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-red-500 font-semibold">{ad.ctr}</span>
                        <span className="text-xs text-[#AAAAAA]">{ad.clicks} кл.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Карточка рекомендации
function RecCard({ rec, status, onAccept, onReject }) {
  const [expanded, setExpanded] = useState(false)
  const [budget, setBudget] = useState(rec.budgetImpact?.proposed || 0)
  const cat = CATEGORIES[rec.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border-2 transition-all ${
        status === 'accepted' ? 'border-green-400 bg-green-50/20' :
        status === 'rejected' ? 'border-[#EEEEEE] opacity-50' :
        'border-[#EEEEEE] hover:border-gray-300'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Чекбокс */}
          <motion.div
            animate={{
              backgroundColor: status === 'accepted' ? '#22C55E' : '#EEEEEE',
              borderColor: status === 'accepted' ? '#22C55E' : '#DDDDDD',
            }}
            onClick={() => status === 'accepted' ? onReject() : onAccept()}
            className="w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer flex-shrink-0 mt-0.5"
          >
            {status === 'accepted' && <Check size={11} className="text-white" />}
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* Мета */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md border"
                style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.border }}
              >
                {rec.category}
              </span>
              <span className="text-xs text-[#AAAAAA]">{rec.site}</span>
              <span className="text-xs text-[#CCCCCC]">·</span>
              <span className="text-xs text-[#AAAAAA]">{rec.campaign}</span>
              {/* Confidence */}
              <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                rec.confidence >= 85 ? 'bg-green-100 text-green-700' :
                rec.confidence >= 70 ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {rec.confidence}% уверенность
              </span>
            </div>

            <h3 className={`font-semibold text-sm mb-1 ${status === 'rejected' ? 'line-through text-[#AAAAAA]' : 'text-[#111111]'}`}>
              {rec.title}
            </h3>
            <p className="text-sm text-[#888888] leading-relaxed">{rec.desc}</p>

            {/* Разворачиваемые детали */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    <div className="bg-[#F5F5F7] rounded-xl p-3">
                      <p className="text-xs font-semibold text-[#888] mb-1">Почему это важно:</p>
                      <p className="text-xs text-[#444]">{rec.why}</p>
                    </div>
                    <div className="bg-[#F5F5F7] rounded-xl p-3">
                      <p className="text-xs font-semibold text-[#888] mb-1">Данные за период:</p>
                      <p className="text-xs text-[#444] font-mono">{rec.data}</p>
                    </div>

                    {/* Бюджет */}
                    {rec.budgetImpact && (
                      <div className="bg-[#FFFDE7] rounded-xl p-3 border border-[#FFD600]/30">
                        <p className="text-xs font-semibold text-[#888] mb-2">Изменение бюджета:</p>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-[#AAAAAA]">Текущий</p>
                            <p className="text-sm font-semibold text-[#888] line-through">
                              {rec.budgetImpact.current.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-[#CCC]" />
                          <div>
                            <p className="text-xs text-[#AAAAAA]">Рекомендуемый</p>
                            <p className="text-sm font-semibold text-[#111]">
                              {rec.budgetImpact.proposed.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-[#CCC]" />
                          <div>
                            <p className="text-xs text-[#AAAAAA]">Ваш вариант</p>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={budget}
                                onChange={e => setBudget(Number(e.target.value))}
                                className="w-24 px-2 py-1 text-sm border border-[#FFD600] rounded-lg focus:outline-none text-center"
                              />
                              <span className="text-xs text-[#888]">₽</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Нижняя строка */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                <TrendingUp size={13} />
                {rec.effect}
              </div>
              <button
                onClick={() => setExpanded(e => !e)}
                className="text-xs text-[#AAAAAA] hover:text-[#111] transition-colors flex items-center gap-1"
              >
                {expanded ? 'Свернуть' : 'Подробнее'}
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            </div>
          </div>

          {/* Кнопки */}
          {!status && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAccept}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <Check size={12} />Принять
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#888] border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
              >
                <X size={12} />Пропустить
              </motion.button>
            </div>
          )}
          {status === 'accepted' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center gap-1.5 text-sm font-semibold text-green-600 flex-shrink-0"
            >
              <Check size={16} />Принято
            </motion.div>
          )}
          {status === 'rejected' && (
            <div className="flex items-center gap-1.5 text-sm text-[#AAAAAA] flex-shrink-0">
              <X size={16} />Пропущено
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Главный компонент ───────────────────────────────────────────────────────

export default function WeeklyReport() {
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const [statuses, setStatuses] = useState({})
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
    addToast({ message: `Применено ${accepted} рекомендаций ИИ в Яндекс.Директ`, type: 'success' })
    navigate('/dashboard')
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">

      {/* ── Секция 0: Тёмный шапочный баннер ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} style={{ color: '#FFD600' }} />
            <h1 className="text-white font-bold text-xl">Еженедельный отчёт</h1>
          </div>
          <p className="text-gray-400 text-sm mb-4">{PERIOD}</p>
          <div className="flex flex-wrap gap-3">
            {HEADER_STATS.map(s => (
              <span
                key={s.label}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: s.color + '20', color: s.color, border: `1px solid ${s.color}40` }}
              >
                {s.label}: {s.value}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: '#FFD600' }} />
      </motion.div>

      {/* ── Секция 1: Обзор периода ── */}
      <section className="mb-8">
        <h2 className="font-semibold text-[#111111] mb-4">Обзор периода</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {OVERVIEW_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-[#EEEEEE] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#888]">{card.label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '18' }}>
                  <card.icon size={14} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-xl font-bold text-[#111] mb-1">{card.value}</div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-500'}`}>
                  {card.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {card.delta}
                </div>
                <Sparkline
                  values={Array.from({ length: 7 }, () => Math.random() * 100)}
                  color={card.positive ? '#22C55E' : '#EF4444'}
                />
              </div>
              <div className="text-xs text-[#AAAAAA] mt-1">пред. нед.: {card.prev}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Секция 2: По сайтам ── */}
      <section className="mb-8">
        <h2 className="font-semibold text-[#111111] mb-4">По сайтам</h2>
        <div className="space-y-4">
          {SITES.map(site => (
            <SiteAccordion key={site.id} site={site} />
          ))}
        </div>
      </section>

      {/* ── Секция 3: Аудит сайта ── */}
      <section className="mb-8">
        <h2 className="font-semibold text-[#111111] mb-4">Аудит сайтов</h2>
        <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5">
          <div className="space-y-3">
            {AUDIT_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.severity === 'ок' && <CheckCircle size={15} className="text-green-500 flex-shrink-0" />}
                {item.severity === 'рекомендация' && <BarChart2 size={15} className="text-blue-400 flex-shrink-0" />}
                {item.severity === 'важно' && <AlertTriangle size={15} className="text-orange-400 flex-shrink-0" />}
                {item.severity === 'критично' && <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />}
                <span className="text-sm text-[#333] flex-1">{item.text}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  item.severity === 'ок' ? 'bg-green-100 text-green-700' :
                  item.severity === 'критично' ? 'bg-red-100 text-red-700' :
                  item.severity === 'важно' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Секция 4: Рекомендации ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#111111]">Рекомендации ИИ</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={acceptAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
            >
              Принять все
            </button>
            <button
              onClick={skipAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#888] border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
            >
              Пропустить все
            </button>
          </div>
        </div>

        {/* Счётчик */}
        <div className="flex items-center gap-3 mb-4 text-sm text-[#888]">
          <span>Принято: <span className="font-semibold text-green-600">{accepted}</span></span>
          <span>|</span>
          <span>Пропущено: <span className="font-semibold text-[#AAAAAA]">{rejected}</span></span>
        </div>

        <div className="space-y-3">
          {RECOMMENDATIONS.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <RecCard
                rec={rec}
                status={statuses[rec.id]}
                onAccept={() => accept(rec.id)}
                onReject={() => reject(rec.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Кнопка отправки в Директ */}
        <div className="mt-8 pt-6 border-t border-[#EEEEEE] flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm font-semibold text-[#111]">
              {accepted > 0
                ? `Выбрано ${accepted} рекомендаций для применения`
                : 'Выберите рекомендации для применения'}
            </div>
            {accepted > 0 && (
              <div className="text-xs text-[#888] mt-0.5">
                Изменения будут отправлены в Яндекс.Директ API
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: accepted > 0 ? 1.02 : 1 }}
            whileTap={{ scale: accepted > 0 ? 0.97 : 1 }}
            onClick={accepted > 0 ? handleApply : undefined}
            disabled={accepted === 0 || applying}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            {applying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                />
                Отправляем в Директ...
              </>
            ) : (
              <>
                Отправить изменения в Директ
                {accepted > 0 && ` (${accepted})`}
                <ChevronRight size={16} />
              </>
            )}
          </motion.button>
        </div>
      </section>
    </div>
  )
}
