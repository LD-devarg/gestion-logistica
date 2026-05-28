import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  AppBar,
  Toolbar,
  useMediaQuery,
} from '@mui/material'
import {
  DirectionsCar as ViajesIcon,
  Folder as DocIcon,
  AccountBalance as LiquidacionIcon,
  Receipt as PreliqIcon,
  Person as PerfilIcon,
  Logout as LogoutIcon,
  LocalShipping as LogoIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64

const navItems = [
  { label: 'Mis Viajes',          icon: <ViajesIcon />,      to: '/empleado/viajes' },
  { label: 'Preliquidaciones',    icon: <PreliqIcon />,      to: '/empleado/preliquidaciones' },
  { label: 'Mis Liquidaciones',   icon: <LiquidacionIcon />, to: '/empleado/liquidaciones' },
  { label: 'Documentación',       icon: <DocIcon />,         to: '/empleado/documentacion' },
  { label: 'Mi Perfil',           icon: <PerfilIcon />,      to: '/empleado/perfil' },
]

export default function EmpleadoLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width:899px)')

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH
  // En mobile el drawer siempre muestra el contenido completo
  const isCollapsed = isMobile ? false : collapsed

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: isCollapsed ? 1 : 2, py: 2.5, gap: 1.5, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LogoIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        {!isCollapsed && (
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
            LOGIDEMO
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: isCollapsed ? 1 : 2 }} />

      {/* Nav */}
      <List sx={{ flex: 1, pt: 1.5 }}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }} onClick={() => isMobile && setMobileOpen(false)}>
            {({ isActive }) => (
              <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    bgcolor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#60a5fa' : 'rgba(255,255,255,0.7)', minWidth: isCollapsed ? 0 : 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.85)' } } }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            )}
          </NavLink>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: isCollapsed ? 1 : 2 }} />

      {/* User + Logout */}
      <Box sx={{ px: isCollapsed ? 0 : 1.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        <Tooltip title={isCollapsed ? (user?.username || 'Empleado') : ''} placement="right">
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#3b82f6', fontSize: 14, flexShrink: 0, cursor: 'default' }}>
            {user?.username?.[0]?.toUpperCase() || 'E'}
          </Avatar>
        </Tooltip>
        {!isCollapsed && (
          <>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
                {user?.username || 'Empleado'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                {user?.email || ''}
              </Typography>
            </Box>
            <Tooltip title="Cerrar sesión">
              <IconButton
                onClick={handleLogout}
                sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#f87171' } }}
                size="small"
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </>
  )

  const drawerSx = {
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    borderRight: 'none',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f172a' }}>
      {!isMobile && (
        <Drawer
          variant="permanent"
          onMouseEnter={() => setCollapsed(false)}
          onMouseLeave={() => setCollapsed(true)}
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: 'width 0.25s ease',
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              boxSizing: 'border-box',
              transition: 'width 0.25s ease',
              overflowX: 'hidden',
              ...drawerSx,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              ...drawerSx,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isMobile && (
          <AppBar
            position="static"
            elevation={0}
            sx={{
              bgcolor: '#0f172a',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <Toolbar variant="dense" sx={{ px: 1.5, minHeight: 52 }}>
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ color: '#fff', mr: 1 }}
                size="medium"
              >
                <MenuIcon />
              </IconButton>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  bgcolor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                <LogoIcon sx={{ color: '#fff', fontSize: 14 }} />
              </Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                LOGIDEMO
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <Tooltip title="Cerrar sesiÃ³n">
                  <IconButton onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.5)' }} size="small">
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 2.5, md: 3 }, overflow: 'auto', bgcolor: '#0f172a', minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

