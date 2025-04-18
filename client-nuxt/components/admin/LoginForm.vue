<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="bg-gray-700 p-8 rounded-2xl shadow-md w-full max-w-md text-white">
      <h1 class="text-2xl font-bold mb-6 text-center">Login Administrador</h1>

      <form @submit.prevent="login" class="space-y-4">
        <input v-model="username" type="text" placeholder="Username" class="w-full px-4 py-2 border rounded-lg text-black"
          required />

        <input v-model="password" type="password" placeholder="Contraseña" class="w-full px-4 py-2 border rounded-lg text-black"
          required />

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '~/stores/admin'

const username = ref('')
const password = ref('')
const adminStore = useAdminStore()

async function login() {

  const success = await adminStore.login(username.value, password.value)

  if (success) {
    navigateTo('/admin/desserts')
  }
}
</script>

<style scoped></style>
