import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "@features/login/components/LoginForm";
import RegisterForm from "@features/register/components/RegisterForm";
import UserProfile from "@features/profile/components/UserProfile";
import ForgotPasswordForm from "@features/password/components/ForgotPasswordForm";
import ResetPasswordForm from "@features/password/components/ResetPasswordForm";
import FarmSelector from "@features/farm/components/FarmSelector";
import Dashboard from "@features/dashboard/components/Dashboard";
import { ToastContainer } from "@shared/components/ui/ToastContainer";
import { PrivateRoute, PublicRoute } from "@shared/components/routes";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas - Redirigen a /farm-selector si el usuario ya está autenticado */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordForm />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordForm />
              </PublicRoute>
            }
          />

          {/* Rutas Protegidas - Requieren autenticación */}
          <Route
            path="/farm-selector"
            element={
              <PrivateRoute>
                <FarmSelector />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* Rutas por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
