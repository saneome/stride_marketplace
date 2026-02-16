import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Дашборд', icon: '📊' },
    { path: '/listings', label: 'Модерация', icon: '📝' },
    { path: '/users', label: 'Пользователи', icon: '👥' },
    { path: '/categories', label: 'Категории', icon: '📁' },
    { path: '/audit', label: 'Аудит', icon: '📋' },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold">Marketplace Admin</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 transition-colors ${
              location.pathname === item.path
                ? 'bg-gray-800 border-r-4 border-blue-500'
                : 'hover:bg-gray-800'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
