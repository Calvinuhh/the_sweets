<template>
    <div class="container mx-auto px-4 py-8 mt-[50px]">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Nueva Adición</h1>
            <NuxtLink to="/admin/additions" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Volver a la lista
            </NuxtLink>
        </div>

        <div class="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <AdditionForm @success="handleSuccess" @cancel="navigateTo('/admin/additions')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import AdditionForm from '~/components/admin/additions/AdditionForm.vue';

const handleSuccess = () => {
    navigateTo('/admin/additions');
};
</script>