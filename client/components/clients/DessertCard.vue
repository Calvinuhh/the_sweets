<template>
    <div
        class="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 animate-fadeIn">
        <div
            class="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
            <span>🍰</span>
            {{ dessert.type.replace("_", " ") }}
        </div>
        <div class="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img v-if="dessert.picture" :src="`${SERVER_URL}${dessert.picture}`" :alt="dessert.name"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105 border-b-2 border-[#c3ac83]" />
            <div v-else class="text-gray-400">Sin imagen</div>
        </div>
        <div class="p-5">
            <h3 class="text-xl font-bold text-gray-800 mb-2 truncate">{{ dessert.name }}</h3>
            <p class="text-gray-600 mb-4">
                <span class="font-semibold text-lg">${{ dessert.price.toLocaleString() }}</span>
            </p>
            <button @click="handleViewDetail(dessert._id)"
                class="w-full py-2 px-4 bg-gradient-to-r from-pink-400 to-yellow-400 hover:from-pink-500 hover:to-yellow-500 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
                Ver Detalles
                <span>→</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Dessert } from '~/interfaces/Dessert'
import { useRouter } from 'vue-router'

defineProps<{ dessert: Dessert }>()

const { public: { SERVER_URL } } = useRuntimeConfig()
const router = useRouter()

function handleViewDetail(id: string) {
    router.push(`/products/${id}`)
}
</script>