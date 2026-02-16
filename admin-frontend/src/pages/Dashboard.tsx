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
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-gray-600">Пользователей</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">0</div>
          <div className="text-gray-600">Сегодня</div>
        </div>
      </div>
      <p className="text-gray-600">Статистика будет здесь...</p>
    </div>
  )
}
