<template>
  <nav class="flex gap-2 bg-gray-800 p-4 justify-center">
    <NuxtLink
      v-for="item in navItems"
      :key="item.label"
      :to="item.to"
      class="px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
      :class="{
        'bg-blue-600 text-white': isActive(item.to),
        'bg-gray-600 text-gray-200 hover:bg-gray-500': !isActive(item.to),
      }"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Postres', to: '/admin/desserts' },
  { label: 'Addiciones', to: '/admin/additions' },
  { label: 'Solicitudes', to: '/admin/requests' },
  { label: 'Órdenes', to: '/admin/orders' },
]

function isActive(path: string) {
  return route.path === path
}
</script>
