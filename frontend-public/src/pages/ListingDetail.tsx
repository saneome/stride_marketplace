import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, Eye, User, Phone, MessageCircle, ChevronLeft, ImageIcon } from 'lucide-react'
import api from '../lib/api'

interface ListingImage {
  id: string
  url: string
  thumbnailUrl: string | null
}

interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  condition: string
  category: string
  location: string | null
  imageUrl: string | null
  images: ListingImage[]
  status: string
  viewsCount: number
  createdAt: string
  seller: {
    id: string
    firstName: string | null
    avatarUrl: string | null
  } | null
}

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setError('Объявление не найдено'))
      .finally(() => setLoading(false))
  }, [id])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 w-20 bg-gray-200 dark:bg-slate-700 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-3">
            <div className="aspect-[4/3] bg-gray-200 dark:bg-slate-700 rounded-2xl" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-px bg-gray-200 dark:bg-slate-700" />
            <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-px bg-gray-200 dark:bg-slate-700" />
            <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div>
        <Link
          to="/listings"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </Link>
        <div className="glass-card p-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {error || 'Объявление не найдено'}
          </p>
        </div>
      </div>
    )
  }

  const currentImage = listing.images.length > 0
    ? listing.images[selectedImage]?.url
    : listing.imageUrl

  return (
    <div>
      <Link
        to="/listings"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        К объявлениям
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="glass-card overflow-hidden">
            <div className="aspect-[4/3] bg-gray-100 dark:bg-slate-800 relative">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-1.5 p-3 overflow-x-auto">
                {listing.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      selectedImage === i
                        ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-800'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.thumbnailUrl || img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title & Price */}
          <div className="glass-card p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {listing.category && (
                <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium">
                  {listing.category}
                </span>
              )}
              <span className="px-2.5 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md text-xs font-medium">
                {listing.condition}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
              {listing.title}
            </h1>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(listing.price, listing.currency)}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              {listing.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(listing.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {listing.viewsCount}
              </span>
            </div>
          </div>

          {/* Seller */}
          {listing.seller && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {listing.seller.avatarUrl ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${listing.seller.avatarUrl}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {listing.seller.firstName || 'Продавец'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Продавец</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
                  <Phone className="w-4 h-4" />
                  Позвонить
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Написать
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Описание</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
