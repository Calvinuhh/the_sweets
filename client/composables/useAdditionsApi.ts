import type Addition from "~/interfaces/Addition";
import type { CreateAddition, UpdateAddition } from "~/interfaces/Addition";

export const useAdditionsApi = () => {
  const {
    public: { SERVER_URL },
  } = useRuntimeConfig();

  const adminStore = useAdminStore();

  const getAuthHeaders = () => {
    if (!adminStore.token) {
      throw new Error("No hay token de autenticación disponible");
    }
    return {
      Authorization: `Bearer ${adminStore.token}`,
    };
  };

  const fetchAllAdditions = async (type?: string): Promise<Addition[]> => {
    const url = type
      ? `${SERVER_URL}/additions?type=${type}`
      : `${SERVER_URL}/additions`;

    return await $fetch<Addition[]>(url, {
      headers: getAuthHeaders(),
    });
  };

  const createAddition = async (
    additionData: CreateAddition
  ): Promise<Addition> => {
    const url = `${SERVER_URL}/additions`;

    try {
      return await $fetch<Addition>(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(additionData),
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  const getAdditionById = async (id: string): Promise<Addition> => {
    const url = `${SERVER_URL}/additions/${id}`;

    try {
      return await $fetch<Addition>(url, {
        headers: getAuthHeaders(),
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  const deleteAddition = async (id: string): Promise<void> => {
    const url = `${SERVER_URL}/additions/${id}`;

    try {
      await $fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  const updateAddition = async (
    id: string,
    data: UpdateAddition
  ): Promise<Addition> => {
    const url = `${SERVER_URL}/additions/${id}`;

    try {
      return await $fetch<Addition>(url, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  return {
    fetchAllAdditions,
    createAddition,
    getAdditionById,
    deleteAddition,
    updateAddition,
  };
};
