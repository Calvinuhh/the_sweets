export function useClientsDessertsApi() {
  const {
    public: { SERVER_URL },
  } = useRuntimeConfig();

  const fetchDesserts = async (params?: { price?: string; type?: string }) => {
    let url = `${SERVER_URL}/clients`;
    if (params && Object.keys(params).length > 0) {
      const query = new URLSearchParams(params as any).toString();
      url += `?${query}`;
    }
    return await $fetch(url);
  };

  const fetchDessertById = async (_id: string) => {
    return await $fetch(`${SERVER_URL}/clients/${_id}`);
  };

  return { fetchDesserts, fetchDessertById };
}
