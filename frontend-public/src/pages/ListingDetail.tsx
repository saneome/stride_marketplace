import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bike, MapPin, Clock, Eye, User, Phone, Mail, Calendar, Tag } from 'lucide-react'
import BackButton from '../components/BackButton'

export default function ListingDetail() {
  const { id } = useParams()

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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Bike className="w-32 h-32 text-gray-400 dark:text-gray-500" />
              </motion.div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl overflow-hidden">
                  <Bike className="w-8 h-8 text-gray-400 dark:text-gray-500 m-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                  Категория
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                  Состояние
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Название товара #{id}
              </h1>
              <div className="text-4xl font-bold gradient-text mb-4">
                10 000 ₽
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Москва</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Сегодня</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>123 просмотра</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>ID: {id}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Описание</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Подробное описание товара будет здесь. Здесь можно указать характеристики,
                состояние, особенности и другую важную информацию о товаре.
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Продавец</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Имя продавца</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">На сайте с 2024</div>
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

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Опубликовано: 17 февраля 2026</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
