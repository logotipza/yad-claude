// Главный дашборд — статистика, график, таблица кампаний
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Plus, Bell, ChevronRight,
  Eye, MousePointerClick, Percent, Wallet, MoreHorizontal,
  Play, Pause, Settings
} from 'lucide-react'

// Моковые данные для графика (30 дней)
const generateChartData = () => {
  const days = []
  let clicks = 220
  let impressions = 7500
  for (let i = 0; i < 30; i++) {
    clicks = Math.max(100, clicks + (Math.random() - 0.45) * 40)
    impressions = Math.max(5000, impressions + (Math.random() - 0.45) * 600)
    const date = new Date(2026, 1, i + 6)
    days.push({
      date: `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
      clicks: Math.round(clicks),
      impressions: Math.round(impressions),
    })
  }
  return days
}
const chartData = generateChartData()

const campaigns = [
  { id: '1', name: 'Смартфоны — Поиск', status: 'active', impressions: 142300, clicks: 4210, ctr: 2.96, spend: 21400, budget: 30000 },
  { id: '2', name: 'iPhone — РСЯ', status: 'active', impressions: 98700, clicks: 3120, ctr: 3.16, spend: 14800, budget: 20000 },
  { id: '3', name: 'Xiaomi — Поиск', status: 'paused', impressions: 43190, clicks: 1102, ctr: 2.55, spend: 5080, budget: 10000 },
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

// SVG-график с анимацией
function LineChart({ data }) {
  const [pathLength, setPathLength] = useState(0)
  const svgRef = useRef(null)

  const W = 700, H = 160, PAD = 8
  const maxClicks = Math.max(...data.map(d => d.clicks))
  const minClicks = Math.min(...data.map(d => d.clicks))
  const maxImp = Math.max(...data.map(d => d.impressions))
  const minImp = Math.min(...data.map(d => d.impressions))

  const px = (i) => PAD + (i / (data.length - 1)) * (W - PAD * 2)
  const pyClicks = (v) => H - PAD - ((v - minClicks) / (maxClicks - minClicks || 1)) * (H - PAD * 2)
  const pyImp = (v) => H - PAD - ((v - minImp) / (maxImp - minImp || 1)) * (H - PAD * 2) * 0.6 - 10

  const clicksPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${pyClicks(d.clicks)}`).join(' ')
  const impPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${pyImp(d.impressions)}`).join(' ')

  useEffect(() => {
    animate(0, 1, {
      duration: 1.5,
      ease: 'easeInOut',
      onUpdate: setPathLength,
    })
  }, [])

  // Показываем каждую 5-ю метку
  const labels = data.filter((_, i) => i % 5 === 0 || i === data.length - 1)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" style={{ height: 200 }}>
        {/* Горизонтальные линии сетки */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PAD} y1={PAD + t * (H - PAD * 2)}
            x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
            stroke="#EEEEEE" strokeWidth="1"
          />
        ))}

        {/* Линия показов */}
        <motion.path
          d={impPath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="1"
          strokeDashoffset="0"
          opacity={0.4}
          style={{ pathLength }}
        />

        {/* Линия кликов */}
        <motion.path
          d={clicksPath}
          fill="none"
          stroke="#FFD600"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength }}
        />

        {/* Метки по X */}
        {labels.map((d) => {
          const idx = data.indexOf(d)
          return (
            <text
              key={idx}
              x={px(idx)}
              y={H + 18}
              textAnchor="middle"
              fontSize="10"
              fill="#AAAAAA"
            >
              {d.date}
            </text>
          )
        })}
      </svg>

      {/* Легенда */}
      <div className="flex items-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: '#FFD600' }} />
          <span className="text-xs text-[#888888]">Клики</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: '#2563EB' }} />
          <span className="text-xs text-[#888888]">Показы</span>
        </div>
      </div>
    </div>
  )
}

const statCards = [
  {
    label: 'Показы',
    value: 284190,
    delta: '+12%',
    positive: true,
    icon: Eye,
    iconColor: '#2563EB',
    suffix: '',
  },
  {
    label: 'Клики',
    value: 8432,
    delta: '+8%',
    positive: true,
    icon: MousePointerClick,
    iconColor: '#22C55E',
    suffix: '',
  },
  {
    label: 'CTR',
    value: 2.97,
    decimals: 2,
    delta: '-0.3%',
    positive: false,
    icon: Percent,
    iconColor: '#FF9500',
    suffix: '%',
  },
  {
    label: 'Расход',
    value: 41280,
    delta: 'из 60 000 ₽',
    positive: null,
    icon: Wallet,
    iconColor: '#7C3AED',
    prefix: '',
    suffix: ' ₽',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('30d')
  const [hoveredRow, setHoveredRow] = useState(null)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Шапка */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Обзор кампаний</h1>
          <p className="text-[#888888] text-sm mt-0.5">8 марта 2026</p>
        </div>
        <div className="flex items-center gap-3">
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
                {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : '90 дней'}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/campaign/create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            <Plus size={16} />
            Новая кампания
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
          className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          style={{ color: '#111111' }}
        >
          Смотреть <ChevronRight size={16} />
        </button>
      </motion.div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.iconColor + '18' }}
              >
                <card.icon size={16} style={{ color: card.iconColor }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#111111] mb-1">
              {card.prefix || ''}
              <AnimatedNumber
                value={card.value}
                suffix={card.suffix}
                decimals={card.decimals || 0}
              />
            </div>
            {card.positive !== null ? (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-500'}`}
              >
                {card.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.delta}
              </div>
            ) : (
              <div className="text-xs text-[#AAAAAA]">{card.delta}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* График */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl border border-[#EEEEEE] p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#111111]">Динамика за 30 дней</h2>
        </div>
        <LineChart data={chartData} />
      </motion.div>

      {/* Таблица кампаний */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#EEEEEE]">
          <h2 className="font-semibold text-[#111111]">Кампании</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EEEEEE]">
              {['Кампания', 'Статус', 'Показы', 'Клики', 'CTR', 'Расход', 'Бюджет/день', ''].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-6 py-3 first:pl-6"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                onMouseEnter={() => setHoveredRow(c.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => navigate(`/campaign/${c.id}`)}
                className="border-b border-[#EEEEEE] last:border-0 cursor-pointer transition-colors hover:bg-[#F5F5F7]"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-sm text-[#111111]">{c.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: c.status === 'active' ? '#22C55E' : '#AAAAAA' }}
                    />
                    <span className="text-sm text-[#888888]">
                      {c.status === 'active' ? 'Активна' : 'На паузе'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#111111]">
                  {c.impressions.toLocaleString('ru-RU')}
                </td>
                <td className="px-6 py-4 text-sm text-[#111111]">
                  {c.clicks.toLocaleString('ru-RU')}
                </td>
                <td className="px-6 py-4 text-sm text-[#111111]">{c.ctr}%</td>
                <td className="px-6 py-4 text-sm text-[#111111]">
                  {c.spend.toLocaleString('ru-RU')} ₽
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-[#111111]">
                      {(c.budget / 30).toFixed(0).toLocaleString()} ₽
                    </div>
                    <div className="w-24 h-1.5 bg-[#EEEEEE] rounded-full overflow-hidden">
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
                <td className="px-6 py-4">
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredRow === c.id ? 1 : 0 }}
                  >
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-[#EEEEEE] text-[#888888] hover:text-[#111111] transition-colors"
                    >
                      {c.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-[#EEEEEE] text-[#888888] hover:text-[#111111] transition-colors"
                    >
                      <Settings size={14} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-[#EEEEEE] text-[#888888] hover:text-[#111111] transition-colors"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </motion.div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
