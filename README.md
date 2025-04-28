# Todo Electro - Tienda de Electrodomésticos

Una moderna tienda de electrodomésticos con un diseño futurista, construida con Django y React. Este proyecto incluye un backend RESTful API y un frontend con diseño responsive y efectos visuales modernos.

## Características

- **Diseño Futurista y Moderno**: Interfaz con glassmorphism, neon glow effects y animaciones suaves.
- **Autenticación Completa**: Registro con verificación por email, login, y roles de usuario.
- **Catálogo de Productos**: Visualización y filtrado de productos por categoría.
- **Panel de Administración**: Gestión de productos y categorías para usuarios admin.
- **Responsive Design**: Experiencia optimizada en todos los dispositivos.

## Tecnologías

### Backend
- Django 5
- Django REST Framework
- Django AllAuth (autenticación)
- PostgreSQL (configurable, usa SQLite por defecto)

### Frontend
- React 18
- TailwindCSS (estilos)
- Framer Motion (animaciones)
- Axios (peticiones HTTP)
- React Router (navegación)

## Requisitos

- Python 3.8+
- Node.js 16+
- npm o yarn

## Instalación

### Backend (Django)

1. Clona el repositorio:
```
git clone https://github.com/tu-usuario/todoelectro.git
cd todoelectro
```

2. Crea y activa un entorno virtual:
```
python -m venv venv
# En Windows
venv\Scripts\activate
# En macOS/Linux
source venv/bin/activate
```

3. Instala las dependencias:
```
pip install -r requirements.txt
```

4. Configura la base de datos:
```
python manage.py migrate
```

5. Crea un superusuario:
```
python manage.py createsuperuser
```

6. Inicia el servidor:
```
python manage.py runserver
```

### Frontend (React)

1. Navega a la carpeta frontend:
```
cd frontend
```

2. Instala las dependencias:
```
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo:
```
npm run dev
# o
yarn dev
```

## Uso

### Acceso
- **URL del backend**: http://localhost:8000
- **URL del frontend**: http://localhost:5173
- **Admin Django**: http://localhost:8000/admin

### Credenciales Admin (por defecto)
- **Usuario**: admin@admin
- **Contraseña**: admin

## Estructura del Proyecto

```
todoelectro/
├── products/           # App para gestionar productos y categorías
├── users/              # App para gestionar usuarios y autenticación  
├── templates/          # Plantillas HTML (email, etc.)
├── static/             # Archivos estáticos
├── media/              # Archivos subidos por los usuarios
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Páginas de la aplicación
│   │   ├── context/    # Contextos de React (autenticación, etc.)
│   │   └── api/        # Servicios para interactuar con la API
│   └── public/         # Archivos estáticos públicos
└── todoelectro/        # Configuración principal de Django
```

## Características Principales

### Usuarios
- Registro con verificación por correo
- Login/Logout
- Roles: Usuario normal y Administrador

### Productos
- Listado de productos
- Filtrado por categoría
- Diseño atractivo con tarjetas glassmorphism
- Detalle de producto

### Administración (Usuarios Admin)
- Gestión completa de productos (CRUD)
- Gestión de categorías (CRUD)
- Interfaz intuitiva y moderna

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o sugerencias, por favor abre un issue en GitHub. 