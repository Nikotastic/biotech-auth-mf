const getMockUsers = () => {
  const stored = localStorage.getItem("mock_users_db");
  return stored ? JSON.parse(stored) : {};
};

export const registerServiceMock = {
  register: async (userData) => {
    console.log("🧪 Using MOCK API for Register");
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getMockUsers();
    if (users[userData.email]) {
      const error = new Error("El correo electrónico ya está registrado");
      error.response = {
        status: 409,
        data: { message: "El correo electrónico ya está registrado" },
      };
      throw error;
    }

    // Create new user
    const userId = `user-${Date.now()}`;
    const newUser = {
      userId,
      email: userData.email,
      fullName: userData.name || userData.fullName,
      password: userData.password,
      role: "USER",
    };

    // Save to DB
    users[userData.email] = newUser;
    localStorage.setItem("mock_users_db", JSON.stringify(users));

    console.log("✅ Mock Register Success:", newUser.email);

    return {
      token: "mock-token-" + userId,
      user: {
        id: userId,
        email: newUser.email,
        name: newUser.fullName,
        fullName: newUser.fullName,
        role: "USER",
      },
    };
  },
};
