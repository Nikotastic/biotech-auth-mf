/**
 * Auth Error Handler - Utilidad para centralizar y estandarizar los mensajes de error de autenticación
 */
export const handleAuthError = (err) => {
  console.error("Auth error occurred:", err);

  const errorData = err.response?.data;
  const statusCode = err.response?.status;

  let message = "Error en la operación de autenticación";
  let type = "error";

  if (statusCode === 401) {
    message = "🔒 Credenciales incorrectas. Verifica tu correo y contraseña.";
  } else if (statusCode === 404) {
    message = "❌ Usuario no encontrado. ¿Ya te has registrado?";
  } else if (statusCode === 403) {
    message = "⛔ Cuenta inactiva o bloqueada. Contacta al administrador.";
  } else if (statusCode === 500) {
    message = "❌ Error del servidor. Por favor, intenta nuevamente más tarde.";
  } else if (!err.response) {
    message =
      "🔌 No se pudo conectar con el servidor. Verifica tu conexión a internet.";
  } else {
    message =
      errorData?.message ||
      (typeof errorData === "string"
        ? errorData
        : "Ocurrió un error inesperado");
  }

  return { message, type };
};
