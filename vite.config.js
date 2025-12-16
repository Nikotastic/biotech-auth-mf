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
    },
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
        "./AuthStore": "./src/shared/store/authStore.js",
      },
      shared: ["react", "react-dom", "react-router-dom", "zustand", "axios"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5001,
    cors: true,
  },
});
