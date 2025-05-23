<template>
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-bold mb-2 text-[#6b3e26]">Crea tu cuenta</h1>
            <p class="text-gray-600 mb-8 text-center max-w-md">
                Únete a The Sweet S y disfruta de nuestros deliciosos postres artesanales.
            </p>

            <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <RegisterForm />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import RegisterForm from '~/components/clients/RegisterForm.vue';

definePageMeta({
    layout: "clients",
    middleware: 'auth-guest'
});
</script>