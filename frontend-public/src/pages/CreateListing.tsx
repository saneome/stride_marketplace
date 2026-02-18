import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, DollarSign, MapPin, Tag, FileText, Send } from 'lucide-react'

export default function CreateListing() {
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
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Название</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Название товара"
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Состояние</span>
              </label>
              <select className="input-field">
                <option value="new">Новое</option>
                <option value="like_new">Как новое</option>
                <option value="good">Хорошее</option>
                <option value="fair">Удовлетворительное</option>
                <option value="poor">Б/у</option>
                <option value="for_parts">На запчасти</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Категория</span>
            </label>
            <select className="input-field">
              <option value="">Выберите категорию</option>
              <option value="bikes">Велосипеды</option>
              <option value="scooters">Самокаты</option>
              <option value="tubes">Ватрушки</option>
              <option value="skis">Лыжи</option>
              <option value="snowboards">Сноуборды</option>
              <option value="skates">Коньки</option>
              <option value="skateboards">Скейты</option>
              <option value="used">Б/у товары</option>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Фотографии</span>
            </label>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-12 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Перетащите файлы сюда</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">или нажмите для выбора</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Максимум 10 файлов, до 5 МБ каждый</p>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Отправить на модерацию</span>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
