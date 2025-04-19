<template>
  <button @click="logout"
    class="px-4 py-2 rounded-lg font-semibold transition-colors duration-200 bg-red-600 text-white hover:bg-red-500 ml-auto flex items-center gap-2">
    <Icon name="heroicons:arrow-left-on-rectangle" class="w-5 h-5" />
    <span>Cerrar sesión</span>
  </button>
</template>

<script setup lang="ts">
const logout = async () => {
  const adminStore = useAdminStore();

  await adminStore.logout();

};
</script>