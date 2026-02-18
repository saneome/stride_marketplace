import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ListingsModeration from './pages/ListingsModeration'
import UsersManagement from './pages/UsersManagement'
import CategoriesManagement from './pages/CategoriesManagement'
import AuditLog from './pages/AuditLog'

function App() {
  return (
    <BrowserRouter basename="/admin">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/listings" element={<ListingsModeration />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/categories" element={<CategoriesManagement />} />
            <Route path="/audit" element={<AuditLog />} />
          </Routes>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: '#374151',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
