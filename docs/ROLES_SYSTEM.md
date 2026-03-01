# 🔐 Sistema de Roles y Permisos - BioTech

## 📋 Roles del Sistema

### 1. **Super Admin** (`super_admin`)

- **Descripción:** Administrador del sistema completo
- **Acceso:** Total a todas las funcionalidades
- **Uso:** Gestión del sistema, soporte técnico

### 2. **Dueño de Granja** (`farm_owner`)

- **Descripción:** Propietario de la granja
- **Acceso:** Control total de su granja
- **Permisos:**
  - ✅ Crear, editar, eliminar granjas
  - ✅ Invitar usuarios (veterinarios, trabajadores)
  - ✅ Gestión completa de animales
  - ✅ Ver diagnósticos y tratamientos
  - ✅ Gestión de reproducción
  - ✅ Gestión de inventario
  - ✅ Crear y exportar reportes

### 3. **Veterinario** (`veterinarian`)

- **Descripción:** Profesional médico veterinario (invitado por dueño)
- **Acceso:** Funcionalidades médicas y diagnóstico
- **Permisos:**
  - ✅ Ver información de granjas
  - ✅ Ver y actualizar animales (historial médico)
  - ✅ Crear diagnósticos
  - ✅ Crear tratamientos
  - ✅ Crear prescripciones
  - ✅ Ver inventario de medicamentos
  - ✅ Crear reportes médicos
  - ❌ NO puede eliminar animales
  - ❌ NO puede gestionar inventario

### 4. **Trabajador** (`worker`)

- **Descripción:** Empleado de la granja
- **Acceso:** Operaciones diarias
- **Permisos:**
  - ✅ Ver información de granjas
  - ✅ Ver y actualizar animales
  - ✅ Ver diagnósticos y tratamientos
  - ✅ Gestión de reproducción
  - ✅ Actualizar inventario
  - ✅ Ver reportes
  - ❌ NO puede eliminar animales
  - ❌ NO puede crear/eliminar inventario

### 5. **Invitado** (`guest`)

- **Descripción:** Usuario con acceso de solo lectura
- **Acceso:** Visualización únicamente
- **Permisos:**
  - ✅ Ver granjas
  - ✅ Ver animales
  - ✅ Ver diagnósticos
  - ✅ Ver reportes
  - ❌ NO puede modificar nada

---

## 🔄 Flujo de Invitación de Usuarios

### Caso: Invitar a un Veterinario

```
1. Dueño de Granja → Crea invitación
   ├─ Frontend: Botón "Invitar Veterinario"
   ├─ Backend: POST /api/invitations
   │   {
   │     "email": "vet@example.com",
   │     "role": "veterinarian",
   │     "farmId": "farm-123"
   │   }
   └─ Backend: Genera link único de invitación

2. Backend → Envía email al veterinario
   ├─ Asunto: "Invitación a BioTech Farm"
   ├─ Link: https://biotech.com/register?token=abc123&role=veterinarian
   └─ Token contiene: { email, role, farmId, expiresAt }

3. Veterinario → Hace clic en el link
   ├─ Frontend: Detecta token en URL
   ├─ Frontend: Pre-llena email y muestra rol
   └─ Frontend: Muestra formulario de registro

4. Veterinario → Completa registro
   ├─ Ingresa: nombre, contraseña
   ├─ Email y rol ya están definidos
   └─ Frontend: POST /api/auth/register-with-invitation

5. Backend → Crea usuario
   ├─ Valida token de invitación
   ├─ Crea usuario con rol "veterinarian"
   ├─ Asocia usuario a la granja
   └─ Retorna JWT con rol incluido

6. Frontend → Recibe JWT
   ├─ JWT payload: { userId, email, role: "veterinarian", farmId }
   ├─ Guarda en authStore
   └─ roles.js valida permisos automáticamente

7. Veterinario → Accede al sistema
   ├─ Ve solo las opciones permitidas
   ├─ Puede crear diagnósticos
   └─ NO puede eliminar animales
```

---

## 🎯 Cómo el Frontend Usa los Roles

### 1. **Protección de Rutas**

```jsx
// Ruta solo para veterinarios y dueños
<RoleBasedRoute allowedRoles={[ROLES.VETERINARIAN, ROLES.FARM_OWNER]}>
  <DiagnosisPanel />
</RoleBasedRoute>

// Ruta solo para dueños
<RoleBasedRoute allowedRoles={[ROLES.FARM_OWNER]}>
  <InviteUsers />
</RoleBasedRoute>
```

### 2. **Control de UI según Permisos**

```jsx
import { useAuth } from "@shared/hooks/useAuth";
import { PERMISSIONS } from "@shared/constants/roles";

const AnimalDetail = () => {
  const { hasPermission } = useAuth();

  return (
    <div>
      <h1>Detalles del Animal</h1>

      {/* Solo veterinarios pueden crear diagnósticos */}
      {hasPermission(PERMISSIONS.DIAGNOSIS_CREATE) && (
        <button>Crear Diagnóstico</button>
      )}

      {/* Solo dueños pueden eliminar */}
      {hasPermission(PERMISSIONS.ANIMAL_DELETE) && (
        <button className="danger">Eliminar Animal</button>
      )}

      {/* Todos pueden ver */}
      <AnimalInfo />
    </div>
  );
};
```

### 3. **Validación en Componentes**

```jsx
const Dashboard = () => {
  const { user, hasRole, hasPermission } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>

      {/* Mostrar panel según rol */}
      {hasRole(ROLES.VETERINARIAN) && <VeterinaryPanel />}
      {hasRole(ROLES.FARM_OWNER) && <OwnerPanel />}
      {hasRole(ROLES.WORKER) && <WorkerPanel />}

      {/* Mostrar funcionalidad según permiso */}
      {hasPermission(PERMISSIONS.FARM_INVITE_USERS) && <InviteUsersButton />}
    </div>
  );
};
```

---

## 🔒 Seguridad en Múltiples Capas

### Capa 1: Backend

```javascript
// El backend SIEMPRE valida permisos
POST /api/animals/:id/delete
→ Verifica que user.role tenga ANIMAL_DELETE
→ Si no: 403 Forbidden
```

### Capa 2: Rutas (Frontend)

```jsx
// RoleBasedRoute impide acceso a la ruta
<RoleBasedRoute allowedRoles={[ROLES.FARM_OWNER]}>
  <DeleteAnimal />
</RoleBasedRoute>
```

### Capa 3: UI (Frontend)

```jsx
// hasPermission oculta botones
{
  hasPermission(PERMISSIONS.ANIMAL_DELETE) && <button>Eliminar</button>;
}
```

**Resultado:** Triple validación = Máxima seguridad

---

## 📊 Matriz de Permisos

| Permiso             | Super Admin | Farm Owner | Veterinarian | Worker | Guest |
| ------------------- | ----------- | ---------- | ------------ | ------ | ----- |
| **Farm**            |
| farm:create         | ✅          | ✅         | ❌           | ❌     | ❌    |
| farm:read           | ✅          | ✅         | ✅           | ✅     | ✅    |
| farm:update         | ✅          | ✅         | ❌           | ❌     | ❌    |
| farm:delete         | ✅          | ✅         | ❌           | ❌     | ❌    |
| farm:invite_users   | ✅          | ✅         | ❌           | ❌     | ❌    |
| **Animals**         |
| animal:create       | ✅          | ✅         | ❌           | ❌     | ❌    |
| animal:read         | ✅          | ✅         | ✅           | ✅     | ✅    |
| animal:update       | ✅          | ✅         | ✅           | ✅     | ❌    |
| animal:delete       | ✅          | ✅         | ❌           | ❌     | ❌    |
| **Veterinary**      |
| diagnosis:create    | ✅          | ❌         | ✅           | ❌     | ❌    |
| diagnosis:read      | ✅          | ✅         | ✅           | ✅     | ✅    |
| treatment:create    | ✅          | ❌         | ✅           | ❌     | ❌    |
| prescription:create | ✅          | ❌         | ✅           | ❌     | ❌    |
| **Inventory**       |
| inventory:create    | ✅          | ✅         | ❌           | ❌     | ❌    |
| inventory:read      | ✅          | ✅         | ✅           | ✅     | ❌    |
| inventory:update    | ✅          | ✅         | ❌           | ✅     | ❌    |
| inventory:delete    | ✅          | ✅         | ❌           | ❌     | ❌    |
| **Reports**         |
| report:create       | ✅          | ✅         | ✅           | ❌     | ❌    |
| report:read         | ✅          | ✅         | ✅           | ✅     | ✅    |
| report:export       | ✅          | ✅         | ❌           | ❌     | ❌    |

---

## 🚀 Ejemplo Completo: Invitar Veterinario

### 1. Componente de Invitación (Frontend)

```jsx
import { useAuth } from "@shared/hooks/useAuth";
import { PERMISSIONS } from "@shared/constants/roles";

const InviteVeterinarian = () => {
  const { hasPermission } = useAuth();
  const [email, setEmail] = useState("");

  // Solo mostrar si tiene permiso
  if (!hasPermission(PERMISSIONS.FARM_INVITE_USERS)) {
    return null;
  }

  const handleInvite = async () => {
    await fetch("/api/invitations", {
      method: "POST",
      body: JSON.stringify({
        email,
        role: "veterinarian",
        farmId: currentFarm.id,
      }),
    });

    alert("Invitación enviada!");
  };

  return (
    <div>
      <h2>Invitar Veterinario</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@veterinario.com"
      />
      <button onClick={handleInvite}>Enviar Invitación</button>
    </div>
  );
};
```

### 2. Registro con Invitación (Frontend)

```jsx
const RegisterWithInvitation = () => {
  const { token } = useParams(); // Token de la URL
  const [invitationData, setInvitationData] = useState(null);

  useEffect(() => {
    // Validar token de invitación
    fetch(`/api/invitations/validate?token=${token}`)
      .then((res) => res.json())
      .then((data) => setInvitationData(data));
  }, [token]);

  if (!invitationData) return <div>Validando invitación...</div>;

  return (
    <div>
      <h2>Registro como {invitationData.role}</h2>
      <p>Email: {invitationData.email}</p>
      <p>Granja: {invitationData.farmName}</p>

      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Nombre completo" />
        <input name="password" type="password" placeholder="Contraseña" />
        <input type="hidden" value={token} name="invitationToken" />
        <button type="submit">Completar Registro</button>
      </form>
    </div>
  );
};
```

### 3. Backend Asigna Rol Automáticamente

```javascript
// Backend: POST /api/auth/register-with-invitation
app.post("/api/auth/register-with-invitation", async (req, res) => {
  const { invitationToken, name, password } = req.body;

  // 1. Validar token
  const invitation = await validateInvitationToken(invitationToken);
  if (!invitation) {
    return res.status(400).json({ error: "Invalid invitation" });
  }

  // 2. Crear usuario con rol predeterminado
  const user = await User.create({
    email: invitation.email,
    name,
    password: hashPassword(password),
    role: invitation.role, // ← ROL ASIGNADO AUTOMÁTICAMENTE
    farmId: invitation.farmId,
  });

  // 3. Generar JWT con rol incluido
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role, // ← ROL EN EL TOKEN
      farmId: user.farmId,
    },
    SECRET_KEY,
  );

  // 4. Marcar invitación como usada
  await invitation.markAsUsed();

  res.json({ token, user });
});
```

### 4. Frontend Recibe y Valida

```javascript
// El JWT llega con el rol incluido
const loginData = await registerWithInvitation(data);

// authStore guarda el usuario con rol
setAuth(loginData.user, loginData.token);
// user = { id, email, name, role: "veterinarian", farmId }

// roles.js automáticamente valida permisos
hasPermission(PERMISSIONS.DIAGNOSIS_CREATE); // ✅ true para veterinario
hasPermission(PERMISSIONS.ANIMAL_DELETE); // ❌ false para veterinario
```

---

## ✅ Conclusión

**SÍ, `roles.js` es NECESARIO** porque:

1. ✅ El backend asigna el rol automáticamente
2. ✅ El frontend necesita validar qué puede hacer ese rol
3. ✅ Protege rutas según permisos
4. ✅ Controla qué botones/funciones mostrar
5. ✅ Proporciona seguridad en múltiples capas

**El flujo es:**

```
Backend asigna rol → JWT incluye rol → Frontend valida con roles.js
```

¡Es el corazón del sistema de autorización! 🎯
