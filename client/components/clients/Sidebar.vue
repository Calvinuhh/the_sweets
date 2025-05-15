<template>
    <aside class="w-full md:w-64 bg-white rounded-xl shadow p-6 mb-8 md:mb-0">
        <h3 class="text-lg font-bold mb-4 text-[#6b3e26]">Filtrar postres</h3>
        <div class="mb-6">
            <label class="block font-semibold mb-2 text-[#6b3e26]">Tipo</label>
            <select v-model="selectedType" class="w-full border rounded p-2">
                <option value="">Todos</option>
                <option v-for="type in allTypes" :key="type" :value="type">
                    {{ type.replace('_', ' ') }}
                </option>
            </select>
        </div>
        <div>
            <label class="block font-semibold mb-2 text-[#6b3e26]">Ordenar por precio</label>
            <select v-model="selectedPriceOrder" class="w-full border rounded p-2">
                <option value="">Sin orden</option>
                <option value="ASC">Menor a mayor</option>
                <option value="DESC">Mayor a menor</option>
            </select>
        </div>
        <button @click="applyFilters"
            class="mt-6 w-full bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-bold py-2 rounded-lg shadow hover:from-pink-500 hover:to-yellow-500 transition">
            Aplicar filtros
        </button>
        <button @click="resetFilters" class="mt-2 w-full text-[#6b3e26] underline text-sm">
            Limpiar filtros
        </button>
    </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useClientDessertsStore } from '~/stores/clientDesserts'

const allTypes = [
    'torta',
    'postre_frio',
    'rollo',
    'galleta'
]

const clientDessertsStore = useClientDessertsStore()

const selectedType = ref('')
const selectedPriceOrder = ref('')

function applyFilters() {
    const params: { type?: string; price?: string } = {}
    if (selectedType.value) params.type = selectedType.value
    if (selectedPriceOrder.value) params.price = selectedPriceOrder.value
    clientDessertsStore.loadDesserts(params)
}

function resetFilters() {
    selectedType.value = ''
    selectedPriceOrder.value = ''
    clientDessertsStore.loadDesserts()
}
</script>