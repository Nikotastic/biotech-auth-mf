import { Navigate } from "react-router-dom";
import { useAuth } from "@shared/hooks/useAuth";
import PropTypes from "prop-types";

/**
 * PublicRoute - Componente para rutas públicas (login, register, etc.)
 * Redirige a una ruta protegida si el usuario ya está autenticado
 *
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si no está autenticado
 * @param {string} props.redirectTo - Ruta a la que redirigir si está autenticado (por defecto '/farm-selector')
 * @param {boolean} props.restricted - Si es true, redirige usuarios autenticados (por defecto true)
 */
export const PublicRoute = ({
  children,
  redirectTo = "/farm-selector",
  restricted = true,
}) => {
  const { isAuthenticated, isTokenValid } = useAuth();

  // Si la ruta es restringida y el usuario está autenticado con token válido
  if (restricted && isAuthenticated && isTokenValid()) {
    console.log(
      "PublicRoute: User already authenticated, redirecting to",
      redirectTo,
    );
    return <Navigate to={redirectTo} replace />;
  }

  // Usuario no autenticado o ruta no restringida, renderizar el componente hijo
  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
  restricted: PropTypes.bool,
};
