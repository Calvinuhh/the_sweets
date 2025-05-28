import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    token: null as string | null,
    message: null as string | null,
    tokenExpiration: null as number | null,
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

        const expirationTime = new Date().getTime() + 3600000;
        this.tokenExpiration = expirationTime;

        if (import.meta.client) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("tokenExpiration", expirationTime.toString());
        }

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
          text: error.data.message || "Error al iniciar sesión",
          confirmButtonText: "Aceptar",
        });
      }

      return false;
    },

    logout() {
      this.token = null;
      this.message = null;
      this.tokenExpiration = null;

      if (import.meta.client) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
      }

      navigateTo("/admin/login");
    },

    loadFromLocalStorage() {
      if (import.meta.client) {
        const token = localStorage.getItem("token");
        const expiration = localStorage.getItem("tokenExpiration");

        if (token && expiration) {
          const currentTime = new Date().getTime();
          const expirationTime = parseInt(expiration);

          if (currentTime < expirationTime) {
            this.token = token;
            this.tokenExpiration = expirationTime;
          } else {
            this.logout();
          }
        }
      }
    },

    checkTokenExpiration() {
      if (this.token && this.tokenExpiration) {
        const currentTime = new Date().getTime();
        if (currentTime >= this.tokenExpiration) {
          this.logout();
          return false;
        }
        return true;
      }
      return false;
    },
  },
});
