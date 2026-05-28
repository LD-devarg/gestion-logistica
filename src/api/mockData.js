export const categoriaLabels = {
  '3ero_sin_semi': '3ero S/Semi',
  '1': 'Categoria 1',
  '2': 'Categoria 2',
  '3': 'Categoria 3',
}

export const mockDb = {
  clientes: [
    { id: 1, nombre: 'Andes Retail SA', cuit: '30-71000001-4', email: 'operaciones@andes-retail.demo' },
    { id: 2, nombre: 'Pampa Foods SRL', cuit: '30-71000002-2', email: 'logistica@pampa-foods.demo' },
    { id: 3, nombre: 'Nodo Sur Distribucion', cuit: '30-71000003-0', email: 'trafico@nodosur.demo' },
  ],
  proveedores: [
    { id: 1, nombre: 'Ruta Clara Transportes', chofer: 'Martin Costa', email: 'martin.costa@demo.local', categoria: '1', carpeta_drive_id: 'demo-folder-ruta-clara', telefono: '+5491100000001', telegram_chat_id: '1001001', telegram_activo: true },
    { id: 2, nombre: 'Sur Cargo Demo', chofer: 'Laura Medina', email: 'laura.medina@demo.local', categoria: '2', carpeta_drive_id: 'demo-folder-sur-cargo', telefono: '+5491100000002', telegram_chat_id: '1001002', telegram_activo: true },
    { id: 3, nombre: 'Norte Fletes Mock', chofer: 'Diego Ramos', email: 'diego.ramos@demo.local', categoria: '3ero_sin_semi', carpeta_drive_id: 'demo-folder-norte', telefono: '+5491100000003', telegram_chat_id: '', telegram_activo: false },
  ],
  salidas: [
    { id: 1, cliente: 1, descripcion: 'CD Tigre' },
    { id: 2, cliente: 1, descripcion: 'Sucursal La Plata' },
    { id: 3, cliente: 2, descripcion: 'Planta Pilar' },
    { id: 4, cliente: 2, descripcion: 'Deposito Rosario' },
    { id: 5, cliente: 3, descripcion: 'Base Mendoza' },
  ],
  tarifas: [
    { id: 1, cliente: 1, salida: 1, activo: true, vigente_desde: '2026-05-01', precio_cat_3ero_sin_semi: 180000, precio_cat_1: 210000, precio_cat_2: 235000, precio_cat_3: 260000 },
    { id: 2, cliente: 1, salida: 2, activo: true, vigente_desde: '2026-05-01', precio_cat_3ero_sin_semi: 150000, precio_cat_1: 175000, precio_cat_2: 198000, precio_cat_3: 225000 },
    { id: 3, cliente: 2, salida: 3, activo: true, vigente_desde: '2026-05-01', precio_cat_3ero_sin_semi: 195000, precio_cat_1: 220000, precio_cat_2: 250000, precio_cat_3: 275000 },
    { id: 4, cliente: 2, salida: 4, activo: true, vigente_desde: '2026-05-01', precio_cat_3ero_sin_semi: 260000, precio_cat_1: 295000, precio_cat_2: 330000, precio_cat_3: 365000 },
    { id: 5, cliente: 3, salida: 5, activo: true, vigente_desde: '2026-05-01', precio_cat_3ero_sin_semi: 420000, precio_cat_1: 470000, precio_cat_2: 520000, precio_cat_3: 570000 },
    { id: 6, cliente: 1, salida: 1, activo: false, vigente_desde: '2026-04-01', precio_cat_3ero_sin_semi: 165000, precio_cat_1: 198000, precio_cat_2: 220000, precio_cat_3: 245000 },
  ],
  adicionales: [
    { id: 1, cliente: null, nombre: 'Espera operativa', tipo: 'fijo', vigente_desde: '2026-05-01', activo: true, precio_cat_3ero_sin_semi: 35000, precio_cat_1: 40000, precio_cat_2: 45000, precio_cat_3: 50000 },
    { id: 2, cliente: 1, nombre: 'Descarga manual', tipo: 'fijo', vigente_desde: '2026-05-01', activo: true, precio_cat_3ero_sin_semi: 28000, precio_cat_1: 33000, precio_cat_2: 36000, precio_cat_3: 39000 },
    { id: 3, cliente: null, nombre: 'Adicional al momento', tipo: 'al_momento', vigente_desde: '2026-05-01', activo: true, precio_cat_3ero_sin_semi: 0, precio_cat_1: 0, precio_cat_2: 0, precio_cat_3: 0 },
  ],
  viajes: [],
  gastos: [],
  preliquidaciones: [],
  liquidaciones: [],
  users: [
    { id: 1, email: 'admin@demo.local', username: 'admin', first_name: 'Admin', last_name: 'Demo', rol: 'admin', proveedor: null },
    { id: 2, email: 'proveedor@demo.local', username: 'proveedor', first_name: 'Ruta Clara', last_name: 'Transportes', rol: 'readonly', proveedor: 1 },
    { id: 3, email: 'contable@demo.com', username: 'contable_demo', first_name: 'Contable', last_name: 'Demo', rol: 'contable', proveedor: null },
  ],
  documentos: {
    'demo-folder-ruta-clara': [
      { id: 'doc-1', name: 'VTV-MARTIN-COSTA.pdf', size: 324000, updated_at: '2026-05-20T10:30:00Z', url: '#' },
      { id: 'doc-2', name: 'SEGURO-RUTA-CLARA.pdf', size: 512000, updated_at: '2026-05-22T15:10:00Z', url: '#' },
    ],
    'demo-folder-sur-cargo': [
      { id: 'doc-3', name: 'DNI-LAURA-MEDINA.pdf', size: 220000, updated_at: '2026-05-18T12:00:00Z', url: '#' },
      { id: 'doc-4', name: 'CEDULA-VERDE-SUR-CARGO.pdf', size: 430000, updated_at: '2026-05-19T09:45:00Z', url: '#' },
    ],
    'demo-folder-norte': [
      { id: 'doc-5', name: 'CARNET-DIEGO-RAMOS.pdf', size: 290000, updated_at: '2026-05-16T11:15:00Z', url: '#' },
    ],
  },
}

let nextIds = {
  clientes: 4,
  proveedores: 4,
  salidas: 6,
  tarifas: 7,
  adicionales: 4,
  viajes: 1,
  gastos: 1,
  preliquidaciones: 1,
  liquidaciones: 1,
  users: 4,
}

export function nextId(key) {
  const id = nextIds[key]
  nextIds[key] += 1
  return id
}

export function seedOperations() {
  if (mockDb.viajes.length) return
  mockDb.viajes.push(
    { id: nextId('viajes'), fecha: '2026-05-21', cliente: 1, salida: 1, proveedor: 1, tarifa: 1, remito: 'R-1001', estado: 'habilitado', precio_tarifa: 210000, adicionales: [{ adicional: 1, adicional_nombre: 'Espera operativa', adicional_tipo: 'fijo', precio_snapshot: 40000, descripcion_snapshot: '' }] },
    { id: nextId('viajes'), fecha: '2026-05-22', cliente: 1, salida: 2, proveedor: 1, tarifa: 2, remito: 'R-1002', estado: 'habilitado', precio_tarifa: 175000, adicionales: [] },
    { id: nextId('viajes'), fecha: '2026-05-23', cliente: 2, salida: 3, proveedor: 2, tarifa: 3, remito: 'R-2001', estado: 'habilitado', precio_tarifa: 250000, adicionales: [{ adicional: 3, adicional_nombre: 'Adicional al momento', adicional_tipo: 'al_momento', precio_snapshot: 55000, descripcion_snapshot: 'Reentrega programada' }] },
    { id: nextId('viajes'), fecha: '2026-05-18', cliente: 3, salida: 5, proveedor: 3, tarifa: 5, remito: 'R-3001', estado: 'pendiente', precio_tarifa: 420000, adicionales: [] },
  )
  mockDb.gastos.push(
    { id: nextId('gastos'), proveedor: 1, fecha_gasto: '2026-05-22', combustible: { lts_comb: 120, precio_lts_comb: 1050, precio_total_comb: 126000 }, remito_combustible: 'C-501', varios: [{ descripcion: 'Peaje', monto: 18000 }], total_combustible: 100800, total_varios: 18000, total_gasto: 118800 },
    { id: nextId('gastos'), proveedor: 2, fecha_gasto: '2026-05-23', combustible: { lts_comb: 90, precio_lts_comb: 1080, precio_total_comb: 97200 }, remito_combustible: 'C-777', varios: [{ descripcion: 'Estadia', monto: 24000 }], total_combustible: 77760, total_varios: 24000, total_gasto: 101760 },
  )
  const base = makePreliquidacion({ proveedor: 1, periodo_desde: '2026-05-15', periodo_hasta: '2026-05-20', viaje_ids: [], gasto_ids: [] })
  base.estado = 'confirmada'
  base.detalles = [{ viaje: 99, fecha_viaje: '2026-05-16', cliente_snapshot: 'Andes Retail SA', salida_snapshot: 'CD Tigre', remito_snapshot: 'R-0999', adicionales_snapshot: [], tarifa_sin_iva: 205000, tarifa_con_iva: 248050 }]
  base.total_sin_iva = 205000
  base.total_con_iva = 248050
  base.gastos_periodo = 0
  base.adeudado_final = 248050
  mockDb.preliquidaciones.push(base)
}

export function makePreliquidacion(payload) {
  const proveedor = mockDb.proveedores.find((p) => p.id === Number(payload.proveedor))
  const viajes = mockDb.viajes.filter((v) => payload.viaje_ids?.includes(v.id))
  const gastos = mockDb.gastos.filter((g) => payload.gasto_ids?.includes(g.id))
  const detalles = viajes.map((v) => {
    const base = Number(v.precio_tarifa || 0)
    const adicionales = (v.adicionales || []).map((a) => ({ nombre: a.adicional_nombre, descripcion: a.descripcion_snapshot, precio: Number(a.precio_snapshot || 0) }))
    const totalAdic = adicionales.reduce((sum, a) => sum + Number(a.precio || 0), 0)
    return {
      viaje: v.id,
      fecha_viaje: v.fecha,
      cliente_snapshot: nombreCliente(v.cliente),
      salida_snapshot: nombreSalida(v.salida),
      remito_snapshot: v.remito || '',
      adicionales_snapshot: adicionales,
      tarifa_sin_iva: base + totalAdic,
      tarifa_con_iva: (base + totalAdic) * 1.21,
    }
  })
  const totalSinIva = detalles.reduce((sum, d) => sum + Number(d.tarifa_sin_iva || 0), 0)
  const totalConIva = totalSinIva * 1.21
  const gastosPeriodo = gastos.reduce((sum, g) => sum + Number(g.total_gasto || 0), 0)
  return {
    id: nextId('preliquidaciones'),
    proveedor: Number(payload.proveedor),
    proveedor_nombre: proveedor?.nombre || '-',
    carpeta_drive_id: proveedor?.carpeta_drive_id || '',
    periodo_desde: payload.periodo_desde,
    periodo_hasta: payload.periodo_hasta,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'pendiente',
    enviado_a_drive: false,
    detalles,
    gastos,
    total_sin_iva: totalSinIva,
    total_con_iva: totalConIva,
    gastos_periodo: gastosPeriodo,
    adeudado_final: totalConIva - gastosPeriodo,
  }
}

export function nombreCliente(id) {
  return mockDb.clientes.find((c) => c.id === Number(id))?.nombre || '-'
}

export function nombreSalida(id) {
  return mockDb.salidas.find((s) => s.id === Number(id))?.descripcion || '-'
}

