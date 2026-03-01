import Cookies from "js-cookie";

/**
 * Token Manager - Centraliza el manejo de tokens JWT
 * Proporciona funcionalidades para almacenar, recuperar, validar y decodificar tokens
 */
export const tokenManager = {
  TOKEN_KEY: "auth_token",

  /**
   * Caché interna para evitar decodificaciones repetitivas
   */
  _cache: {
    raw: null,
    decoded: null,
  },

  /**
   * Decodifica un token JWT sin verificar la firma
   * @param {string} token - Token JWT a decodificar
   * @returns {object|null} Payload del token o null si es inválido
   */
  decodeToken: (token) => {
    if (!token) return null;

    // Retornar desde caché si es el mismo token
    if (tokenManager._cache.raw === token) {
      return tokenManager._cache.decoded;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = parts[1];
      // Usar una decodificación que maneje caracteres especiales de base64url
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        ),
      );

      // Actualizar caché
      tokenManager._cache = {
        raw: token,
        decoded: decoded,
      };

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
    if (!token) {
      console.warn("isTokenExpired: Token is null/undefined");
      return true;
    }

    const decoded = tokenManager.decodeToken(token);
    if (!decoded) {
      console.warn("isTokenExpired: Could not decode token");
      return true;
    }

    if (!decoded.exp) {
      console.log("isTokenExpired: No 'exp' claim in token, assuming valid");
      return false;
    }

    const currentTime = Date.now();
    const expirationTime = decoded.exp * 1000;
    const safetyMargin = 30000; // 30 seconds
    const isExpired = currentTime >= expirationTime - safetyMargin;

    if (isExpired) {
      console.warn("isTokenExpired: Token expired!", {
        currentTime,
        expirationTime,
        diffSeconds: (expirationTime - currentTime) / 1000,
      });
    }

    return isExpired;
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
