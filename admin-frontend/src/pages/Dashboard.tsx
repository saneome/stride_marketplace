import { motion } from 'framer-motion'
import { FileText, Clock, Users, TrendingUp, Activity, BarChart3, FolderOpen } from 'lucide-react'
import { useDashboardStats } from '../lib/hooks'

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats()

  const statCards = [
    {
      title: 'Активных объявлений',
      value: stats?.listings_by_status.active ?? 0,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'На модерации',
      value: stats?.listings_by_status.moderation ?? 0,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Пользователей',
      value: stats?.total_users ?? 0,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Объявлений сегодня',
      value: stats?.new_listings.today ?? 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Дашборд</h1>
        <p className="text-gray-600 dark:text-gray-400">Обзор активности платформы</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">Загрузка...</div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statCards.map((stat) => (
              <motion.div key={stat.title} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <div className="glass-card p-6 card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.title}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Объявления по статусам</span>
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Активных', value: stats?.listings_by_status.active ?? 0, color: 'bg-green-500' },
                  { label: 'На модерации', value: stats?.listings_by_status.moderation ?? 0, color: 'bg-yellow-500' },
                  { label: 'Отклонённых', value: stats?.listings_by_status.rejected ?? 0, color: 'bg-red-500' },
                  { label: 'Черновиков', value: stats?.listings_by_status.draft ?? 0, color: 'bg-gray-400' },
                  { label: 'Продано', value: stats?.listings_by_status.sold ?? 0, color: 'bg-blue-500' },
                  { label: 'В архиве', value: stats?.listings_by_status.archived ?? 0, color: 'bg-slate-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${item.color} rounded-full`} />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>За период</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">Новые пользователи</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Сегодня', value: stats?.new_users.today ?? 0 },
                      { label: 'Неделя', value: stats?.new_users.week ?? 0 },
                      { label: 'Месяц', value: stats?.new_users.month ?? 0 },
                    ].map((p) => (
                      <div key={p.label} className="text-center p-3 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl">
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{p.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{p.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">Новые объявления</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Сегодня', value: stats?.new_listings.today ?? 0 },
                      { label: 'Неделя', value: stats?.new_listings.week ?? 0 },
                      { label: 'Месяц', value: stats?.new_listings.month ?? 0 },
                    ].map((p) => (
                      <div key={p.label} className="text-center p-3 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl">
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{p.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{p.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {stats?.top_categories && stats.top_categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Топ категорий</span>
              </h2>
              <div className="space-y-3">
                {stats.top_categories.map((cat, i) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{i + 1}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{cat.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}
