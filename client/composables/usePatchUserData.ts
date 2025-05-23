import { useUsersStore } from "~/stores/users";
import { useAlert } from "~/composables/useAlert";

interface UserUpdateData {
  name?: string;
  lastname?: string;
  country_code?: string;
  phone?: string;
}

export const usePatchUserData = () => {
  const usersStore = useUsersStore();
  const { showSuccess, showError } = useAlert();
  const isLoading = ref(false);

  const updateUserData = async (updatedFields: UserUpdateData) => {
    if (Object.keys(updatedFields).length === 0) {
      showError("No hay cambios para guardar");
      return false;
    }

    isLoading.value = true;

    try {
      const token = usersStore.getToken;
      if (!token) {
        showError("No autorizado");
        navigateTo("/user/login");
        return false;
      }

      const config = useRuntimeConfig();
      const serverUrl = config.public.serverUrl;

      const response = await $fetch(`${serverUrl}/api/users/user`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: updatedFields,
      });

      const currentUserData = usersStore.getUserData;
      if (currentUserData) {
        usersStore.updateUserData({
          ...currentUserData,
          ...updatedFields,
        });
      }

      showSuccess("Datos actualizados correctamente");
      return true;
    } catch (error: any) {
      console.error("Error al actualizar datos:", error);
      showError(error?.data?.message || "Error al actualizar los datos");
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const getChangedFields = (
    originalData: any,
    currentData: any
  ): UserUpdateData => {
    const changedFields: UserUpdateData = {};

    if (originalData.name !== currentData.name?.trim()) {
      changedFields.name = currentData.name?.trim();
    }
    if (originalData.lastname !== currentData.lastname?.trim()) {
      changedFields.lastname = currentData.lastname?.trim();
    }
    if (originalData.country_code !== currentData.country_code?.trim()) {
      changedFields.country_code = currentData.country_code?.trim();
    }
    if (originalData.phone !== currentData.phone?.trim()) {
      changedFields.phone = currentData.phone?.trim();
    }

    return changedFields;
  };

  return {
    updateUserData,
    getChangedFields,
    isLoading: readonly(isLoading),
  };
};
