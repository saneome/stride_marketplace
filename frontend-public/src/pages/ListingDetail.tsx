import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Eye, User, Phone, MessageCircle, ChevronLeft, ImageIcon, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

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
  category_id: number
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

const CONDITIONS: Record<string, string> = {
  'Новый': 'new',
  'Как новый': 'like_new',
  'Б/у': 'used',
  'На запчасти': 'for_parts',
}

const CONDITION_LABELS: Record<string, string> = {
  new: 'Новый',
  like_new: 'Как новый',
  used: 'Б/у',
  for_parts: 'На запчасти',
}

function conditionToValue(label: string): string {
  return CONDITIONS[label] || label
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editCondition, setEditCondition] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setError('Объявление не найдено'))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = user && listing?.seller && user.id === listing.seller.id

  const startEditing = () => {
    if (!listing) return
    setEditTitle(listing.title)
    setEditDescription(listing.description)
    setEditPrice(String(listing.price))
    setEditCondition(conditionToValue(listing.condition))
    setEditLocation(listing.location || '')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  const saveEditing = async () => {
    if (!listing) return
    if (!editTitle.trim()) return toast.error('Укажите название')
    if (!editDescription.trim()) return toast.error('Укажите описание')
    if (!editPrice || Number(editPrice) <= 0) return toast.error('Укажите цену')
    if (!editLocation.trim()) return toast.error('Укажите локацию')

    setIsSaving(true)
    try {
      const { data } = await api.put(`/listings/${listing.id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        price: Number(editPrice),
        condition: editCondition,
        location: editLocation.trim(),
      })
      setListing(data)
      setIsEditing(false)
      toast.success('Объявление обновлено')
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      toast.error(typeof detail === 'string' ? detail : 'Ошибка при обновлении')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!listing) return
    setIsDeleting(true)
    try {
      await api.delete(`/listings/${listing.id}`)
      toast.success('Объявление удалено')
      navigate('/listings')
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      toast.error(typeof detail === 'string' ? detail : 'Ошибка при удалении')
    } finally {
      setIsDeleting(false)
    }
  }

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
        <div className="h-5 w-20 bg-gray-200 dark:bg-neutral-800 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-3">
            <div className="aspect-[4/3] bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
            <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-3/4" />
            <div className="h-10 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
            <div className="h-px bg-gray-200 dark:bg-neutral-800" />
            <div className="h-20 bg-gray-200 dark:bg-neutral-800 rounded" />
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
            <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800 relative">
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
                        ? 'ring-2 ring-neutral-900 dark:ring-white ring-offset-1 dark:ring-offset-neutral-900'
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
                <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium">
                  {listing.category}
                </span>
              )}
              {isEditing ? (
                <select
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium border-0 outline-none"
                >
                  {Object.entries(CONDITION_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              ) : (
                <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium">
                  {listing.condition}
                </span>
              )}
            </div>

            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight bg-transparent border-b border-gray-300 dark:border-neutral-700 outline-none pb-1"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="text-3xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-neutral-700 outline-none pb-1 w-48"
                    min="0"
                  />
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{listing.currency}</span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                  {listing.title}
                </h1>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(listing.price, listing.currency)}
                </p>
              </>
            )}

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              {isEditing ? (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="bg-transparent border-b border-gray-300 dark:border-neutral-700 outline-none text-sm w-32"
                    placeholder="Город"
                  />
                </span>
              ) : listing.location ? (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.location}
                </span>
              ) : null}
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

          {/* Owner actions */}
          {isOwner && (
            <div className="glass-card p-4">
              {showDeleteConfirm ? (
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Удалить это объявление? Действие нельзя отменить.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Да, удалить
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-medium rounded-xl transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveEditing}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Сохранить
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-medium rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={startEditing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-xl transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Seller */}
          {listing.seller && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
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
              {!isOwner && (
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-xl transition-colors">
                    <Phone className="w-4 h-4" />
                    Позвонить
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-medium rounded-xl transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Написать
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Описание</h2>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={6}
                className="w-full text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-transparent border border-gray-200 dark:border-neutral-700 rounded-lg p-2 outline-none resize-none"
              />
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
