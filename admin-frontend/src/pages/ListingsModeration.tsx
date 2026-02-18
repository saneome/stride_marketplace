import { motion } from 'framer-motion'
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react'

export default function ListingsModeration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Модерация объявлений</h1>
        <p className="text-gray-600">Управление объявлениями, требующими проверки</p>
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
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center"
        >
          <FileText className="w-12 h-12 text-yellow-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Нет объявлений на модерации</h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Б/у объявления, требующие модерации, появятся здесь после того, как пользователи начнут их публиковать.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CheckCircle, label: 'Одобрено', value: '0', color: 'from-green-500 to-emerald-500' },
            { icon: XCircle, label: 'Отклонено', value: '0', color: 'from-red-500 to-rose-500' },
            { icon: Clock, label: 'На рассмотрении', value: '0', color: 'from-yellow-500 to-orange-500' },
            { icon: AlertCircle, label: 'Всего', value: '0', color: 'from-blue-500 to-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`w-10 h-10 mx-auto mb-3 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 text-left max-w-2xl mx-auto"
        >
          <h4 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span>Как работает модерация:</span>
          </h4>
          <ul className="space-y-3">
            {[
              'Новые товары (новые, как новые) публикуются сразу',
              'Б/у товары отправляются на модерацию',
              'Админ одобряет или отклоняет объявления',
              'Пользователь получает уведомление о решении',
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start space-x-3 text-gray-700"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
