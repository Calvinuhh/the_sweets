import { useAdminStore } from "~/stores/admin";

export default defineNuxtRouteMiddleware((to) => {
  if (
    import.meta.client &&
    to.path.startsWith("/admin") &&
    to.path !== "/admin/login"
  ) {
    const adminStore = useAdminStore();
    adminStore.loadFromLocalStorage();

    if (!adminStore.token || !adminStore.checkTokenExpiration()) {
      return navigateTo("/admin/login");
    }
  }
});
