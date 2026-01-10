// Mock data for testing without backend
const MOCK_USERS = {
  "user@biotech.com": {
    password: "password123",
    token: "mock-token-user-123",
    userId: "user-1",
    email: "user@biotech.com",
    fullName: "Usuario Demo",
  },
  "admin@biotech.com": {
    password: "admin123",
    token: "mock-token-admin-456",
    userId: "admin-1",
    email: "admin@biotech.com",
    fullName: "Admin Demo",
  },
};

export const loginServiceMock = {
  login: async (credentials) => {
    console.log('🧪 Mock Login - Credenciales recibidas:', { email: credentials.email, password: '***' });
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS[credentials.email];

    // Validate user exists
    if (!user) {
      console.log('❌ Mock Login - Usuario no encontrado:', credentials.email);
      throw {
        response: {
          status: 404,
          data: "Usuario no encontrado",
        },
      };
    }

    // For demo purposes, accept any password in mock mode
    // Remove this check in production or use strict validation
    console.log('✅ Mock Login - Usuario autenticado:', user.email);

    // Return mock response
    return {
      token: user.token,
      user: {
        id: user.userId,
        email: user.email,
        name: user.fullName,
        fullName: user.fullName,
      },
    };
  },
};
