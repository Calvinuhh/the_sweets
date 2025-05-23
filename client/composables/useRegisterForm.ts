import { ref, computed } from "vue";

export interface RegisterFormData {
  name: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export function useRegisterForm() {
  const formData = ref<RegisterFormData>({
    name: "",
    lastName: "",
    email: "",
    countryCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const errors = ref<Record<string, string>>({});
  const isSubmitting = ref(false);
  const isSubmitted = ref(false);
  const apiError = ref<string | null>(null);
  const showSuccessModal = ref(false);

  const validateNameFormat = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, "");
    return /^\d{7,15}$/.test(cleanPhone);
  };

  const validatePasswordFormat = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.value.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (!validateNameFormat(formData.value.name)) {
      newErrors.name =
        "El nombre solo puede contener letras, números y espacios";
    } else if (formData.value.name.length > 100) {
      newErrors.name = "El nombre debe tener máximo 100 caracteres";
    }

    if (!formData.value.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (!validateNameFormat(formData.value.lastName)) {
      newErrors.lastName =
        "El apellido solo puede contener letras, números y espacios";
    } else if (formData.value.lastName.length > 100) {
      newErrors.lastName = "El apellido debe tener máximo 100 caracteres";
    }

    if (!formData.value.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!validateEmail(formData.value.email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido";
    }

    if (!formData.value.countryCode.trim()) {
      newErrors.countryCode = "El código de país es requerido";
    }

    if (!formData.value.phone.trim()) {
      newErrors.phone = "El número telefónico es requerido";
    } else if (!validatePhone(formData.value.phone)) {
      newErrors.phone = "Por favor ingresa un número telefónico válido";
    }

    if (!formData.value.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (!validatePasswordFormat(formData.value.password)) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo";
    }

    if (!formData.value.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.value.password !== formData.value.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.value.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (validateForm()) {
      isSubmitting.value = true;
      apiError.value = null;

      try {
        const runtimeConfig = useRuntimeConfig();
        const serverUrl = runtimeConfig.public.SERVER_URL;

        const response = await fetch(`${serverUrl}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.value.name,
            lastname: formData.value.lastName,
            email: formData.value.email,
            country_code: formData.value.countryCode,
            phone: formData.value.phone,
            password: formData.value.password,
          }),
        });

        const data = await response.json();

        if (data === "El usuario ya existe") {
          apiError.value = "El usuario ya existe";
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Error en el registro");
        }

        isSubmitted.value = true;
        showSuccessModal.value = true;
        resetForm();
      } catch (error) {
        console.error("Error al registrar:", error);
        if (error instanceof Error) {
          apiError.value = error.message;
        } else {
          apiError.value = "Ocurrió un error al registrar. Intenta de nuevo.";
        }
      } finally {
        isSubmitting.value = false;
      }
    }
  };

  const resetForm = () => {
    formData.value = {
      name: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    };
    errors.value = {};
    isSubmitted.value = false;
    apiError.value = null;
  };

  const closeSuccessModal = () => {
    showSuccessModal.value = false;
  };

  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    apiError,
    showSuccessModal,
    validateForm,
    submitForm,
    resetForm,
    closeSuccessModal,
    hasErrors,
  };
}
