import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Shield, Ban, Search, Mail, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminUsers, useUpdateUser } from '../lib/hooks'

const ROLE_LABELS: Record<string, string> = {
  user: 'Пользователь',
  moderator: 'Модератор',
  admin: 'Администратор',
}

const ROLE_COLORS: Record<string, string> = {
  user: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  moderator: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function UsersManagement() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminUsers({ q: search || undefined, page, per_page: 20 })
  const updateUser = useUpdateUser()

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser.mutateAsync({ id: userId, role: newRole })
      toast.success('Роль обновлена')
    } catch {
      toast.error('Ошибка обновления роли')
    }
  }

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      await updateUser.mutateAsync({ id: userId, is_active: !currentActive })
      toast.success(currentActive ? 'Пользователь заблокирован' : 'Пользователь разблокирован')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Ошибка'
      toast.error(msg)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Управление пользователями</h1>
          <p className="text-gray-600 dark:text-gray-400">Просмотр и управление зарегистрированными пользователями</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Поиск по email или имени..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">Загрузка...</div>
      ) : !data?.data.length ? (
        <div className="glass-card p-8 text-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Пользователи не найдены</h3>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Пользователь</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Роль</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Объявлений</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Регистрация</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Статус</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{user.display_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />{user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${ROLE_COLORS[user.role] || ROLE_COLORS.user}`}
                      >
                        <option value="user">Пользователь</option>
                        <option value="moderator">Модератор</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{user.listings_count}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.is_active ? 'Активен' : 'Заблокирован'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          user.is_active
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                        }`}
                      >
                        {user.is_active ? 'Заблокировать' : 'Разблокировать'}
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.meta.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.meta.total_pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
