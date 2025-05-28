import { useUsersStore } from "~/stores/users";
import { useAlert } from "~/composables/useAlert";
import { useRouter } from "vue-router";

declare global {
  interface Window {
    google: any;
    googleLoginCallback: (response: any) => void;
  }
}

type GoogleAuthResult =
  | { success: true }
  | { success: false }
  | { requiresVerification: true; email?: string };

export const useGoogleAuth = () => {
  const usersStore = useUsersStore();
  const { showError, showSuccess } = useAlert();
  const router = useRouter();
  const {
    public: { GOOGLE_CLIENT_ID },
  } = useRuntimeConfig();

  const isLoading = ref(false);

  const initializeGoogleSignIn = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Google Sign-In only works in browser"));
        return;
      }

      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      const checkGoogle = () => {
        if (window.google?.accounts?.id) {
          resolve();
        } else {
          setTimeout(checkGoogle, 50);
        }
      };

      checkGoogle();
    });
  };

  const handleGoogleResponse = async (
    response: any
  ): Promise<GoogleAuthResult> => {
    if (!response.credential) {
      showError("No se recibió token de Google");
      return { success: false };
    }

    isLoading.value = true;

    try {
      const config = useRuntimeConfig();
      const serverUrl = config.public.SERVER_URL;

      const result = await $fetch<{
        token: string;
        user: any;
        requiresVerification?: boolean;
        email?: string;
        message?: string;
        tokenAlreadyExists?: boolean;
      }>(`${serverUrl}/users/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          token: response.credential,
        },
      });

      if (result.requiresVerification) {
        // Mostrar mensaje personalizado dependiendo si el token ya existía
        const message = result.tokenAlreadyExists
          ? result.message ||
            "Ya se ha enviado un correo de verificación previamente. Por favor revisa tu bandeja de entrada."
          : "Por favor verifica tu correo electrónico para activar tu cuenta";

        showSuccess(message);
        router.push("/user/verification-pending");
        return { requiresVerification: true, email: result.email };
      }

      if (result.token && result.user) {
        const expirationTime = new Date().getTime() + 3600000;

        usersStore.tokenUser = result.token;
        usersStore.tokenUserExpiration = expirationTime;
        usersStore.userData = result.user;

        if (import.meta.client) {
          try {
            localStorage.setItem("userToken", result.token);
            localStorage.setItem(
              "userTokenExpiration",
              expirationTime.toString()
            );
            localStorage.setItem("userData", JSON.stringify(result.user));
          } catch (error) {
            console.error("Error saving to localStorage:", error);
          }
        }

        showSuccess("¡Bienvenido!");
        return { success: true };
      } else {
        showError("Respuesta incompleta del servidor");
        return { success: false };
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      let errorMessage = "Error al autenticar con Google";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const renderGoogleButton = async (elementId: string) => {
    try {
      await initializeGoogleSignIn();

      window.googleLoginCallback = async (response: any) => {
        const result = await handleGoogleResponse(response);

        if ("success" in result && result.success) {
          router.push("/products");
        } else if (
          "requiresVerification" in result &&
          result.requiresVerification
        ) {
          router.push("/user/verification-pending");
        }
      };

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.googleLoginCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = "";

        window.google.accounts.id.renderButton(element, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width: 336,
          height: 44,
          text: "continue_with",
          logo_alignment: "left",
        });
      }
    } catch (error) {
      console.error("Error al renderizar botón de Google:", error);
      showError("Error al cargar Google Sign-In");
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      await initializeGoogleSignIn();

      return new Promise((resolve) => {
        window.googleLoginCallback = async (response: any) => {
          const result = await handleGoogleResponse(response);

          if ("requiresVerification" in result && result.requiresVerification) {
            router.push("/user/verification-pending");
            resolve(false);
          } else if ("success" in result) {
            resolve(result.success);
          } else {
            resolve(false);
          }
        };

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: window.googleLoginCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            window.google.accounts.id.renderButton(
              document.getElementById("google-signin-fallback"),
              {
                theme: "outline",
                size: "large",
                width: "100%",
              }
            );
          }
        });
      });
    } catch (error) {
      showError("Error al cargar Google Sign-In");
      return false;
    }
  };

  return {
    signInWithGoogle,
    renderGoogleButton,
    isLoading: readonly(isLoading),
  };
};
