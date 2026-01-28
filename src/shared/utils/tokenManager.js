import Cookies from "js-cookie";

/**
 * Token Manager - Centraliza el manejo de tokens JWT
 * Proporciona funcionalidades para almacenar, recuperar, validar y decodificar tokens
 */
export const tokenManager = {
  TOKEN_KEY: "auth_token",

  /**
   * Decodifica un token JWT sin verificar la firma
   * @param {string} token - Token JWT a decodificar
   * @returns {object|null} Payload del token o null si es inválido
   */
  decodeToken: (token) => {
    try {
      if (!token) return null;

      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
      );
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  /**
   * Verifica si un token ha expirado
   * @param {string} token - Token JWT a verificar
   * @returns {boolean} true si el token ha expirado, false en caso contrario
   */
  isTokenExpired: (token) => {
    try {
      const decoded = tokenManager.decodeToken(token);

      // Si no se puede decodificar, considerar inválido
      if (!decoded) return true;

      // Si no tiene campo exp, asumir que es válido (útil para mocks)
      if (!decoded.exp) return false;

      // exp viene en segundos, Date.now() en milisegundos
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();

      // Agregar un margen de 60 segundos para evitar problemas de sincronización
      return currentTime >= expirationTime - 60000;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  },

  /**
   * Obtiene el tiempo restante hasta la expiración del token en milisegundos
   * @param {string} token - Token JWT
   * @returns {number} Milisegundos hasta la expiración, 0 si ya expiró
   */
  getTimeUntilExpiration: (token) => {
    try {
      const decoded = tokenManager.decodeToken(token);
      if (!decoded || !decoded.exp) return 0;

      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = expirationTime - currentTime;

      return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
      console.error("Error getting time until expiration:", error);
      return 0;
    }
  },

  /**
   * Guarda el token en cookies con configuración segura
   * @param {string} token - Token JWT a guardar
   * @param {number} expiresInDays - Días hasta la expiración (por defecto 7)
   */
  setToken: (token, expiresInDays = 7) => {
    if (!token) {
      console.warn("Attempted to set empty token");
      return;
    }

    // Configuración de cookies segura
    const cookieOptions = {
      expires: expiresInDays,
      sameSite: "strict",
      secure: window.location.protocol === "https:", // Solo HTTPS en producción
    };

    Cookies.set(tokenManager.TOKEN_KEY, token, cookieOptions);
  },

  /**
   * Obtiene el token almacenado en cookies
   * @returns {string|null} Token JWT o null si no existe
   */
  getToken: () => {
    return Cookies.get(tokenManager.TOKEN_KEY) || null;
  },

  /**
   * Verifica si existe un token válido (no expirado)
   * @returns {boolean} true si hay un token válido
   */
  hasValidToken: () => {
    const token = tokenManager.getToken();
    if (!token) return false;

    return !tokenManager.isTokenExpired(token);
  },

  /**
   * Obtiene el payload del token almacenado
   * @returns {object|null} Payload del token o null
   */
  getTokenPayload: () => {
    const token = tokenManager.getToken();
    return tokenManager.decodeToken(token);
  },

  /**
   * Elimina el token de las cookies
   */
  removeToken: () => {
    Cookies.remove(tokenManager.TOKEN_KEY);
  },

  /**
   * Limpia todos los datos de autenticación
   */
  clearAuth: () => {
    tokenManager.removeToken();

    // Limpiar todas las cookies relacionadas con auth
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      if (cookieName.includes("auth") || cookieName.includes("token")) {
        Cookies.remove(cookieName);
      }
    });
  },
};
