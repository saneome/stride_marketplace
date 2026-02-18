import { motion } from 'framer-motion'
import { ClipboardList, Search, Filter, Download, User, FileText, Shield, LogIn, LogOut, Calendar, Clock } from 'lucide-react'

export default function AuditLog() {
  const logTypes = [
    { icon: User, label: 'Регистрация', count: 0, color: 'from-blue-500 to-cyan-500' },
    { icon: FileText, label: 'Объявления', count: 0, color: 'from-green-500 to-emerald-500' },
    { icon: Shield, label: 'Модерация', count: 0, color: 'from-yellow-500 to-orange-500' },
    { icon: LogIn, label: 'Входы', count: 0, color: 'from-purple-500 to-pink-500' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Журнал аудита</h1>
          <p className="text-gray-600 dark:text-gray-400">История действий пользователей и администраторов</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Фильтры</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Экспорт</span>
          </motion.button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {logTypes.map((type, index) => (
          <motion.div
            key={type.label}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="glass-card p-6 card-hover">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`w-12 h-12 mb-4 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <type.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">{type.count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{type.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center"
        >
          <ClipboardList className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">История действий</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
          Записи о действиях пользователей и администраторов появятся здесь.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-left max-w-2xl mx-auto"
        >
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Что записывается в журнал:</span>
          </h4>
          <ul className="space-y-3">
            {[
              'Регистрация новых пользователей',
              'Создание и редактирование объявлений',
              'Модерация объявлений (одобрение/отклонение)',
              'Действия администраторов',
              'Входы и выходы из системы',
              'Изменения в категориях',
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
              >
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
