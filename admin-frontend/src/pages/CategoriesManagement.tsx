export default function CategoriesManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление категориями</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold mb-2">Список категорий</h3>
        <p className="text-gray-600 mb-6">
          Категории товаров появятся здесь после создания в системе.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-green-800 mb-2">Доступные категории:</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Велосипеды</li>
            <li>• Самокаты</li>
            <li>• Ватрушки</li>
            <li>• Лыжи</li>
            <li>• Сноуборды</li>
            <li>• Коньки</li>
            <li>• Скейты</li>
            <li>• Б/у товары</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
