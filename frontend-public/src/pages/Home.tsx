import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bike, Flame, Snowflake, ArrowRight, Star, MapPin, Clock, TrendingUp } from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  currency: string
  location: string | null
  imageUrl: string | null
  category: string
  createdAt: string
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/listings?limit=8`)
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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency
  }

  const categories = [
    { name: 'Велосипеды', slug: 'bikes', icon: Bike, color: 'from-blue-500 to-cyan-500' },
    { name: 'Самокаты', slug: 'scooters', icon: Flame, color: 'from-orange-500 to-red-500' },
    { name: 'Ватрушки', slug: 'tubes', icon: Snowflake, color: 'from-cyan-500 to-blue-500' },
    { name: 'Лыжи', slug: 'skis', icon: Snowflake, color: 'from-purple-500 to-pink-500' },
    { name: 'Сноуборды', slug: 'snowboards', icon: Snowflake, color: 'from-indigo-500 to-purple-500' },
    { name: 'Коньки', slug: 'skates', icon: Snowflake, color: 'from-pink-500 to-rose-500' },
    { name: 'Скейты', slug: 'skateboards', icon: Flame, color: 'from-yellow-500 to-orange-500' },
    { name: 'Б/у товары', slug: 'used', icon: TrendingUp, color: 'from-green-500 to-emerald-500', isHighlight: true },
  ]

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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 p-12 md:p-16 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
              SportMarket
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Маркетплейс спортивных товаров нового поколения
            </p>
            <p className="text-lg mb-8 text-white/80">
              Новые велосипеды, самокаты, ватрушки, лыжи, сноуборды и аксессуары от проверенных продавцов
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/listings"
                className="btn-primary flex items-center space-x-2"
              >
                <span>Смотреть товары</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/listings/create"
                className="px-6 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 border border-white/30 dark:border-white/20"
              >
                Продать б/у товар
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"
        />
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold gradient-text">Категории товаров</h2>
          <Link to="/listings" className="text-blue-600 hover:text-blue-700 flex items-center space-x-2 font-medium">
            <span>Все категории</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {categories.map((category) => (
            <motion.div
              key={category.slug}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/listings?category=${category.slug}`}
                className={`glass-card p-6 text-center card-hover relative overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <category.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">{category.name}</div>
                {category.isHighlight && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Listings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold gradient-text">Последние объявления</h2>
          <Link to="/listings" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-2 font-medium">
            <span>Смотреть все</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-slate-700 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Bike className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-600 dark:text-gray-400">Объявлений пока нет</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Bike className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {formatPrice(listing.price, listing.currency)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">{listing.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      {listing.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.location}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(listing.createdAt).toLocaleDateString('ru-RU')}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  )
}
