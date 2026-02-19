import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Bike, MapPin, Clock, Eye, Search } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: string | null
  imageUrl: string | null
  category: string
  condition: string
  viewsCount: number
  createdAt: string
  seller: {
    id: string
    firstName: string | null
  }
}

export default function Listings() {
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const category = searchParams.get('category')

  useEffect(() => {
    fetchListings()
  }, [category])

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/v1/listings?limit=50`
      if (category) {
        url += `&category=${category}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setListings(data.items || [])
      } else {
        setError('Не удалось загрузить объявления')
      }
    } catch (err) {
      setError('Ошибка при загрузке объявлений')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const getCategoryDisplayName = (slug: string | null) => {
    if (!slug) return 'Все товары'
    const names: Record<string, string> = {
      bikes: 'Велосипеды',
      scooters: 'Самокаты',
      tubes: 'Ватрушки',
      skis: 'Лыжи',
      snowboards: 'Сноуборды',
      skates: 'Коньки',
      skateboards: 'Скейты',
      used: 'Б/у товары',
    }
    return names[slug] || slug
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {getCategoryDisplayName(category)}
          </h1>
          {!loading && !error && listings.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Найдено: {listings.length}</p>
          )}
        </div>
        <Link
          to="/listings/create"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Подать объявление</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200 dark:bg-neutral-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-red-500" />
          </div>
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Ошибка загрузки</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bike className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Объявлений не найдено</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {category
              ? `В категории \u00ab${getCategoryDisplayName(category)}\u00bb пока нет объявлений`
              : 'Объявлений пока нет'}
          </p>
          <Link
            to="/listings/create"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Будьте первым!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listings/${listing.id}`}
              className="glass-card overflow-hidden card-hover block"
            >
              <div className="aspect-video bg-gray-100 dark:bg-neutral-800 relative overflow-hidden">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bike className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {formatPrice(listing.price, listing.currency)}
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md text-white text-xs">
                  <Eye className="w-3 h-3" />
                  <span>{listing.viewsCount}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-md font-medium">
                    {listing.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-md font-medium">
                    {listing.condition}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-2">
                  {listing.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {listing.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800 text-xs text-gray-400 dark:text-gray-500">
                  {listing.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(listing.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
