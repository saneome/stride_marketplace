import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Clock, User, FileText, FolderOpen } from 'lucide-react'
import { useAuditLog } from '../lib/hooks'

const ACTION_LABELS: Record<string, string> = {
  'listing.approve': 'Одобрение объявления',
  'listing.reject': 'Отклонение объявления',
  'listing.delete': 'Удаление объявления',
  'user.update': 'Обновление пользователя',
  'category.create': 'Создание категории',
  'category.update': 'Обновление категории',
  'category.delete': 'Удаление категории',
}

const ENTITY_ICONS: Record<string, typeof FileText> = {
  listing: FileText,
  user: User,
  category: FolderOpen,
}

export default function AuditLog() {
  const [page, setPage] = useState(1)
  const [entityFilter, setEntityFilter] = useState<string | undefined>()
  const { data, isLoading } = useAuditLog({ entity_type: entityFilter, page, per_page: 20 })

  const filters = [
    { value: undefined, label: 'Все' },
    { value: 'listing', label: 'Объявления' },
    { value: 'user', label: 'Пользователи' },
    { value: 'category', label: 'Категории' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Журнал аудита</h1>
        <p className="text-gray-600 dark:text-gray-400">История действий администраторов</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => { setEntityFilter(f.value); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              entityFilter === f.value
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">Загрузка...</div>
      ) : !data?.data.length ? (
        <div className="glass-card p-8 text-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <ClipboardList className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Записей нет</h3>
          <p className="text-gray-600 dark:text-gray-400">Записи аудита появятся после выполнения действий в админке.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((entry) => {
              const Icon = ENTITY_ICONS[entry.entity_type] || ClipboardList
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {ACTION_LABELS[entry.action] || entry.action}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-2">
                      {entry.user && <span>{entry.user.display_name} ({entry.user.email})</span>}
                      {entry.entity_id && <span className="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{entry.entity_id.slice(0, 8)}...</span>}
                      {entry.details && Object.keys(entry.details).length > 0 && (
                        <span className="text-xs">{JSON.stringify(entry.details).slice(0, 80)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    {new Date(entry.created_at).toLocaleString('ru-RU')}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {data.meta.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.meta.total_pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
