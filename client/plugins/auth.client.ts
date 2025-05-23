export default defineNuxtPlugin(() => {
  const usersStore = useUsersStore();

  usersStore.loadFromLocalStorage();
});
