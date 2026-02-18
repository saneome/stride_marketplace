import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      new: 'Новый',
      like_new: 'Как новый',
      good: 'Хорошее',
      fair: 'Удовлетворительное',
      poor: 'Б/у',
      for_parts: 'На запчасти',
    }
    return labels[condition] || condition
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {getCategoryDisplayName(category)}
          </h1>
          {!loading && !error && listings.length > 0 && (
            <p className="text-gray-600 dark:text-gray-400">Найдено объявлений: {listings.length}</p>
          )}
        </div>
        <Link
          to="/listings/create"
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Подать объявление</span>
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Ошибка загрузки</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </motion.div>
      ) : listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center"
          >
            <Bike className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">Объявлений не найдено</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {category
              ? `В категории "${getCategoryDisplayName(category)}" пока нет объявлений`
              : 'Объявлений пока нет'}
          </p>
          <Link
            to="/listings/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Будьте первым!</span>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to={`/listings/${listing.id}`}
                className="glass-card overflow-hidden card-hover block"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bike className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-lg">
                    {formatPrice(listing.price, listing.currency)}
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
                    <Eye className="w-3 h-3" />
                    <span>{listing.viewsCount}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-medium">
                      {listing.category}
                    </span>
                    <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-medium">
                      {getConditionLabel(listing.condition)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-lg">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm text-gray-500">
                    {listing.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.location}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(listing.createdAt)}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
