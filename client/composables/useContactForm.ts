import { ref, computed } from "vue";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  message: string;
}

export function useContactForm() {
  const formData = ref<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phone: "",
    message: "",
  });

  const errors = ref<Record<string, string>>({});
  const isSubmitting = ref(false);
  const isSubmitted = ref(false);
  const apiError = ref<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const validateCountryCode = (code: string): boolean => {
    return code.length >= 2 && code.length <= 5;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.value.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.value.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.value.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!validateEmail(formData.value.email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido";
    }

    if (!formData.value.countryCode.trim()) {
      newErrors.countryCode = "El código de país es requerido";
    } else if (!validateCountryCode(formData.value.countryCode)) {
      newErrors.countryCode =
        "El código de país debe tener entre 2 y 5 caracteres";
    }

    if (!formData.value.phone.trim()) {
      newErrors.phone = "El número telefónico es requerido";
    } else if (!validatePhone(formData.value.phone)) {
      newErrors.phone = "El número telefónico debe tener entre 10 y 15 dígitos";
    }

    if (!formData.value.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const {
    public: { SERVER_URL },
  } = useRuntimeConfig();

  const submitForm = async () => {
    if (validateForm()) {
      isSubmitting.value = true;
      apiError.value = null;

      try {
        const dataToSend = {
          firstName: formData.value.firstName,
          lastName: formData.value.lastName,
          email: formData.value.email,
          countryCode: formData.value.countryCode,
          phone: formData.value.phone,
          message: formData.value.message,
          timestamp: new Date().toISOString(),
        };

        const response = await fetch(`${SERVER_URL}/users/contact-form`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error(`Error en el envío: ${response.statusText}`);
        }

        isSubmitted.value = true;

        formData.value = {
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phone: "",
          message: "",
        };
      } catch (error) {
        apiError.value =
          error instanceof Error
            ? error.message
            : "Ocurrió un error al enviar el formulario. Por favor intenta de nuevo más tarde.";
      } finally {
        isSubmitting.value = false;
      }
    }
  };

  const resetForm = () => {
    formData.value = {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      message: "",
    };
    errors.value = {};
    isSubmitted.value = false;
    apiError.value = null;
  };

  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    apiError,
    validateForm,
    submitForm,
    resetForm,
    hasErrors,
  };
}
