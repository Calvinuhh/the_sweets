<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="form.name" type="text" id="name" required
                class="mt-1 block w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
        </div>

        <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Precio</label>
            <input v-model.number="form.price" type="number" id="price" min="1000" step="50" required
                class="mt-1 block w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
        </div>

        <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Tipo</label>
            <select v-model="form.type" id="type" required
                class="mt-1 block w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="torta">Torta</option>
                <option value="postre_frio">Postre Frío</option>
                <option value="rollo">Rollo</option>
                <option value="galleta">Galleta</option>
            </select>
        </div>

        <div>
            <label for="flavor" class="block text-sm font-medium text-gray-700">Sabor</label>
            <select v-model="form.flavor" id="flavor" required
                class="mt-1 block w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="chocolate">Chocolate</option>
                <option value="vainilla">Vainilla</option>
                <option value="caramelo">Caramelo</option>
            </select>
        </div>

        <div class="flex justify-end space-x-3">
            <button type="button" @click="$emit('cancel')"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cancelar
            </button>
            <button type="submit" :disabled="dessertsStore.loading"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="dessertsStore.loading">
                    <Spinner class="h-4 w-4" />
                </span>
                <span v-else>Guardar</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useDessertsStore } from '~/stores/desserts';
import Spinner from '~/components/ui/Spinner.vue';

const dessertsStore = useDessertsStore();
const alert = useAlert();

const form = reactive({
    name: '',
    price: 0,
    type: 'torta' as 'torta' | 'postre_frio' | 'rollo' | 'galleta',
    flavor: 'chocolate' as 'chocolate' | 'vainilla' | 'caramelo',
});

const emit = defineEmits(['success', 'cancel']);

const handleSubmit = async () => {
    try {
        await dessertsStore.createNewDessert(form);
        emit('success');
    } catch (error: any) {
        alert.showError(error.message || 'Error al crear el postre');
    }
};
</script>