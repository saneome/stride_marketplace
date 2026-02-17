export default function ListingsModeration() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Модерация объявлений</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">Нет объявлений на модерации</h3>
        <p className="text-gray-600 mb-6">
          Б/у объявления, требующие модерации, появятся здесь после того, как пользователи начнут их публиковать.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-yellow-800 mb-2">Как работает модерация:</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Новые товары (новые, как новые) публикуются сразу</li>
            <li>• Б/у товары отправляются на модерацию</li>
            <li>• Админ одобряет или отклоняет объявления</li>
            <li>• Пользователь получает уведомление о решении</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
