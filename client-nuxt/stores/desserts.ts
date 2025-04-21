import { defineStore } from "pinia";
import type { Dessert, CreateDessert } from "~/interfaces/Dessert";

interface DessertsState {
  desserts: Dessert[];
  loading: boolean;
  error: string | null;
  currentType: string;
  currentDessert: (Dessert & { picture?: string }) | null;
}

export const useDessertsStore = defineStore("desserts", {
  state: (): DessertsState => ({
    desserts: [],
    loading: false,
    error: null,
    currentType: "",
    currentDessert: null,
  }),

  actions: {
    async fetchDesserts(type?: string) {
      const dessertsApi = useDessertsApi();

      try {
        this.loading = true;
        this.error = null;
        this.currentType = type || "";

        this.desserts = await dessertsApi.fetchAllDesserts(type);
      } catch (error: any) {
        this.error = error.data?.message;
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

    async createNewDessert(dessertData: CreateDessert): Promise<Dessert> {
      const dessertsApi = useDessertsApi();

      try {
        this.loading = true;
        this.error = null;

        const newDessert = await dessertsApi.createDessert(dessertData);
        this.desserts.unshift(newDessert);
        return newDessert;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchDessertById(id: string): Promise<void> {
      const dessertsApi = useDessertsApi();

      try {
        this.loading = true;
        this.error = null;
        this.currentDessert = await dessertsApi.getDessertById(id);
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentDessert(): void {
      this.currentDessert = null;
    },

    async deleteDessert(id: string): Promise<void> {
      const dessertsApi = useDessertsApi();

      try {
        this.loading = true;
        this.error = null;
        await dessertsApi.deleteDessert(id);

        this.desserts = this.desserts.filter((d) => d._id !== id);

        if (this.currentDessert?._id === id) {
          this.currentDessert = null;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
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
