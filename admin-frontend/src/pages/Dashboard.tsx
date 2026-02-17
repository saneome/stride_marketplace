export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-gray-600">Активных объявлений</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">0</div>
          <div className="text-gray-600">На модерации</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">1</div>
          <div className="text-gray-600">Пользователей</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">0</div>
          <div className="text-gray-600">Сегодня</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold mb-2">Статистика загружается...</h3>
        <p className="text-gray-600">
          Данные о продажах, просмотрах и активности пользователей появятся здесь после начала работы платформы.
        </p>
      </div>
    </div>
  )
}
