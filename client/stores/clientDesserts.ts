import { defineStore } from "pinia";
import { ref } from "vue";
import { useClientsDessertsApi } from "../composables/useClientsDessertsApi";
import type { Dessert } from "~/interfaces/Dessert";

export const useClientDessertsStore = defineStore("clientDesserts", () => {
  const desserts = ref<Dessert[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const { fetchDesserts } = useClientsDessertsApi();

  const loadDesserts = async (params?: { price?: string; type?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await fetchDesserts(params);
      if (typeof result === "string") {
        desserts.value = [];
        error.value = result;
      } else {
        desserts.value = result as Dessert[];
      }
    } catch (err: any) {
      error.value = err.message || "Error al cargar postres";
      desserts.value = [];
    } finally {
      loading.value = false;
    }
  };

  return { desserts, loading, error, loadDesserts };
});
