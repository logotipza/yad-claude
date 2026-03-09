// Страница управления учётными данными — полноэкранная, без Layout
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, Check, X, ChevronDown, ChevronUp,
  ExternalLink, Save, AlertTriangle, CheckCircle, Circle,
  ArrowLeft, Key
} from 'lucide-react'
import { useToastCtx } from '../App'

const STORAGE_KEY = 'yad_credentials'

const defaultCreds = {
  direct: { token: '', login: '' },
  metrika: { token: '', counterId: '' },
  yandexgpt: { apiKey: '', folderId: '', enabled: true },
  gigachat: { clientId: '', clientSecret: '', enabled: false },
  claude: { apiKey: '', model: 'claude-sonnet-4-6', enabled: false },
}

// Компонент поля ввода пароля с показом/скрытием
function PasswordField({ value, onChange, placeholder, id }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-11 border border-[#333] rounded-xl text-sm bg-[#1A1A1A] text-white placeholder-[#555] focus:outline-none focus:border-[#FFD600] transition-colors font-mono"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#AAA] transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

// Компонент текстового поля
function TextField({ value, onChange, placeholder, id }) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-[#333] rounded-xl text-sm bg-[#1A1A1A] text-white placeholder-[#555] focus:outline-none focus:border-[#FFD600] transition-colors"
    />
  )
}

// Индикатор статуса подключения
function StatusBadge({ connected, label }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
      connected
        ? 'bg-green-900/40 text-green-400 border border-green-700/50'
        : 'bg-red-900/40 text-red-400 border border-red-700/50'
    }`}>
      {connected ? <CheckCircle size={12} /> : <Circle size={12} />}
      {connected ? 'Подключено' : label || 'Не настроено'}
    </div>
  )
}

// Переключатель
function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-[#FFD600]' : 'bg-[#333]'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

// Аккордеон-секция
function Section({ title, subtitle, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#222] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#161616] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">{title}</span>
              {badge}
            </div>
            {subtitle && <p className="text-[#666] text-xs mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[#666]" /> : <ChevronDown size={16} className="text-[#666]" />}
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
            <div className="px-6 pb-6 border-t border-[#222]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Numbered instruction list
function Instructions({ steps }) {
  return (
    <ol className="space-y-1.5 mt-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-[#888]">
          <span className="w-4 h-4 rounded-full bg-[#222] text-[#AAA] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}

// Ссылка-кнопка
function LinkBtn({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-[#FFD600] hover:text-yellow-300 transition-colors"
    >
      {children}
      <ExternalLink size={11} />
    </a>
  )
}

export default function Credentials() {
  const navigate = useNavigate()
  const { addToast } = useToastCtx()
  const [creds, setCreds] = useState(defaultCreds)
  const [saved, setSaved] = useState(false)

  // Загружаем из localStorage при открытии
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setCreds(prev => ({ ...prev, ...JSON.parse(stored) }))
      }
    } catch {}
  }, [])

  const set = (section, field, value) => {
    setCreds(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
      setSaved(true)
      addToast({ message: 'Настройки сохранены в localStorage', type: 'success' })
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      addToast({ message: 'Ошибка сохранения', type: 'error' })
    }
  }

  const directConnected = creds.direct.token.length > 10
  const metrikaConnected = creds.metrika.token.length > 10 && creds.metrika.counterId.length > 2
  const gptConnected = creds.yandexgpt.apiKey.length > 5 && creds.yandexgpt.folderId.length > 3
  const gigaConnected = creds.gigachat.clientId.length > 3 && creds.gigachat.clientSecret.length > 5
  const claudeConnected = creds.claude.apiKey.length > 10

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Шапка */}
      <header className="border-b border-[#1A1A1A] px-6 py-4 flex items-center justify-between sticky top-0 z-10" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#666] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#1A1A1A]"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: '#FFD600', color: '#111111' }}
            >
              Я
            </div>
            <span className="text-white font-semibold text-sm">ЯД Оптимизатор</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-white font-bold text-sm">Локальные настройки</h1>
            <p className="text-[#555] text-xs">Только для разработки. Не коммитить в репо.</p>
          </div>
          <Key size={18} className="text-[#FFD600]" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Предупреждение */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl border border-yellow-700/50 bg-yellow-900/20 mb-8"
        >
          <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-sm font-medium">Внимание — безопасность</p>
            <p className="text-yellow-400/80 text-xs mt-0.5">
              Эти данные хранятся только в localStorage вашего браузера. Не передаются на сервер.
              Не используйте продакшн-токены в этом прототипе.
            </p>
          </div>
        </motion.div>

        <div className="space-y-3">

          {/* 1. Яндекс.Директ */}
          <Section
            title="Яндекс.Директ API"
            subtitle="Управление кампаниями и ставками"
            badge={<StatusBadge connected={directConnected} />}
            defaultOpen={true}
          >
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">OAuth Токен</label>
                  <PasswordField
                    value={creds.direct.token}
                    onChange={v => set('direct', 'token', v)}
                    placeholder="y0_AgAAAA..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Логин клиента</label>
                  <TextField
                    value={creds.direct.login}
                    onChange={v => set('direct', 'login', v)}
                    placeholder="my-agency-client"
                  />
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl p-4">
                <p className="text-xs text-[#666] font-medium mb-2">Как получить токен:</p>
                <Instructions steps={[
                  'Зарегистрируйтесь в Яндекс.Директ: direct.yandex.ru',
                  'Создайте приложение в Яндекс OAuth: oauth.yandex.ru',
                  'Запросите права: direct:api',
                  'Получите токен и вставьте в поле выше',
                ]} />
                <div className="flex gap-4 mt-4">
                  <LinkBtn href="https://direct.yandex.ru">Открыть Яндекс.Директ</LinkBtn>
                  <LinkBtn href="https://oauth.yandex.ru">Яндекс OAuth</LinkBtn>
                </div>
              </div>
            </div>
          </Section>

          {/* 2. Яндекс.Метрика */}
          <Section
            title="Яндекс.Метрика API"
            subtitle="Данные о конверсиях и поведении пользователей"
            badge={<StatusBadge connected={metrikaConnected} />}
          >
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">OAuth Токен</label>
                  <PasswordField
                    value={creds.metrika.token}
                    onChange={v => set('metrika', 'token', v)}
                    placeholder="y0_AgAAAA..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">ID счётчика</label>
                  <TextField
                    value={creds.metrika.counterId}
                    onChange={v => set('metrika', 'counterId', v)}
                    placeholder="12345678"
                  />
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl p-4">
                <p className="text-xs text-[#666] font-medium mb-2">Как получить токен Метрики:</p>
                <Instructions steps={[
                  'Войдите в Яндекс.Метрику: metrika.yandex.ru',
                  'Создайте приложение в oauth.yandex.ru с правами metrika:read',
                  'Получите токен и ID счётчика из настроек счётчика',
                ]} />
                <div className="mt-4">
                  <LinkBtn href="https://metrika.yandex.ru">Открыть Метрику</LinkBtn>
                </div>
              </div>
            </div>
          </Section>

          {/* 3. Яндекс Wordstat */}
          <Section
            title="Яндекс Wordstat"
            subtitle="Данные о частотности ключевых слов"
          >
            <div className="pt-4">
              <div className="bg-[#141414] rounded-xl p-4 flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${directConnected ? 'bg-green-400' : 'bg-[#555]'}`}
                />
                <div>
                  <p className="text-sm text-[#CCC]">
                    Wordstat использует тот же OAuth-токен что и Яндекс.Директ
                  </p>
                  <p className="text-xs text-[#666] mt-1">
                    {directConnected
                      ? 'Токен Директа настроен — Wordstat доступен автоматически'
                      : 'Настройте токен Директа выше для доступа к Wordstat'}
                  </p>
                  <div className="mt-3">
                    <LinkBtn href="https://wordstat.yandex.ru">Открыть Wordstat</LinkBtn>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 4. YandexGPT */}
          <Section
            title="YandexGPT (Яндекс Облако)"
            subtitle="Генерация объявлений и ИИ-анализ"
            badge={<StatusBadge connected={gptConnected} />}
          >
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-[#CCC]">Включить YandexGPT</span>
                <Toggle
                  checked={creds.yandexgpt.enabled}
                  onChange={v => set('yandexgpt', 'enabled', v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">API-ключ</label>
                  <PasswordField
                    value={creds.yandexgpt.apiKey}
                    onChange={v => set('yandexgpt', 'apiKey', v)}
                    placeholder="AQVN..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Folder ID</label>
                  <TextField
                    value={creds.yandexgpt.folderId}
                    onChange={v => set('yandexgpt', 'folderId', v)}
                    placeholder="b1gxxxxxxxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl p-4">
                <p className="text-xs text-[#666] font-medium mb-2">Как настроить:</p>
                <Instructions steps={[
                  'Зарегистрируйтесь в Яндекс Облаке: cloud.yandex.ru',
                  'Создайте сервисный аккаунт в разделе IAM',
                  'Выдайте роль: ai.languageModels.user',
                  'Создайте API-ключ для сервисного аккаунта',
                  'Скопируйте Folder ID из настроек облака',
                ]} />
                <div className="mt-4">
                  <LinkBtn href="https://cloud.yandex.ru">Открыть Яндекс Облако</LinkBtn>
                </div>
              </div>
            </div>
          </Section>

          {/* 5. GigaChat */}
          <Section
            title="GigaChat (Сбер)"
            subtitle="Альтернативный ИИ для генерации текстов"
            badge={<StatusBadge connected={gigaConnected} />}
          >
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-[#CCC]">Включить GigaChat</span>
                <Toggle
                  checked={creds.gigachat.enabled}
                  onChange={v => set('gigachat', 'enabled', v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Client ID</label>
                  <TextField
                    value={creds.gigachat.clientId}
                    onChange={v => set('gigachat', 'clientId', v)}
                    placeholder="xxxxxxxx-xxxx-..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Client Secret</label>
                  <PasswordField
                    value={creds.gigachat.clientSecret}
                    onChange={v => set('gigachat', 'clientSecret', v)}
                    placeholder="Client Secret..."
                  />
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl p-4">
                <p className="text-xs text-[#666] font-medium mb-2">Как зарегистрироваться:</p>
                <Instructions steps={[
                  'Перейдите на developers.sber.ru/gigachat',
                  'Создайте проект и получите Client ID и Client Secret',
                  'Выберите тариф API (есть бесплатный план)',
                ]} />
                <div className="mt-4">
                  <LinkBtn href="https://developers.sber.ru/gigachat">Открыть GigaChat API</LinkBtn>
                </div>
              </div>
            </div>
          </Section>

          {/* 6. Claude API */}
          <Section
            title="Claude API (Anthropic)"
            subtitle="Продвинутый анализ и генерация стратегий"
            badge={<StatusBadge connected={claudeConnected} />}
          >
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-[#CCC]">Включить Claude</span>
                <Toggle
                  checked={creds.claude.enabled}
                  onChange={v => set('claude', 'enabled', v)}
                />
              </div>

              <div>
                <label className="block text-xs text-[#888] mb-1.5">API Key</label>
                <PasswordField
                  value={creds.claude.apiKey}
                  onChange={v => set('claude', 'apiKey', v)}
                  placeholder="sk-ant-api03-..."
                />
              </div>

              <div>
                <label className="block text-xs text-[#888] mb-1.5">Модель</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { val: 'claude-sonnet-4-6', label: 'Sonnet 4.6', desc: 'Баланс' },
                    { val: 'claude-opus-4-6', label: 'Opus 4.6', desc: 'Мощный' },
                    { val: 'claude-haiku-4-5', label: 'Haiku 4.5', desc: 'Быстрый' },
                  ].map(m => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => set('claude', 'model', m.val)}
                      className={`px-3 py-2 rounded-xl border text-xs text-left transition-all ${
                        creds.claude.model === m.val
                          ? 'border-[#FFD600] bg-[#FFD600]/10 text-[#FFD600]'
                          : 'border-[#333] text-[#888] hover:border-[#555]'
                      }`}
                    >
                      <div className="font-medium">{m.label}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl p-4">
                <p className="text-xs text-[#666] font-medium mb-2">Как получить ключ:</p>
                <Instructions steps={[
                  'Зайдите на platform.anthropic.com',
                  'Перейдите в раздел API Keys',
                  'Создайте новый ключ и скопируйте его',
                ]} />
                <div className="mt-4">
                  <LinkBtn href="https://platform.anthropic.com">Открыть Anthropic Console</LinkBtn>
                </div>
              </div>
            </div>
          </Section>

        </div>

        {/* Кнопка сохранения */}
        <div className="mt-8 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: '#FFD600', color: '#111111' }}
          >
            <Save size={16} />
            Сохранить в localStorage
          </motion.button>

          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-green-400 text-sm"
              >
                <CheckCircle size={16} />
                Сохранено
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[#444] text-xs mt-4 pb-8">
          Данные хранятся только в localStorage этого браузера. Очистятся при удалении истории браузера.
        </p>
      </div>
    </div>
  )
}
