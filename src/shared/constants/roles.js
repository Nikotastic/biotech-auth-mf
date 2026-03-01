/**
 * Roles del sistema BioTech
 * Define los roles disponibles en la aplicación
 */
export const ROLES = {
  SUPER_ADMIN: "super_admin", // Administrador del sistema
  FARM_OWNER: "farm_owner", // Dueño de la granja
  VETERINARIAN: "veterinarian", // Veterinario (invitado)
  WORKER: "worker", // Trabajador de granja
  GUEST: "guest", // Invitado (solo lectura)
};

/**
 * Permisos del sistema
 * Define los permisos granulares disponibles
 */
export const PERMISSIONS = {
  // Farm permissions
  FARM_CREATE: "farm:create",
  FARM_READ: "farm:read",
  FARM_UPDATE: "farm:update",
  FARM_DELETE: "farm:delete",
  FARM_INVITE_USERS: "farm:invite_users",

  // Animal permissions
  ANIMAL_CREATE: "animal:create",
  ANIMAL_READ: "animal:read",
  ANIMAL_UPDATE: "animal:update",
  ANIMAL_DELETE: "animal:delete",

  // Veterinary permissions
  DIAGNOSIS_CREATE: "diagnosis:create",
  DIAGNOSIS_READ: "diagnosis:read",
  DIAGNOSIS_UPDATE: "diagnosis:update",
  TREATMENT_CREATE: "treatment:create",
  TREATMENT_READ: "treatment:read",
  PRESCRIPTION_CREATE: "prescription:create",

  // Reproduction permissions
  REPRODUCTION_CREATE: "reproduction:create",
  REPRODUCTION_READ: "reproduction:read",
  REPRODUCTION_UPDATE: "reproduction:update",

  // Inventory permissions
  INVENTORY_CREATE: "inventory:create",
  INVENTORY_READ: "inventory:read",
  INVENTORY_UPDATE: "inventory:update",
  INVENTORY_DELETE: "inventory:delete",

  // Report permissions
  REPORT_CREATE: "report:create",
  REPORT_READ: "report:read",
  REPORT_EXPORT: "report:export",

  // User permissions
  USER_INVITE: "user:invite",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  // System permissions
  SYSTEM_SETTINGS: "system:settings",
  SYSTEM_LOGS: "system:logs",
};

/**
 * Mapa de roles a permisos
 * Define qué permisos tiene cada rol
 */
export const ROLE_PERMISSIONS = {
  // Super Admin - Acceso total al sistema
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  // Dueño de Granja - Control total de su granja
  [ROLES.FARM_OWNER]: [
    // Farm
    PERMISSIONS.FARM_CREATE,
    PERMISSIONS.FARM_READ,
    PERMISSIONS.FARM_UPDATE,
    PERMISSIONS.FARM_DELETE,
    PERMISSIONS.FARM_INVITE_USERS,

    // Animals
    PERMISSIONS.ANIMAL_CREATE,
    PERMISSIONS.ANIMAL_READ,
    PERMISSIONS.ANIMAL_UPDATE,
    PERMISSIONS.ANIMAL_DELETE,

    // Veterinary (lectura)
    PERMISSIONS.DIAGNOSIS_READ,
    PERMISSIONS.TREATMENT_READ,

    // Reproduction
    PERMISSIONS.REPRODUCTION_CREATE,
    PERMISSIONS.REPRODUCTION_READ,
    PERMISSIONS.REPRODUCTION_UPDATE,

    // Inventory
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.INVENTORY_DELETE,

    // Reports
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_EXPORT,

    // Users
    PERMISSIONS.USER_INVITE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
  ],

  // Veterinario - Permisos médicos y de diagnóstico
  [ROLES.VETERINARIAN]: [
    // Farm (solo lectura)
    PERMISSIONS.FARM_READ,

    // Animals (lectura y actualización para historial médico)
    PERMISSIONS.ANIMAL_READ,
    PERMISSIONS.ANIMAL_UPDATE,

    // Veterinary (control total)
    PERMISSIONS.DIAGNOSIS_CREATE,
    PERMISSIONS.DIAGNOSIS_READ,
    PERMISSIONS.DIAGNOSIS_UPDATE,
    PERMISSIONS.TREATMENT_CREATE,
    PERMISSIONS.TREATMENT_READ,
    PERMISSIONS.PRESCRIPTION_CREATE,

    // Reproduction (lectura)
    PERMISSIONS.REPRODUCTION_READ,

    // Inventory (lectura de medicamentos)
    PERMISSIONS.INVENTORY_READ,

    // Reports (lectura y creación de reportes médicos)
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_READ,
  ],

  // Trabajador - Operaciones diarias
  [ROLES.WORKER]: [
    // Farm (solo lectura)
    PERMISSIONS.FARM_READ,

    // Animals
    PERMISSIONS.ANIMAL_READ,
    PERMISSIONS.ANIMAL_UPDATE,

    // Veterinary (solo lectura)
    PERMISSIONS.DIAGNOSIS_READ,
    PERMISSIONS.TREATMENT_READ,

    // Reproduction
    PERMISSIONS.REPRODUCTION_CREATE,
    PERMISSIONS.REPRODUCTION_READ,
    PERMISSIONS.REPRODUCTION_UPDATE,

    // Inventory
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_UPDATE,

    // Reports (solo lectura)
    PERMISSIONS.REPORT_READ,
  ],

  // Invitado - Solo lectura
  [ROLES.GUEST]: [
    PERMISSIONS.FARM_READ,
    PERMISSIONS.ANIMAL_READ,
    PERMISSIONS.DIAGNOSIS_READ,
    PERMISSIONS.REPORT_READ,
  ],
};

/**
 * Verifica si un rol tiene un permiso específico
 * @param {string} role - Rol a verificar
 * @param {string} permission - Permiso a verificar
 * @returns {boolean} true si el rol tiene el permiso
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Verifica si un rol tiene todos los permisos especificados
 * @param {string} role - Rol a verificar
 * @param {string[]} permissions - Array de permisos a verificar
 * @returns {boolean} true si el rol tiene todos los permisos
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.every((permission) => hasPermission(role, permission));
};

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados
 * @param {string} role - Rol a verificar
 * @param {string[]} permissions - Array de permisos a verificar
 * @returns {boolean} true si el rol tiene al menos un permiso
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.some((permission) => hasPermission(role, permission));
};
