import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
    <header className="glass-card sticky top-0 z-50 rounded-none border-x-0 border-t-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
              <Bike className="w-5 h-5 text-white dark:text-neutral-900" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">頂点Stride</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {sections.map((section) => (
              <Link
                key={section.slug}
                to={`/listings?category=${section.slug}`}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {section.name}
              </Link>
            ))}

            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-neutral-700 flex items-center gap-2">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/listings/create"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Подать</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.firstName || 'Профиль'}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-sm transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-sm font-medium transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </nav>

          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-200 dark:border-neutral-800 py-3"
            >
              <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                  <Link
                    key={section.slug}
                    to={`/listings?category=${section.slug}`}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {section.name}
                  </Link>
                ))}

                <div className="border-t border-gray-200 dark:border-neutral-800 pt-3 mt-2 flex flex-col gap-1">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/listings/create"
                        className="flex items-center gap-2 px-3 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Подать объявление</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>{user?.firstName || 'Профиль'}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Выйти</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Войти</span>
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center px-3 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Регистрация
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
