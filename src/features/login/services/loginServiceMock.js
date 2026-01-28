// Mock data for testing without backend

/**
 * Genera un JWT mock válido con payload
 * @param {object} userData - Datos del usuario
 * @returns {string} JWT mock
 */
const generateMockJWT = (userData) => {
  // Crear payload con datos del usuario y expiración
  const payload = {
    userId: userData.userId,
    email: userData.email,
    name: userData.fullName,
    fullName: userData.fullName,
    // Expiración en 7 días (en segundos)
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    iat: Math.floor(Date.now() / 1000), // Issued at
  };

  // Simular estructura JWT: header.payload.signature
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature-" + userData.userId);

  return `${header}.${payloadEncoded}.${signature}`;
};

const MOCK_USERS = {
  "user@biotech.com": {
    password: "password123",
    userId: "user-1",
    email: "user@biotech.com",
    fullName: "Usuario Demo",
  },
  "admin@biotech.com": {
    password: "admin123",
    userId: "admin-1",
    email: "admin@biotech.com",
    fullName: "Admin Demo",
  },
};

export const loginServiceMock = {
  login: async (credentials) => {
    console.log("🧪 Mock Login - Credenciales recibidas:", {
      email: credentials.email,
      password: "***",
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS[credentials.email];

    // Validate user exists
    if (!user) {
      console.log("❌ Mock Login - Usuario no encontrado:", credentials.email);
      throw {
        response: {
          status: 404,
          data: "Usuario no encontrado",
        },
      };
    }

    // For demo purposes, accept any password in mock mode
    // Remove this check in production or use strict validation
    console.log("✅ Mock Login - Usuario autenticado:", user.email);

    // Generate mock JWT token
    const token = generateMockJWT(user);

    // Return mock response
    return {
      token,
      user: {
        id: user.userId,
        email: user.email,
        name: user.fullName,
        fullName: user.fullName,
      },
    };
  },
};
