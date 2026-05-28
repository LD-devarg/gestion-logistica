import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const demoUsers = {
  admin: {
    id: 1,
    email: 'admin@demo.local',
    username: 'admin',
    first_name: 'Admin',
    last_name: 'Demo',
    rol: 'admin',
    proveedor: null,
  },
  proveedor: {
    id: 2,
    email: 'proveedor@demo.local',
    username: 'proveedor',
    first_name: 'Ruta Clara',
    last_name: 'Transportes',
    rol: 'readonly',
    proveedor: 1,
  },
}

function resolveDemoUser(username, password) {
  const normalized = String(username || '').trim().toLowerCase()

  if (password !== 'demo1234') {
    throw new Error('Credenciales demo inválidas.')
  }

  if (normalized === 'admin') return demoUsers.admin
  if (normalized === 'proveedor') return demoUsers.proveedor

  throw new Error('Usuario demo no encontrado.')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (username, password) => {
    const me = resolveDemoUser(username, password)
    localStorage.setItem('access', 'demo-access-token')
    localStorage.setItem('user', JSON.stringify(me))
    setUser(me)
    return me
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem('access')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

