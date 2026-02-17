import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {getCategoryDisplayName(category)}
        </h1>
        <Link
          to="/listings/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Подать объявление
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Загрузка объявлений...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">Объявлений не найдено</h3>
          <p className="text-gray-600 mb-6">
            {category
              ? `В категории "${category}" пока нет объявлений`
              : 'Объявлений пока нет'}
          </p>
          <Link
            to="/listings/create"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Будьте первым!
          </Link>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">Найдено объявлений: {listings.length}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {listing.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {getConditionLabel(listing.condition)}
                    </span>
                  </div>
                  <h3 className="font-medium mb-2 line-clamp-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(listing.price, listing.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm text-gray-500">
                    {listing.location && <span>{listing.location}</span>}
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
