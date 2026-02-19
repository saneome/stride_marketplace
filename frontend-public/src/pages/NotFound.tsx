import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center"
        >
          <AlertTriangle className="w-14 h-14 text-red-500 dark:text-red-400" />
        </motion.div>

        <h1 className="text-8xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Страница не найдена</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Запрашиваемая страница не существует или была удалена.
        </p>

        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Home className="w-5 h-5" />
            На главную
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
