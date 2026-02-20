import { useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreateListing from './pages/CreateListing'
import NotFound from './pages/NotFound'
import { useAuthStore } from './store/authStore'

function MainLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  const verifyToken = useAuthStore((s) => s.verifyToken)

  useEffect(() => {
    verifyToken()
  }, [verifyToken])

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/listings/create" element={<CreateListing />} />
        </Route>
        <Route path="*" element={<NotFound />} />
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
    </>
  )
}

export default App
