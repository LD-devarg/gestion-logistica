import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  LocalShipping as ProviderIcon,
} from '@mui/icons-material'

const demoAccounts = [
  {
    label: 'Administrador',
    username: 'admin',
    password: 'demo1234',
    description: 'Operaciones, maestros, tarifas y liquidaciones.',
    icon: <AdminIcon fontSize="small" />,
  },
  {
    label: 'Proveedor',
    username: 'proveedor',
    password: 'demo1234',
    description: 'Viajes propios, documentación y liquidaciones.',
    icon: <ProviderIcon fontSize="small" />,
  },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submitCredentials = async (nextUsername = username, nextPassword = password) => {
    setError('')
    setLoading(true)
    try {
      const me = await login(nextUsername, nextPassword)
      navigate(me.rol === 'readonly' ? '/empleado' : '/')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitCredentials()
  }

  const useDemoAccount = (account) => {
    setUsername(account.username)
    setPassword(account.password)
    submitCredentials(account.username, account.password)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0f172a',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: '#1e293b',
          color: '#f8fafc',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
          boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 2 } }}>
          <Stack spacing={0.8} sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 13, color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
              LOGIDEMO
            </Typography>
            <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 750 }}>
              Acceso a la demo
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>
              Ingresá con las credenciales públicas del README para alternar entre el panel administrativo y el portal de proveedor.
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
                sx={fieldSx}
              />
              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                sx={fieldSx}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{ py: 1.2, fontWeight: 700, textTransform: 'none' }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Ingresar'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }}>
            <Chip label="Usuarios demo" size="small" sx={{ bgcolor: '#0f172a', color: '#94a3b8' }} />
          </Divider>

          <Stack spacing={1.2}>
            {demoAccounts.map((account) => (
              <Button
                key={account.username}
                onClick={() => useDemoAccount(account)}
                variant="outlined"
                disabled={loading}
                startIcon={account.icon}
                sx={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  borderColor: 'rgba(148,163,184,0.24)',
                  color: '#e2e8f0',
                  p: 1.4,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#60a5fa',
                    bgcolor: 'rgba(96,165,250,0.08)',
                  },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                    {account.label}: {account.username} / {account.password}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                    {account.description}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

const fieldSx = {
  '& .MuiInputBase-root': {
    bgcolor: 'rgba(15,23,42,0.7)',
    color: '#f8fafc',
  },
  '& .MuiInputLabel-root': {
    color: '#94a3b8',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#60a5fa',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(148,163,184,0.28)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(148,163,184,0.52)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#60a5fa',
  },
}
