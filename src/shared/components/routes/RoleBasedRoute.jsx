import { Navigate } from "react-router-dom";
import { useAuth } from "@shared/hooks/useAuth";
import PropTypes from "prop-types";
import {
  ROLES,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from "@shared/constants/roles";

/**
 * RoleBasedRoute - Componente para proteger rutas basadas en roles y permisos
 * Más avanzado que PrivateRoute, permite validación granular de permisos
 *
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componente hijo a renderizar
 * @param {string[]} props.allowedRoles - Roles permitidos para acceder
 * @param {string[]} props.requiredPermissions - Permisos requeridos (todos)
 * @param {string[]} props.anyPermissions - Permisos requeridos (al menos uno)
 * @param {string} props.redirectTo - Ruta de redirección si no tiene acceso
 * @param {React.ReactNode} props.fallback - Componente a mostrar mientras valida
 */
export const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  anyPermissions = [],
  redirectTo = "/unauthorized",
  fallback = null,
}) => {
  const { isAuthenticated, isTokenValid, user } = useAuth();

  // Verificar autenticación
  if (!isAuthenticated) {
    console.warn(
      "RoleBasedRoute: User not authenticated, redirecting to /login",
    );
    return <Navigate to="/login" replace />;
  }

  // Verificar validez del token
  if (!isTokenValid()) {
    console.warn(
      "RoleBasedRoute: Token invalid or expired, redirecting to /login",
    );
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene datos
  if (!user) {
    console.warn("RoleBasedRoute: User data not available");
    return fallback || <Navigate to="/login" replace />;
  }

  const userRole = user.role || ROLES.USER;

  //  Verificar roles permitidos
  if (allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.includes(userRole);

    if (!hasAllowedRole) {
      console.warn(
        `RoleBasedRoute: User role "${userRole}" not in allowed roles:`,
        allowedRoles,
      );
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Verificar permisos requeridos (todos)
  if (requiredPermissions.length > 0) {
    const hasRequired = hasAllPermissions(userRole, requiredPermissions);

    if (!hasRequired) {
      console.warn(
        `RoleBasedRoute: User role "${userRole}" missing required permissions:`,
        requiredPermissions,
      );
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Verificar permisos requeridos (al menos uno)
  if (anyPermissions.length > 0) {
    const hasAny = hasAnyPermission(userRole, anyPermissions);

    if (!hasAny) {
      console.warn(
        `RoleBasedRoute: User role "${userRole}" missing any of permissions:`,
        anyPermissions,
      );
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Usuario autorizado, renderizar el componente hijo
  return children;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requiredPermissions: PropTypes.arrayOf(PropTypes.string),
  anyPermissions: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
  fallback: PropTypes.node,
};
