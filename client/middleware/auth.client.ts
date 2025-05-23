import { useUsersStore } from "~/stores/users";

export default defineNuxtRouteMiddleware((to, from) => {
  const usersStore = useUsersStore();
  usersStore.loadFromLocalStorage();
});
