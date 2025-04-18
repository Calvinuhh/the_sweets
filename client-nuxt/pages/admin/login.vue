<template>
  <LoginForm />
</template>

<script lang="ts" setup>

import LoginForm from "~/components/admin/LoginForm"

definePageMeta({
  middleware: () => {
    if (import.meta.client) {
      const token = localStorage.getItem('token');
      if (token && useRoute().path === '/admin/login') {
        return navigateTo('/admin/desserts');
      }
    }
  }
});
</script>
