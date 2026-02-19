import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image as ImageIcon, DollarSign, MapPin, Tag, FileText, Send, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

interface PreviewFile {
  file: File
  preview: string
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function CreateListing() {
  const navigate = useNavigate()
  const [images, setImages] = useState<PreviewFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('new')
  const [categoryId, setCategoryId] = useState('')
  const [location, setLocation] = useState('')

  const MAX_FILES = 10
  const MAX_SIZE = 5 * 1024 * 1024
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(Array.isArray(res.data) ? res.data : [])
    }).catch(() => {})
  }, [])

  const addFiles = useCallback((files: FileList | File[]) => {
    const newFiles: PreviewFile[] = []

    for (const file of Array.from(files)) {
      if (images.length + newFiles.length >= MAX_FILES) break
      if (!ALLOWED_TYPES.includes(file.type)) continue
      if (file.size > MAX_SIZE) continue

      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
      })
    }

    setImages((prev) => [...prev, ...newFiles])
  }, [images.length])

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return toast.error('Укажите название')
    if (!description.trim()) return toast.error('Укажите описание')
    if (!price || Number(price) <= 0) return toast.error('Укажите цену')
    if (!categoryId) return toast.error('Выберите категорию')
    if (!location.trim()) return toast.error('Укажите локацию')

    setIsSubmitting(true)

    try {
      // 1. Create listing
      const { data: listing } = await api.post('/listings', {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        condition,
        category_id: Number(categoryId),
        location: location.trim(),
      })

      // 2. Upload images if any
      if (images.length > 0) {
        const formData = new FormData()
        images.forEach((img) => formData.append('files', img.file))

        await api.post(`/listings/${listing.id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      toast.success('Объявление отправлено на модерацию!')
      navigate('/')
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      toast.error(typeof detail === 'string' ? detail : 'Ошибка при создании объявления')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Подать объявление</h1>
        <p className="text-gray-600 dark:text-gray-400">Заполните форму для размещения товара</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Название</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Название товара"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Описание</span>
            </label>
            <textarea
              className="input-field resize-none"
              rows={5}
              placeholder="Подробное описание товара"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Цена</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="0"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Состояние</span>
              </label>
              <select
                className="input-field"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="new">Новое</option>
                <option value="like_new">Как новое</option>
                <option value="used">Б/у</option>
                <option value="for_parts">На запчасти</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Категория</span>
            </label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Локация</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Город, район"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Фотографии ({images.length}/{MAX_FILES})</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 ${
                isDragging
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                {isDragging ? 'Отпустите файлы' : 'Перетащите файлы сюда'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">или нажмите для выбора</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                JPG, PNG, WebP. Максимум {MAX_FILES} файлов, до 5 МБ каждый
              </p>
            </motion.div>

            <AnimatePresence>
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4"
                >
                  {images.map((img, index) => (
                    <motion.div
                      key={img.preview}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600"
                    >
                      <img
                        src={img.preview}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 text-[10px] font-medium bg-blue-600 text-white px-1.5 py-0.5 rounded-md">
                          Обложка
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Отправка...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Отправить на модерацию</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
