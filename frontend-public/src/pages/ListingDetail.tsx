import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, Eye, User, Phone, Mail, Tag, ImageIcon } from 'lucide-react'
import BackButton from '../components/BackButton'
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
        <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded mb-6" />
        <div className="glass-card p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 dark:bg-slate-700 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div>
        <BackButton />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center mt-6"
        >
          <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
            {error || 'Объявление не найдено'}
          </h3>
        </motion.div>
      </div>
    )
  }

  const currentImage = listing.images.length > 0
    ? listing.images[selectedImage]?.url
    : listing.imageUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-8 mt-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl overflow-hidden relative">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-32 h-32 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <img
                      src={img.thumbnailUrl || img.url}
                      alt={`${listing.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                {listing.category && (
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                    {listing.category}
                  </span>
                )}
                <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                  {listing.condition}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {listing.title}
              </h1>
              <div className="text-4xl font-bold gradient-text mb-4">
                {formatPrice(listing.price, listing.currency)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {listing.location && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{listing.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{formatDate(listing.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{listing.viewsCount} просмотров</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>ID: {listing.id.slice(0, 8)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Описание</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {listing.seller && (
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Продавец</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {listing.seller.avatarUrl ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${listing.seller.avatarUrl}`}
                        alt={listing.seller.firstName || 'Продавец'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {listing.seller.firstName || 'Продавец'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 btn-primary flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Позвонить</span>
                  </button>
                  <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Написать</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
