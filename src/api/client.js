import { categoriaLabels, makePreliquidacion, mockDb, nextId, nombreCliente, nombreSalida, seedOperations } from './mockData'

seedOperations()

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve({ data: clone(value) }), 120))
const clone = (value) => value instanceof Blob ? value : JSON.parse(JSON.stringify(value ?? null))
const ok = (value) => delay(value)
const fail = (detail, status = 400) => Promise.reject({ response: { status, data: { detail } }, message: detail })

function parseUrl(rawUrl, config = {}) {
  const url = new URL(rawUrl, 'https://demo.local')
  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
    })
  }
  return { path: url.pathname, query: url.searchParams }
}

function withProveedorDisplay(p) {
  return { ...p, categoria_display: categoriaLabels[p.categoria] || p.categoria }
}

function withSalidaDisplay(s) {
  return { ...s, cliente_nombre: nombreCliente(s.cliente) }
}

function withTarifaDisplay(t) {
  return { ...t, cliente_nombre: nombreCliente(t.cliente), salida_descripcion: nombreSalida(t.salida) }
}

function withAdicionalDisplay(a) {
  return { ...a, cliente_nombre: a.cliente ? nombreCliente(a.cliente) : null }
}

function withUserDisplay(u) {
  const rolLabels = { admin: 'Administrador', contable: 'Contable', readonly: 'Empleado' }
  return { ...u, rol_display: rolLabels[u.rol] || u.rol, proveedor_nombre: u.proveedor ? mockDb.proveedores.find((p) => p.id === Number(u.proveedor))?.nombre : null }
}

function withViajeDisplay(v) {
  return { ...v, cliente_nombre: nombreCliente(v.cliente), salida_descripcion: nombreSalida(v.salida), proveedor_nombre: mockDb.proveedores.find((p) => p.id === Number(v.proveedor))?.nombre || '-' }
}

function withGastoDisplay(g) {
  return { ...g, proveedor_nombre: mockDb.proveedores.find((p) => p.id === Number(g.proveedor))?.nombre || '-' }
}

function byId(path, prefix) {
  const match = path.match(new RegExp(`^${prefix}/(\\d+)/?$`))
  return match ? Number(match[1]) : null
}

function listByQuery(items, query) {
  let result = [...items]
  const proveedor = query.get('proveedor')
  const cliente = query.get('cliente')
  const estado = query.get('estado')
  const desde = query.get('desde')
  const hasta = query.get('hasta')
  const activo = query.get('activo')
  if (proveedor) result = result.filter((item) => Number(item.proveedor) === Number(proveedor))
  if (cliente) result = result.filter((item) => Number(item.cliente) === Number(cliente))
  if (estado) result = result.filter((item) => item.estado === estado || item.estado_pago === estado)
  if (desde) result = result.filter((item) => (item.fecha || item.fecha_gasto || item.periodo_desde || '') >= desde)
  if (hasta) result = result.filter((item) => (item.fecha || item.fecha_gasto || item.periodo_hasta || '') <= hasta)
  if (activo === 'true') result = result.filter((item) => item.activo !== false)
  if (query.get('sin_preliquidar') === 'true') result = result.filter((item) => item.estado === 'habilitado' || item.total_gasto != null)
  return result
}

function priceKey(categoria) {
  return categoria === '1' ? 'precio_cat_1' : categoria === '2' ? 'precio_cat_2' : categoria === '3' ? 'precio_cat_3' : 'precio_cat_3ero_sin_semi'
}

function calcGasto(payload) {
  const combustible = payload.combustible || null
  const bruto = combustible ? Number(combustible.precio_total_comb || (Number(combustible.lts_comb || 0) * Number(combustible.precio_lts_comb || 0))) : 0
  const totalComb = bruto * 0.8
  const varios = payload.varios || []
  const totalVarios = varios.reduce((sum, v) => sum + Number(v.monto || 0), 0)
  return { total_combustible: totalComb, total_varios: totalVarios, total_gasto: totalComb + totalVarios }
}

function makeViaje(payload, id = nextId('viajes')) {
  const proveedor = mockDb.proveedores.find((p) => p.id === Number(payload.proveedor))
  const tarifa = mockDb.tarifas.find((t) => t.id === Number(payload.tarifa)) || mockDb.tarifas.find((t) => t.activo && t.cliente === Number(payload.cliente) && t.salida === Number(payload.salida))
  const base = Number(tarifa?.[priceKey(proveedor?.categoria)] || 0)
  const adicionales = (payload.adicionales || []).map((item) => {
    const ad = mockDb.adicionales.find((a) => a.id === Number(item.adicional_id || item.adicional))
    const precio = ad?.tipo === 'al_momento' ? Number(item.precio_manual || item.precio_snapshot || 0) : Number(ad?.[priceKey(proveedor?.categoria)] || 0)
    return { adicional: ad?.id, adicional_nombre: ad?.nombre || 'Adicional', adicional_tipo: ad?.tipo || 'fijo', precio_snapshot: precio, descripcion_snapshot: item.descripcion || item.descripcion_snapshot || '' }
  })
  return { id, fecha: payload.fecha, cliente: Number(payload.cliente), salida: Number(payload.salida), proveedor: Number(payload.proveedor), tarifa: tarifa?.id || Number(payload.tarifa), remito: payload.remito || '', estado: payload.estado || 'habilitado', precio_tarifa: base, adicionales }
}

function refreshPreliq(preliq) {
  const viajeIds = (preliq.detalles || []).map((d) => d.viaje)
  const gastoIds = (preliq.gastos || []).map((g) => g.id)
  const updated = makePreliquidacion({ proveedor: preliq.proveedor, periodo_desde: preliq.periodo_desde, periodo_hasta: preliq.periodo_hasta, viaje_ids: viajeIds, gasto_ids: gastoIds })
  return { ...preliq, ...updated, id: preliq.id, estado: 'pendiente' }
}

const client = {
  async get(rawUrl, config = {}) {
    const { path, query } = parseUrl(rawUrl, config)

    if (path === '/maestros/clientes/') return ok(mockDb.clientes)
    if (path === '/maestros/proveedores/') return ok(mockDb.proveedores.map(withProveedorDisplay))
    if (path === '/maestros/salidas/') return ok(listByQuery(mockDb.salidas, query).map(withSalidaDisplay))
    if (path === '/maestros/tarifas/') return ok(listByQuery(mockDb.tarifas, query).map(withTarifaDisplay))
    if (path === '/maestros/adicionales/') return ok(listByQuery(mockDb.adicionales, query).map(withAdicionalDisplay))
    if (path === '/auth/users/') return ok(mockDb.users.map(withUserDisplay))
    if (path === '/maestros/telegram/status/') return ok({ configured: true, bot_username: 'logidemo_bot', api_ok: true, api_username: 'logidemo_bot', webhook_url: 'demo://webhook', pending_update_count: 0 })
    if (path === '/maestros/telegram/updates/') return ok([{ id: 1, username: 'chofer_demo', first_name: 'Martin', last_name: 'Costa', chat_id: '1001001' }])
    if (path === '/mock/documentos/') return ok(mockDb.documentos[query.get('folder_id')] || [])

    const provId = byId(path, '/maestros/proveedores')
    if (provId) return ok(withProveedorDisplay(mockDb.proveedores.find((p) => p.id === provId)))

    const histMatch = path.match(/^\/maestros\/tarifas\/historial\/(\d+)\/(\d+)\/?$/)
    if (histMatch) {
      const salida = Number(histMatch[1])
      const cliente = Number(histMatch[2])
      return ok(mockDb.tarifas.filter((t) => t.salida === salida && t.cliente === cliente).map(withTarifaDisplay))
    }

    if (path === '/operaciones/viajes/') return ok(listByQuery(mockDb.viajes, query).map(withViajeDisplay))
    if (path === '/operaciones/gastos/') return ok(listByQuery(mockDb.gastos, query).map(withGastoDisplay))
    if (path === '/operaciones/preliquidaciones/') return ok(listByQuery(mockDb.preliquidaciones, query))
    if (path === '/operaciones/liquidaciones/') return ok(listByQuery(mockDb.liquidaciones, query))
    if (path === '/operaciones/mis-viajes/') return ok(listByQuery(mockDb.viajes.filter((v) => v.proveedor === 1), query).map(withViajeDisplay))
    if (path === '/operaciones/mis-preliquidaciones/') return ok(mockDb.preliquidaciones.filter((p) => p.proveedor === 1))
    if (path === '/operaciones/mis-liquidaciones/') return ok(mockDb.liquidaciones.filter((l) => l.proveedor === 1))

    return fail(`Endpoint demo no implementado: ${path}`, 404)
  },

  async post(rawUrl, payload = {}) {
    const { path } = parseUrl(rawUrl)

    if (path === '/maestros/clientes/') { const row = { id: nextId('clientes'), ...payload }; mockDb.clientes.push(row); return ok(row) }
    if (path === '/maestros/proveedores/') { const row = { id: nextId('proveedores'), ...payload }; mockDb.proveedores.push(row); return ok(withProveedorDisplay(row)) }
    if (path === '/maestros/salidas/') { const row = { id: nextId('salidas'), ...payload }; mockDb.salidas.push(row); return ok(withSalidaDisplay(row)) }
    if (path === '/maestros/adicionales/') { const row = { id: nextId('adicionales'), activo: true, ...payload }; mockDb.adicionales.push(row); return ok(withAdicionalDisplay(row)) }
    if (path === '/auth/users/') { const row = { id: nextId('users'), username: payload.email?.split('@')[0] || 'usuario_demo', ...payload }; mockDb.users.push(row); return ok(withUserDisplay(row)) }

    if (path === '/maestros/tarifas/actualizar/') {
      mockDb.tarifas.forEach((t) => { if (t.cliente === Number(payload.cliente) && t.salida === Number(payload.salida)) t.activo = false })
      const row = { id: nextId('tarifas'), activo: true, ...payload, cliente: Number(payload.cliente), salida: Number(payload.salida) }
      mockDb.tarifas.push(row)
      return ok(withTarifaDisplay(row))
    }
    if (path === '/maestros/tarifas/recalcular/') return ok({ viajes_actualizados: mockDb.viajes.length, preliquidaciones_actualizadas: mockDb.preliquidaciones.length, viajes_sin_tarifa: 0, viajes_bloqueados: 0 })

    if (path === '/operaciones/viajes/') { const row = makeViaje(payload); mockDb.viajes.push(row); return ok(withViajeDisplay(row)) }
    if (path === '/operaciones/gastos/') { const totals = calcGasto(payload); const row = { id: nextId('gastos'), ...payload, proveedor: Number(payload.proveedor), ...totals }; mockDb.gastos.push(row); return ok(withGastoDisplay(row)) }
    if (path === '/operaciones/preliquidaciones/generar/') {
      const row = makePreliquidacion(payload)
      mockDb.preliquidaciones.push(row)
      ;(payload.viaje_ids || []).forEach((id) => { const v = mockDb.viajes.find((item) => item.id === Number(id)); if (v) { v.estado = 'preliquidado'; v.preliquidacion_estado = row.estado } })
      return ok(row)
    }
    if (path === '/operaciones/liquidaciones/generar/') {
      const preliqs = mockDb.preliquidaciones.filter((p) => payload.preliquidacion_ids?.includes(p.id))
      if (!preliqs.length) return fail('Selecciona al menos una preliquidacion confirmada.')
      const proveedor = preliqs[0].proveedor
      const prov = mockDb.proveedores.find((p) => p.id === proveedor)
      const detalles = preliqs.flatMap((p) => p.detalles || [])
      const gastos = preliqs.flatMap((p) => p.gastos || [])
      const totalSinIva = preliqs.reduce((sum, p) => sum + Number(p.total_sin_iva || 0), 0)
      const totalConIva = preliqs.reduce((sum, p) => sum + Number(p.total_con_iva || 0), 0)
      const gastosPeriodo = Number(payload.gastos_periodo || preliqs.reduce((sum, p) => sum + Number(p.gastos_periodo || 0), 0))
      const row = { id: nextId('liquidaciones'), proveedor, proveedor_nombre: prov?.nombre || '-', carpeta_drive_id: prov?.carpeta_drive_id || '', periodo_desde: preliqs[0].periodo_desde, periodo_hasta: preliqs[preliqs.length - 1].periodo_hasta, fecha: new Date().toISOString().slice(0, 10), factura: payload.factura || 'FAC-DEMO', fecha_pago: payload.fecha_pago || new Date().toISOString().slice(0, 10), estado_pago: 'pendiente', detalles, gastos, total_sin_iva: totalSinIva, total_con_iva: totalConIva, gastos_periodo: gastosPeriodo, adeudado_final: totalConIva - gastosPeriodo }
      mockDb.liquidaciones.push(row)
      preliqs.forEach((p) => { p.estado = 'liquidada' })
      return ok(row)
    }
    if (path === '/operaciones/generar-pdf/') return ok(new Blob([payload.html || 'Demo PDF'], { type: 'application/pdf' }))
    if (/^\/operaciones\/preliquidaciones\/\d+\/telegram\/?$/.test(path)) return ok({ ok: true })
    if (/^\/maestros\/proveedores\/\d+\/telegram-test\/?$/.test(path)) return ok({ ok: true })
    const addMatch = path.match(/^\/operaciones\/preliquidaciones\/(\d+)\/viajes\/?$/)
    if (addMatch) {
      const preliq = mockDb.preliquidaciones.find((p) => p.id === Number(addMatch[1]))
      const viaje = mockDb.viajes.find((v) => v.id === Number(payload.viaje_id))
      if (!preliq || !viaje) return fail('No se encontro el viaje o la preliquidacion.')
      preliq.detalles.push(makePreliquidacion({ proveedor: preliq.proveedor, periodo_desde: preliq.periodo_desde, periodo_hasta: preliq.periodo_hasta, viaje_ids: [viaje.id], gasto_ids: [] }).detalles[0])
      Object.assign(preliq, refreshPreliq(preliq))
      viaje.estado = 'preliquidado'
      return ok(preliq)
    }
    return fail(`Endpoint demo no implementado: ${path}`, 404)
  },

  async patch(rawUrl, payload = {}) {
    const { path } = parseUrl(rawUrl)
    const maps = [
      ['/maestros/clientes', mockDb.clientes, (x) => x],
      ['/maestros/proveedores', mockDb.proveedores, withProveedorDisplay],
      ['/maestros/salidas', mockDb.salidas, withSalidaDisplay],
      ['/maestros/adicionales', mockDb.adicionales, withAdicionalDisplay],
      ['/auth/users', mockDb.users, withUserDisplay],
      ['/operaciones/preliquidaciones', mockDb.preliquidaciones, (x) => x],
      ['/operaciones/liquidaciones', mockDb.liquidaciones, (x) => x],
    ]
    for (const [prefix, list, shape] of maps) {
      const id = byId(path, prefix)
      if (id) {
        const item = list.find((row) => row.id === id)
        if (!item) return fail('Registro demo no encontrado.', 404)
        Object.assign(item, payload)
        if (prefix === '/operaciones/preliquidaciones' && payload.estado) mockDb.viajes.forEach((v) => { if ((item.detalles || []).some((d) => d.viaje === v.id)) v.preliquidacion_estado = payload.estado })
        return ok(shape(item))
      }
    }
    const viajeId = byId(path, '/operaciones/viajes')
    if (viajeId) {
      const idx = mockDb.viajes.findIndex((v) => v.id === viajeId)
      if (idx < 0) return fail('Viaje no encontrado.', 404)
      mockDb.viajes[idx] = makeViaje({ ...mockDb.viajes[idx], ...payload }, viajeId)
      return ok(withViajeDisplay(mockDb.viajes[idx]))
    }
    const gastoId = byId(path, '/operaciones/gastos')
    if (gastoId) {
      const item = mockDb.gastos.find((g) => g.id === gastoId)
      if (!item) return fail('Gasto no encontrado.', 404)
      Object.assign(item, payload, calcGasto({ ...item, ...payload }))
      return ok(withGastoDisplay(item))
    }
    return fail(`Endpoint demo no implementado: ${path}`, 404)
  },

  async delete(rawUrl) {
    const { path } = parseUrl(rawUrl)
    const removeFrom = (prefix, list) => {
      const id = byId(path, prefix)
      if (!id) return false
      const idx = list.findIndex((row) => row.id === id)
      if (idx >= 0) list.splice(idx, 1)
      return true
    }
    if (removeFrom('/maestros/clientes', mockDb.clientes)) return ok({})
    if (removeFrom('/maestros/proveedores', mockDb.proveedores)) return ok({})
    if (removeFrom('/maestros/salidas', mockDb.salidas)) return ok({})
    if (removeFrom('/maestros/tarifas', mockDb.tarifas)) return ok({})
    if (removeFrom('/maestros/adicionales', mockDb.adicionales)) return ok({})
    if (removeFrom('/auth/users', mockDb.users)) return ok({})
    if (removeFrom('/operaciones/viajes', mockDb.viajes)) return ok({})
    if (removeFrom('/operaciones/gastos', mockDb.gastos)) return ok({})
    const delMatch = path.match(/^\/operaciones\/preliquidaciones\/(\d+)\/viajes\/(\d+)\/?$/)
    if (delMatch) {
      const preliq = mockDb.preliquidaciones.find((p) => p.id === Number(delMatch[1]))
      if (!preliq) return fail('Preliquidacion no encontrada.', 404)
      preliq.detalles = (preliq.detalles || []).filter((d) => d.viaje !== Number(delMatch[2]))
      Object.assign(preliq, refreshPreliq(preliq))
      return ok(preliq)
    }
    return fail(`Endpoint demo no implementado: ${path}`, 404)
  },
}

export default client

