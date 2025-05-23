<template>
    <div class="container mx-auto px-4 py-8 max-w-4xl mt-[60px]">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Editar Adición</h1>
        </div>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-8">
                <div v-if="loading" class="text-center py-12">
                    <Spinner class="mx-auto h-12 w-12" />
                </div>

                <div v-else-if="error" class="text-center py-12">
                    <Icon name="heroicons:exclamation-circle" class="mx-auto h-12 w-12 text-red-500" />
                    <p class="mt-4 text-red-500 text-lg">{{ error }}</p>
                </div>

                <form v-else-if="addition" @submit.prevent="handleSubmit" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <input v-model="formData.name" type="text" id="name" name="name" required
                                class="w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>

                        <div>
                            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                            <input v-model.number="formData.price" type="number" id="price" name="price" min="1000"
                                step="50" required
                                class="w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>

                        <div>
                            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select v-model="formData.type" id="type" name="type" required
                                class="w-full h-[40px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="cobertura">Cobertura</option>
                                <option value="relleno">Relleno</option>
                                <option value="topping">Topping</option>
                                <option value="decoracion">Decoración</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button type="button" @click="navigateTo('/admin/additions')"
                            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="isSubmitting || !hasChanges"
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isSubmitting">
                                <Spinner class="h-4 w-4 inline" />
                                Actualizando...
                            </span>
                            <span v-else>Actualizar Adición</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UpdateAddition, AdditionType } from '~/interfaces/Addition';
import type Addition from '~/interfaces/Addition';
import { useAdditionsStore } from '~/stores/additions';
import { useAlert } from '~/composables/useAlert';
import Spinner from '~/components/ui/Spinner.vue';

const route = useRoute();
const additionsStore = useAdditionsStore();
const alert = useAlert();

const loading = ref(true);
const error = ref<string | null>(null);
const isSubmitting = ref(false);
const addition = ref<Addition | null>(null);

const formData = reactive<UpdateAddition>({
    name: '',
    price: 1000,
    type: 'cobertura'
});
const formKeys = ['name', 'price', 'type'] as const;

const hasChanges = computed(() => {
    if (!addition.value) return false;

    return formKeys.some(key => {
        const formValue = formData[key];
        const originalValue = addition.value?.[key];

        if (key === 'price') {
            return Number(formValue) !== Number(originalValue);
        }

        return formValue !== originalValue;
    });
});

onMounted(async () => {
    try {
        const additionId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
        if (!additionId) throw new Error('ID de adición no válido');

        await additionsStore.fetchAdditionById(additionId);
        if (!additionsStore.currentAddition) throw new Error('Adición no encontrada');

        Object.assign(formData, {
            name: additionsStore.currentAddition.name,
            price: additionsStore.currentAddition.price,
            type: additionsStore.currentAddition.type
        });

        addition.value = additionsStore.currentAddition;
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : 'Error al cargar la adición';
        alert.showError(error.value);
    } finally {
        loading.value = false;
    }
});

const handleSubmit = async () => {
    if (!hasChanges.value) {
        alert.showError('Debes realizar al menos un cambio para actualizar');
        return;
    }

    try {
        isSubmitting.value = true;
        const changes: UpdateAddition = {};

        if (formData.name !== addition.value?.name) {
            changes.name = formData.name;
        }

        if (formData.price !== addition.value?.price) {
            changes.price = typeof formData.price === 'string'
                ? Number(formData.price)
                : formData.price;
        }

        if (formData.type !== addition.value?.type) {
            changes.type = formData.type as AdditionType;
        }

        await additionsStore.updateAddition(
            route.params.id as string,
            changes
        );

        alert.showSuccess('Adición actualizada correctamente');
        navigateTo(`/admin/additions`);
    } catch (err: unknown) {
        const message = err instanceof Error
            ? err.message
            : 'Error al actualizar la adición';
        alert.showError(message);
    } finally {
        isSubmitting.value = false;
    }
};


onUnmounted(() => {
    additionsStore.clearCurrentAddition();
});
</script>