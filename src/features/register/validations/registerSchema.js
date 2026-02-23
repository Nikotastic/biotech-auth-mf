import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .matches(/[0-9]/, "La contraseña debe tener al menos un número")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "La contraseña debe tener al menos un carácter especial",
    )
    .required("La contraseña es requerida"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});
