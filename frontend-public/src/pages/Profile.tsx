import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Settings, LogOut, Bike, Heart, MessageSquare, Edit } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import ProfileSettings from '../components/ProfileSettings'
import { EyeIcon } from '../components/icons/EyeIcon'

interface Listing {
  id: string
  title: string
  price: number
  currency: string
  imageUrl: string | null
  viewsCount: number
  createdAt: string
}

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [stats, setStats] = useState({
    listingsCount: 0,
    totalViews: 0,
    favoritesCount: 0,
    messagesCount: 0,
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchUserListings()
    fetchUserStats()
  }, [user, navigate])

  const fetchUserListings = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/listings?seller_id=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setListings(data.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('access_token')
      // В реальном приложении здесь будет API вызов для получения статистики
      // Пока используем данные из listings
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/listings?seller_id=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        const items = data.items || []
        const totalViews = items.reduce((sum: number, item: Listing) => sum + item.viewsCount, 0)
        setStats({
          listingsCount: items.length,
          totalViews,
          favoritesCount: 0, // Будет получено из API избранного
          messagesCount: 0, // Будет получено из API сообщений
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return null
  }

  const displayName = user.firstName || user.email.split('@')[0]
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || displayName

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 text-center">
            <div
              className="w-24 h-24 mx-auto mb-4 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center shadow-xl"
            >
              {user.avatarUrl ? (
                <img src={`${import.meta.env.VITE_API_URL}${user.avatarUrl}`} alt={displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white dark:text-neutral-900" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{fullName}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <Calendar className="w-4 h-4" />
              <span>ID: {user.id.slice(0, 8)}...</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.listingsCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Объявлений</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Просмотров</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favoritesCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Избранное</div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Настройки</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Контактная информация</h3>
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1 text-sm font-medium">
                <Edit className="w-4 h-4" />
                <span>Редактировать</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Телефон</div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">{user.phone || 'Не указан'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Дата регистрации</div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указана'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* My Listings */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Мои объявления</h3>
              <button
                onClick={() => navigate('/listings/create')}
                className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
              >
                <span>+ Добавить</span>
              </button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 border border-gray-100 dark:border-neutral-700 animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-neutral-700 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <Bike className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">У вас пока нет объявлений</p>
                <button
                  onClick={() => navigate('/listings/create')}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>Создать первое объявление</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => navigate(`/listings/${listing.id}`)}
                    className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-neutral-800 rounded-lg mb-3 overflow-hidden">
                      {listing.imageUrl ? (
                        <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bike className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">{listing.title}</h4>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-gray-600 dark:text-gray-400">{formatPrice(listing.price, listing.currency)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                        <EyeIcon size={14} className="text-gray-500 dark:text-gray-400" />
                        <span>{listing.viewsCount}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(listing.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="glass-card p-6 cursor-pointer card-hover"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-neutral-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white dark:text-neutral-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Избранное</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stats.favoritesCount} товаров</p>
                </div>
              </div>
            </div>
            <div
              className="glass-card p-6 cursor-pointer card-hover"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-neutral-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white dark:text-neutral-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Сообщения</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stats.messagesCount} новых</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <ProfileSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
