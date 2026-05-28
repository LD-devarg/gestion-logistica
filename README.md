# Sistema de Gestión Logística — Demo visual

Demo visual e interactiva de un sistema web para la gestión operativa de una empresa de transporte: clientes, proveedores, viajes, tarifas, gastos, preliquidaciones y liquidaciones, con un portal diferenciado para el equipo interno y para proveedores.

> **Sobre esta demo:** este repositorio contiene una versión demostrativa del frontend con datos simulados (mock). El objetivo es mostrar la interfaz, la navegación y las decisiones de diseño del producto, sin backend conectado: no hay login real, no se persisten datos. Está basada en un proyecto que desarrollé y mantengo en producción para una empresa del rubro; ese proyecto original es privado por confidencialidad con el cliente.

---

## Demo en vivo

🔗 **[Ver demo](https://ld-devarg.github.io/gestion-logistica/)**

> Todos los datos visibles en la demo son ficticios. La demo es de solo lectura: las acciones de creación, edición o login no impactan en ningún backend.

---

## Qué muestra la demo

- Layouts diferenciados por rol (administrativo y proveedor).
- Listado y detalle de **viajes** con campos de fecha, cliente, proveedor, tarifa, remito y estado operativo.
- Gestión visual de **clientes, proveedores, salidas, tarifas y adicionales**.
- Vistas de **gastos por proveedor** (combustible, adelantos, varios).
- **Preliquidaciones** por período con detalle de viajes, adicionales y gastos.
- **Liquidaciones** con estado de pago, factura y fecha.
- **Portal de proveedor** con vista de viajes propios, liquidaciones y documentación.

---

## Stack técnico

### Frontend (lo que se muestra en la demo)

- **React** + **Vite**
- **React Router** — ruteo y layouts diferenciados por rol
- **Material UI** + **Tailwind CSS**
- Datos simulados servidos desde el propio frontend

### Backend del proyecto original (no incluido en esta demo)

- **Python** + **Django 5** + **Django REST Framework**
- **Simple JWT** — autenticación con refresh en cookie segura
- **PostgreSQL**
- **Celery** + **Redis** — tareas asíncronas
- **Gunicorn** + **WhiteNoise**
- Despliegue en **Railway**

---

## Arquitectura del proyecto original

```
┌─────────────────┐      REST/JSON      ┌──────────────────┐
│  Frontend React │ ◄─────────────────► │  API Django/DRF  │
│  (Vite SPA)     │      JWT auth       │                  │
└─────────────────┘                     └────────┬─────────┘
                                                 │
                          ┌──────────────────────┼─────────────────┐
                          │                      │                 │
                    ┌─────▼─────┐         ┌──────▼──────┐    ┌─────▼─────┐
                    │PostgreSQL │         │ Celery+Redis│    │   Auth    │
                    │           │         │ (async)     │    │  JWT/Roles│
                    └───────────┘         └─────────────┘    └───────────┘
```

El backend se organiza en aplicaciones Django por dominio:

- `accounts` — usuarios, roles y autenticación
- `maestros` — clientes, proveedores, salidas, tarifas, adicionales
- `operaciones` — viajes, gastos, preliquidaciones, liquidaciones
- `configuracion` — parámetros generales del sistema

El frontend separa vistas por módulo y aplica layouts diferenciados (administrativo y proveedor) sobre un contexto de autenticación centralizado.

---

## Decisiones de diseño

- **Configuración separada del código:** toda la configuración sensible se inyecta por variables de entorno; el repositorio no contiene secretos.
- **Auth por JWT con refresh en cookie segura:** los access tokens viven en memoria del cliente y el refresh se maneja por cookie httpOnly, reduciendo superficie de XSS.
- **Permisos verificados en backend:** la interfaz oculta acciones según rol, pero la autorización real se valida siempre en la API. La UI no es la fuente de verdad de los permisos.
- **Tareas asíncronas desacopladas:** notificaciones y procesos pesados se delegan a Celery para no bloquear la respuesta de la API.
- **Separación por dominio:** la organización en apps refleja el negocio (maestros, operaciones, configuración), no la implementación técnica.

---

## Probar localmente

### Requisitos
- Node.js 20+

### Instalación

```bash
npm install
npm run dev
```

Disponible en `http://localhost:5173`

---

## Capturas

> Todas las capturas usan datos ficticios.

| Vista | |
|-------|---|
| Dashboard administrativo | `docs/dashboard.png` |
| Registro de viajes | `docs/viajes.png` |
| Preliquidación por período | `docs/preliquidacion.png` |
| Portal de proveedor | `docs/portal-proveedor.png` |

_(Subir las imágenes a una carpeta `docs/` del repo y reemplazar los paths.)_

---

## Sobre el autor

Lorenzo Diel — desarrollador full-stack con foco en automatización de procesos y sistemas de gestión a medida.

- GitHub: [@LD-devarg](https://github.com/LD-devarg)
- LinkedIn: [lorenzo-diel](https://linkedin.com/in/lorenzo-diel-305aa8129)
- Mail: lddevarg@gmail.com
