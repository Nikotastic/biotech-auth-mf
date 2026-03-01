# Configuración de Entorno Local y Mocks - Biotech Auth MF

Esta rama `feature/local-env-setup` contiene las modificaciones necesarias para ejecutar el microfrontend de autenticación (`biotech-auth-mf`) en un entorno local, utilizando datos simulados (mocks) en lugar del backend real. Esto permite el desarrollo y pruebas sin depender de la disponibilidad de la API Gateway externa.

## 📄 Cambios Realizados

Se han modificado los servicios clave para soportar un "Modo Mock" controlado por variables de entorno.

### 1. Cliente API (`src/shared/utils/apiClient.js`)

- Se agregó lógica para detectar la variable de entorno `VITE_USE_MOCK_API`.
- Si `VITE_USE_MOCK_API` es "true", el cliente ignora la URL del Gateway real y utiliza una URL local o simulada.

### 2. Servicio de Login (`src/features/login/services/loginService.js`)

- Se implementó un condicional que verifica si el modo mock está activo.
- Si está activo, redirige las peticiones a `loginServiceMock.js`, que devuelve credenciales exitosas predefinidas (ej. `admin@biotech.com` / `admin123`) sin hacer llamadas de red reales.

### 3. Otros Servicios (`farmService.js`, `useProfile.js`)

- Similar al servicio de login, se adaptaron para devolver datos estáticos o usar el cliente mockeado cuando se detecta el flag de entorno local.

## 🚀 Cómo Ejecutar en Local

Para iniciar el proyecto utilizando los mocks:

1.  Asegúrate de tener un archivo `.env` en la raíz de `biotech-auth-mf`.
2.  Agrega o modifica la siguiente variable:
    ```env
    VITE_USE_MOCK_API=true
    ```
3.  Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    ```

Esto permitirá iniciar sesión y navegar por los flujos básicos utilizando los datos de prueba definidos en los archivos `*Mock.js`.
