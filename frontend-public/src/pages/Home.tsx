import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
    { name: 'Велосипеды', slug: 'bikes', icon: '🚲' },
    { name: 'Самокаты', slug: 'scooters', icon: '🛴' },
    { name: 'Ватрушки', slug: 'tubes', icon: '🛟' },
    { name: 'Лыжи', slug: 'skis', icon: '⛷️' },
    { name: 'Сноуборды', slug: 'snowboards', icon: '🏂' },
    { name: 'Коньки', slug: 'skates', icon: '⛸️' },
    { name: 'Скейты', slug: 'skateboards', icon: '🛹' },
    { name: 'Б/у товары', slug: 'used', icon: '♻️', isHighlight: true },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12">
        <h1 className="text-4xl font-bold mb-4">
          SportMarket — маркетплейс спортивных товаров
        </h1>
        <p className="text-xl mb-8">
          Новые велосипеды, самокаты, ватрушки, лыжи, сноуборды и аксессуары
        </p>
        <div className="flex gap-4">
          <Link
            to="/listings"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Смотреть товары
          </Link>
          <Link
            to="/listings/create"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
          >
            Продать б/у товар
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Категории товаров</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/listings?category=${category.slug}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-medium">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Последние объявления</h2>
          <Link to="/listings" className="text-blue-600 hover:text-blue-700">
            Смотреть все →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Загрузка объявлений...</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">Объявлений пока нет</h3>
            <p className="text-gray-600 mb-6">
              Будьте первым, кто разместит объявление!
            </p>
            <Link
              to="/listings/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Подать объявление
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">📷</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">{listing.category}</div>
                  <h3 className="font-medium mb-2 line-clamp-2">{listing.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(listing.price, listing.currency)}
                    </span>
                    {listing.location && (
                      <span className="text-sm text-gray-500">{listing.location}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Почему выбирают нас?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold mb-2">Модерация объявлений</h3>
            <p className="text-gray-600">
              Все объявления проходят проверку модераторами
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-2">Безопасные сделки</h3>
            <p className="text-gray-600">
              Защищенная система личных сообщений
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold mb-2">Быстрый поиск</h3>
            <p className="text-gray-600">
              Удобные фильтры и полнотекстовый поиск
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
