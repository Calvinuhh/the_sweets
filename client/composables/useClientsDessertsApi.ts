export function useClientsDessertsApi() {
  const {
    public: { SERVER_URL },
  } = useRuntimeConfig();

  const fetchDesserts = async (params?: { price?: string; type?: string }) => {
    return await $fetch(SERVER_URL, { params });
  };

  const fetchDessertById = async (_id: string) => {
    return await $fetch(`${SERVER_URL}/${_id}`);
  };

  return { fetchDesserts, fetchDessertById };
}
