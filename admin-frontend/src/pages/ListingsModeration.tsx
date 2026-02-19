import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Eye, MapPin, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminListings, useApproveListing, useRejectListing } from '../lib/hooks'
import type { Listing } from '../types'

const STATUS_TABS = [
  { value: 'moderation', label: 'На модерации' },
  { value: 'active', label: 'Активные' },
  { value: 'rejected', label: 'Отклонённые' },
  { value: '', label: 'Все' },
]

const CONDITION_LABELS: Record<string, string> = {
  new: 'Новый',
  like_new: 'Как новый',
  used: 'Б/У',
  for_parts: 'На запчасти',
}

export default function ListingsModeration() {
  const [statusFilter, setStatusFilter] = useState('moderation')
  const [page, setPage] = useState(1)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading } = useAdminListings({ status: statusFilter || undefined, page, per_page: 20 })
  const approveMut = useApproveListing()
  const rejectMut = useRejectListing()

  const handleApprove = async (listing: Listing) => {
    try {
      await approveMut.mutateAsync(listing.id)
      toast.success(`"${listing.title}" одобрено`)
    } catch {
      toast.error('Ошибка одобрения')
    }
  }

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return
    try {
      await rejectMut.mutateAsync({ id: rejectId, reason: rejectReason })
      toast.success('Объявление отклонено')
      setRejectId(null)
      setRejectReason('')
    } catch {
      toast.error('Ошибка отклонения')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Модерация объявлений</h1>
        <p className="text-gray-600 dark:text-gray-400">Управление объявлениями, требующими проверки</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === tab.value
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">Загрузка...</div>
      ) : !data?.data.length ? (
        <div className="glass-card p-8 text-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Нет объявлений</h3>
          <p className="text-gray-600 dark:text-gray-400">В данном разделе пока нет объявлений.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data.data.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{listing.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        listing.status === 'moderation' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        listing.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{listing.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{listing.price} {listing.currency}</span>
                      <span className="flex items-center gap-1"><Tag className="w-4 h-4" />{CONDITION_LABELS[listing.condition] ?? listing.condition}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.location}</span>
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{listing.views_count}</span>
                      <span>{listing.category.name}</span>
                      <span>от {listing.author.display_name} ({listing.author.email})</span>
                    </div>
                    {listing.reject_reason && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-400">
                        Причина отклонения: {listing.reject_reason}
                      </div>
                    )}
                  </div>

                  {listing.status === 'moderation' && (
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(listing)}
                        disabled={approveMut.isPending}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Одобрить
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRejectId(listing.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Отклонить
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {data.meta.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.meta.total_pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRejectId(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Отклонить объявление</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Укажите причину отклонения..."
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRejectId(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                Отмена
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || rejectMut.isPending}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl disabled:opacity-50 transition-colors"
              >
                {rejectMut.isPending ? 'Отклонение...' : 'Отклонить'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
