import { motion } from 'framer-motion'
import { FileText, Clock, Users, TrendingUp, Activity, DollarSign, Eye, ShoppingCart } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      title: 'Активных объявлений',
      value: '0',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      change: '+0%',
    },
    {
      title: 'На модерации',
      value: '0',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      change: '+0%',
    },
    {
      title: 'Пользователей',
      value: '1',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      change: '+100%',
    },
    {
      title: 'Сегодня',
      value: '0',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: '+0%',
    },
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Дашборд</h1>
        <p className="text-gray-600 dark:text-gray-400">Обзор активности платформы</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="glass-card p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
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
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Активность</span>
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Просмотры', value: '0', icon: Eye, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Продажи', value: '0', icon: ShoppingCart, color: 'text-green-600 dark:text-green-400' },
              { label: 'Доход', value: '0 ₽', icon: DollarSign, color: 'text-purple-600 dark:text-purple-400' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{item.value}</span>
              </motion.div>
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
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Статистика</span>
          </h2>
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                <Activity className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Статистика загружается...</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Данные появятся после начала работы платформы
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Последние действия</h2>
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center"
          >
            <Activity className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Действий пока нет</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            История действий пользователей появится здесь
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
