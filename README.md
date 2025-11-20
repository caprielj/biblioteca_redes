# Sistema de Gestión de Biblioteca

Sistema web simple y funcional para la gestión de una biblioteca desarrollado con Node.js, JavaScript y arquitectura MVC.

## Características

- ✅ Gestión de libros (CRUD completo)
- ✅ Gestión de usuarios/miembros
- ✅ Sistema de préstamos
- ✅ Registro de devoluciones
- ✅ Sistema de multas automáticas
- ✅ Gestión de autores, editoriales, categorías, idiomas y ubicaciones
- ✅ Dashboard con estadísticas
- ✅ Interfaz web responsive

## Tecnologías Utilizadas

- **Backend:** Node.js con Express.js
- **Base de Datos:** MariaDB
- **Motor de Vistas:** EJS
- **Arquitectura:** MVC (Modelo-Vista-Controlador)
- **Estilo:** CSS personalizado

## Estructura del Proyecto

```
poryecto de redes/
├── config/
│   └── database.js          # Configuración de conexión a MariaDB
├── controllers/             # Controladores (lógica de negocio)
│   ├── homeController.js
│   ├── libroController.js
│   ├── usuarioController.js
│   ├── prestamoController.js
│   ├── devolucionController.js
│   └── multaController.js
├── models/                  # Modelos (interacción con BD)
│   ├── Libro.js
│   ├── Usuario.js
│   ├── Prestamo.js
│   ├── Devolucion.js
│   ├── Multa.js
│   ├── Autor.js
│   ├── Editorial.js
│   ├── Categoria.js
│   ├── Idioma.js
│   └── Ubicacion.js
├── routes/
│   └── index.js            # Definición de rutas
├── views/                  # Vistas EJS
│   ├── layouts/
│   ├── home/
│   ├── libros/
│   ├── usuarios/
│   ├── prestamos/
│   ├── devoluciones/
│   └── multas/
├── public/                 # Archivos estáticos
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── .env                    # Variables de entorno
├── app.js                  # Servidor principal
└── package.json
```

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- MariaDB (v10.5 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**

   - Abrir MariaDB/MySQL
   - Ejecutar el script SQL ubicado en el archivo que se proporcionó
   - Esto creará la base de datos `biblioteca` con todas las tablas y datos de ejemplo

4. **Configurar variables de entorno**

   Editar el archivo `.env` con tus credenciales de MariaDB:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password_aqui
   DB_NAME=biblioteca
   DB_PORT=3306
   ```

5. **Iniciar el servidor**
   ```bash
   npm start
   ```

   O para desarrollo con auto-reinicio:
   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**

   Abrir el navegador y visitar: `http://localhost:3000`

## Uso del Sistema

### Módulos Principales

1. **Dashboard (Inicio)**
   - Vista general con estadísticas
   - Préstamos recientes y atrasados
   - Accesos rápidos

2. **Libros**
   - Listar todos los libros
   - Agregar nuevos libros
   - Editar información de libros
   - Ver detalles y disponibilidad

3. **Usuarios**
   - Gestión de miembros
   - Ver historial de préstamos
   - Ver multas pendientes

4. **Préstamos**
   - Registrar nuevos préstamos
   - Ver préstamos activos
   - Ver préstamos atrasados
   - Reducción automática de disponibilidad

5. **Devoluciones**
   - Registrar devoluciones
   - Cálculo automático de días de retraso
   - Generación automática de multas

6. **Multas**
   - Ver todas las multas
   - Registrar pagos
   - Condonar multas
   - Resumen de montos

## Base de Datos

### Tablas Principales

- **autores** - Información de autores
- **editoriales** - Casas editoriales
- **categorias** - Categorías de libros
- **idiomas** - Idiomas disponibles
- **ubicaciones** - Ubicación física en biblioteca
- **libros** - Inventario de libros
- **usuarios** - Miembros de la biblioteca
- **prestamos** - Registro de préstamos
- **devoluciones** - Registro de devoluciones
- **multas** - Sistema de multas

## Funcionalidades Especiales

### Sistema de Multas Automáticas

Cuando se registra una devolución atrasada:
- Se calcula automáticamente los días de retraso
- Se genera una multa de Q5.00 por día
- Se actualiza el estado del préstamo
- Se incrementa la disponibilidad del libro

### Control de Disponibilidad

- Al crear un préstamo, se reduce la cantidad disponible
- Al devolver, se incrementa la cantidad disponible
- No se permiten préstamos si no hay copias disponibles

## Contribuciones

Este es un proyecto educativo simple pero funcional. Siéntete libre de mejorarlo y adaptarlo a tus necesidades.

## Licencia

ISC

---

**Desarrollado con Node.js y MariaDB | 2025**
