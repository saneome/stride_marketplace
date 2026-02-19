import { useEffect } from 'react'
import { useAuthStore } from '../store/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading, checkAdmin } = useAuthStore()

  useEffect(() => {
    checkAdmin()
  }, [checkAdmin])

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      window.location.replace('/not-found')
    }
  }, [isLoading, isAdmin])

  if (isLoading || !isAdmin) {
    return null
  }

  return <>{children}</>
}
