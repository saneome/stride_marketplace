import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Plus, User, LogOut, Bike, Snowflake, Flame } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { ThemeToggle } from './ThemeToggle'

const sections = [
  { name: 'Велосипеды', slug: 'bikes', icon: Bike },
  { name: 'Самокаты', slug: 'scooters', icon: Flame },
  { name: 'Ватрушки', slug: 'tubes', icon: Snowflake },
  { name: 'Лыжи', slug: 'skis', icon: Snowflake },
  { name: 'Сноуборды', slug: 'snowboards', icon: Snowflake },
  { name: 'Б/у', slug: 'used', isHighlight: true, icon: Flame },
]

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-white/30 dark:border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <Bike className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">SportMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {sections.map((section) => (
              <Link
                key={section.slug}
                to={`/listings?category=${section.slug}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  section.isHighlight
                    ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-orange-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span>{section.name}</span>
              </Link>
            ))}

            <div className="ml-6 pl-6 border-l border-gray-200/50 dark:border-slate-700/50 flex items-center space-x-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/listings/create"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Подать</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.firstName || 'Профиль'}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 rounded-xl font-medium transition-all duration-300"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200/50 dark:border-slate-700/50 py-4"
            >
              <nav className="flex flex-col space-y-2">
                {sections.map((section) => (
                  <Link
                    key={section.slug}
                    to={`/listings?category=${section.slug}`}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-3 ${
                      section.isHighlight
                        ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-orange-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.name}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-200/50 dark:border-slate-700/50 pt-4 mt-4 flex flex-col space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/listings/create"
                        className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Plus className="w-5 h-5" />
                        <span>Подать объявление</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>{user?.firstName || 'Профиль'}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Выйти</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Войти</span>
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Регистрация</span>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
