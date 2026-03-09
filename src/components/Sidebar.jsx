// Боковая навигационная панель — проекты (сайты) и навигация
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, BarChart2, FileText, Sparkles, Settings, Circle,
  Key, ChevronDown, ChevronRight, AlertTriangle, Globe
} from 'lucide-react'

const navItems = [
  { icon: Plus, label: 'Добавить сайт', to: '/add-site', accent: true },
  { icon: BarChart2, label: 'Дашборд', to: '/dashboard' },
  { icon: FileText, label: 'Отчёты', to: '/report', badge: true },
  { icon: Sparkles, label: 'ИИ Гипотезы', to: '/hypotheses' },
  { icon: Settings, label: 'Настройки', to: '/settings' },
]

// Проекты (сайты) с кампаниями
const projects = [
  {
    id: 'p1',
    name: 'rogikopyta.ru',
    status: 'active',
    campaigns: [
      { id: 'c1', name: 'Поиск — Шины', status: 'active' },
      { id: 'c2', name: 'РСЯ — Запчасти', status: 'active' },
      { id: 'c3', name: 'Бренд — Поиск', status: 'active' },
    ],
  },
  {
    id: 'p2',
    name: 'shop.example.ru',
    status: 'active',
    campaigns: [
      { id: 'c4', name: 'Поиск — Каталог', status: 'active' },
      { id: 'c5', name: 'РСЯ — Ретаргетинг', status: 'active' },
    ],
  },
  {
    id: 'p3',
    name: 'test-store.ru',
    status: 'paused',
    campaigns: [
      { id: 'c6', name: 'Поиск — Тест', status: 'paused' },
    ],
  },
]

function ProjectItem({ project, index }) {
  const [open, setOpen] = useState(index === 0)
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.07 }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#444444] hover:bg-[#F5F5F7] hover:text-[#111111] transition-all text-left group"
      >
        <Globe size={14} className="flex-shrink-0 text-[#888888] group-hover:text-[#111111]" />
        <Circle
          size={7}
          fill={project.status === 'active' ? '#22C55E' : '#AAAAAA'}
          stroke="none"
          className="flex-shrink-0"
        />
        <span className="flex-1 truncate font-medium text-xs">{project.name}</span>
        <span className="text-xs text-[#AAAAAA] flex-shrink-0">{project.campaigns.length}</span>
        {open
          ? <ChevronDown size={12} className="flex-shrink-0 text-[#AAAAAA]" />
          : <ChevronRight size={12} className="flex-shrink-0 text-[#AAAAAA]" />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-5"
          >
            {project.campaigns.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => navigate(`/campaign/${c.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#666666] hover:bg-[#F5F5F7] hover:text-[#111111] transition-all text-left"
                >
                  <Circle
                    size={6}
                    fill={c.status === 'active' ? '#22C55E' : '#AAAAAA'}
                    stroke="none"
                    className="flex-shrink-0"
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate()

  const sidebarContent = (
    <aside className="flex flex-col h-full bg-white border-r border-[#EEEEEE]" style={{ width: 240 }}>
      {/* Логотип */}
      <div className="px-5 py-4 border-b border-[#EEEEEE] flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: '#FFD600', color: '#111111' }}
        >
          Я
        </div>
        <span className="font-bold text-[#111111] text-sm tracking-tight">ЯД Оптимизатор</span>
      </div>

      {/* Навигационные пункты */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item, i) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-[#FFD600] text-[#111111]'
                      : item.accent
                      ? 'text-[#111111] bg-[#F5F5F7] hover:bg-[#EEEEEE]'
                      : 'text-[#444444] hover:bg-[#F5F5F7] hover:text-[#111111]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={16}
                      className={isActive ? 'text-[#111111]' : item.accent ? 'text-[#111111]' : 'text-[#888888] group-hover:text-[#111111]'}
                    />
                    <span className="flex-1">{item.label}</span>
                    {/* Красная точка для новых отчётов */}
                    {item.badge && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Предупреждение о подключении Директа */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 mx-0 p-3 rounded-xl border border-orange-200 bg-orange-50 flex items-start gap-2"
        >
          <AlertTriangle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-orange-700">Подключить Директ</div>
            <button
              onClick={() => { navigate('/credentials'); onClose?.() }}
              className="text-xs text-orange-600 hover:underline mt-0.5"
            >
              Настроить токены →
            </button>
          </div>
        </motion.div>

        {/* Разделитель */}
        <div className="border-t border-[#EEEEEE] my-3" />

        {/* МОИ САЙТЫ */}
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">
            Мои сайты
          </span>
        </div>

        <div className="space-y-0.5">
          {projects.map((project, i) => (
            <ProjectItem key={project.id} project={project} index={i} />
          ))}
        </div>
      </nav>

      {/* Нижняя часть — Credentials */}
      <div className="px-3 py-3 border-t border-[#EEEEEE]">
        <NavLink
          to="/credentials"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              isActive
                ? 'bg-[#111111] text-white'
                : 'text-[#444444] hover:bg-[#F5F5F7] hover:text-[#111111]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Key size={16} className={isActive ? 'text-white' : 'text-[#888888] group-hover:text-[#111111]'} />
              <span className="flex-1">Credentials</span>
            </>
          )}
        </NavLink>
        <p className="text-xs text-[#AAAAAA] px-3 mt-2">ЯД Оптимизатор v1.0</p>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0" style={{ width: 240 }}>
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 h-full z-50 md:hidden"
              style={{ width: 240 }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
