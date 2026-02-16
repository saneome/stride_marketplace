import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Marketplace
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/listings" className="text-gray-700 hover:text-blue-600">
              Объявления
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/listings/create" className="text-gray-700 hover:text-blue-600">
                  Подать объявление
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  {user?.firstName || 'Профиль'}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
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
          </nav>
        </div>
      </div>
    </header>
  )
}
