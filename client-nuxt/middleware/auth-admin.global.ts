import { useAdminStore } from "~/stores/admin";

export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
    if (import.meta.client) {
      const adminStore = useAdminStore();
      adminStore.loadFromLocalStorage();

      if (!adminStore.token) {
        return navigateTo("/admin/login");
      }
    }
  }
});
