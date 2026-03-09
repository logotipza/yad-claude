// Страница добавления нового сайта — мастер с 4 шагами
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, ArrowRight, Check, X, ChevronDown, ChevronUp,
  AlertTriangle, Loader2, CheckCircle, Circle, Zap,
  ExternalLink, Plus, Edit3, Wallet, Key, Clock
} from 'lucide-react'
import { useToastCtx } from '../App'

const STEPS = ['URL сайта', 'Подключение', 'Анализ', 'Рекомендации']

// Шаг 1: Ввод URL
function StepUrl({ url, setUrl, onNext }) {
  const [error, setError] = useState('')

  const validate = () => {
    if (!url.trim()) { setError('Введите URL сайта'); return }
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`)
      if (!u.hostname.includes('.')) { setError('Некорректный URL'); return }
    } catch {
      setError('Некорректный URL')
      return
    }
    setError('')
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-xl font-bold text-[#111111] mb-2">Введите URL сайта</h2>
      <p className="text-[#888] text-sm mb-6">
        Мы проанализируем сайт, подберём ключевые слова и сгенерируем структуру рекламных кампаний
      </p>

      <div className="relative mb-2">
        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
        <input
          type="text"
          value={url}
          onChange={e => { setUrl(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && validate()}
          placeholder="rogikopyta.ru или https://rogikopyta.ru"
          className={`w-full pl-11 pr-4 py-4 rounded-xl border text-sm focus:outline-none transition-all ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-[#EEEEEE] focus:border-[#FFD600] focus:ring-2 focus:ring-[#FFD600]/20'
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={validate}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm mt-4"
        style={{ backgroundColor: '#FFD600', color: '#111111' }}
      >
        Проанализировать
        <ArrowRight size={16} />
      </motion.button>

      <div className="mt-8 p-4 bg-[#F5F5F7] rounded-xl">
        <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-3">Что произойдёт:</p>
        <ul className="space-y-2">
          {[
            'Сканирование сайта и определение тематики',
            'Запрос Яндекс.Wordstat — реальные частотности',
            'Группировка ключевых слов по кластерам',
            'Генерация объявлений через YandexGPT',
            'Расчёт рекомендуемых бюджетов',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#555]">
              <Check size={13} className="text-[#FFD600] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// Шаг 2: Подключение сервисов
function StepConnect({ url, onNext, onSkip }) {
  const navigate = useNavigate()
  const hostname = (() => {
    try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname }
    catch { return url }
  })()

  const services = [
    { name: 'Яндекс.Директ', key: 'direct', connected: false, required: true },
    { name: 'Яндекс.Метрика', key: 'metrika', connected: false, required: false },
    { name: 'Wordstat (через Директ)', key: 'wordstat', connected: false, required: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-xl font-bold text-[#111111] mb-2">Подключение сервисов</h2>
      <p className="text-[#888] text-sm mb-6">
        Для полного анализа <span className="font-medium text-[#111]">{hostname}</span> подключите:
      </p>

      <div className="space-y-3 mb-6">
        {services.map(s => (
          <div
            key={s.key}
            className="flex items-center justify-between p-4 rounded-xl border border-[#EEEEEE] bg-white"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${s.connected ? 'bg-green-500' : 'bg-red-400'}`} />
              <div>
                <div className="text-sm font-medium text-[#111]">{s.name}</div>
                {s.required && <div className="text-xs text-red-500">Обязательно</div>}
              </div>
            </div>
            {s.connected
              ? <Check size={16} className="text-green-500" />
              : <X size={16} className="text-red-400" />
            }
          </div>
        ))}
      </div>

      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl mb-6 flex items-start gap-3">
        <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-orange-800">Токены не настроены</p>
          <p className="text-xs text-orange-600 mt-0.5">Без подключения анализ будет в демо-режиме с моковыми данными</p>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/credentials')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 border-[#FFD600] hover:bg-[#FFFDE7] transition-colors"
        >
          <Key size={15} />
          Настроить подключение
          <ExternalLink size={13} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSkip}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#888] border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
        >
          Демо-режим →
        </motion.button>
      </div>
    </motion.div>
  )
}

// Шаг 3: Анализ (loading)
function StepAnalyzing({ url, onDone }) {
  const hostname = (() => {
    try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname }
    catch { return url }
  })()

  const steps = [
    { label: `Сканирование сайта: ${hostname}`, delay: 600 },
    { label: 'Определение тематики: Автозапчасти, шины', delay: 1400 },
    { label: 'Запрос Яндекс.Wordstat API...', delay: 2500 },
    { label: 'Группировка ключевых слов', delay: 3800 },
    { label: 'Генерация объявлений (YandexGPT)', delay: 5200 },
    { label: 'Подбор изображений (YandexART)', delay: 6500 },
  ]

  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let timer
    const advance = (i) => {
      if (i >= steps.length) {
        setDone(true)
        setTimeout(onDone, 800)
        return
      }
      timer = setTimeout(() => {
        setCurrent(i + 1)
        advance(i + 1)
      }, steps[i].delay - (i > 0 ? steps[i - 1].delay : 0))
    }
    advance(0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl"
    >
      <h2 className="text-xl font-bold text-[#111111] mb-2">Анализируем сайт...</h2>
      <p className="text-[#888] text-sm mb-8">Это займёт около 10 секунд</p>

      <div className="space-y-4">
        {steps.map((step, i) => {
          const status = i < current ? 'done' : i === current ? 'loading' : 'pending'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {status === 'done' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <Check size={13} className="text-green-600" />
                  </motion.div>
                )}
                {status === 'loading' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={18} className="text-[#FFD600]" />
                  </motion.div>
                )}
                {status === 'pending' && (
                  <Circle size={18} className="text-[#DDDDDD]" />
                )}
              </div>
              <span className={`text-sm ${
                status === 'done' ? 'text-[#111]' :
                status === 'loading' ? 'text-[#FFD600] font-medium' :
                'text-[#AAAAAA]'
              }`}>
                {step.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
        >
          <CheckCircle size={20} className="text-green-500" />
          <span className="text-sm font-semibold text-green-800">Анализ завершён!</span>
        </motion.div>
      )}
    </motion.div>
  )
}

// Кампания в рекомендациях
function CampaignCard({ campaign, accepted, onAccept, onReject }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all ${
      accepted === true ? 'border-green-400 bg-green-50/30' :
      accepted === false ? 'border-[#EEEEEE] opacity-50' :
      'border-[#EEEEEE] bg-white'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#111111] text-sm">{campaign.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#888]">
                {campaign.type}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-[#888]">
              <span>Ключей: <span className="font-semibold text-[#111]">{campaign.keywords}</span></span>
              <span>Бюджет: <span className="font-semibold text-[#111]">{campaign.budget.toLocaleString('ru-RU')} ₽/день</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {accepted === undefined && (
              <>
                <button
                  onClick={() => onAccept()}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <Check size={12} className="inline mr-1" />Принять
                </button>
                <button
                  onClick={() => onReject()}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#888] border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
                >
                  Отклонить
                </button>
              </>
            )}
            {accepted === true && (
              <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                <Check size={13} /> Принята
              </span>
            )}
            {accepted === false && (
              <span className="text-xs text-[#AAAAAA]">Отклонена</span>
            )}
            <button
              onClick={() => setOpen(o => !o)}
              className="p-1.5 rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              {open ? <ChevronUp size={14} className="text-[#888]" /> : <ChevronDown size={14} className="text-[#888]" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-[#EEEEEE] pt-4">
              {/* Ключевые слова */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">
                  Ключевые слова (топ-5 по частотности)
                </h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[#AAAAAA]">
                      <th className="text-left py-1">Запрос</th>
                      <th className="text-right py-1">Частотность</th>
                      <th className="text-right py-1">Конкуренция</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.topKeywords.map((kw, i) => (
                      <tr key={i} className="border-t border-[#F5F5F7]">
                        <td className="py-1.5 text-[#333]">{kw.query}</td>
                        <td className="py-1.5 text-right text-[#555]">{kw.freq.toLocaleString('ru-RU')}</td>
                        <td className="py-1.5 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            kw.comp === 'высокая' ? 'bg-red-100 text-red-600' :
                            kw.comp === 'средняя' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>{kw.comp}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Минус-слова */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Минус-слова</h4>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.minusWords.map(w => (
                    <span key={w} className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-md border border-red-200">
                      -{w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Бюджет */}
              <div>
                <h4 className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Настройки бюджета</h4>
                <div className="flex items-center gap-3">
                  <Wallet size={14} className="text-[#888]" />
                  <span className="text-sm text-[#333]">Дневной бюджет:</span>
                  <input
                    type="number"
                    defaultValue={campaign.budget}
                    className="w-32 px-3 py-1.5 border border-[#EEEEEE] rounded-lg text-sm text-center focus:outline-none focus:border-[#FFD600] transition-colors"
                  />
                  <span className="text-sm text-[#888]">₽</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Шаг 4: Рекомендации
function StepResults({ url, onFinish }) {
  const hostname = (() => {
    try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname }
    catch { return url }
  })()

  const campaigns = [
    {
      id: 1,
      name: 'Шины и диски — Поиск',
      type: 'Поиск',
      keywords: 47,
      budget: 2000,
      topKeywords: [
        { query: 'купить шины', freq: 45200, comp: 'высокая' },
        { query: 'летние шины цена', freq: 28900, comp: 'средняя' },
        { query: 'зимние шины купить', freq: 21300, comp: 'высокая' },
        { query: 'шины r15 недорого', freq: 8700, comp: 'низкая' },
        { query: 'диски на авто', freq: 6200, comp: 'средняя' },
      ],
      minusWords: ['бу', 'подержанные', 'ремонт', 'вакансии', 'работа'],
    },
    {
      id: 2,
      name: 'Запчасти — РСЯ',
      type: 'РСЯ',
      keywords: 23,
      budget: 1500,
      topKeywords: [
        { query: 'автозапчасти', freq: 112000, comp: 'высокая' },
        { query: 'запчасти для авто', freq: 67400, comp: 'высокая' },
        { query: 'детали двигателя', freq: 12000, comp: 'средняя' },
        { query: 'тормозные колодки', freq: 9800, comp: 'средняя' },
        { query: 'масло для двигателя', freq: 8300, comp: 'низкая' },
      ],
      minusWords: ['своими руками', 'инструкция', 'форум', 'видео'],
    },
    {
      id: 3,
      name: 'Бренд — Поиск',
      type: 'Поиск',
      keywords: 12,
      budget: 500,
      topKeywords: [
        { query: 'rogikopyta', freq: 3200, comp: 'низкая' },
        { query: 'рогикопыта запчасти', freq: 1800, comp: 'низкая' },
        { query: 'rogikopyta.ru', freq: 1200, comp: 'низкая' },
        { query: 'магазин рогикопыта', freq: 890, comp: 'низкая' },
        { query: 'рогикопыта отзывы', freq: 450, comp: 'низкая' },
      ],
      minusWords: ['отзывы плохие', 'мошенники'],
    },
  ]

  const auditPoints = [
    { text: 'Мобильная версия сайта работает корректно', type: 'ok' },
    { text: 'Скорость загрузки: 3.2 сек (рекомендуется < 2 сек)', type: 'warn' },
    { text: 'Отсутствует форма обратного звонка', type: 'warn' },
    { text: 'SSL-сертификат установлен и активен', type: 'ok' },
    { text: 'Нет страницы с отзывами клиентов', type: 'info' },
    { text: 'Недостаточно контента для SEO (< 300 слов на главной)', type: 'warn' },
  ]

  const [statuses, setStatuses] = useState({})
  const accept = id => setStatuses(p => ({ ...p, [id]: true }))
  const reject = id => setStatuses(p => ({ ...p, [id]: false }))

  const acceptedCount = Object.values(statuses).filter(Boolean).length
  const totalBudget = campaigns
    .filter(c => statuses[c.id] === true)
    .reduce((s, c) => s + c.budget, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Рекомендации для {hostname}</h2>
          <p className="text-sm text-[#888] mt-1">
            Найдено {campaigns.reduce((s, c) => s + c.keywords, 0)} ключевых слов ·{' '}
            {campaigns.length} кампании · Тематика: Автозапчасти, шины
          </p>
        </div>
      </div>

      {/* Структура кампаний */}
      <h3 className="text-sm font-semibold text-[#111111] mb-3 uppercase tracking-wider text-[#AAAAAA]">
        Структура кампаний
      </h3>
      <div className="space-y-3 mb-8">
        {campaigns.map(c => (
          <CampaignCard
            key={c.id}
            campaign={c}
            accepted={statuses[c.id]}
            onAccept={() => accept(c.id)}
            onReject={() => reject(c.id)}
          />
        ))}
      </div>

      {/* Аудит сайта */}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#AAAAAA] mb-3">
        Аудит сайта
      </h3>
      <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5 mb-8">
        <div className="space-y-2.5">
          {auditPoints.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              {p.type === 'ok' && <CheckCircle size={15} className="text-green-500 flex-shrink-0" />}
              {p.type === 'warn' && <AlertTriangle size={15} className="text-orange-400 flex-shrink-0" />}
              {p.type === 'info' && <Circle size={15} className="text-blue-400 flex-shrink-0" />}
              <span className="text-sm text-[#333]">{p.text}</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                p.type === 'ok' ? 'bg-green-100 text-green-700' :
                p.type === 'warn' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {p.type === 'ok' ? 'ок' : p.type === 'warn' ? 'важно' : 'рекомендация'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Итог и кнопки */}
      {acceptedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-[#FFFDE7] rounded-xl border border-[#FFD600]/50 mb-4"
        >
          <div>
            <div className="text-sm font-semibold text-[#111]">
              Принято кампаний: {acceptedCount} из {campaigns.length}
            </div>
            <div className="text-xs text-[#888] mt-0.5">
              Суммарный дневной бюджет: {totalBudget.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const all = {}
            campaigns.forEach(c => { all[c.id] = true })
            setStatuses(all)
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-colors"
        >
          Принять все
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onFinish}
          disabled={acceptedCount === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#FFD600', color: '#111111' }}
        >
          <Plus size={16} />
          Принять всё и создать кампании ({acceptedCount})
        </motion.button>
      </div>
    </motion.div>
  )
}

// Индикатор шагов
function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: i < current ? '#22C55E' : i === current ? '#FFD600' : '#EEEEEE',
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
            >
              {i < current
                ? <Check size={12} className="text-white" />
                : <span style={{ color: i === current ? '#111' : '#AAA' }}>{i + 1}</span>
              }
            </motion.div>
            <span
              className="text-xs font-medium hidden sm:block"
              style={{ color: i === current ? '#111' : i < current ? '#22C55E' : '#AAAAAA' }}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="h-px mx-3"
              style={{ width: 32, backgroundColor: i < current ? '#22C55E' : '#EEEEEE' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function AddSite() {
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const [step, setStep] = useState(0)
  const [url, setUrl] = useState('')

  const handleFinish = async () => {
    addToast({ message: 'Сайт добавлен! Кампании созданы в Яндекс.Директ', type: 'success' })
    navigate('/dashboard')
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Добавить сайт</h1>
        <p className="text-[#888] text-sm">ИИ проанализирует сайт и создаст структуру рекламных кампаний</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EEEEEE] p-8">
        <StepIndicator steps={STEPS} current={step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepUrl
              key="url"
              url={url}
              setUrl={setUrl}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepConnect
              key="connect"
              url={url}
              onNext={() => setStep(2)}
              onSkip={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepAnalyzing
              key="analyzing"
              url={url}
              onDone={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepResults
              key="results"
              url={url}
              onFinish={handleFinish}
            />
          )}
        </AnimatePresence>

        {/* Навигация назад (не на шаге анализа) */}
        {step !== 2 && step > 0 && (
          <div className="mt-6 pt-4 border-t border-[#EEEEEE]">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className="text-sm text-[#888] hover:text-[#111] transition-colors"
            >
              ← Назад
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
