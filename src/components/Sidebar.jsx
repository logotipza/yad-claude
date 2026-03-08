// Боковая навигационная панель
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, BarChart2, FileText, Sparkles, Settings, Circle } from 'lucide-react'

const navItems = [
  { icon: Plus, label: 'Новая кампания', to: '/campaign/create', accent: true },
  { icon: BarChart2, label: 'Статистика', to: '/dashboard' },
  { icon: FileText, label: 'Отчёты', to: '/report', badge: true },
  { icon: Sparkles, label: 'ИИ Гипотезы', to: '/hypotheses' },
  { icon: Settings, label: 'Настройки', to: '/settings' },
]

// Список кампаний в сайдбаре
const campaigns = [
  { name: 'Смартфоны — Поиск', status: 'active', id: '1' },
  { name: 'iPhone — РСЯ', status: 'active', id: '2' },
  { name: 'Xiaomi — Поиск', status: 'paused', id: '3' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside
      className="flex flex-col flex-shrink-0 bg-white border-r border-[#EEEEEE]"
      style={{ width: 240 }}
    >
      {/* Навигационные пункты */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, i) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-[#FFD600] text-[#111111]'
                      : 'text-[#444444] hover:bg-[#F5F5F7] hover:text-[#111111]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={18}
                      className={isActive ? 'text-[#111111]' : 'text-[#888888] group-hover:text-[#111111]'}
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

        {/* Разделитель */}
        <div className="border-t border-[#EEEEEE] my-4" />

        {/* Список кампаний */}
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">
            Кампании
          </span>
        </div>
        <ul className="space-y-0.5">
          {campaigns.map((campaign, i) => (
            <motion.li
              key={campaign.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <button
                onClick={() => navigate(`/campaign/${campaign.id}`)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F5F7] hover:text-[#111111] transition-all text-left"
              >
                <Circle
                  size={8}
                  fill={campaign.status === 'active' ? '#22C55E' : '#AAAAAA'}
                  stroke="none"
                  className="flex-shrink-0"
                />
                <span className="truncate">{campaign.name}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Нижняя часть — версия */}
      <div className="px-6 py-3 border-t border-[#EEEEEE]">
        <p className="text-xs text-[#AAAAAA]">ЯД Оптимизатор v1.0</p>
      </div>
    </aside>
  )
}
