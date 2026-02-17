export default function UsersManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление пользователями</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold mb-2">Список пользователей</h3>
        <p className="text-gray-600 mb-6">
          Зарегистрированные пользователи появятся здесь после начала работы платформы.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-blue-800 mb-2">Функции управления:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Просмотр списка всех пользователей</li>
            <li>• Изменение ролей (USER, MODERATOR, ADMIN)</li>
            <li>• Блокировка/разблокировка пользователей</li>
            <li>• Просмотр истории действий</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
