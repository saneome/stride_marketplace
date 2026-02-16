export default function CreateListing() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Подать объявление</h1>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Название товара"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
            placeholder="Подробное описание товара"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Состояние
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="new">Новое</option>
              <option value="like_new">Как новое</option>
              <option value="used">Б/у</option>
              <option value="for_parts">На запчасти</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Категория
          </label>
          <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Выберите категорию</option>
            <option value="electronics">Электроника</option>
            <option value="sports">Спорт и отдых</option>
            <option value="home">Для дома</option>
            <option value="clothing">Одежда и обувь</option>
            <option value="auto">Авто и мото</option>
            <option value="hobbies">Хобби</option>
            <option value="other">Другое</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Локация
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Город, район"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Фотографии
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Перетащите файлы сюда или нажмите для выбора</p>
            <p className="text-sm text-gray-400 mt-1">Максимум 10 файлов, до 5 МБ каждый</p>
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Отправить на модерацию
        </button>
      </form>
    </div>
  )
}
