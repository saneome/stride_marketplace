import { useEffect } from 'react'
import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ListingsModeration from './pages/ListingsModeration'
import UsersManagement from './pages/UsersManagement'
import CategoriesManagement from './pages/CategoriesManagement'
import AuditLog from './pages/AuditLog'

function RedirectToPublic404() {
  useEffect(() => {
    window.location.replace('/not-found')
  }, [])
  return null
}

function AdminLayout() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/listings" element={<ListingsModeration />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/categories" element={<CategoriesManagement />} />
          <Route path="/audit" element={<AuditLog />} />
        </Route>
        <Route path="*" element={<RedirectToPublic404 />} />
      </Routes>
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
