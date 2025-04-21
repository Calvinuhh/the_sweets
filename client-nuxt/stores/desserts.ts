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

    async updateDessert(id: string, data: Partial<Dessert>): Promise<Dessert> {
      const dessertsApi = useDessertsApi();

      try {
        this.loading = true;
        this.error = null;

        const currentDessert = this.desserts.find((d) => d._id === id);
        if (!currentDessert) throw new Error("Postre no encontrado");

        const changes: Partial<Dessert> = {};

        (Object.keys(data) as Array<keyof Dessert>).forEach((key) => {
          if (data[key] !== undefined && data[key] !== currentDessert[key]) {
            if (key === "price" || key === "portions" || key === "levels") {
              changes[key] = Number(data[key]);
            } else if (key === "active") {
              changes[key] = Boolean(data[key]);
            } else {
              changes[key] = data[key] as any;
            }
          }
        });

        if (Object.keys(changes).length === 0) {
          throw new Error("No se detectaron cambios para actualizar");
        }

        const updatedDessert = await dessertsApi.updateDessert(id, changes);

        const index = this.desserts.findIndex((d) => d._id === id);
        if (index !== -1) {
          this.desserts[index] = { ...this.desserts[index], ...updatedDessert };
        }

        if (this.currentDessert?._id === id) {
          this.currentDessert = { ...this.currentDessert, ...updatedDessert };
        }

        return updatedDessert;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadDessertImage(dessertId: string, formData: FormData) {
      const dessertsApi = useDessertsApi();

      try {
        this.loading = true;
        this.error = null;

        const response = await dessertsApi.uploadDessertImage(
          dessertId,
          formData
        );

        const index = this.desserts.findIndex((d) => d._id === dessertId);
        if (index !== -1) {
          this.desserts[index].picture = response.picture;
        }

        if (this.currentDessert?._id === dessertId) {
          this.currentDessert.picture = response.picture;
        }

        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteDessertImage(dessertId: string) {
      const dessertsApi = useDessertsApi();

      try {
        this.loading = true;
        this.error = null;

        await dessertsApi.deleteDessertImage(dessertId);

        const index = this.desserts.findIndex((d) => d._id === dessertId);
        if (index !== -1) {
          this.desserts[index].picture = undefined;
        }

        if (this.currentDessert?._id === dessertId) {
          this.currentDessert.picture = undefined;
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
