import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@shared/hooks/useAuth";
import { Shield } from "lucide-react";
import PropTypes from "prop-types";

/**
 * AuthGuard - Componente de alto nivel para protección de autenticación
 * Verifica continuamente la validez del token y maneja auto-logout
 *
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a proteger
 * @param {number} props.checkInterval - Intervalo de verificación en ms (default: 60000 = 1 min)
 * @param {boolean} props.warnBeforeExpiry - Mostrar advertencia antes de expirar (default: true)
 * @param {number} props.warnMinutes - Minutos antes de expiración para advertir (default: 5)
 */
export const AuthGuard = ({
  children,
  checkInterval = 60000, // 1 minuto
  warnBeforeExpiry = true,
  warnMinutes = 5,
}) => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isTokenValid,
    getTimeUntilExpiration,
    isTokenExpiringSoon,
    logout,
  } = useAuth();

  const [isChecking, setIsChecking] = useState(true);
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    // Verificación inicial
    const checkAuth = () => {
      if (!isAuthenticated) {
        console.warn("AuthGuard: User not authenticated");
        setIsChecking(false);
        navigate("/login", { replace: true });
        return;
      }

      if (!isTokenValid()) {
        console.warn("AuthGuard: Token expired, logging out");
        logout();
        navigate("/login", { replace: true });
        return;
      }

      // Advertir si el token está por expirar
      if (warnBeforeExpiry && !hasWarned && isTokenExpiringSoon()) {
        const timeRemaining = getTimeUntilExpiration();
        const minutesRemaining = Math.floor(timeRemaining / 60000);

        console.warn(
          `AuthGuard: Token expiring in ${minutesRemaining} minutes`,
        );

        // Aquí podrías mostrar una notificación al usuario
        // Por ahora solo logueamos
        setHasWarned(true);
      }

      setIsChecking(false);
    };

    // Verificación inicial
    checkAuth();

    // Verificación periódica
    const intervalId = setInterval(checkAuth, checkInterval);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [
    isAuthenticated,
    isTokenValid,
    logout,
    navigate,
    checkInterval,
    warnBeforeExpiry,
    hasWarned,
    isTokenExpiringSoon,
    getTimeUntilExpiration,
  ]);

  // Mostrar loader mientras verifica
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-600 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">
            Verificando autenticación...
          </p>
        </div>
      </div>
    );
  }

  // Renderizar hijos si está autenticado
  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
  checkInterval: PropTypes.number,
  warnBeforeExpiry: PropTypes.bool,
  warnMinutes: PropTypes.number,
};
