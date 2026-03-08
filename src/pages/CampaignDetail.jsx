// Страница деталей кампании — статистика, объявления, ключевики, настройки
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, AlertTriangle, Eye, MousePointerClick,
  Percent, Wallet, RefreshCw, Settings, ToggleLeft, ToggleRight,
  Edit3, Play, Pause
} from 'lucide-react'
import { useToastCtx } from '../App'

const campaigns = {
  '1': { name: 'Смартфоны — Поиск', type: 'Поиск' },
  '2': { name: 'iPhone — РСЯ', type: 'РСЯ' },
  '3': { name: 'Xiaomi — Поиск', type: 'Поиск' },
}

const ADS = [
  { id: 1, title: 'Купить смартфон в Москве', desc: 'Огромный выбор. Доставка за 1 день. Гарантия.', clicks: 1240, ctr: 3.4, status: 'active', lowCtr: false },
  { id: 2, title: 'Смартфоны от 5999 ₽', desc: 'Бюджетные и флагманские модели. Рассрочка 0%.', clicks: 890, ctr: 1.2, status: 'active', lowCtr: true },
  { id: 3, title: 'iPhone 16 по лучшей цене', desc: 'Официальный магазин. Гарантия Apple. Trade-in.', clicks: 2100, ctr: 4.8, status: 'active', lowCtr: false },
  { id: 4, title: 'Смартфон Xiaomi за 9999', desc: 'Топовые характеристики за небольшие деньги.', clicks: 340, ctr: 0.9, status: 'paused', lowCtr: true },
]

const KEYWORDS = [
  { id: 1, word: 'купить смартфон', freq: 148200, competition: 87, type: 'hot' },
  { id: 2, word: 'смартфон цена', freq: 89400, competition: 72, type: 'hot' },
  { id: 3, word: 'лучший смартфон 2026', freq: 67300, competition: 65, type: 'warm' },
  { id: 4, word: 'смартфон недорого', freq: 54200, competition: 58, type: 'warm' },
  { id: 5, word: 'купить айфон', freq: 43100, competition: 91, type: 'hot' },
]

const TYPE_COLORS = {
  hot: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  warm: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  cold: { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' },
}
const TYPE_LABELS = { hot: 'Горячий', warm: 'Тёплый', cold: 'Холодный' }

const statCards = [
  { label: 'Показы', value: '142 300', icon: Eye, color: '#2563EB' },
  { label: 'Клики', value: '4 210', icon: MousePointerClick, color: '#22C55E' },
  { label: 'CTR', value: '2.96%', icon: Percent, color: '#FF9500' },
  { label: 'Расход', value: '21 400 ₽', icon: Wallet, color: '#7C3AED' },
]

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const campaign = campaigns[id] || { name: 'Кампания', type: 'Поиск' }

  const [tab, setTab] = useState('ads')
  const [active, setActive] = useState(true)
  const [adStatuses, setAdStatuses] = useState({ 1: true, 2: true, 3: true, 4: false })
  const [budget, setBudget] = useState('30000')
  const [bidStrategy, setBidStrategy] = useState('auto')

  const toggleAd = (adId) => {
    setAdStatuses(prev => ({ ...prev, [adId]: !prev[adId] }))
    addToast({
      message: adStatuses[adId] ? 'Объявление поставлено на паузу' : 'Объявление активировано',
      type: 'info',
    })
  }

  const TABS = [
    { id: 'ads', label: 'Объявления' },
    { id: 'keywords', label: 'Ключевые слова' },
    { id: 'minus', label: 'Минус-фразы' },
    { id: 'settings', label: 'Настройки' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-[#888888] mb-4">
        <button onClick={() => navigate('/dashboard')} className="hover:text-[#111111] transition-colors">
          Кампании
        </button>
        <ChevronRight size={14} />
        <span className="text-[#111111] font-medium">{campaign.name}</span>
      </div>

      {/* Шапка */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#111111]">{campaign.name}</h1>
          <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[#F5F5F7] text-[#888888]">
            {campaign.type}
          </span>
          {/* Переключатель статуса */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActive(v => !v)
              addToast({ message: active ? 'Кампания остановлена' : 'Кампания запущена', type: active ? 'warning' : 'success' })
            }}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: active ? '#22C55E' : '#AAAAAA' }}
          >
            {active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
            {active ? 'Активна' : 'На паузе'}
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
        >
          <Edit3 size={15} />
          Редактировать
        </motion.button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-[#EEEEEE]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#888888]">{card.label}</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.color + '18' }}
              >
                <card.icon size={14} style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-xl font-bold text-[#111111]">{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Табы */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#EEEEEE] p-1 w-fit mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
              tab === t.id ? 'text-[#111111]' : 'text-[#888888] hover:text-[#111111]'
            }`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="campaign-tab"
                className="absolute inset-0 rounded-lg bg-[#FFD600]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Контент */}
      <AnimatePresence mode="wait">
        {tab === 'ads' && (
          <motion.div
            key="ads"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {ADS.map((ad, i) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`bg-white rounded-2xl border p-5 flex items-start gap-4 ${
                  ad.lowCtr ? 'border-red-200 bg-red-50/30' : 'border-[#EEEEEE]'
                }`}
              >
                {/* Статус toggle */}
                <button
                  onClick={() => toggleAd(ad.id)}
                  className="mt-0.5 text-[#888888] hover:text-[#111111] transition-colors flex-shrink-0"
                >
                  {adStatuses[ad.id] ? (
                    <Pause size={18} className="text-green-500" />
                  ) : (
                    <Play size={18} className="text-[#AAAAAA]" />
                  )}
                </button>

                {/* Контент */}
                <div className="flex-1">
                  {ad.lowCtr && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-500 mb-2">
                      <AlertTriangle size={12} />
                      Низкий CTR — рекомендуем обновить текст
                    </div>
                  )}
                  <h4 className={`font-semibold text-sm mb-1 ${!adStatuses[ad.id] ? 'text-[#AAAAAA] line-through' : 'text-[#111111]'}`}>
                    {ad.title}
                  </h4>
                  <p className="text-sm text-[#888888]">{ad.desc}</p>
                </div>

                {/* Метрики */}
                <div className="flex items-center gap-6 text-sm flex-shrink-0">
                  <div className="text-center">
                    <div className="font-semibold text-[#111111]">{ad.clicks}</div>
                    <div className="text-xs text-[#AAAAAA]">Клики</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-semibold ${ad.lowCtr ? 'text-red-500' : 'text-[#111111]'}`}
                    >
                      {ad.ctr}%
                    </div>
                    <div className="text-xs text-[#AAAAAA]">CTR</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg border border-[#EEEEEE] text-[#888888] hover:text-[#111111] hover:bg-[#F5F5F7] transition-colors"
                  >
                    <RefreshCw size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === 'keywords' && (
          <motion.div
            key="keywords"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                  {['Ключевое слово', 'Частота/мес', 'Конкуренция', 'Тип'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KEYWORDS.map((kw, i) => {
                  const typeStyle = TYPE_COLORS[kw.type]
                  return (
                    <motion.tr
                      key={kw.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#111111]">{kw.word}</td>
                      <td className="px-6 py-4 text-sm text-[#888888]">{kw.freq.toLocaleString('ru-RU')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#EEEEEE] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${kw.competition}%`,
                                backgroundColor: kw.competition >= 75 ? '#FF4444' : kw.competition >= 50 ? '#FF9500' : '#22C55E',
                              }}
                            />
                          </div>
                          <span className="text-xs text-[#888888]">{kw.competition}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-md border"
                          style={{ backgroundColor: typeStyle.bg, color: typeStyle.text, borderColor: typeStyle.border }}
                        >
                          {TYPE_LABELS[kw.type]}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </motion.div>
        )}

        {tab === 'minus' && (
          <motion.div
            key="minus"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-[#EEEEEE] p-6"
          >
            <div className="flex flex-wrap gap-2">
              {['скачать', 'бесплатно', 'своими руками', 'ремонт', 'б/у', 'реплика', 'чехол', 'наушники'].map(phrase => (
                <span
                  key={phrase}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: '#FFF1F1', color: '#FF4444', border: '1px solid #FFD0D0' }}
                >
                  —{phrase}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-[#EEEEEE] p-6 space-y-6"
          >
            {/* Бюджет */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">
                Дневной бюджет (₽)
              </label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-48 px-4 py-2 border border-[#EEEEEE] rounded-xl text-sm focus:outline-none focus:border-[#FFD600] transition-colors"
              />
            </div>

            {/* Стратегия ставок */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">
                Стратегия ставок
              </label>
              <div className="flex gap-3">
                {[
                  { val: 'auto', label: 'Автоматическая' },
                  { val: 'manual', label: 'Ручная' },
                  { val: 'cpa', label: 'Оптимизация CPA' },
                ].map(s => (
                  <button
                    key={s.val}
                    onClick={() => setBidStrategy(s.val)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      bidStrategy === s.val
                        ? 'border-[#FFD600] bg-[#FFFDE7] text-[#111111]'
                        : 'border-[#EEEEEE] text-[#888888] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Гео */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">
                Гео-таргетинг
              </label>
              <div className="flex flex-wrap gap-2">
                {['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Новосибирск'].map(city => (
                  <span
                    key={city}
                    className="px-3 py-1.5 text-sm rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] text-[#555555]"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addToast({ message: 'Настройки сохранены', type: 'success' })}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: '#FFD600', color: '#111111' }}
            >
              Сохранить изменения
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
