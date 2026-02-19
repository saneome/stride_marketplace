import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, FileText, Users, FolderOpen, ClipboardList, Settings } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export default function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Дашборд', icon: LayoutDashboard },
    { path: '/listings', label: 'Модерация', icon: FileText },
    { path: '/users', label: 'Пользователи', icon: Users },
    { path: '/categories', label: 'Категории', icon: FolderOpen },
    { path: '/audit', label: 'Аудит', icon: ClipboardList },
  ]

  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white dark:text-gray-100 min-h-screen shadow-2xl transition-colors duration-300">
      <div className="p-6 border-b border-gray-700 dark:border-slate-700">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
            >
              <LayoutDashboard className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Marketplace</p>
            </div>
          </div>
          <ThemeToggle />
        </motion.div>
      </div>

      <nav className="mt-6 px-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                  : 'hover:bg-gray-700/50 dark:hover:bg-slate-700/50 hover:translate-x-2'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-2 w-2 h-2 bg-white rounded-full"
                />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 dark:border-slate-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl hover:bg-gray-700/50 dark:hover:bg-slate-700/50 transition-all duration-300 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100"
        >
          <Settings className="w-5 h-5" />
          <span>Настройки</span>
        </motion.button>
      </div>
    </aside>
  )
}
