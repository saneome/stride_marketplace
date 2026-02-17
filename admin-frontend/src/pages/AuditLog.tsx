export default function AuditLog() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Журнал аудита</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold mb-2">История действий</h3>
        <p className="text-gray-600 mb-6">
          Записи о действиях пользователей и администраторов появятся здесь.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-blue-800 mb-2">Что записывается в журнал:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Регистрация новых пользователей</li>
            <li>• Создание и редактирование объявлений</li>
            <li>• Модерация объявлений (одобрение/отклонение)</li>
            <li>• Действия администраторов</li>
            <li>• Входы и выходы из системы</li>
            <li>• Изменения в категориях</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
