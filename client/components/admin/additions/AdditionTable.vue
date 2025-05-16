<template>
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b">
            <label class="block text-sm font-medium text-gray-700 mb-1">Filtrar por tipo:</label>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <select v-model="selectedType" class="border rounded-md px-3 py-2 text-sm w-full sm:w-64">
                    <option value="">Todos los tipos ({{ additionsStore.additions.length }})</option>
                    <option v-for="type in additionTypes" :key="type" :value="type">
                        {{ formatType(type) }} ({{additionsStore.additions.filter(a => a.type === type).length}})
                    </option>
                </select>
                <button @click="refreshAdditions"
                    class="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm w-full sm:w-auto">
                    <Icon name="heroicons:arrow-path" class="h-5 w-5" />
                </button>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-200">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="additionsStore.loading || !Array.isArray(additionsStore.additions)">
                        <td colspan="4" class="px-6 py-4 text-center">
                            <Spinner class="mx-auto" />
                        </td>
                    </tr>
                    <tr v-else-if="additionsStore.error">
                        <td colspan="4" class="px-6 py-4 text-center text-red-500">
                            {{ additionsStore.error }}
                        </td>
                    </tr>
                    <tr v-else-if="filteredAdditions.length === 0">
                        <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                            No se encontraron adiciones
                        </td>
                    </tr>
                    <tr v-for="addition in filteredAdditions" :key="addition._id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">
                                {{ addition.name }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ formatType(addition.type) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${{ addition.price.toLocaleString() }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <NuxtLink :to="`/admin/additions/${addition._id}/edit`"
                                class="text-blue-600 hover:text-blue-900 mr-3">
                                Editar
                            </NuxtLink>
                            <button @click="handleDelete(addition._id, addition.name)"
                                class="text-red-600 hover:text-red-900">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAdditionsStore } from '~/stores/additions';
import Spinner from '~/components/ui/Spinner.vue';
import { useAlert } from '~/composables/useAlert';

const alert = useAlert();
const additionsStore = useAdditionsStore();

const selectedType = ref('');
const additionTypes = ['cobertura', 'relleno', 'topping', 'decoracion'];

const filteredAdditions = computed(() => {
    if (!additionsStore.additions || !Array.isArray(additionsStore.additions)) {
        return [];
    }
    if (!selectedType.value) return additionsStore.additions;
    return additionsStore.additions.filter(a => a.type === selectedType.value);
});

const formatType = (type: string) => {
    const typesMap: Record<string, string> = {
        cobertura: 'Cobertura',
        relleno: 'Relleno',
        topping: 'Topping',
        decoracion: 'Decoración'
    };
    return typesMap[type] || type;
};

const updateAdditions = () => {
    additionsStore.fetchAdditions(selectedType.value);
};

const refreshAdditions = () => {
    selectedType.value = '';
    additionsStore.fetchAdditions();
};

const handleDelete = async (id: string, name: string) => {
    await alert.confirmDelete({
        itemName: name,
        deleteFn: async () => {
            await additionsStore.deleteAddition(id);
        }
    });
};

onMounted(() => {
    additionsStore.fetchAdditions();
});
</script>