// Главный дашборд — Мои сайты, статистика, график
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Plus, Bell, ChevronRight,
  Eye, MousePointerClick, Percent, Wallet, Globe,
  Play, Pause, AlertTriangle, CheckCircle
} from 'lucide-react'

// Моковые данные для графика (30 дней)
const generateChartData = () => {
  const days = []
  let clicks = 220
  let spend = 1800
  for (let i = 0; i < 30; i++) {
    clicks = Math.max(100, clicks + (Math.random() - 0.45) * 40)
    spend = Math.max(1000, spend + (Math.random() - 0.45) * 300)
    const date = new Date(2026, 1, i + 6)
    days.push({
      date: `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
      clicks: Math.round(clicks),
      spend: Math.round(spend),
    })
  }
  return days
}
const chartData = generateChartData()

// Проекты (сайты)
const projects = [
  {
    id: 'p1',
    name: 'rogikopyta.ru',
    status: 'active',
    campaigns: 3,
    impressions: 142300,
    clicks: 4210,
    spend: 21400,
    budget: 30000,
    delta: '+12%',
    positive: true,
    topic: 'Автозапчасти, шины',
  },
  {
    id: 'p2',
    name: 'shop.example.ru',
    status: 'active',
    campaigns: 2,
    impressions: 98700,
    clicks: 3120,
    spend: 14800,
    budget: 20000,
    delta: '+8%',
    positive: true,
    topic: 'Интернет-магазин',
  },
  {
    id: 'p3',
    name: 'test-store.ru',
    status: 'paused',
    campaigns: 1,
    impressions: 43190,
    clicks: 1102,
    spend: 5080,
    budget: 10000,
    delta: '-3%',
    positive: false,
    topic: 'Тестовый проект',
  },
]

// Анимированный счётчик
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const motionVal = useMotionValue(0)
  const display = useTransform(motionVal, (v) => {
    const formatted = decimals > 0
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString('ru-RU')
    return `${prefix}${formatted}${suffix}`
  })
  const [text, setText] = useState(`${prefix}0${suffix}`)

  useEffect(() => {
    display.on('change', setText)
    const controls = animate(motionVal, value, { duration: 1.2, ease: 'easeOut' })
    return controls.stop
  }, [value])

  return <span>{text}</span>
}

// SVG-спарклайн для карточки проекта
function Sparkline({ positive }) {
  const points = Array.from({ length: 10 }, (_, i) => ({
    x: (i / 9) * 80,
    y: 20 - Math.max(2, Math.min(18, 10 + (Math.random() - (positive ? 0.35 : 0.65)) * 10)),
  }))
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const color = positive ? '#22C55E' : '#EF4444'

  return (
    <svg viewBox="0 0 80 22" className="w-20 h-6" style={{ overflow: 'visible' }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
    </svg>
  )
}

// SVG-график общего расхода
function SpendChart({ data }) {
  const [pathLength, setPathLength] = useState(0)
  const W = 700, H = 140, PAD = 8
  const maxSpend = Math.max(...data.map(d => d.spend))
  const minSpend = Math.min(...data.map(d => d.spend))
  const px = (i) => PAD + (i / (data.length - 1)) * (W - PAD * 2)
  const py = (v) => H - PAD - ((v - minSpend) / (maxSpend - minSpend || 1)) * (H - PAD * 2)
  const spendPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(d.spend)}`).join(' ')
  // Area fill
  const areaPath = spendPath + ` L ${px(data.length - 1)} ${H - PAD} L ${px(0)} ${H - PAD} Z`

  useEffect(() => {
    animate(0, 1, { duration: 1.5, ease: 'easeInOut', onUpdate: setPathLength })
  }, [])

  const labels = data.filter((_, i) => i % 5 === 0 || i === data.length - 1)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" style={{ height: 180 }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={PAD} y1={PAD + t * (H - PAD * 2)} x2={W - PAD} y2={PAD + t * (H - PAD * 2)} stroke="#EEEEEE" strokeWidth="1" />
        ))}
        {/* Area */}
        <motion.path d={areaPath} fill="#FFD600" opacity={0.08} style={{ pathLength }} />
        {/* Line */}
        <motion.path d={spendPath} fill="none" stroke="#FFD600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength }} />
        {labels.map((d) => {
          const idx = data.indexOf(d)
          return (
            <text key={idx} x={px(idx)} y={H + 18} textAnchor="middle" fontSize="10" fill="#AAAAAA">{d.date}</text>
          )
        })}
      </svg>
      <div className="flex items-center gap-2 mt-1">
        <div className="w-4 h-0.5 rounded" style={{ backgroundColor: '#FFD600' }} />
        <span className="text-xs text-[#888]">Общий расход по всем сайтам</span>
      </div>
    </div>
  )
}

const statCards = [
  { label: 'Показы', value: 284190, delta: '+12%', positive: true, icon: Eye, iconColor: '#2563EB', suffix: '' },
  { label: 'Клики', value: 8432, delta: '+8%', positive: true, icon: MousePointerClick, iconColor: '#22C55E', suffix: '' },
  { label: 'CTR', value: 2.97, decimals: 2, delta: '-0.3%', positive: false, icon: Percent, iconColor: '#FF9500', suffix: '%' },
  { label: 'Расход', value: 41280, delta: 'из 60 000 ₽', positive: null, icon: Wallet, iconColor: '#7C3AED', suffix: ' ₽' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('30d')

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Мои сайты</h1>
          <p className="text-[#888888] text-sm mt-0.5">8 марта 2026 · 3 проекта, 6 кампаний</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Период */}
          <div className="flex rounded-lg border border-[#EEEEEE] bg-white overflow-hidden">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  period === p ? 'bg-[#111111] text-white' : 'text-[#888888] hover:bg-[#F5F5F7]'
                }`}
              >
                {p === '7d' ? '7 дн' : p === '30d' ? '30 дн' : '90 дн'}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/add-site')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            <Plus size={16} />
            Добавить сайт
          </motion.button>
        </div>
      </div>

      {/* Баннер нового отчёта */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white rounded-xl border border-[#EEEEEE] px-5 py-3 mb-6"
        style={{ borderLeft: '4px solid #FFD600' }}
      >
        <div className="flex items-center gap-3">
          <Bell size={18} style={{ color: '#FFD600' }} />
          <span className="text-sm text-[#111111] font-medium">
            Новый еженедельный отчёт готов — рекомендации ИИ по вашим кампаниям
          </span>
        </div>
        <button
          onClick={() => navigate('/report')}
          className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap"
          style={{ color: '#111111' }}
        >
          Смотреть <ChevronRight size={16} />
        </button>
      </motion.div>

      {/* Сводные карточки */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
            className="bg-white rounded-2xl p-5 border border-[#EEEEEE] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#888888]">{card.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.iconColor + '18' }}>
                <card.icon size={16} style={{ color: card.iconColor }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#111111] mb-1">
              <AnimatedNumber value={card.value} suffix={card.suffix} decimals={card.decimals || 0} />
            </div>
            {card.positive !== null ? (
              <div className={`flex items-center gap-1 text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-500'}`}>
                {card.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.delta}
              </div>
            ) : (
              <div className="text-xs text-[#AAAAAA]">{card.delta}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Карточки проектов */}
      <h2 className="font-semibold text-[#111111] mb-4">Проекты</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
            className={`bg-white rounded-2xl border-2 p-5 transition-all cursor-pointer ${
              project.status === 'paused' ? 'border-[#EEEEEE] opacity-75' : 'border-[#EEEEEE] hover:border-gray-300'
            }`}
            onClick={() => navigate('/report')}
          >
            {/* Заголовок проекта */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-[#888]" />
                <div>
                  <div className="font-semibold text-sm text-[#111111]">{project.name}</div>
                  <div className="text-xs text-[#AAAAAA]">{project.topic}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-[#888]">{project.status === 'active' ? 'Активен' : 'На паузе'}</span>
              </div>
            </div>

            {/* Метрики */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-xs text-[#AAAAAA] mb-0.5">Кампании</div>
                <div className="text-lg font-bold text-[#111]">{project.campaigns}</div>
              </div>
              <div>
                <div className="text-xs text-[#AAAAAA] mb-0.5">Клики</div>
                <div className="text-lg font-bold text-[#111]">{project.clicks.toLocaleString('ru-RU')}</div>
              </div>
              <div>
                <div className="text-xs text-[#AAAAAA] mb-0.5">Расход</div>
                <div className="text-sm font-semibold text-[#111]">{project.spend.toLocaleString('ru-RU')} ₽</div>
              </div>
              <div>
                <div className="text-xs text-[#AAAAAA] mb-0.5">Тренд</div>
                <div className={`text-sm font-semibold flex items-center gap-1 ${project.positive ? 'text-green-600' : 'text-red-500'}`}>
                  {project.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {project.delta}
                </div>
              </div>
            </div>

            {/* Спарклайн */}
            <div className="flex items-center justify-between">
              <Sparkline positive={project.positive} />
              <div className="text-right">
                <div className="text-xs text-[#AAAAAA]">Бюджет</div>
                <div className="w-20 h-1.5 bg-[#EEEEEE] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(project.spend / project.budget) * 100}%`,
                      backgroundColor: (project.spend / project.budget) > 0.85 ? '#FF4444' : '#22C55E',
                    }}
                  />
                </div>
                <div className="text-xs text-[#AAAAAA] mt-0.5">
                  {Math.round((project.spend / project.budget) * 100)}%
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Кнопка добавить сайт */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + projects.length * 0.08 }}
          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
          onClick={() => navigate('/add-site')}
          className="bg-white rounded-2xl border-2 border-dashed border-[#DDDDDD] p-5 flex flex-col items-center justify-center gap-3 text-[#AAAAAA] hover:border-[#FFD600] hover:text-[#111111] transition-all min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
            <Plus size={24} className="text-[#AAAAAA]" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm">Добавить сайт</div>
            <div className="text-xs mt-0.5">Подключить новый проект</div>
          </div>
        </motion.button>
      </div>

      {/* Нет подключения к Директу — варнинг */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-start gap-4"
      >
        <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-orange-800 text-sm mb-1">Нет подключения к Яндекс.Директ</div>
          <p className="text-orange-600 text-xs mb-3">
            Данные демонстрационные. Для работы с реальными кампаниями настройте OAuth-токен.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/credentials')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors border border-orange-300"
            >
              Настроить токены
            </button>
          </div>
        </div>
      </motion.div>

      {/* График общего расхода */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-white rounded-2xl border border-[#EEEEEE] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#111111]">Динамика расходов за 30 дней</h2>
          <span className="text-xs text-[#AAAAAA]">Все проекты</span>
        </div>
        <SpendChart data={chartData} />
      </motion.div>
    </div>
  )
}
