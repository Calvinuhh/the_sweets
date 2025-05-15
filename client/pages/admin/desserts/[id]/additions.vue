<template>
    <div class="container mx-auto px-4 py-8 max-w-4xl mt-[100px]">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Gestionar Adiciones del Postre</h1>
            <NuxtLink :to="`/admin/desserts/${route.params.id}`"
                class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 transition">
                <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
                Volver
            </NuxtLink>
        </div>
        <div v-if="loading" class="flex justify-center py-10">
            <Spinner />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 class="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-500" />
                    Adiciones asignadas
                </h2>
                <ul class="border rounded-lg p-3 min-h-[200px] bg-blue-50 shadow-sm">
                    <li v-for="addition in assignedAdditions" :key="addition._id"
                        class="flex justify-between items-center mb-2 px-2 py-1 rounded hover:bg-blue-100 transition">
                        <span class="font-medium text-gray-700">{{ addition.name }}</span>
                        <span class="text-xs text-gray-500 ml-2">({{ formatType(addition.type) }})</span>
                        <button @click="removeAddition(addition._id)"
                            class="ml-4 text-red-600 hover:text-red-800 hover:underline text-xs font-semibold transition">
                            Quitar
                        </button>
                    </li>
                    <li v-if="assignedAdditions.length === 0" class="text-gray-400 text-sm text-center py-4">
                        Sin adiciones asignadas
                    </li>
                </ul>
            </div>
            <div>
                <h2 class="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
                    <Icon name="heroicons:plus-circle" class="w-5 h-5 text-green-500" />
                    Adiciones disponibles
                </h2>
                <ul class="border rounded-lg p-3 min-h-[200px] bg-green-50 shadow-sm">
                    <li v-for="addition in availableAdditions" :key="addition._id"
                        class="flex justify-between items-center mb-2 px-2 py-1 rounded hover:bg-green-100 transition">
                        <span class="font-medium text-gray-700">{{ addition.name }}</span>
                        <span class="text-xs text-gray-500 ml-2">({{ formatType(addition.type) }})</span>
                        <button @click="addAddition(addition._id)"
                            class="ml-4 text-green-700 hover:text-green-900 hover:underline text-xs font-semibold transition">
                            Agregar
                        </button>
                    </li>
                    <li v-if="availableAdditions.length === 0" class="text-gray-400 text-sm text-center py-4">
                        No hay más adiciones
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex justify-end mt-8">
            <button @click="saveAdditions" :disabled="saving"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow transition flex items-center">
                <Spinner v-if="saving" class="inline w-4 h-4 mr-2" />
                <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useAdditionsStore } from '~/stores/additions';
import { useDessertsStore } from '~/stores/desserts';
import Spinner from '~/components/ui/Spinner.vue';
import { useAlert } from '~/composables/useAlert';

const route = useRoute();
const router = useRouter();
const alert = useAlert();
const additionsStore = useAdditionsStore();
const dessertsStore = useDessertsStore();

const loading = ref(true);
const saving = ref(false);
const assignedIds = ref<string[]>([]);

const formatType = (type: string) => {
    const map: Record<string, string> = {
        cobertura: 'Cobertura',
        relleno: 'Relleno',
        topping: 'Topping',
        decoracion: 'Decoración'
    };
    return map[type] || type;
};

const assignedAdditions = computed(() =>
    additionsStore.additions.filter(a => assignedIds.value.includes(a._id))
);
const availableAdditions = computed(() =>
    additionsStore.additions.filter(a => !assignedIds.value.includes(a._id))
);

const fetchData = async () => {
    loading.value = true;
    try {
        const dessertId = route.params.id as string;
        await Promise.all([
            dessertsStore.fetchDessertById(dessertId),
            additionsStore.fetchAdditions()
        ]);
        if (!dessertsStore.currentDessert) throw new Error('No se encontró el postre');
        assignedIds.value = dessertsStore.currentDessert.additions?.map((a: any) => typeof a === 'string' ? a : a._id) || [];
    } catch (err: any) {
        alert.showError(err.message);
    } finally {
        loading.value = false;
    }
};

const addAddition = (id: string) => {
    if (!assignedIds.value.includes(id)) assignedIds.value.push(id);
};
const removeAddition = (id: string) => {
    assignedIds.value = assignedIds.value.filter(aid => aid !== id);
};

const saveAdditions = async () => {
    saving.value = true;
    try {
        const dessertId = route.params.id as string;
        await dessertsStore.updateDessertAdditions(dessertId, assignedIds.value);
        alert.showSuccess('Adiciones actualizadas correctamente');
        router.push(`/admin/desserts/${dessertId}`);
    } catch (err: any) {
        alert.showError('Error al guardar las adiciones');
    } finally {
        saving.value = false;
    }
};

onMounted(fetchData);
</script>