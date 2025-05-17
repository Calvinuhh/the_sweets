<template>
    <div class="max-w-5xl mx-auto py-10 px-4 mb-[200px]">
        <button @click="goBack" class="flex items-center text-blue-700 font-semibold mb-6 hover:underline">
            <span class="mr-2 text-xl">← Volver</span>
        </button>
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <div v-else-if="error" class="text-red-600 text-center my-8">{{ error }}</div>
        <div v-else-if="dessert"
            class="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden animate-fadeIn">
            <div class="md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
                <img v-if="dessert.picture" :src="`${SERVER_URL}${dessert.picture}`" :alt="dessert.name"
                    class="rounded-xl object-cover max-h-96 w-full" />
                <div v-else class="text-gray-400 text-center">Sin imagen</div>
            </div>
            <div class="md:w-1/2 p-8 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ dessert.name }}</h1>
                    <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {{ dessert.type.replace('_', ' ') }}
                    </span>
                </div>
                <div class="flex flex-wrap gap-6 text-gray-700 text-base">
                    <div>
                        <span class="font-semibold">Sabor:</span> {{ dessert.flavor }}
                    </div>
                    <div v-if="!isRollo && !isGalleta">
                        <span class="font-semibold">Niveles:</span> {{ dessert.levels }}
                    </div>
                    <div>
                        <span class="font-semibold">Porciones totales:</span> {{ dessert.portions }}
                    </div>
                </div>
                <div class="my-2">
                    <span class="text-2xl font-bold text-gray-900">Precio: ${{ dessert.price.toLocaleString() }}</span>
                </div>
                <div v-if="isRollo || isGalleta">
                    <label class="block font-semibold mb-2 text-[#6b3e26]">Cantidad de unidades</label>
                    <select v-model="selectedUnits" class="w-full border rounded p-2">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">+3 (Conversar con The Sweet S para confirmación)</option>
                    </select>
                </div>
                <template v-else>
                    <div>
                        <label class="block font-semibold mb-2 text-[#6b3e26]">Tipo de compra</label>
                        <select v-model="purchaseType" class="w-full border rounded p-2">
                            <option value="unidad">Por unidad</option>
                            <option value="porciones">Por porciones</option>
                        </select>
                    </div>
                    <div v-if="purchaseType === 'unidad'">
                        <label class="block font-semibold mb-2 text-[#6b3e26]">Cantidad de unidades</label>
                        <select v-model="selectedUnits" class="w-full border rounded p-2">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">+3 (Conversar con The Sweet S para confirmación)</option>
                        </select>
                    </div>
                    <div v-if="purchaseType === 'porciones' && dessert.portions && dessert.portions > 1">
                        <label class="block font-semibold mb-2 text-[#6b3e26]">Cantidad de porciones</label>
                        <select v-model="selectedPortions" class="w-full border rounded p-2">
                            <option v-for="n in maxPorciones" :key="n" :value="n">{{ n }}</option>
                        </select>
                    </div>
                    <div v-if="purchaseType !== 'porciones'">
                        <label class="block font-semibold mb-2 text-[#6b3e26]">
                            <input type="checkbox" v-model="showLevels" class="mr-2 accent-pink-500" />
                            ¿Quieres niveles en tu torta?
                        </label>
                        <div v-if="showLevels">
                            <label class="block font-semibold mb-2 text-[#6b3e26]">Niveles</label>
                            <select v-model="selectedLevel" class="w-full border rounded p-2">
                                <option value="2">2</option>
                                <option value="+3">+3 (Conversar con The Sweet S para confirmación)</option>
                            </select>
                        </div>
                    </div>
                </template>
                <div v-if="dessert.additions && dessert.additions.length">
                    <label class="block font-semibold mb-2 text-[#6b3e26]">Adiciones disponibles</label>
                    <div class="flex flex-col gap-2">
                        <label v-for="addition in dessert.additions" :key="addition._id"
                            class="flex items-center gap-2">
                            <input type="checkbox" :value="addition._id" v-model="selectedAdditions"
                                class="accent-pink-500" />
                            <span>{{ addition.name }} (+${{ addition.price }})</span>
                        </label>
                    </div>
                </div>
                <div class="flex items-center justify-between mt-6">
                    <span class="text-xl font-bold text-[#6b3e26]">
                        Total: ${{ total.toLocaleString() }}<span v-if="showLevels">+</span>
                    </span>
                    <button
                        class="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                        @click="handleAddToCart">
                        Agregar al carrito
                    </button>
                </div>
                <div v-if="showLevels" class="flex items-center mt-2 text-sm text-yellow-700">
                    <span class="mr-1"
                        title="El precio final puede variar según la cantidad de niveles y detalles seleccionados.">ℹ️</span>
                    El precio puede variar según la cantidad de niveles seleccionados.
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientsDessertsApi } from '~/composables/useClientsDessertsApi'
import { addToCart } from '~/stores/cart'
import { useAlert } from '~/composables/useAlert'
import type { Dessert } from '~/interfaces/Dessert'
import type { CartItem } from '~/interfaces/Cart'

const { public: { SERVER_URL } } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const { fetchDessertById } = useClientsDessertsApi()

const dessert = ref<Dessert | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const purchaseType = ref<'unidad' | 'porciones'>('unidad')
const selectedAdditions = ref<string[]>([])

const showLevels = ref(false)
const selectedLevel = ref<string>('1')

const selectedUnits = ref<string>('1')
const selectedPortions = ref<number>(1)

const isRollo = computed(() => dessert.value?.type?.toLowerCase() === 'rollo')
const isGalleta = computed(() => dessert.value?.type?.toLowerCase() === 'galleta')

const alert = useAlert()

watchEffect(() => {
    if (isRollo.value || isGalleta.value) {
        purchaseType.value = 'unidad'
        showLevels.value = false
    }
})

const maxPorciones = computed(() => {
    if (dessert.value?.portions && dessert.value.portions > 1) {
        return Array.from({ length: dessert.value.portions - 1 }, (_, i) => i + 1)
    }
    return []
})

const basePrice = computed(() => {
    const d = dessert.value;
    if (!d) return 0;
    if (purchaseType.value === 'unidad') {
        if (selectedUnits.value === '+3') return 0;
        return d.price;
    } else if (purchaseType.value === 'porciones') {
        if (!d.portions || !selectedPortions.value) return 0;
        return Math.round(d.price / d.portions);
    }
    return 0;
});

const additionsTotal = computed(() => {
    const d = dessert.value;
    if (!d || !d.additions || !selectedAdditions.value.length) return 0;
    const selected = d.additions.filter(a => selectedAdditions.value.includes(a._id));
    return selected.reduce((sum, a) => sum + a.price, 0);
});

const quantity = computed(() => {
    if (purchaseType.value === 'porciones') {
        return Number(selectedPortions.value);
    }
    return selectedUnits.value === '+3' ? 0 : Number(selectedUnits.value);
});

const total = computed(() => {
    return (basePrice.value + additionsTotal.value) * quantity.value;
});

function goBack() {
    router.back()
}

function handleAddToCart() {
    if (!dessert.value) return;

    if (selectedUnits.value === '+3' || (purchaseType.value === 'porciones' && !selectedPortions.value)) {
        alert.showError('Por favor, contacta a The Sweet S para confirmar cantidades mayores.');
        return;
    }

    const d = dessert.value;
    const selected = d.additions && selectedAdditions.value.length
        ? d.additions.filter(a => selectedAdditions.value.includes(a._id)).map(a => ({
            id: a._id,
            name: a.name,
            price: a.price
        }))
        : [];

    const item: CartItem = {
        productId: d._id,
        name: d.name,
        price: basePrice.value,
        quantity: quantity.value,
        imageUrl: d.picture ? `${SERVER_URL}${d.picture}` : undefined,
        additions: selected.length ? selected : undefined
    };

    addToCart(item);
    alert.showSuccess('¡Postre agregado al carrito!');
}

onMounted(async () => {
    loading.value = true
    try {
        const data = await fetchDessertById(route.params.id as string)
        if (typeof data === 'string') {
            error.value = data
        } else {
            dessert.value = data as Dessert
        }
    } catch (err: any) {
        error.value = err.message || 'Error al cargar el postre'
    } finally {
        loading.value = false
    }
})

definePageMeta({
    layout: "clients"
})
</script>