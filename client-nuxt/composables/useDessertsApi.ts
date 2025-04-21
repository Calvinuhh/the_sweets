import type {
  Dessert,
  CreateDessert,
  UpdateDessert,
} from "~/interfaces/Dessert";

export const useDessertsApi = () => {
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

  const fetchAllDesserts = async (type?: string): Promise<Dessert[]> => {
    const url = type
      ? `${SERVER_URL}/desserts?type=${type}`
      : `${SERVER_URL}/desserts`;

    return await $fetch<Dessert[]>(url, {
      headers: getAuthHeaders(),
    });
  };

  const createDessert = async (
    dessertData: CreateDessert
  ): Promise<Dessert> => {
    const url = `${SERVER_URL}/desserts`;

    try {
      return await $fetch<Dessert>(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(dessertData),
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  const getDessertById = async (id: string): Promise<Dessert> => {
    const url = `${SERVER_URL}/desserts/${id}`;

    try {
      return await $fetch<Dessert>(url, {
        headers: getAuthHeaders(),
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  const deleteDessert = async (id: string): Promise<void> => {
    const url = `${SERVER_URL}/desserts/${id}`;

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

  const updateDessert = async (
    id: string,
    data: Partial<Dessert>
  ): Promise<Dessert> => {
    const url = `${SERVER_URL}/desserts/${id}`;

    try {
      return await $fetch<Dessert>(url, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  const uploadDessertImage = async (
    dessertId: string,
    formData: FormData
  ): Promise<Dessert> => {
    const url = `${SERVER_URL}/desserts/picture/${dessertId}`;

    try {
      return await $fetch<Dessert>(url, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: formData,
      });
    } catch (error: any) {
      const serverMessage = error.data?.message || error.message;
      throw new Error(serverMessage);
    }
  };

  const deleteDessertImage = async (dessertId: string): Promise<void> => {
    const url = `${SERVER_URL}/desserts/picture/${dessertId}`;

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

  return {
    fetchAllDesserts,
    createDessert,
    getDessertById,
    deleteDessert,
    updateDessert,
    uploadDessertImage,
    deleteDessertImage,
  };
};
