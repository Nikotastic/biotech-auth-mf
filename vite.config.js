import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      // Eliminamos @shared-services porque causa errores de resolución en producción
    },
  },
  server: {
    port: 5001,
    cors: true,
  },
  plugins: [
    react(),
    federation({
      name: "authMF",
      filename: "remoteEntry.js",
      exposes: {
        "./Login": "./src/features/login/components/LoginForm.jsx",
        "./Register": "./src/features/register/components/RegisterForm.jsx",
        "./UserProfile": "./src/features/profile/components/UserProfile.jsx",
        "./FarmSelector": "./src/features/farm/components/FarmSelector.jsx",
        "./ForgotPassword":
          "./src/features/password/components/ForgotPasswordForm.jsx",
        "./ResetPassword":
          "./src/features/password/components/ResetPasswordForm.jsx",
        "./SettingsPage": "./src/features/profile/components/SettingsPage.jsx",
        "./AuthStore": "./src/shared/store/authStore.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-router-dom": { singleton: true },
        zustand: { singleton: true },
        axios: { singleton: true },
        "framer-motion": { singleton: true },
        "lucide-react": { singleton: true },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: true, // Minificar para producción
    cssCodeSplit: false,
    rollupOptions: {
      // Eliminamos el external que causaba el Uncaught TypeError
    },
  },
});
