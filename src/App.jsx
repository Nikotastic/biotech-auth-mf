import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "@shared/components/ui/ToastContainer";
import {
  PrivateRoute,
  PublicRoute,
  RoleBasedRoute,
} from "@shared/components/routes";
import { AuthGuard } from "@shared/components/guards";
import { Unauthorized, NotFound } from "@shared/components/errors";
import { ROLES, PERMISSIONS } from "@shared/constants/roles";

// Lazy loading components
const LoginForm = lazy(() => import("@features/login/components/LoginForm"));
const RegisterForm = lazy(
  () => import("@features/register/components/RegisterForm"),
);
const UserProfile = lazy(
  () => import("@features/profile/components/UserProfile"),
);
const ForgotPasswordForm = lazy(
  () => import("@features/password/components/ForgotPasswordForm"),
);
const ResetPasswordForm = lazy(
  () => import("@features/password/components/ResetPasswordForm"),
);
const FarmSelector = lazy(
  () => import("@features/farm/components/FarmSelector"),
);
const Dashboard = lazy(
  () => import("@features/dashboard/components/Dashboard"),
);
const SettingsPage = lazy(
  () => import("@features/profile/components/SettingsPage"),
);

// Loading helper component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-green-900/10">
    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <AuthGuard>
                    <SettingsPage />
                  </AuthGuard>
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
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
