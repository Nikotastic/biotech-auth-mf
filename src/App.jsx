import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "@features/login/components/LoginForm";
import RegisterForm from "@features/register/components/RegisterForm";
import UserProfile from "@features/profile/components/UserProfile";
import ForgotPasswordForm from "@features/password/components/ForgotPasswordForm";
import ResetPasswordForm from "@features/password/components/ResetPasswordForm";
import FarmSelector from "@features/farm/components/FarmSelector";
import Dashboard from "@features/dashboard/components/Dashboard";
import { ToastContainer } from "@shared/components/ui/ToastContainer";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/farm-selector" element={<FarmSelector />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
