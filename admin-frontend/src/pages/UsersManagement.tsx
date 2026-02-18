import { motion } from 'framer-motion'
import { Users, Shield, Ban, Search, Filter, MoreVertical, UserPlus, Mail, Calendar } from 'lucide-react'

export default function UsersManagement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Управление пользователями</h1>
          <p className="text-gray-600 dark:text-gray-400">Просмотр и управление зарегистрированными пользователями</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Добавить пользователя</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center"
        >
          <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Список пользователей</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
          Зарегистрированные пользователи появятся здесь после начала работы платформы.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: 'Всего пользователей', value: '1', color: 'from-blue-500 to-cyan-500' },
            { icon: Shield, label: 'Активных', value: '1', color: 'from-green-500 to-emerald-500' },
            { icon: Ban, label: 'Заблокированных', value: '0', color: 'from-red-500 to-rose-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl border border-gray-100 dark:border-slate-700"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`w-10 h-10 mx-auto mb-3 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-left max-w-2xl mx-auto"
        >
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Функции управления:</span>
          </h4>
          <ul className="space-y-3">
            {[
              'Просмотр списка всех пользователей',
              'Изменение ролей (USER, MODERATOR, ADMIN)',
              'Блокировка/разблокировка пользователей',
              'Просмотр истории действий',
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
              >
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
