import { Navigate } from "react-router-dom";
import { useAuth } from "@shared/hooks/useAuth";
import PropTypes from "prop-types";

/**
 * PrivateRoute - Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado o el token ha expirado
 *
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si está autenticado
 * @param {string} props.redirectTo - Ruta a la que redirigir si no está autenticado (por defecto '/login')
 * @param {string[]} props.requiredRoles - Roles requeridos para acceder a la ruta (opcional)
 */
export const PrivateRoute = ({
  children,
  redirectTo = "/login",
  requiredRoles = null,
}) => {
  const { isAuthenticated, isTokenValid, hasAnyRole } = useAuth();

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    console.warn(
      "PrivateRoute: User not authenticated, redirecting to",
      redirectTo,
    );
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar si el token es válido
  if (!isTokenValid()) {
    console.warn(
      "PrivateRoute: Token invalid or expired, redirecting to",
      redirectTo,
    );
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar roles si se especificaron
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAnyRole(requiredRoles)) {
      console.warn(
        "PrivateRoute: User does not have required roles, redirecting to /unauthorized",
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Usuario autenticado y con permisos, renderizar el componente hijo
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};
