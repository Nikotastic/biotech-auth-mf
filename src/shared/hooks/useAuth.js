import { useAuthStore } from "@shared/store/authStore";
import { tokenManager } from "@shared/utils/tokenManager";
import { useEffect } from "react";

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona acceso fácil al estado de autenticación y métodos relacionados
 * @returns {object} Estado y métodos de autenticación
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    selectedFarm,
    setAuth,
    setSelectedFarm,
    logout,
    isTokenValid,
    getTokenPayload,
    updateUser,
  } = useAuthStore();

  /**
   * Verifica si el usuario está autenticado y tiene un token válido
   */
  useEffect(() => {
    if (isAuthenticated && token) {
      // Verificar si el token ha expirado
      if (tokenManager.isTokenExpired(token)) {
        console.warn("Token expired in useAuth, logging out...");
        logout();
      }
    }
  }, [isAuthenticated, token, logout]);

  /**
   * Obtiene información del usuario desde el token
   * @returns {object|null} Información del usuario
   */
  const getUserFromToken = () => {
    if (!token) return null;
    return getTokenPayload();
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} true si el usuario tiene el rol
   */
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user.roles?.includes(role);
  };

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   * @param {string[]} roles - Array de roles a verificar
   * @returns {boolean} true si el usuario tiene alguno de los roles
   */
  const hasAnyRole = (roles) => {
    if (!user || !roles || roles.length === 0) return false;
    return roles.some((role) => hasRole(role));
  };

  /**
   * Obtiene el tiempo restante hasta la expiración del token
   * @returns {number} Milisegundos hasta la expiración
   */
  const getTimeUntilExpiration = () => {
    if (!token) return 0;
    return tokenManager.getTimeUntilExpiration(token);
  };

  /**
   * Verifica si el token expirará pronto (en los próximos 5 minutos)
   * @returns {boolean} true si el token expirará pronto
   */
  const isTokenExpiringSoon = () => {
    const timeRemaining = getTimeUntilExpiration();
    const fiveMinutes = 5 * 60 * 1000;
    return timeRemaining > 0 && timeRemaining < fiveMinutes;
  };

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    selectedFarm,

    // Métodos de autenticación
    setAuth,
    logout,

    // Métodos de granja
    setSelectedFarm,

    // Métodos de usuario
    updateUser,

    // Métodos de validación
    isTokenValid,
    getUserFromToken,
    getTokenPayload,
    hasRole,
    hasAnyRole,

    // Métodos de expiración
    getTimeUntilExpiration,
    isTokenExpiringSoon,
  };
};
