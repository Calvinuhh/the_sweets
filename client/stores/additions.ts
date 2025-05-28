import { defineStore } from "pinia";
import type { CreateAddition } from "~/interfaces/Addition";
import type Addition from "~/interfaces/Addition";

interface AdditionsState {
  additions: Addition[];
  loading: boolean;
  error: string | null;
  currentAddition: Addition | null;
  currentType: string;
}

export const useAdditionsStore = defineStore("additions", {
  state: (): AdditionsState => ({
    additions: [],
    loading: false,
    error: null,
    currentAddition: null,
    currentType: "",
  }),

  actions: {
    async fetchAdditions(type?: string) {
      const additionsApi = useAdditionsApi();

      try {
        this.loading = true;
        this.error = null;
        this.currentType = type || "";

        const data = await additionsApi.fetchAllAdditions(type);
        this.additions = Array.isArray(data) ? data : [];
      } catch (error: any) {
        this.error = error.data?.message || "Error al cargar adiciones";
      } finally {
        this.loading = false;
      }
    },

    async createNewAddition(additionData: CreateAddition): Promise<Addition> {
      const additionsApi = useAdditionsApi();

      try {
        this.loading = true;
        this.error = null;

        const newAddition = await additionsApi.createAddition(additionData);
        this.additions.unshift(newAddition);
        return newAddition;
      } catch (error: any) {
        this.error = error.message || "Error al crear adición";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAdditionById(id: string): Promise<void> {
      const additionsApi = useAdditionsApi();

      try {
        this.loading = true;
        this.error = null;
        this.currentAddition = await additionsApi.getAdditionById(id);
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAddition(id: string): Promise<void> {
      const additionsApi = useAdditionsApi();

      try {
        this.loading = true;
        this.error = null;
        await additionsApi.deleteAddition(id);

        this.additions = this.additions.filter((a) => a._id !== id);

        if (this.currentAddition?._id === id) {
          this.currentAddition = null;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAddition(
      id: string,
      data: Partial<Addition>
    ): Promise<Addition> {
      const additionsApi = useAdditionsApi();

      try {
        this.loading = true;
        this.error = null;

        const updatedAddition = await additionsApi.updateAddition(id, data);

        const index = this.additions.findIndex((a) => a._id === id);
        if (index !== -1) {
          this.additions[index] = {
            ...this.additions[index],
            ...updatedAddition,
          };
        }

        if (this.currentAddition?._id === id) {
          this.currentAddition = updatedAddition;
        }

        return updatedAddition;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentAddition() {
      this.currentAddition = null;
    },
  },
  getters: {
    filteredAdditions(): Addition[] {
      if (!this.currentType) return this.additions;
      return this.additions.filter((a) => a.type === this.currentType);
    },

    activeAdditions(): Addition[] {
      return this.additions;
    },
  },
});
