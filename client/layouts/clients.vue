<template>
    <Header />
    <Navbar />
    <slot />
    <Footer />
</template>

<script lang="ts" setup>
import Header from '~/components/clients/Header.vue';
import Navbar from '~/components/clients/Navbar.vue';
import Footer from '~/components/clients/Footer.vue';

</script>
