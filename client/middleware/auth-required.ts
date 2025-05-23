export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const usersStore = useUsersStore();
    usersStore.loadFromLocalStorage();

    if (!usersStore.isAuthenticated) {
      return navigateTo("/user/login");
    }
  }
});
