import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material'
import {
  Close as CloseIcon,
  Description as FileIcon,
  FolderOff as FolderOffIcon,
  InsertDriveFile as DocumentIcon,
  OpenInNew as OpenIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import client from '../../api/client'


const CARD = {
  bgcolor: '#1e293b',
  borderRadius: 2,
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: 'none',
  height: '100%',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, transform 0.15s ease',
  '&:hover': {
    borderColor: 'rgba(96,165,250,0.45)',
    transform: 'translateY(-1px)',
  },
}

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes)) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function buildDriveFolderUrl(folderId) {
  return '#'
}


export default function DocumentacionPage() {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [docs, setDocs] = useState([])
  const [docsLoading, setDocsLoading] = useState(false)
  const [error, setError] = useState('')
  const [docsError, setDocsError] = useState('')

  const cargarProveedores = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await client.get('/maestros/proveedores/')
      setProveedores(data)
    } catch {
      setError('No se pudieron cargar los proveedores.')
    } finally {
      setLoading(false)
    }
  }, [])

  const cargarDocumentos = useCallback(async (proveedor) => {
    if (!proveedor?.carpeta_drive_id) {
      setDocs([])
      setDocsError('Este proveedor no tiene carpeta demo configurada.')
      return
    }

    setDocsLoading(true)
    setDocsError('')
    try {
      const { data } = await client.get(`/mock/documentos/?folder_id=${proveedor.carpeta_drive_id}`)
      setDocs(data)
    } catch (err) {
      setDocs([])
      setDocsError(err.message || 'No se pudieron obtener los documentos demo.')
    } finally {
      setDocsLoading(false)
    }
  }, [])

  useEffect(() => { cargarProveedores() }, [cargarProveedores])

  const abrirProveedor = (proveedor) => {
    setSelected(proveedor)
    setDocs([])
    setDocsError('')
    cargarDocumentos(proveedor)
  }

  const cerrarModal = () => {
    setSelected(null)
    setDocs([])
    setDocsError('')
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 }}>
            Administracion
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mt: 0.5 }}>
            Documentacion de proveedores
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, mt: 0.5 }}>
            Consulta los archivos cargados por cada proveedor en su carpeta de Drive.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={cargarProveedores}
          disabled={loading}
          sx={{
            textTransform: 'none',
            borderColor: 'rgba(255,255,255,0.14)',
            color: 'rgba(255,255,255,0.75)',
            '&:hover': { borderColor: '#60a5fa', color: '#60a5fa' },
          }}
        >
          Actualizar
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={28} sx={{ color: '#3b82f6' }} />
        </Box>
      )}

      {!loading && proveedores.length === 0 && (
        <Box sx={{ py: 8, textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
          <FolderOffIcon sx={{ fontSize: 42, mb: 1 }} />
          <Typography sx={{ fontSize: 13 }}>No hay proveedores cargados.</Typography>
        </Box>
      )}

      {!loading && proveedores.length > 0 && (
        <Grid container spacing={2}>
          {proveedores.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={CARD} onClick={() => abrirProveedor(p)}>
                <CardContent sx={{ p: 2.2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 1.5,
                        bgcolor: p.carpeta_drive_id ? 'rgba(59,130,246,0.16)' : 'rgba(248,113,113,0.12)',
                        color: p.carpeta_drive_id ? '#60a5fa' : '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {p.carpeta_drive_id ? <DocumentIcon /> : <FolderOffIcon />}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.nombre}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.chofer || 'Sin chofer'} · {p.email || 'Sin email'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    <Chip
                      size="small"
                      label={p.categoria_display || p.categoria || 'Sin categoría'}
                      sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.72)', fontSize: 11 }}
                    />
                    <Chip
                      size="small"
                      label={p.carpeta_drive_id ? 'Carpeta demo' : 'Sin carpeta demo'}
                      sx={{
                        bgcolor: p.carpeta_drive_id ? 'rgba(34,197,94,0.12)' : 'rgba(248,113,113,0.12)',
                        color: p.carpeta_drive_id ? '#86efac' : '#fca5a5',
                        fontSize: 11,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={Boolean(selected)}
        onClose={cerrarModal}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 } } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, pb: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
              {selected?.nombre || 'Proveedor'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
              Documentos en archivo demo
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selected?.carpeta_drive_id && (
              <Button
                component={Link}
                href={buildDriveFolderUrl(selected.carpeta_drive_id)}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                endIcon={<OpenIcon sx={{ fontSize: 15 }} />}
                sx={{ textTransform: 'none', color: '#93c5fd' }}
              >
                Vista demo
              </Button>
            )}
            <IconButton
              onClick={() => selected && cargarDocumentos(selected)}
              disabled={docsLoading}
              sx={{ color: 'rgba(255,255,255,0.5)' }}
              size="small"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={cerrarModal} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {docsError && <Alert severity="warning" sx={{ mb: 2 }}>{docsError}</Alert>}

          {docsLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={26} sx={{ color: '#3b82f6' }} />
            </Box>
          )}

          {!docsLoading && !docsError && docs.length === 0 && (
            <Box sx={{ py: 5, textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
              <FileIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography sx={{ fontSize: 13 }}>No hay documentos cargados en esta carpeta.</Typography>
            </Box>
          )}

          {!docsLoading && docs.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {docs.map((doc) => (
                <Box
                  key={doc.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <FileIcon sx={{ color: '#60a5fa', flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.name}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: 11 }}>
                      {formatDate(doc.updated_at)} Â· {formatSize(doc.size)}
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    endIcon={<OpenIcon sx={{ fontSize: 15 }} />}
                    sx={{ textTransform: 'none', color: '#93c5fd', flexShrink: 0 }}
                  >
                    Ver
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}


