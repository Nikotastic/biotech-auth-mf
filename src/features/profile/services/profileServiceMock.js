// Mock data for profile
export const profileServiceMock = {
  getProfile: async () => {
    console.log('🧪 Mock - Getting profile');
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Get user from localStorage (set during login)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state.user;
    }
    
    // Default mock user
    return {
      id: "user-1",
      email: "user@biotech.com",
      name: "Usuario Demo",
      fullName: "Usuario Demo",
    };
  },

  updateProfile: async (data) => {
    console.log('🧪 Mock - Updating profile:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Update localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      parsed.state.user = { ...parsed.state.user, ...data };
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
    
    return { success: true };
  },
};
