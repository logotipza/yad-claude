// Главная страница — ввод URL для анализа или вход через Яндекс
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Zap, BarChart2, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Автоматический анализ',
    desc: 'Сканируем сайт и извлекаем семантику за 2 минуты',
    color: '#FFD600',
  },
  {
    icon: BarChart2,
    title: 'Оптимизация ставок',
    desc: 'ИИ подбирает оптимальные ставки для каждого ключевика',
    color: '#2563EB',
  },
  {
    icon: Sparkles,
    title: 'Генерация креативов',
    desc: 'YandexGPT создаёт заголовки и тексты объявлений',
    color: '#7C3AED',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Welcome() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = (e) => {
    e.preventDefault()
    if (!url.trim()) return
    // Сохраняем URL и переходим на страницу анализа
    sessionStorage.setItem('analyzeUrl', url)
    navigate('/analyzing')
  }

  const handleYandexLogin = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Логотип в левом верхнем углу */}
      <header className="px-8 py-5 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: '#FFD600', color: '#111111' }}
        >
          Я
        </div>
        <span className="font-bold text-[#111111] text-base tracking-tight">ЯД Оптимизатор</span>
      </header>

      {/* Основной контент */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-10">
        <motion.div
          className="w-full max-w-xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Бейдж */}
          <motion.div variants={itemVariants} className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{ backgroundColor: '#FFFDE7', borderColor: '#FFD600', color: '#7A6500' }}
            >
              <Sparkles size={12} />
              Powered by YandexGPT & Claude
            </span>
          </motion.div>

          {/* Заголовок */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold text-[#111111] leading-tight mb-4"
          >
            Умная реклама в
            <br />
            <span style={{ color: '#FFD600' }}>Яндекс.Директ</span>
          </motion.h1>

          {/* Подзаголовок */}
          <motion.p
            variants={itemVariants}
            className="text-[#888888] text-lg leading-relaxed mb-10"
          >
            Анализируем сайт, подбираем ключевики и оптимизируем кампании автоматически
          </motion.p>

          {/* Форма ввода URL */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleAnalyze}
            className="flex gap-2 mb-4"
          >
            <div className="flex-1 relative">
              <Globe
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ваш-сайт.ru"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#EEEEEE] text-[#111111] text-sm focus:outline-none focus:border-[#FFD600] focus:ring-2 focus:ring-[#FFD600]/20 transition-all placeholder-[#AAAAAA]"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
              style={{ backgroundColor: '#FFD600', color: '#111111' }}
            >
              Анализировать
              <ArrowRight size={16} />
            </motion.button>
          </motion.form>

          {/* Разделитель */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-4"
          >
            <div className="flex-1 border-t border-[#EEEEEE]" />
            <span className="text-[#AAAAAA] text-sm">или</span>
            <div className="flex-1 border-t border-[#EEEEEE]" />
          </motion.div>

          {/* Кнопка входа через Яндекс */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleYandexLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all hover:border-[#FFD600] hover:bg-[#FFFDE7]"
              style={{ borderColor: '#FFD600', color: '#111111', backgroundColor: 'white' }}
            >
              {/* Логотип Яндекса */}
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#FC3F1D' }}
              >
                Я
              </span>
              Войти через Яндекс
            </motion.button>
          </motion.div>

          {/* Метки преимуществ */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-6 mt-8 text-sm text-[#888888]"
          >
            {['Бесплатный анализ', 'Без кредитки', '2 минуты на запуск'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-500" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Карточки фич */}
        <motion.div
          className="grid grid-cols-3 gap-4 max-w-2xl w-full mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-2xl p-5 border border-[#EEEEEE] text-left transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: f.color + '20' }}
              >
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-[#111111] text-sm mb-1">{f.title}</h3>
              <p className="text-[#888888] text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Нижняя часть */}
      <footer className="py-6 text-center">
        <p className="text-xs text-[#AAAAAA]">© 2026 ЯД Оптимизатор — автоматизация Яндекс.Директ</p>
      </footer>
    </div>
  )
}
