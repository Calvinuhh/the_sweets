<template>
  <LoginForm />
</template>

<script lang="ts" setup>
import LoginForm from "~/components/admin/LoginForm"
import { onMounted } from 'vue'

onMounted(() => {
  const token = localStorage.getItem('token');
  const expiration = localStorage.getItem('tokenExpiration');

  if (token && expiration) {
    const currentTime = new Date().getTime();
    const expirationTime = parseInt(expiration);

    if (currentTime < expirationTime && window.location.pathname === '/admin/login') {
      navigateTo('/admin/desserts');
    }
  }
});
</script>
