<template>
  <nav class="flex flex-col sm:flex-row items-center bg-gray-800 p-4">
    <div class="absolute left-1/2 transform -translate-x-1/2">
      <div class="flex gap-2">
        <NuxtLink v-for="item in navItems" :key="item.label" :to="item.to"
          class="px-4 py-2 rounded-lg font-semibold transition-colors duration-200" :class="{
            'bg-blue-600 text-white': isActive(item.to),
            'bg-gray-600 text-gray-200 hover:bg-gray-500': !isActive(item.to),
          }">
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>

    <div class="ml-auto">
      <LogoutBtn class="border-l border-gray-600 pl-4" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import LogoutBtn from "~/components/admin/LogoutBtn.vue"
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Postres', to: '/admin/desserts' },
  { label: 'Addiciones', to: '/admin/additions' },
  { label: 'Solicitudes', to: '/admin/requests' },
  { label: 'Órdenes', to: '/admin/orders' },
  { label: 'Configuraciòn', to: '/admin/config' }
]

function isActive(path: string) {
  return route.path === path
}
</script>