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
    getToken: (state) => state.tokenUser,
    getUserData: (state) => state.userData,
    isAuthenticated: (state) => {
      if (!state.tokenUser || !state.tokenUserExpiration) return false;
      return new Date().getTime() < state.tokenUserExpiration;
    },
  },

  actions: {
    loadFromLocalStorage() {
      if (import.meta.client) {
        try {
          const token = localStorage.getItem("userToken");
          const expiration = localStorage.getItem("userTokenExpiration");
          const userData = localStorage.getItem("userData");

          if (token && expiration) {
            const expirationTime = parseInt(expiration);
            if (new Date().getTime() < expirationTime) {
              this.tokenUser = token;
              this.tokenUserExpiration = expirationTime;

              if (userData && userData !== "undefined" && userData !== "null") {
                try {
                  this.userData = JSON.parse(userData);
                } catch (parseError) {
                  console.error(
                    "Error parsing userData from localStorage:",
                    parseError
                  );
                  this.userData = null;
                  localStorage.removeItem("userData");
                }
              }
            } else {
              this.logout();
            }
          }
        } catch (error) {
          console.error("Error loading from localStorage:", error);
          this.logout();
        }
      }
    },

    logout() {
      this.tokenUser = null;
      this.userData = null;
      this.tokenUserExpiration = null;

      if (import.meta.client) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userTokenExpiration");
        localStorage.removeItem("userData");
      }
    },

    async login(email: string, password: string) {
      const {
        public: { SERVER_URL },
      } = useRuntimeConfig();
      const { showSuccess, showError } = useAlert();

      try {
        const response = await $fetch<{ token: string; user?: UserData }>(
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

    async googleAuth(token: string) {
      const {
        public: { SERVER_URL },
      } = useRuntimeConfig();
      const { showSuccess, showError } = useAlert();

      try {
        const response = await $fetch<any>(`${SERVER_URL}/users/google-login`, {
          method: "POST",
          body: { token },
        });

        // Si el usuario necesita verificación, mostrar mensaje y redireccionar
        if (response.requiresVerification) {
          showSuccess(
            "Por favor verifica tu correo electrónico para activar tu cuenta"
          );
          return {
            requiresVerification: true,
            email: response.email,
          };
        }

        if (response.token) {
          const expirationTime = new Date().getTime() + 3600000; // 1 hora

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

          showSuccess(
            "¡Bienvenido! Has iniciado sesión con Google correctamente"
          );
          return { success: true };
        }
        return { success: false };
      } catch (error: any) {
        console.error("Error en autenticación Google:", error);

        let errorMessage = "Error al iniciar sesión con Google";
        if (error.response?._data?.message) {
          errorMessage = error.response._data.message;
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        }

        showError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },

    clearUserData() {
      this.tokenUser = null;
      this.userData = null;
      this.tokenUserExpiration = null;

      if (import.meta.client) {
        try {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userTokenExpiration");
          localStorage.removeItem("userData");
        } catch (error) {
          const { showError } = useAlert();
          showError("Error al limpiar datos guardados");
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
        try {
          localStorage.setItem("userData", JSON.stringify(userData));
        } catch (error) {
          const { showError } = useAlert();
          showError("Error al guardar datos del usuario");
        }
      }
    },

    setToken(token: string) {
      const expirationTime = new Date().getTime() + 3600000;

      this.tokenUser = token;
      this.tokenUserExpiration = expirationTime;

      if (import.meta.client) {
        try {
          localStorage.setItem("userToken", token);
          localStorage.setItem(
            "userTokenExpiration",
            expirationTime.toString()
          );
        } catch (error) {
          console.error("Error saving token to localStorage:", error);
          const { showError } = useAlert();
          showError("Error al guardar sesión");
        }
      }
    },

    setUserData(userData: UserData) {
      this.userData = userData;

      if (import.meta.client && userData) {
        try {
          localStorage.setItem("userData", JSON.stringify(userData));
        } catch (error) {
          console.error("Error saving userData to localStorage:", error);
          const { showError } = useAlert();
          showError("Error al guardar datos del usuario");
        }
      }
    },
  },
});
