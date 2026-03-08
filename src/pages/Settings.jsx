// Страница настроек — аккаунт, нейросети, расписание
import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Cpu, Calendar, CheckCircle, Key } from 'lucide-react'
import { useToastCtx } from '../App'

// Компонент переключателя с анимацией
function Toggle({ checked, onChange, disabled }) {
  return (
    <motion.button
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ backgroundColor: checked ? '#FFD600' : '#DDDDDD' }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </motion.button>
  )
}

// Карточка секции
function Section({ icon: Icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#EEEEEE] bg-[#FAFAFA]">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#FFD60020' }}
        >
          <Icon size={16} style={{ color: '#FFD600' }} />
        </div>
        <h2 className="font-semibold text-[#111111]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

export default function Settings() {
  const { addToast } = useToastCtx()

  // Состояния нейросетей
  const [aiModels, setAiModels] = useState({
    yandexgpt: true,
    gigachat: true,
    claude: false,
  })
  const [apiKeys, setApiKeys] = useState({
    yandexgpt: '',
    gigachat: '',
    claude: '',
  })

  // Расписание
  const [scheduleDay, setScheduleDay] = useState('monday')
  const [scheduleTime, setScheduleTime] = useState('09:00')

  const toggleModel = (key) => {
    setAiModels(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    addToast({ message: 'Настройки сохранены', type: 'success' })
  }

  const DAYS = [
    { val: 'monday', label: 'Понедельник' },
    { val: 'tuesday', label: 'Вторник' },
    { val: 'wednesday', label: 'Среда' },
    { val: 'thursday', label: 'Четверг' },
    { val: 'friday', label: 'Пятница' },
    { val: 'saturday', label: 'Суббота' },
    { val: 'sunday', label: 'Воскресенье' },
  ]

  const AI_MODELS = [
    {
      key: 'yandexgpt',
      name: 'YandexGPT',
      desc: 'Языковая модель от Яндекс для генерации текстов',
      color: '#FC3F1D',
    },
    {
      key: 'gigachat',
      name: 'GigaChat',
      desc: 'Нейросеть от Сбера, специализируется на русском языке',
      color: '#0B5FFF',
    },
    {
      key: 'claude',
      name: 'Claude (Anthropic)',
      desc: 'Мощная языковая модель от Anthropic, требует API ключ',
      color: '#CC785C',
      requiresKey: true,
    },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#111111]">Настройки</h1>
        <p className="text-[#888888] text-sm mt-0.5">Управление аккаунтом и интеграциями</p>
      </div>

      {/* Секция 1: Аккаунт */}
      <Section icon={User} title="Аккаунт">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            U
          </div>
          <div>
            <div className="font-semibold text-[#111111] text-lg">user@company.ru</div>
            <div className="text-sm text-[#888888]">Аккаунт создан 15 января 2026</div>
          </div>
        </div>

        {/* Подключённый аккаунт Яндекса */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAFAFA] border border-[#EEEEEE]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: '#FC3F1D' }}
            >
              Я
            </div>
            <div>
              <div className="font-medium text-sm text-[#111111]">Яндекс.Директ</div>
              <div className="text-xs text-[#888888]">user@yandex.ru · Аккаунт #4821937</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle size={16} />
            Подключено
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-[#EEEEEE] text-[#888888] hover:bg-[#F5F5F7] transition-colors"
          >
            Переподключить
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            Отключить
          </motion.button>
        </div>
      </Section>

      {/* Секция 2: Нейросети */}
      <Section icon={Cpu} title="Нейросети">
        <p className="text-sm text-[#888888] mb-5">
          Выберите модели, которые будут использоваться для генерации текстов и анализа
        </p>
        <div className="space-y-4">
          {AI_MODELS.map((model) => (
            <div
              key={model.key}
              className={`p-4 rounded-xl border transition-all ${
                aiModels[model.key] ? 'border-[#FFD600]/50 bg-[#FFFDE7]/30' : 'border-[#EEEEEE] bg-[#FAFAFA]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: model.color }}
                  >
                    AI
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#111111]">{model.name}</div>
                    <div className="text-xs text-[#888888]">{model.desc}</div>
                  </div>
                </div>
                <Toggle
                  checked={aiModels[model.key]}
                  onChange={() => toggleModel(model.key)}
                />
              </div>

              {/* Поле для API ключа */}
              {model.requiresKey && (
                <motion.div
                  initial={false}
                  animate={{ height: aiModels[model.key] ? 'auto' : 0, opacity: aiModels[model.key] ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 border-t border-[#EEEEEE] mt-3">
                    <label className="text-xs font-semibold text-[#888888] mb-1.5 flex items-center gap-1.5">
                      <Key size={12} />
                      API ключ
                    </label>
                    <input
                      type="password"
                      value={apiKeys[model.key]}
                      onChange={e => setApiKeys(prev => ({ ...prev, [model.key]: e.target.value }))}
                      placeholder="sk-ant-api03-..."
                      className="w-full px-3 py-2 text-sm border border-[#EEEEEE] rounded-lg font-mono focus:outline-none focus:border-[#FFD600] transition-colors bg-white"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Секция 3: Расписание */}
      <Section icon={Calendar} title="Расписание отчётов">
        <p className="text-sm text-[#888888] mb-5">
          Настройте, когда ИИ будет автоматически генерировать еженедельный отчёт
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-2">День недели</label>
            <select
              value={scheduleDay}
              onChange={e => setScheduleDay(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#EEEEEE] rounded-xl text-sm focus:outline-none focus:border-[#FFD600] transition-colors bg-white"
            >
              {DAYS.map(d => (
                <option key={d.val} value={d.val}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-2">Время</label>
            <input
              type="time"
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#EEEEEE] rounded-xl text-sm focus:outline-none focus:border-[#FFD600] transition-colors bg-white"
            />
          </div>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-xl mt-4"
          style={{ backgroundColor: '#FFFDE7', border: '1px solid #FFD600' }}
        >
          <Calendar size={16} style={{ color: '#D97706' }} />
          <span className="text-sm text-[#7A6500]">
            Следующий отчёт: {DAYS.find(d => d.val === scheduleDay)?.label}, {scheduleTime}
          </span>
        </div>
      </Section>

      {/* Кнопка сохранения */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="px-8 py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: '#FFD600', color: '#111111' }}
        >
          Сохранить настройки
        </motion.button>
      </div>
    </div>
  )
}
