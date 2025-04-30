<template>
    <Header />
    <Navbar />
    <slot />
</template>

<script lang="ts" setup>
import Header from '~/components/clients/Header.vue';
import Navbar from '~/components/clients/Navbar.vue';

</script>
