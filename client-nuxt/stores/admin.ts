import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    token: null as string | null,
    message: null as string | null,
  }),

  actions: {
    async login(username: string, password: string) {
      const {
        public: { SERVER_URL },
      } = useRuntimeConfig();

      try {
        const res = await $fetch<{ message: string; token: string }>(
          `${SERVER_URL}/admin/login`,
          {
            method: "POST",
            body: { username, password },
          }
        );

        this.token = res.token;
        this.message = res.message;

        localStorage.setItem("token", res.token);

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: this.message,
          confirmButtonText: "Aceptar",
        });

        return true;
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.data.message,
          confirmButtonText: "Aceptar",
        });
      }

      return false;
    },

    logout() {
      this.token = null;
      this.message = null;
      localStorage.removeItem("token");
      navigateTo("/admin/login");
    },

    loadFromLocalStorage() {
      if (import.meta.client) {
        const token = localStorage.getItem("token");

        if (token) {
          this.token = token;
        }
      }
    },
  },
});
