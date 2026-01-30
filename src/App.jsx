import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "@features/login/components/LoginForm";
import RegisterForm from "@features/register/components/RegisterForm";
import UserProfile from "@features/profile/components/UserProfile";
import ForgotPasswordForm from "@features/password/components/ForgotPasswordForm";
import ResetPasswordForm from "@features/password/components/ResetPasswordForm";
import FarmSelector from "@features/farm/components/FarmSelector";
import Dashboard from "@features/dashboard/components/Dashboard";
import { ToastContainer } from "@shared/components/ui/ToastContainer";
import {
  PrivateRoute,
  PublicRoute,
  RoleBasedRoute,
} from "@shared/components/routes";
import { AuthGuard } from "@shared/components/guards";
import { Unauthorized, NotFound } from "@shared/components/errors";
import { ROLES, PERMISSIONS } from "@shared/constants/roles";
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
                <AuthGuard>
                  <FarmSelector />
                </AuthGuard>
                <FarmSelector />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AuthGuard>
                  <UserProfile />
                </AuthGuard>
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* Ejemplo de Ruta Basada en Roles - Solo Admin */}
          {/* <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                <AuthGuard>
                  <AdminPanel />
                </AuthGuard>
              </RoleBasedRoute>
            }
          /> */}

          {/* Ejemplo de Ruta Basada en Permisos */}
          {/* <Route
            path="/reports"
            element={
              <RoleBasedRoute
                anyPermissions={[PERMISSIONS.REPORT_READ, PERMISSIONS.REPORT_CREATE]}
              >
                <AuthGuard>
                  <Reports />
                </AuthGuard>
              </RoleBasedRoute>
            }
          /> */}

          {/* Rutas de Error */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />

          {/* Rutas por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
