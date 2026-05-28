# Sistema de Gestión Logística — Demo

Demo pública de un sistema web full-stack para la gestión operativa de una empresa de transporte: clientes, proveedores, viajes, tarifas, gastos, preliquidaciones y liquidaciones, con un portal diferenciado para el equipo interno y para proveedores.

> **Sobre esta demo:** este repositorio contiene una versión demostrativa, construida con datos ficticios y un alcance reducido, para que se pueda explorar la interfaz y la lógica del sistema sin exponer información real. Está basada en un proyecto que desarrollé y mantengo en producción para una empresa del rubro; ese proyecto original es privado por confidencialidad con el cliente.

---

## Demo en vivo

🔗 **[ver demo](#)** _(reemplazar por URL de Pages/Vercel)_

**Usuarios de prueba:**

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Administrador | `admin` | `demo1234` |
| Proveedor | `proveedor` | `demo1234` |

> Todos los datos visibles en la demo son ficticios.

---

## Qué muestra la demo

- Registro y seguimiento de **viajes** por fecha, cliente, proveedor, tarifa, remito y estado operativo.
- Gestión de **clientes, proveedores, salidas, tarifas y adicionales**.
- Control de **gastos por proveedor** (combustible, adelantos, varios).
- Generación de **preliquidaciones** por período con detalle de viajes, adicionales y gastos.
- Gestión de **liquidaciones** con estado de pago, factura y fecha.
- **Portal de proveedor** con vista de viajes propios, liquidaciones, documentación y perfil.
- Autenticación con JWT y permisos diferenciados por rol.

---

## Stack técnico

### Backend
- **Python** + **Django 5** + **Django REST Framework**
- **Simple JWT** — autenticación con refresh en cookie segura
- **PostgreSQL**
- **Celery** + **Redis** — tareas asíncronas
- **Gunicorn** + **WhiteNoise**

### Frontend
- **React** + **Vite**
- **React Router** — ruteo y layouts diferenciados por rol
- **Axios** — cliente HTTP con interceptores de auth
- **Material UI** + **Tailwind CSS**

### Despliegue
- **Railway** (backend, base de datos, Redis)
- Frontend servido como sitio estático

---

## Arquitectura

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
- Python 3.12+
- Node.js 20+
- PostgreSQL
- Redis

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate     # En Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py loaddata fixtures/demo.json    # carga datos ficticios
python manage.py runserver
```

Disponible en `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend
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
