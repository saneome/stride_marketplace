import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ListingsModeration from './pages/ListingsModeration'
import UsersManagement from './pages/UsersManagement'
import CategoriesManagement from './pages/CategoriesManagement'
import AuditLog from './pages/AuditLog'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/listings" element={<ListingsModeration />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/categories" element={<CategoriesManagement />} />
          <Route path="/audit" element={<AuditLog />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
