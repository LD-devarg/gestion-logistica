import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children, roles, fallback = '/login' }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (roles?.length && !roles.includes(user.rol)) {
    return <Navigate to={fallback} replace />
  }

  return children
}
