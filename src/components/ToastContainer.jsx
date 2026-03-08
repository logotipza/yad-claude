// Контейнер для тостов — рендерит все активные уведомления в правом нижнем углу
import { AnimatePresence } from 'framer-motion'
import Toast from './Toast'

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
