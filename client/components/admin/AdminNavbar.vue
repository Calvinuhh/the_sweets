<template>
  <nav class="flex flex-col sm:flex-row items-center bg-gray-800 p-4 relative">
    <div class="w-full flex justify-center sm:static sm:left-0 sm:transform-none">
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink v-for="item in navItems" :key="item.label" :to="item.to"
          class="px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-center" :class="{
            'bg-blue-600 text-white': isActive(item.to),
            'bg-gray-600 text-gray-200 hover:bg-gray-500': !isActive(item.to),
          }">
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>
    <div class="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-auto flex justify-center sm:justify-end">
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