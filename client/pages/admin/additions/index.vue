<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Administración de Adiciones</h1>
      <NuxtLink to="/admin/additions/new"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
        Crear Nueva Adición
      </NuxtLink>
    </div>

    <AdditionTable />
  </div>
</template>

<script setup lang="ts">
import AdditionTable from "~/components/admin/additions/AdditionTable.vue";

definePageMeta({
  layout: 'admin'
});
</script>