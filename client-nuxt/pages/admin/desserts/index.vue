<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Administración de Postres</h1>
      <NuxtLink to="/admin/desserts/new"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
        Crear Nuevo Postre
      </NuxtLink>
    </div>

    <DessertsTable />
  </div>
</template>

<script setup lang="ts">

import DessertsTable from "~/components/admin/desserts/DessertsTable.vue";

definePageMeta({
  layout: 'admin',
})

</script>