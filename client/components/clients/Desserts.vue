<template>
    <div
        class="w-full min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f6f1] to-[#f3e9dd] py-10">
        <div v-if="loading" class="flex justify-center items-center h-64 w-full">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <div v-else-if="!desserts.length" class="p-4 text-gray-600 w-full text-center">
            No hay postres disponibles.
        </div>
        <div v-else
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-[1400px] px-4 transition-all duration-300">
            <DessertCard v-for="dessert in desserts" :key="dessert._id" :dessert="dessert" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onActivated } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientDessertsStore } from '~/stores/clientDesserts'
import DessertCard from './DessertCard.vue'

const clientDessertsStore = useClientDessertsStore()
const { desserts, loading, error } = storeToRefs(clientDessertsStore)
const { loadDesserts } = clientDessertsStore

onMounted(async () => {
    await loadDesserts()
})
onActivated(async () => {
    if (!desserts.value.length && !loading.value) {
        await loadDesserts()
    }
})
</script>