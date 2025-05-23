import { ref, reactive, computed } from "vue";
import { useUsersStore } from "~/stores/users";
import { useAlert } from "~/composables/useAlert";

export interface LoginFormData {
  email: string;
  password: string;
}

export function useLoginForm() {
  const usersStore = useUsersStore();
  const { showError } = useAlert();

  const formData = ref<LoginFormData>({
    email: "",
    password: "",
  });

  const errors = reactive<Record<string, string>>({
    email: "",
    password: "",
  });

  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const isAuthenticated = computed(() => usersStore.isAuthenticated);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    errors.email = "";
    errors.password = "";

    if (!formData.value.email) {
      errors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!validateEmail(formData.value.email)) {
      errors.email = "Ingresa un correo electrónico válido";
      isValid = false;
    }

    if (!formData.value.password) {
      errors.password = "La contraseña es requerida";
      isValid = false;
    }

    return isValid;
  };

  const submitForm = async () => {
    if (!validateForm()) return false;

    isSubmitting.value = true;
    errorMessage.value = null;

    try {
      const success = await usersStore.login(
        formData.value.email,
        formData.value.password
      );
      return success;
    } catch (error) {
      if (error instanceof Error) {
      } else {
        showError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    errorMessage,
    isAuthenticated,
    validateForm,
    submitForm,
  };
}
