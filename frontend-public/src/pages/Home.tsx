import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bike, Flame, Snowflake, ArrowRight, MapPin, Clock, TrendingUp } from 'lucide-react'

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
    { name: 'Велосипеды', slug: 'bikes', icon: Bike },
    { name: 'Самокаты', slug: 'scooters', icon: Flame },
    { name: 'Ватрушки', slug: 'tubes', icon: Snowflake },
    { name: 'Лыжи', slug: 'skis', icon: Snowflake },
    { name: 'Сноуборды', slug: 'snowboards', icon: Snowflake },
    { name: 'Коньки', slug: 'skates', icon: Snowflake },
    { name: 'Скейты', slug: 'skateboards', icon: Flame },
    { name: 'Б/у товары', slug: 'used', icon: TrendingUp },
  ]

  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="rounded-2xl bg-neutral-900 dark:bg-white p-10 md:p-14">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white dark:text-neutral-900 mb-4 leading-tight">
            頂点Stride
          </h1>
          <p className="text-lg text-neutral-400 dark:text-neutral-500 mb-6">
            Маркетплейс спортивных товаров. Новые и б/у велосипеды, самокаты, лыжи, сноуборды и аксессуары.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Смотреть товары
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/listings/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-800 dark:bg-neutral-100 text-neutral-300 dark:text-neutral-600 rounded-xl text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
            >
              Продать товар
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Категории</h2>
          <Link to="/listings" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            Все
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/listings?category=${category.slug}`}
              className="glass-card p-4 flex items-center gap-3 card-hover"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <category.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Последние объявления</h2>
          <Link to="/listings" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            Все объявления
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-neutral-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Bike className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">Объявлений пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listings/${listing.id}`}
                className="glass-card overflow-hidden card-hover"
              >
                <div className="aspect-square bg-gray-100 dark:bg-neutral-800 relative overflow-hidden">
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
                </div>
                <div className="p-3.5">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{listing.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    {listing.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
