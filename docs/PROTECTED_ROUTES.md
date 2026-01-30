# 🔒 Sistema de Rutas Protegidas - BioTech Auth

## 📋 Descripción General

Sistema completo de protección de rutas con autenticación, autorización basada en roles y permisos granulares.

## 🏗️ Arquitectura

### Componentes Principales

```
src/shared/
├── components/
│   ├── routes/
│   │   ├── PrivateRoute.jsx      # Rutas que requieren autenticación
│   │   ├── PublicRoute.jsx       # Rutas públicas (login, register)
│   │   └── RoleBasedRoute.jsx    # Rutas con roles/permisos específicos
│   ├── guards/
│   │   └── AuthGuard.jsx         # Verificación continua de autenticación
│   └── errors/
│       ├── Unauthorized.jsx      # Página 403
│       └── NotFound.jsx          # Página 404
├── constants/
│   └── roles.js                  # Definición de roles y permisos
└── hooks/
    └── useAuth.js                # Hook con funciones de auth/permisos
```

---

## 🛡️ Componentes de Protección

### 1. **PrivateRoute**

Protege rutas que requieren autenticación básica.

```jsx
import { PrivateRoute } from "@shared/components/routes";

<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>;
```

**Validaciones:**

- ✅ Usuario autenticado
- ✅ Token válido (no expirado)
- ❌ Redirige a `/login` si falla

---

### 2. **PublicRoute**

Para rutas públicas que redirigen si el usuario ya está autenticado.

```jsx
import { PublicRoute } from "@shared/components/routes";

<Route
  path="/login"
  element={
    <PublicRoute redirectTo="/farm-selector">
      <LoginForm />
    </PublicRoute>
  }
/>;
```

**Comportamiento:**

- ✅ Permite acceso si NO está autenticado
- ✅ Redirige a `/farm-selector` si YA está autenticado

---

### 3. **RoleBasedRoute**

Protección avanzada con roles y permisos granulares.

```jsx
import { RoleBasedRoute } from '@shared/components/routes';
import { ROLES, PERMISSIONS } from '@shared/constants/roles';

// Solo Admin y Super Admin
<Route
  path="/admin"
  element={
    <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
      <AdminPanel />
    </RoleBasedRoute>
  }
/>

// Requiere TODOS los permisos
<Route
  path="/settings"
  element={
    <RoleBasedRoute
      requiredPermissions={[
        PERMISSIONS.SYSTEM_SETTINGS,
        PERMISSIONS.USER_UPDATE
      ]}
    >
      <Settings />
    </RoleBasedRoute>
  }
/>

// Requiere AL MENOS UNO de los permisos
<Route
  path="/reports"
  element={
    <RoleBasedRoute
      anyPermissions={[
        PERMISSIONS.REPORT_READ,
        PERMISSIONS.REPORT_CREATE
      ]}
    >
      <Reports />
    </RoleBasedRoute>
  }
/>
```

**Props:**

- `allowedRoles`: Array de roles permitidos
- `requiredPermissions`: Todos los permisos requeridos
- `anyPermissions`: Al menos uno de estos permisos
- `redirectTo`: Ruta de redirección (default: `/unauthorized`)

---

### 4. **AuthGuard**

Componente de alto nivel que verifica continuamente la autenticación.

```jsx
import { AuthGuard } from "@shared/components/guards";

<PrivateRoute>
  <AuthGuard checkInterval={60000} warnBeforeExpiry={true}>
    <Dashboard />
  </AuthGuard>
</PrivateRoute>;
```

**Características:**

- ✅ Verificación periódica del token (cada 1 minuto por defecto)
- ✅ Auto-logout cuando el token expira
- ✅ Advertencia antes de expiración (5 minutos antes)
- ✅ Loader mientras verifica

**Props:**

- `checkInterval`: Intervalo de verificación en ms (default: 60000)
- `warnBeforeExpiry`: Mostrar advertencia (default: true)
- `warnMinutes`: Minutos antes de expirar para advertir (default: 5)

---

## 👥 Sistema de Roles y Permisos

### Roles Disponibles

```javascript
import { ROLES } from "@shared/constants/roles";

ROLES.SUPER_ADMIN; // Acceso total
ROLES.ADMIN; // Administrador de granja
ROLES.USER; // Usuario estándar
ROLES.GUEST; // Invitado (solo lectura)
```

### Permisos Disponibles

```javascript
import { PERMISSIONS } from "@shared/constants/roles";

// Farm
PERMISSIONS.FARM_CREATE;
PERMISSIONS.FARM_READ;
PERMISSIONS.FARM_UPDATE;
PERMISSIONS.FARM_DELETE;

// Animal
PERMISSIONS.ANIMAL_CREATE;
PERMISSIONS.ANIMAL_READ;
PERMISSIONS.ANIMAL_UPDATE;
PERMISSIONS.ANIMAL_DELETE;

// User
PERMISSIONS.USER_CREATE;
PERMISSIONS.USER_READ;
PERMISSIONS.USER_UPDATE;
PERMISSIONS.USER_DELETE;

// Report
PERMISSIONS.REPORT_CREATE;
PERMISSIONS.REPORT_READ;
PERMISSIONS.REPORT_EXPORT;

// System
PERMISSIONS.SYSTEM_SETTINGS;
PERMISSIONS.SYSTEM_LOGS;
```

### Mapa de Roles a Permisos

```javascript
SUPER_ADMIN → Todos los permisos

ADMIN →
  - FARM_CREATE, FARM_READ, FARM_UPDATE
  - ANIMAL_CREATE, ANIMAL_READ, ANIMAL_UPDATE, ANIMAL_DELETE
  - USER_READ, USER_UPDATE
  - REPORT_CREATE, REPORT_READ, REPORT_EXPORT

USER →
  - FARM_READ
  - ANIMAL_READ, ANIMAL_CREATE, ANIMAL_UPDATE
  - REPORT_READ

GUEST →
  - FARM_READ
  - ANIMAL_READ
```

---

## 🎣 Hook useAuth

Hook centralizado para toda la lógica de autenticación y autorización.

```javascript
import { useAuth } from "@shared/hooks/useAuth";

const MyComponent = () => {
  const {
    // Estado
    user,
    token,
    isAuthenticated,
    selectedFarm,

    // Métodos de autenticación
    setAuth,
    logout,

    // Validación de roles
    hasRole,
    hasAnyRole,

    // Validación de permisos
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,

    // Expiración
    isTokenValid,
    getTimeUntilExpiration,
    isTokenExpiringSoon,
  } = useAuth();

  // Verificar rol
  if (hasRole(ROLES.ADMIN)) {
    // Mostrar opciones de admin
  }

  // Verificar permiso
  if (hasPermission(PERMISSIONS.FARM_CREATE)) {
    // Mostrar botón crear granja
  }

  // Verificar múltiples permisos
  if (hasAllPermissions([PERMISSIONS.REPORT_READ, PERMISSIONS.REPORT_EXPORT])) {
    // Permitir exportar reportes
  }
};
```

---

## 🚨 Páginas de Error

### Unauthorized (403)

Se muestra cuando el usuario no tiene permisos para acceder a una ruta.

```jsx
// Automáticamente redirige aquí desde RoleBasedRoute
<Route path="/unauthorized" element={<Unauthorized />} />
```

**Características:**

- Diseño atractivo con animaciones
- Explicación clara del error
- Botones para volver o ir al inicio
- Información de contacto

### NotFound (404)

Se muestra cuando la ruta no existe.

```jsx
<Route path="*" element={<NotFound />} />
```

**Características:**

- Diseño atractivo con animaciones
- Sugerencias de qué hacer
- Botones de navegación
- Información de contacto

---

## 📝 Ejemplos Completos

### Ejemplo 1: Ruta Simple Protegida

```jsx
<Route
  path="/profile"
  element={
    <PrivateRoute>
      <AuthGuard>
        <UserProfile />
      </AuthGuard>
    </PrivateRoute>
  }
/>
```

### Ejemplo 2: Ruta Solo para Admins

```jsx
<Route
  path="/admin/users"
  element={
    <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
      <AuthGuard>
        <UserManagement />
      </AuthGuard>
    </RoleBasedRoute>
  }
/>
```

### Ejemplo 3: Ruta con Permisos Específicos

```jsx
<Route
  path="/reports/export"
  element={
    <RoleBasedRoute
      requiredPermissions={[PERMISSIONS.REPORT_READ, PERMISSIONS.REPORT_EXPORT]}
    >
      <AuthGuard>
        <ReportExport />
      </AuthGuard>
    </RoleBasedRoute>
  }
/>
```

### Ejemplo 4: Verificación en Componente

```jsx
import { useAuth } from "@shared/hooks/useAuth";
import { PERMISSIONS } from "@shared/constants/roles";

const Dashboard = () => {
  const { hasPermission, hasRole } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>

      {hasPermission(PERMISSIONS.FARM_CREATE) && (
        <button>Crear Nueva Granja</button>
      )}

      {hasRole(ROLES.ADMIN) && <AdminPanel />}
    </div>
  );
};
```

---

## 🔐 Niveles de Seguridad

### Nivel 1: Autenticación Básica

```jsx
<PrivateRoute>
  <Component />
</PrivateRoute>
```

✅ Verifica que el usuario esté logueado

### Nivel 2: Autenticación + Monitoreo

```jsx
<PrivateRoute>
  <AuthGuard>
    <Component />
  </AuthGuard>
</PrivateRoute>
```

✅ Verifica login
✅ Monitorea expiración del token

### Nivel 3: Autenticación + Roles

```jsx
<RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
  <AuthGuard>
    <Component />
  </AuthGuard>
</RoleBasedRoute>
```

✅ Verifica login
✅ Monitorea expiración
✅ Verifica rol del usuario

### Nivel 4: Autenticación + Permisos Granulares

```jsx
<RoleBasedRoute requiredPermissions={[PERMISSIONS.FARM_CREATE]}>
  <AuthGuard>
    <Component />
  </AuthGuard>
</RoleBasedRoute>
```

✅ Verifica login
✅ Monitorea expiración
✅ Verifica permisos específicos

---

## 🎯 Mejores Prácticas

1. **Siempre usa AuthGuard** en rutas protegidas importantes
2. **Verifica permisos en el componente** además de en la ruta
3. **Usa RoleBasedRoute** para funcionalidades sensibles
4. **Maneja errores** con páginas 403 y 404 personalizadas
5. **Loguea intentos** de acceso no autorizado para auditoría

---

## 🚀 Próximas Mejoras

- [ ] Refresh token automático
- [ ] Notificaciones de expiración próxima
- [ ] Registro de auditoría de accesos
- [ ] Rate limiting por usuario
- [ ] Sesiones concurrentes limitadas
- [ ] 2FA (Two-Factor Authentication)

---

## 📞 Soporte

¿Problemas o preguntas? Contacta a: support@biotech.com
