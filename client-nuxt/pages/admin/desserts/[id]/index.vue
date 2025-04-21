<template>
    <div class="container mx-auto px-4 py-8 max-w-4xl mt-[60px]">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Detalle del Postre</h1>
            <NuxtLink to="/admin/desserts"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                <Icon name="heroicons:arrow-left" class="h-4 w-4 mr-1" />
                Volver a la lista
            </NuxtLink>
        </div>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-8">
                <div v-if="loading" class="text-center py-12">
                    <Spinner class="mx-auto h-12 w-12" />
                    <p class="mt-4 text-gray-600">Cargando detalles del postre...</p>
                </div>

                <div v-else-if="error" class="text-center py-12">
                    <Icon name="heroicons:exclamation-circle" class="mx-auto h-12 w-12 text-red-500" />
                    <p class="mt-4 text-red-500 text-lg">{{ error }}</p>
                    <button @click="reloadPage" class="mt-4 text-blue-600 hover:text-blue-800">
                        Intentar de nuevo
                    </button>
                </div>

                <div v-else-if="dessert" class="space-y-8">
                    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div class="w-full md:w-1/3 lg:w-2/5">
                            <div v-if="dessert.picture" class="relative rounded-xl overflow-hidden shadow-md">
                                <img :src="getImageUrl(dessert.picture)" :alt="dessert.name"
                                    class="w-full h-64 md:h-80 object-cover" @error="handleImageError">
                            </div>
                            <div v-else
                                class="h-64 md:h-80 rounded-xl bg-gray-100 flex items-center justify-center shadow-md">
                                <div class="text-center p-4">
                                    <Icon name="heroicons:photo" class="mx-auto h-12 w-12 text-gray-400" />
                                    <span class="text-gray-500 text-sm mt-2 block">Sin imagen asignada</span>
                                </div>
                            </div>
                        </div>

                        <div class="w-full md:w-2/3 lg:w-3/5 space-y-4">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">{{ dessert.name }}</h2>
                                <p class="text-gray-600 mt-1">
                                    {{ dessert.portions }} porciones • {{ dessert.levels }} niveles
                                </p>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <p class="text-sm font-medium text-gray-500">Tipo</p>
                                    <p class="mt-1 text-gray-900">{{ formatType(dessert.type) }}</p>
                                </div>

                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <p class="text-sm font-medium text-gray-500">Precio</p>
                                    <p class="mt-1 text-gray-900">${{ dessert.price.toLocaleString() }}</p>
                                </div>

                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <p class="text-sm font-medium text-gray-500">Sabor</p>
                                    <p class="mt-1 text-gray-900 capitalize">{{ dessert.flavor }}</p>
                                </div>

                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <p class="text-sm font-medium text-gray-500">Estado</p>
                                    <p class="mt-1">
                                        <span :class="{
                                            'bg-green-100 text-green-800': dessert.active,
                                            'bg-red-100 text-red-800': !dessert.active
                                        }" class="px-3 py-1 rounded-full text-xs font-semibold">
                                            {{ dessert.active ? 'Activo' : 'Inactivo' }}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div v-if="dessert.additions && dessert.additions.length > 0" class="mt-4">
                                <h3 class="text-lg font-medium text-gray-800 mb-2">Adiciones</h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div v-for="addition in dessert.additions" :key="addition._id"
                                        class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                                        <p class="font-medium text-gray-800">{{ addition.name }}</p>
                                        <p class="text-gray-600">${{ addition.price.toLocaleString() }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-gray-200">
                        <NuxtLink v-if="dessert._id" :to="`/admin/desserts/${dessert._id}/edit`"
                            class="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Icon name="heroicons:pencil" class="h-5 w-5 mr-2" />
                            Editar Postre
                        </NuxtLink>

                        <button @click="handleUploadImage"
                            class="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Icon name="heroicons:photo" class="h-5 w-5 mr-2" />
                            Subir Imagen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Dessert } from '~/interfaces/Dessert';
import { useDessertsStore } from '~/stores/desserts';
import Spinner from '~/components/ui/Spinner.vue';

const route = useRoute();
const dessertsStore = useDessertsStore();
const alert = useAlert();

const loading = ref(true);
const error = ref<string | null>(null);
const imageError = ref(false);

const dessert = computed<Dessert | null>(() => dessertsStore.currentDessert);

const formatType = (type: string) => {
    const typesMap: Record<string, string> = {
        torta: 'Torta',
        postre_frio: 'Postre Frío',
        rollo: 'Rollo',
        galleta: 'Galleta'
    };
    return typesMap[type] || type;
};

const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${useRuntimeConfig().public.SERVER_URL}${imagePath}`;
};

const handleImageError = () => {
    imageError.value = true;
};

const reloadPage = () => {
    window.location.reload();
};

onMounted(async () => {
    try {
        const dessertId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
        if (!dessertId) {
            throw new Error('ID de postre no válido');
        }
        await dessertsStore.fetchDessertById(dessertId);
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : 'Error desconocido al cargar el postre';
        alert.showError(error.value);
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    dessertsStore.clearCurrentDessert();
});

const handleUploadImage = () => {
    if (!dessert.value?._id) return;
    alert.showSuccess('Funcionalidad de subir imagen será implementada');
};
</script>
