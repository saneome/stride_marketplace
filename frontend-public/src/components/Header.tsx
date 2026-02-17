import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const sections = [
  { name: 'Велосипеды', slug: 'bikes' },
  { name: 'Самокаты', slug: 'scooters' },
  { name: 'Ватрушки', slug: 'tubes' },
  { name: 'Лыжи', slug: 'skis' },
  { name: 'Сноуборды', slug: 'snowboards' },
  { name: 'Б/у', slug: 'used', isHighlight: true },
]

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            SportMarket
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {sections.map((section) => (
              <Link
                key={section.slug}
                to={`/listings?category=${section.slug}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  section.isHighlight
                    ? 'text-orange-600 hover:bg-orange-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {section.name}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/listings/create" className="text-sm text-blue-600 hover:text-blue-700">
                    + Подать объявление
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                    {user?.firstName || 'Профиль'}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {sections.map((section) => (
                <Link
                  key={section.slug}
                  to={`/listings?category=${section.slug}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    section.isHighlight
                      ? 'text-orange-600 hover:bg-orange-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {section.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/listings/create" className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setIsMenuOpen(false)}>
                      + Подать объявление
                    </Link>
                    <Link to="/profile" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                      {user?.firstName || 'Профиль'}
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="text-sm text-gray-500 hover:text-red-600 text-left"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                      Войти
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 inline-block text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
