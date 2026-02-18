import { motion } from 'framer-motion'
import { FolderOpen, Plus, Edit, Trash2, Search, Bike, Flame, Snowflake, TrendingUp } from 'lucide-react'

export default function CategoriesManagement() {
  const categories = [
    { name: 'Велосипеды', slug: 'bikes', icon: Bike, color: 'from-blue-500 to-cyan-500', count: 0 },
    { name: 'Самокаты', slug: 'scooters', icon: Flame, color: 'from-orange-500 to-red-500', count: 0 },
    { name: 'Ватрушки', slug: 'tubes', icon: Snowflake, color: 'from-cyan-500 to-blue-500', count: 0 },
    { name: 'Лыжи', slug: 'skis', icon: Snowflake, color: 'from-purple-500 to-pink-500', count: 0 },
    { name: 'Сноуборды', slug: 'snowboards', icon: Snowflake, color: 'from-indigo-500 to-purple-500', count: 0 },
    { name: 'Коньки', slug: 'skates', icon: Snowflake, color: 'from-pink-500 to-rose-500', count: 0 },
    { name: 'Скейты', slug: 'skateboards', icon: Flame, color: 'from-yellow-500 to-orange-500', count: 0 },
    { name: 'Б/у товары', slug: 'used', icon: TrendingUp, color: 'from-green-500 to-emerald-500', count: 0 },
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
          <h1 className="text-4xl font-bold gradient-text mb-2">Управление категориями</h1>
          <p className="text-gray-600 dark:text-gray-400">Просмотр и управление категориями товаров</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить категорию</span>
        </motion.button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.slug}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="glass-card p-6 card-hover relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 hover:opacity-10 transition-opacity duration-300`} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`w-14 h-14 mb-4 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <category.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{category.count} товаров</p>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Редактировать</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 mt-8"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
          <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Статистика категорий</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Всего категорий', value: '8', color: 'from-blue-500 to-purple-500' },
            { label: 'Активных', value: '8', color: 'from-green-500 to-emerald-500' },
            { label: 'Всего товаров', value: '0', color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl border border-gray-100 dark:border-slate-700"
            >
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
