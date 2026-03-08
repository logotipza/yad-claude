// Мастер создания кампании — 4 шага
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Plus, X, Rocket } from 'lucide-react'
import { useToastCtx } from '../App'

const STEPS = ['Параметры', 'Ключевые слова', 'Объявления', 'Проверка']

// Начальные ключевики из анализа
const INITIAL_KEYWORDS = [
  'купить смартфон', 'смартфон цена', 'лучший смартфон 2026',
  'смартфон недорого', 'купить айфон', 'iphone 16 цена',
]

const INITIAL_ADS = [
  {
    id: 1,
    title: 'Смартфоны 2026 — лучшие цены!',
    desc: 'Огромный выбор от топовых брендов. Доставка за 1 день.',
  },
  {
    id: 2,
    title: 'Купите смартфон выгодно',
    desc: 'iPhone, Samsung, Xiaomi — все модели. Рассрочка 0%.',
  },
]

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: i < current ? '#22C55E' : i === current ? '#FFD600' : '#EEEEEE',
                scale: i === current ? 1.1 : 1,
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            >
              {i < current ? (
                <Check size={14} className="text-white" />
              ) : (
                <span style={{ color: i === current ? '#111111' : '#AAAAAA' }}>{i + 1}</span>
              )}
            </motion.div>
            <span
              className="text-sm font-medium hidden sm:block"
              style={{ color: i === current ? '#111111' : i < current ? '#22C55E' : '#AAAAAA' }}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-px flex-1 mx-3"
              style={{
                backgroundColor: i < current ? '#22C55E' : '#EEEEEE',
                width: 40,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Шаг 1: Параметры
function Step1({ data, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-2">Название кампании</label>
        <input
          value={data.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="Смартфоны — Поиск"
          className="w-full px-4 py-3 border border-[#EEEEEE] rounded-xl text-sm focus:outline-none focus:border-[#FFD600] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-2">Тип кампании</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: 'search', label: 'Поисковая', desc: 'Объявления в результатах поиска' },
            { val: 'rsy', label: 'РСЯ', desc: 'Рекламная сеть Яндекса' },
          ].map(t => (
            <button
              key={t.val}
              onClick={() => onChange('type', t.val)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                data.type === t.val
                  ? 'border-[#FFD600] bg-[#FFFDE7]'
                  : 'border-[#EEEEEE] hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm text-[#111111] mb-1">{t.label}</div>
              <div className="text-xs text-[#888888]">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-2">Гео-таргетинг</label>
        <div className="flex flex-wrap gap-2">
          {['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Вся Россия'].map(city => (
            <button
              key={city}
              onClick={() => {
                const geos = data.geos.includes(city)
                  ? data.geos.filter(g => g !== city)
                  : [...data.geos, city]
                onChange('geos', geos)
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                data.geos.includes(city)
                  ? 'border-[#FFD600] bg-[#FFFDE7] text-[#111111] font-medium'
                  : 'border-[#EEEEEE] text-[#888888] hover:bg-[#F5F5F7]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-2">Дневной бюджет (₽)</label>
        <input
          type="number"
          value={data.budget}
          onChange={e => onChange('budget', e.target.value)}
          className="w-48 px-4 py-3 border border-[#EEEEEE] rounded-xl text-sm focus:outline-none focus:border-[#FFD600] transition-colors"
        />
      </div>
    </motion.div>
  )
}

// Шаг 2: Ключевые слова
function Step2({ keywords, setKeywords }) {
  const [newKw, setNewKw] = useState('')

  const addKw = () => {
    if (newKw.trim() && !keywords.includes(newKw.trim())) {
      setKeywords(prev => [...prev, newKw.trim()])
      setNewKw('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <p className="text-sm text-[#888888] mb-4">
        Ключевые слова из анализа — отредактируйте по необходимости
      </p>
      <div className="flex flex-wrap gap-2 mb-4 min-h-[120px] p-4 bg-[#FAFAFA] rounded-xl border border-[#EEEEEE]">
        <AnimatePresence>
          {keywords.map(kw => (
            <motion.span
              key={kw}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: '#FFFDE7', color: '#111111', border: '1px solid #FFD600' }}
            >
              {kw}
              <button
                onClick={() => setKeywords(prev => prev.filter(k => k !== kw))}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <input
          value={newKw}
          onChange={e => setNewKw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addKw()}
          placeholder="Добавить ключевое слово..."
          className="flex-1 max-w-xs px-4 py-2 border border-[#EEEEEE] rounded-xl text-sm focus:outline-none focus:border-[#FFD600] transition-colors"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={addKw}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
        >
          <Plus size={14} />
          Добавить
        </motion.button>
      </div>
      <p className="text-xs text-[#AAAAAA] mt-3">Итого: {keywords.length} ключевых слов</p>
    </motion.div>
  )
}

// Шаг 3: Объявления
function Step3({ ads, setAds }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {ads.map((ad, i) => (
        <div key={ad.id} className="bg-[#FAFAFA] rounded-xl border border-[#EEEEEE] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#AAAAAA] uppercase">Объявление {i + 1}</span>
            {ads.length > 1 && (
              <button
                onClick={() => setAds(prev => prev.filter(a => a.id !== ad.id))}
                className="text-[#AAAAAA] hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <input
            value={ad.title}
            onChange={e => setAds(prev => prev.map(a => a.id === ad.id ? { ...a, title: e.target.value } : a))}
            placeholder="Заголовок объявления"
            maxLength={56}
            className="w-full px-3 py-2 border border-[#EEEEEE] rounded-lg text-sm font-medium focus:outline-none focus:border-[#FFD600] transition-colors mb-2 bg-white"
          />
          <textarea
            value={ad.desc}
            onChange={e => setAds(prev => prev.map(a => a.id === ad.id ? { ...a, desc: e.target.value } : a))}
            placeholder="Текст объявления"
            maxLength={81}
            rows={2}
            className="w-full px-3 py-2 border border-[#EEEEEE] rounded-lg text-sm focus:outline-none focus:border-[#FFD600] transition-colors resize-none bg-white"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-[#AAAAAA]">Заголовок: {ad.title.length}/56</span>
            <span className="text-xs text-[#AAAAAA]">Текст: {ad.desc.length}/81</span>
          </div>
        </div>
      ))}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setAds(prev => [...prev, { id: Date.now(), title: '', desc: '' }])}
        className="w-full py-3 rounded-xl border-2 border-dashed border-[#EEEEEE] text-sm text-[#888888] hover:border-[#FFD600] hover:text-[#111111] transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Добавить объявление
      </motion.button>
    </motion.div>
  )
}

// Шаг 4: Проверка
function Step4({ data, keywords, ads }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Параметры */}
      <div className="bg-[#FAFAFA] rounded-xl border border-[#EEEEEE] p-5">
        <h3 className="font-semibold text-sm text-[#111111] mb-3">Параметры кампании</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Название', value: data.name || 'Не задано' },
            { label: 'Тип', value: data.type === 'search' ? 'Поисковая' : 'РСЯ' },
            { label: 'Гео', value: data.geos.join(', ') || 'Не выбрано' },
            { label: 'Бюджет/день', value: `${Number(data.budget).toLocaleString('ru-RU')} ₽` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs text-[#AAAAAA] mb-0.5">{label}</div>
              <div className="text-sm font-medium text-[#111111]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ключевики */}
      <div className="bg-[#FAFAFA] rounded-xl border border-[#EEEEEE] p-5">
        <h3 className="font-semibold text-sm text-[#111111] mb-3">
          Ключевые слова ({keywords.length})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {keywords.slice(0, 10).map(kw => (
            <span key={kw} className="px-2.5 py-1 text-xs bg-white rounded-lg border border-[#EEEEEE] text-[#555555]">
              {kw}
            </span>
          ))}
          {keywords.length > 10 && (
            <span className="text-xs text-[#AAAAAA] self-center">+{keywords.length - 10} ещё</span>
          )}
        </div>
      </div>

      {/* Объявления */}
      <div className="bg-[#FAFAFA] rounded-xl border border-[#EEEEEE] p-5">
        <h3 className="font-semibold text-sm text-[#111111] mb-3">Объявления ({ads.length})</h3>
        <div className="space-y-2">
          {ads.map((ad, i) => (
            <div key={ad.id} className="bg-white rounded-lg border border-[#EEEEEE] p-3">
              <div className="font-medium text-sm text-[#111111] mb-0.5">{ad.title || '—'}</div>
              <div className="text-xs text-[#888888]">{ad.desc || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function CampaignCreate() {
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const [step, setStep] = useState(0)
  const [launching, setLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)

  const [formData, setFormData] = useState({
    name: 'Смартфоны — Поиск',
    type: 'search',
    geos: ['Москва'],
    budget: '30000',
  })
  const [keywords, setKeywords] = useState(INITIAL_KEYWORDS)
  const [ads, setAds] = useState(INITIAL_ADS)

  const onChange = (key, val) => setFormData(prev => ({ ...prev, [key]: val }))

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleLaunch = async () => {
    setLaunching(true)
    await new Promise(r => setTimeout(r, 1800))
    setLaunched(true)
    setTimeout(() => {
      addToast({ message: `Кампания «${formData.name}» успешно запущена!`, type: 'success' })
      navigate('/dashboard')
    }, 1200)
  }

  if (launched) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
          >
            <Check size={36} className="text-green-500" />
          </motion.div>
          <h2 className="text-xl font-bold text-[#111111] mb-2">Кампания запущена!</h2>
          <p className="text-[#888888] text-sm">Перенаправляем на дашборд...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Новая кампания</h1>
        <p className="text-[#888888] text-sm">Заполните параметры и запустите рекламу</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EEEEEE] p-8">
        {/* Индикатор шагов */}
        <StepIndicator steps={STEPS} current={step} />

        {/* Контент шага */}
        <AnimatePresence mode="wait">
          {step === 0 && <Step1 data={formData} onChange={onChange} />}
          {step === 1 && <Step2 keywords={keywords} setKeywords={setKeywords} />}
          {step === 2 && <Step3 ads={ads} setAds={setAds} />}
          {step === 3 && <Step4 data={formData} keywords={keywords} ads={ads} />}
        </AnimatePresence>

        {/* Навигация */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#EEEEEE]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#EEEEEE] text-[#888888] hover:bg-[#F5F5F7] transition-all disabled:opacity-40"
          >
            Назад
          </motion.button>

          {step < STEPS.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: '#FFD600', color: '#111111' }}
            >
              Далее
              <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLaunch}
              disabled={launching}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-70"
              style={{ backgroundColor: '#FFD600', color: '#111111' }}
            >
              {launching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  />
                  Запускаем...
                </>
              ) : (
                <>
                  <Rocket size={16} />
                  Запустить кампанию
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
