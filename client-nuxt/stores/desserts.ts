import { defineStore } from "pinia";
import type { Dessert } from "../interfaces/Dessert";

export const useDessertsStore = defineStore("desserts", {
  state: () => ({
    desserts: [] as Dessert[],
    loading: false,
    error: null as string | null,
    currentType: "" as string,
  }),

  actions: {
    async fetchDesserts(type?: string) {
      const {
        public: { SERVER_URL },
      } = useRuntimeConfig();

      try {
        this.loading = true;
        this.error = null;
        this.currentType = type || "";

        const url = type
          ? `${SERVER_URL}/desserts?type=${type}`
          : `${SERVER_URL}/desserts`;

        this.desserts = await $fetch<Dessert[]>(url, {
          headers: this.getAuthHeaders(),
        });
        
      } catch (error: any) {
        this.error = error.data?.message;
        console.error("Error fetching desserts:", error);

        if (import.meta.client) {
          console.error(this.error);
        }
      } finally {
        this.loading = false;
      }
    },

    async refreshDesserts() {
      await this.fetchDesserts();
    },

    async filterByType(type: string) {
      await this.fetchDesserts(type);
    },

    getAuthHeaders() {
      const adminStore = useAdminStore();
      if (!adminStore.token) {
        throw new Error("No hay token de autenticación disponible");
      }
      return {
        Authorization: `Bearer ${adminStore.token}`,
      };
    },
  },

  getters: {
    availableTypes(): string[] {
      const types = new Set(this.desserts.map((d) => d.type));
      return Array.from(types);
    },

    filteredDesserts(): Dessert[] {
      if (!this.currentType) return this.desserts;
      return this.desserts.filter((d) => d.type === this.currentType);
    },

    activeDesserts(): Dessert[] {
      return this.desserts.filter((d) => d.active);
    },
  },
});
