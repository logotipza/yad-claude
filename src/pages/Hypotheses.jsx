// Страница ИИ гипотез — тексты объявлений и изображения для РСЯ
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, RefreshCw, Plus, Sparkles } from 'lucide-react'
import { useToastCtx } from '../App'

const MODEL_COLORS = {
  YandexGPT: { bg: '#FFF9E6', text: '#92400E', border: '#FDE68A' },
  GigaChat: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  Claude: { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
}

const IMAGE_GRADIENTS = [
  'linear-gradient(135deg, #FFD600 0%, #FF9500 100%)',
  'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)',
  'linear-gradient(135deg, #FF4444 0%, #FF9500 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  'linear-gradient(135deg, #111111 0%, #374151 100%)',
]

const INITIAL_ADS = [
  { id: 1, model: 'YandexGPT', score: 5, title: 'Смартфоны 2026 — лучшие цены!', desc: 'Огромный выбор от топ-брендов. Доставка за 1 день. Гарантия 2 года. Скидки до 30%!' },
  { id: 2, model: 'GigaChat', score: 4, title: 'Купите смартфон выгодно', desc: 'iPhone, Samsung, Xiaomi — официальный магазин. Рассрочка 0%. Trade-in.' },
  { id: 3, model: 'Claude', score: 5, title: 'Смартфон вашей мечты — у нас', desc: '500+ моделей в наличии. Консультация экспертов. Доставка по всей России.' },
  { id: 4, model: 'YandexGPT', score: 3, title: 'Новые смартфоны — скидки до 40%!', desc: 'Только до конца недели. Флагманы и бюджетные модели. Бесплатная доставка.' },
]

const INITIAL_IMAGES = [
  { id: 1, gradient: IMAGE_GRADIENTS[0], label: 'Смартфоны', format: '1:1' },
  { id: 2, gradient: IMAGE_GRADIENTS[1], label: 'iPhone 16', format: '4:3' },
  { id: 3, gradient: IMAGE_GRADIENTS[2], label: 'Акция', format: '16:9' },
  { id: 4, gradient: IMAGE_GRADIENTS[3], label: 'Распродажа', format: '1:1' },
  { id: 5, gradient: IMAGE_GRADIENTS[4], label: 'Xiaomi', format: '4:3' },
  { id: 6, gradient: IMAGE_GRADIENTS[5], label: 'Premium', format: '16:9' },
]

function StarRating({ score }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={12}
          fill={s <= score ? '#FFD600' : 'none'}
          stroke={s <= score ? '#FFD600' : '#DDDDDD'}
        />
      ))}
    </div>
  )
}

function AdCard({ ad, loading, onAdd, onRegenerate }) {
  const mc = MODEL_COLORS[ad.model] || MODEL_COLORS.YandexGPT

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5">
        <div className="shimmer h-4 w-24 rounded mb-3" />
        <div className="shimmer h-5 w-full rounded mb-2" />
        <div className="shimmer h-12 w-full rounded mb-4" />
        <div className="shimmer h-8 w-32 rounded" />
      </div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#EEEEEE] p-5 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-md border"
          style={{ backgroundColor: mc.bg, color: mc.text, borderColor: mc.border }}
        >
          {ad.model}
        </span>
        <StarRating score={ad.score} />
      </div>
      <h4 className="font-semibold text-sm text-[#111111] mb-1.5 leading-snug">{ad.title}</h4>
      <p className="text-sm text-[#888888] leading-relaxed mb-4">{ad.desc}</p>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onAdd(ad)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#FFD600', color: '#111111' }}
        >
          <Plus size={13} />
          Добавить в кампанию
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onRegenerate(ad.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#EEEEEE] text-[#888888] hover:text-[#111111] hover:bg-[#F5F5F7] transition-colors"
        >
          <RefreshCw size={13} />
          Ещё раз
        </motion.button>
      </div>
    </motion.div>
  )
}

function ImageCard({ img, loading, onUse, onRegenerate }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden">
        <div className="shimmer h-36 w-full" />
        <div className="p-4">
          <div className="shimmer h-4 w-20 rounded mb-3" />
          <div className="shimmer h-8 w-28 rounded" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden hover:shadow-md transition-all"
    >
      {/* Цветной градиент вместо изображения */}
      <div
        className="h-36 w-full flex items-center justify-center relative"
        style={{ background: img.gradient }}
      >
        <span className="text-white font-bold text-xl opacity-50">{img.label}</span>
        <span
          className="absolute top-2 right-2 text-xs font-mono px-2 py-0.5 rounded"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white' }}
        >
          {img.format}
        </span>
      </div>
      <div className="p-4">
        <div className="text-sm font-medium text-[#111111] mb-3">{img.label}</div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onUse(img)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            Использовать
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onRegenerate(img.id)}
            className="p-1.5 rounded-lg border border-[#EEEEEE] text-[#888888] hover:text-[#111111] hover:bg-[#F5F5F7] transition-colors"
          >
            <RefreshCw size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hypotheses() {
  const { addToast } = useToastCtx()
  const [ads, setAds] = useState(INITIAL_ADS)
  const [images, setImages] = useState(INITIAL_IMAGES)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))

    // Новые варианты после генерации
    setAds([
      { id: Date.now() + 1, model: 'YandexGPT', score: 5, title: 'Топ смартфонов 2026 — выбор экспертов', desc: 'Лучшие модели по соотношению цена/качество. Честный рейтинг. Быстрая доставка.' },
      { id: Date.now() + 2, model: 'Claude', score: 4, title: 'Смартфон как у друга — уже у вас', desc: 'Сравните 500 моделей за 2 минуты. Наши эксперты помогут с выбором. Гарантия лучшей цены.' },
      { id: Date.now() + 3, model: 'GigaChat', score: 4, title: 'Март — лучшее время купить смартфон', desc: 'Весенние скидки до 35%. Новинки 2026 уже в наличии. Рассрочка на 12 месяцев.' },
      { id: Date.now() + 4, model: 'YandexGPT', score: 3, title: 'Обновите смартфон сегодня!', desc: 'Trade-in вашего старого телефона. Получите до 15 000 ₽ скидки. Официальная гарантия.' },
    ])
    setImages(INITIAL_IMAGES.map((img, i) => ({
      ...img,
      gradient: IMAGE_GRADIENTS[(i + 3) % IMAGE_GRADIENTS.length],
    })))

    setGenerating(false)
    addToast({ message: 'Новые гипотезы сгенерированы!', type: 'success' })
  }

  const handleAddAd = (ad) => {
    addToast({ message: `Объявление «${ad.title.slice(0, 30)}...» добавлено в кампанию`, type: 'success' })
  }

  const handleRegenerateAd = async (id) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, _loading: true } : a))
    await new Promise(r => setTimeout(r, 1200))
    setAds(prev => prev.map(a => a.id === id ? {
      ...a,
      _loading: false,
      score: Math.floor(Math.random() * 2) + 3,
      title: ['Лучший смартфон по вашему запросу', 'Смартфон с гарантией качества', 'Выгодная покупка смартфона'][Math.floor(Math.random() * 3)],
      desc: 'Обновлённый текст объявления от нейросети. Протестируйте этот вариант.',
    } : a))
  }

  const handleUseImage = (img) => {
    addToast({ message: `Изображение «${img.label}» добавлено в объявление`, type: 'success' })
  }

  const handleRegenerateImage = async (id) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, _loading: true } : img))
    await new Promise(r => setTimeout(r, 1000))
    const gi = Math.floor(Math.random() * IMAGE_GRADIENTS.length)
    setImages(prev => prev.map(img => img.id === id ? { ...img, _loading: false, gradient: IMAGE_GRADIENTS[gi] } : img))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Шапка */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">ИИ Гипотезы</h1>
          <p className="text-[#888888] text-sm mt-0.5">Тексты и изображения, сгенерированные нейросетями</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-70"
          style={{ background: generating ? '#6D28D9' : 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' }}
        >
          {generating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Генерируем...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Сгенерировать новые
            </>
          )}
        </motion.button>
      </div>

      {/* 2-колоночный лейаут */}
      <div className="grid grid-cols-2 gap-6">
        {/* Левая колонка — тексты */}
        <div>
          <h2 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
            Тексты объявлений
            <span className="text-xs font-normal text-[#AAAAAA]">({ads.length} вариантов)</span>
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  loading={generating || ad._loading}
                  onAdd={handleAddAd}
                  onRegenerate={handleRegenerateAd}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Правая колонка — изображения */}
        <div>
          <h2 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
            Изображения для РСЯ
            <span className="text-xs font-normal text-[#AAAAAA]">({images.length} вариантов)</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {images.map((img) => (
                <ImageCard
                  key={img.id}
                  img={img}
                  loading={generating || img._loading}
                  onUse={handleUseImage}
                  onRegenerate={handleRegenerateImage}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
