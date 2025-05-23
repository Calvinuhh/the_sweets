import { defineStore } from "pinia";
import { useAlert } from "~/composables/useAlert";

type UserData = {
  name: string;
  email: string;
  lastname: string;
  country_code: string;
  phone: string;
};

interface UserState {
  tokenUser: string | null;
  userData: UserData | null;
  tokenUserExpiration: number | null;
}

export const useUsersStore = defineStore("users", {
  state: (): UserState => ({
    tokenUser: null,
    userData: null,
    tokenUserExpiration: null,
  }),

  getters: {
    isAuthenticated(): boolean {
      if (import.meta.server) {
        return !!this.tokenUser;
      }

      if (!this.tokenUser) return false;

      if (this.tokenUserExpiration) {
        const currentTime = new Date().getTime();
        if (currentTime >= this.tokenUserExpiration) {
          this.tokenUser = null;
          this.userData = null;
          this.tokenUserExpiration = null;
          if (import.meta.client) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userTokenExpiration");
            localStorage.removeItem("userData");
          }
          return false;
        }
      }

      return true;
    },
    getToken: (state) => state.tokenUser,
    getUserData: (state) => state.userData,
  },

  actions: {
    async login(email: string, password: string) {
      const {
        public: { SERVER_URL },
      } = useRuntimeConfig();
      const { showSuccess, showError } = useAlert();

      try {
        const response = await $fetch<{ token: string; user?: any }>(
          `${SERVER_URL}/users/login`,
          {
            method: "POST",
            body: { email, password },
          }
        );

        if (response.token) {
          const expirationTime = new Date().getTime() + 3600000;

          this.tokenUser = response.token;
          this.tokenUserExpiration = expirationTime;
          this.userData = response.user || null;

          if (import.meta.client) {
            localStorage.setItem("userToken", response.token);
            localStorage.setItem(
              "userTokenExpiration",
              expirationTime.toString()
            );
            if (response.user) {
              localStorage.setItem("userData", JSON.stringify(response.user));
            }
          }

          showSuccess("¡Bienvenido! Has iniciado sesión correctamente");

          return true;
        }
        return false;
      } catch (error: any) {
        console.error("Error al iniciar sesión:", error);

        let errorMessage = "Error al iniciar sesión";

        if (
          error.response &&
          error.response._data &&
          error.response._data.message
        ) {
          errorMessage = error.response._data.message;
        } else if (error.data && error.data.message) {
          errorMessage = error.data.message;
        }

        showError(errorMessage);
        throw new Error(errorMessage);
      }
    },

    logout() {
      this.tokenUser = null;
      this.userData = null;
      this.tokenUserExpiration = null;

      // Solo ejecutar en el cliente
      if (process.client) {
        try {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userTokenExpiration");
          localStorage.removeItem("userData");
        } catch (error) {
          console.error("Error al limpiar localStorage:", error);
        }
      }

      return navigateTo("/user/login");
    },

    loadFromLocalStorage() {
      // Solo ejecutar en el cliente
      if (!process.client) return;

      try {
        const token = localStorage.getItem("userToken");
        const expiration = localStorage.getItem("userTokenExpiration");
        const userData = localStorage.getItem("userData");

        if (token && expiration) {
          const currentTime = new Date().getTime();
          const expirationTime = parseInt(expiration);

          if (currentTime < expirationTime) {
            this.tokenUser = token;
            this.tokenUserExpiration = expirationTime;
            if (userData) {
              try {
                this.userData = JSON.parse(userData);
              } catch (e) {
                console.error("Error al parsear userData:", e);
                this.userData = null;
              }
            }
          } else {
            // Token expirado
            this.clearUserData();
          }
        }
      } catch (error) {
        console.error("Error al cargar datos de localStorage:", error);
      }
    },

    // Método auxiliar para limpiar datos sin navegación
    clearUserData() {
      this.tokenUser = null;
      this.userData = null;
      this.tokenUserExpiration = null;

      if (process.client) {
        try {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userTokenExpiration");
          localStorage.removeItem("userData");
        } catch (error) {
          console.error("Error al limpiar localStorage:", error);
        }
      }
    },

    checkTokenExpiration() {
      if (this.tokenUser && this.tokenUserExpiration) {
        const currentTime = new Date().getTime();
        if (currentTime >= this.tokenUserExpiration) {
          this.logout();
          return false;
        }
        return true;
      }
      return false;
    },

    updateUserData(userData: any) {
      this.userData = userData;
      if (import.meta.client && userData) {
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    },
  },
});
