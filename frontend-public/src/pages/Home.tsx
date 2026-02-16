export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12">
        <h1 className="text-4xl font-bold mb-4">
          Купите и продавайте товары с рук
        </h1>
        <p className="text-xl mb-8">
          Техника, спорт-инвентарь, велосипеды, самокаты и многое другое
        </p>
        <div className="flex gap-4">
          <a
            href="/listings"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Смотреть объявления
          </a>
          <a
            href="/listings/create"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400"
          >
            Подать объявление
          </a>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Популярные категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Электроника', icon: '📱' },
            { name: 'Спорт и отдых', icon: '🚴' },
            { name: 'Для дома', icon: '🏠' },
            { name: 'Одежда и обувь', icon: '👕' },
            { name: 'Авто и мото', icon: '🚗' },
            { name: 'Хобби', icon: '🎨' },
            { name: 'Книги', icon: '📚' },
            { name: 'Другое', icon: '📦' },
          ].map((category) => (
            <a
              key={category.name}
              href={`/listings?category=${category.name}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-medium">{category.name}</div>
            </a>
          ))}
        </div>
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
