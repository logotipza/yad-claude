// Страница результатов анализа — ключевики, минус-фразы, креативы
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, RefreshCw, ChevronLeft, ChevronRight,
  Check, ArrowRight, Globe, X
} from 'lucide-react'
import { useToastCtx } from '../App'

// Моковые ключевые слова
const KEYWORDS = [
  { id: 1, word: 'купить смартфон', freq: 148200, competition: 87, type: 'hot' },
  { id: 2, word: 'смартфон цена', freq: 89400, competition: 72, type: 'hot' },
  { id: 3, word: 'лучший смартфон 2026', freq: 67300, competition: 65, type: 'warm' },
  { id: 4, word: 'смартфон недорого', freq: 54200, competition: 58, type: 'warm' },
  { id: 5, word: 'купить айфон', freq: 43100, competition: 91, type: 'hot' },
  { id: 6, word: 'iphone 16 цена', freq: 38900, competition: 89, type: 'hot' },
  { id: 7, word: 'смартфон отзывы', freq: 31200, competition: 34, type: 'cold' },
  { id: 8, word: 'сравнение смартфонов', freq: 28700, competition: 41, type: 'cold' },
  { id: 9, word: 'xiaomi redmi купить', freq: 24100, competition: 53, type: 'warm' },
  { id: 10, word: 'samsung galaxy s25', freq: 21300, competition: 76, type: 'hot' },
  { id: 11, word: 'смартфон с хорошей камерой', freq: 18900, competition: 47, type: 'warm' },
  { id: 12, word: 'смартфон 2026 топ', freq: 14200, competition: 29, type: 'cold' },
]

const MINUS = [
  'скачать', 'бесплатно', 'своими руками', 'ремонт', 'инструкция',
  'характеристики', 'фото', 'видео обзор', 'б/у', 'секонд хенд',
  'китайский', 'реплика', 'чехол', 'аксессуары', 'зарядное устройство',
  'наушники', 'защитное стекло', 'power bank', 'флешка', 'sim карта',
  'отзыв', 'рейтинг', 'форум', 'пикабу',
]

const CREATIVES = [
  {
    id: 1, model: 'YandexGPT',
    title: 'Смартфоны 2026 — лучшие цены!',
    desc: 'Огромный выбор смартфонов от топовых брендов. Доставка за 1 день. Гарантия 2 года. Скидки до 30%!',
  },
  {
    id: 2, model: 'YandexGPT',
    title: 'Купите смартфон выгодно',
    desc: 'iPhone, Samsung, Xiaomi — все модели в наличии. Официальная гарантия. Рассрочка 0%.',
  },
  {
    id: 3, model: 'GigaChat',
    title: 'Новые смартфоны уже здесь',
    desc: 'Флагманы и бюджетные модели. Быстрая доставка по России. Возврат в течение 14 дней.',
  },
  {
    id: 4, model: 'Claude',
    title: 'Смартфон вашей мечты — у нас',
    desc: 'Выбирайте из 500+ моделей. Профессиональные консультации. Сервис и поддержка 24/7.',
  },
  {
    id: 5, model: 'YandexGPT',
    title: 'Топ смартфонов по цене/качеству',
    desc: 'Рейтинг 2026. Эксперты выбрали лучшие модели специально для вас. Заказ в 2 клика.',
  },
  {
    id: 6, model: 'GigaChat',
    title: 'Скидки на iPhone и Samsung!',
    desc: 'Только сейчас — до 40% на флагманы. Успейте до конца недели. Бесплатная доставка.',
  },
]

const TYPE_LABELS = { hot: 'Горячий', warm: 'Тёплый', cold: 'Холодный' }
const TYPE_COLORS = {
  hot: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  warm: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  cold: { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' },
}

const MODEL_COLORS = {
  YandexGPT: { bg: '#FFF9E6', text: '#92400E', border: '#FDE68A' },
  GigaChat: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  Claude: { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
}

function CompetitionBar({ value }) {
  const color = value >= 75 ? '#FF4444' : value >= 50 ? '#FF9500' : '#22C55E'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#EEEEEE] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-[#888888]">{value}%</span>
    </div>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const [tab, setTab] = useState('keywords')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [newMinus, setNewMinus] = useState('')
  const [extraMinus, setExtraMinus] = useState([])
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const url = sessionStorage.getItem('analyzeUrl') || 'https://example.ru'

  const filtered = KEYWORDS.filter(k =>
    k.word.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleSelect = (id) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map(k => k.id)))
  }

  const handleCreateCampaign = () => {
    navigate('/campaign/create')
  }

  const addMinusPhrase = () => {
    if (newMinus.trim()) {
      setExtraMinus(prev => [...prev, newMinus.trim()])
      setNewMinus('')
    }
  }

  const allMinus = [...MINUS, ...extraMinus]

  const TABS = [
    { id: 'keywords', label: `Ключевые слова (${KEYWORDS.length})` },
    { id: 'minus', label: `Минус-фразы (${allMinus.length})` },
    { id: 'creatives', label: `Креативы (${CREATIVES.length})` },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24">
      {/* Шапка */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Результаты анализа</h1>
          <div className="flex items-center gap-2 mt-1">
            <Globe size={14} className="text-[#AAAAAA]" />
            <span className="text-sm text-[#888888] font-mono">{url}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCreateCampaign}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: '#FFD600', color: '#111111' }}
        >
          <Plus size={16} />
          Создать кампанию
        </motion.button>
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
                layoutId="tab-bg"
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: '#FFD600' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Контент табов */}
      <AnimatePresence mode="wait">
        {tab === 'keywords' && (
          <motion.div
            key="keywords"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Поиск */}
            <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
              <div className="p-4 border-b border-[#EEEEEE] flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Поиск ключевиков..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-[#EEEEEE] rounded-lg focus:outline-none focus:border-[#FFD600] transition-colors"
                  />
                </div>
                <span className="text-sm text-[#888888]">
                  Найдено: {filtered.length}
                </span>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EEEEEE] bg-[#FAFAFA]">
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.size === paginated.length && paginated.length > 0}
                        onChange={toggleAll}
                        className="w-4 h-4 accent-[#FFD600] cursor-pointer"
                      />
                    </th>
                    <th className="text-left text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-4 py-3">
                      Ключевое слово
                    </th>
                    <th className="text-left text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-4 py-3">
                      Частота/мес
                    </th>
                    <th className="text-left text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-4 py-3">
                      Конкуренция
                    </th>
                    <th className="text-left text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-4 py-3">
                      Тип
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.map((kw, i) => {
                      const typeStyle = TYPE_COLORS[kw.type]
                      return (
                        <motion.tr
                          key={kw.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => toggleSelect(kw.id)}
                          className={`border-b border-[#EEEEEE] last:border-0 cursor-pointer transition-colors ${
                            selected.has(kw.id) ? 'bg-[#FFFDE7]' : 'hover:bg-[#FAFAFA]'
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              checked={selected.has(kw.id)}
                              onChange={() => toggleSelect(kw.id)}
                              onClick={e => e.stopPropagation()}
                              className="w-4 h-4 accent-[#FFD600] cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3.5 text-sm font-medium text-[#111111]">{kw.word}</td>
                          <td className="px-4 py-3.5 text-sm text-[#888888]">
                            {kw.freq.toLocaleString('ru-RU')}
                          </td>
                          <td className="px-4 py-3.5">
                            <CompetitionBar value={kw.competition} />
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: typeStyle.bg,
                                color: typeStyle.text,
                                borderColor: typeStyle.border,
                              }}
                            >
                              {TYPE_LABELS[kw.type]}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Пагинация */}
              <div className="px-6 py-3 border-t border-[#EEEEEE] flex items-center justify-between">
                <span className="text-sm text-[#888888]">
                  Страница {page} из {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1.5 rounded-lg border border-[#EEEEEE] disabled:opacity-40 hover:bg-[#F5F5F7] transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1.5 rounded-lg border border-[#EEEEEE] disabled:opacity-40 hover:bg-[#F5F5F7] transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'minus' && (
          <motion.div
            key="minus"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-[#EEEEEE] p-6"
          >
            <h3 className="font-semibold text-[#111111] mb-4">
              Минус-фразы ({allMinus.length})
            </h3>
            {/* Облако минус-фраз */}
            <div className="flex flex-wrap gap-2 mb-6">
              <AnimatePresence>
                {allMinus.map((phrase, i) => (
                  <motion.span
                    key={phrase}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#FFF1F1', color: '#FF4444', border: '1px solid #FFD0D0' }}
                  >
                    —{phrase}
                    {i >= MINUS.length && (
                      <button
                        onClick={() => setExtraMinus(prev => prev.filter(m => m !== phrase))}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            {/* Добавить свою */}
            <div className="flex gap-2">
              <input
                value={newMinus}
                onChange={e => setNewMinus(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMinusPhrase()}
                placeholder="Добавить минус-фразу..."
                className="flex-1 max-w-xs px-4 py-2 text-sm border border-[#EEEEEE] rounded-lg focus:outline-none focus:border-[#FFD600] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={addMinusPhrase}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
              >
                <Plus size={14} />
                Добавить
              </motion.button>
            </div>
          </motion.div>
        )}

        {tab === 'creatives' && (
          <motion.div
            key="creatives"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {CREATIVES.map((c, i) => {
              const mc = MODEL_COLORS[c.model] || MODEL_COLORS.YandexGPT
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
                  className="bg-white rounded-2xl border border-[#EEEEEE] p-5 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-md border"
                      style={{ backgroundColor: mc.bg, color: mc.text, borderColor: mc.border }}
                    >
                      {c.model}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[#111111] text-sm mb-2 leading-snug">{c.title}</h4>
                  <p className="text-[#888888] text-sm leading-relaxed mb-4">{c.desc}</p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToast({ message: 'Объявление добавлено в кампанию', type: 'success' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: '#FFD600', color: '#111111' }}
                    >
                      <Check size={13} /> Добавить
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#EEEEEE] text-[#888888] hover:text-[#111111] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <RefreshCw size={13} /> Ещё раз
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Нижний бар при выборе ключевиков */}
      <AnimatePresence>
        {selected.size > 0 && tab === 'keywords' && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div
              className="flex items-center gap-6 px-6 py-3.5 rounded-2xl shadow-xl"
              style={{ backgroundColor: '#111111' }}
            >
              <span className="text-white text-sm font-medium">
                Выбрано <span style={{ color: '#FFD600' }}>{selected.size}</span> ключевик{selected.size === 1 ? '' : 'а'}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: '#FFD600', color: '#111111' }}
              >
                Создать кампанию
                <ArrowRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
