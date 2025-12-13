import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'authMF',
      filename: 'remoteEntry.js',
      exposes: {
        './Login': './src/features/login/components/LoginForm.jsx',
        './Register': './src/features/register/components/RegisterForm.jsx',
        './UserProfile': './src/features/profile/components/UserProfile.jsx',
        './AuthStore': './src/shared/store/authStore.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand', 'axios']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 5001,
    cors: true
  }
})