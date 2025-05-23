<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl mt-[60px]">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Editar Postre</h1>
      <NuxtLink :to="`/admin/desserts/${dessert?._id}`" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
        Volver al detalle
      </NuxtLink>
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

        <form v-else-if="dessert" @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input v-model="formData.name" type="text" id="name" name="name" required
                class="w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input v-model.number="formData.price" type="number" id="price" name="price" min="1000" step="50" required
                class="w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select v-model="formData.type" id="type" name="type" required
                class="w-full h-[40px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="torta">Torta</option>
                <option value="postre_frio">Postre Frío</option>
                <option value="rollo">Rollo</option>
                <option value="galleta">Galleta</option>
              </select>
            </div>

            <div>
              <label for="flavor" class="block text-sm font-medium text-gray-700 mb-1">Sabor *</label>
              <select v-model="formData.flavor" id="flavor" name="flavor" required
                class="w-full h-[40px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="chocolate">Chocolate</option>
                <option value="vainilla">Vainilla</option>
                <option value="caramelo">Caramelo</option>
              </select>
            </div>

            <div>
              <label for="portions" class="block text-sm font-medium text-gray-700 mb-1">Porciones *</label>
              <input v-model.number="formData.portions" type="number" id="portions" name="portions" min="1" required
                class="w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label for="levels" class="block text-sm font-medium text-gray-700 mb-1">Niveles *</label>
              <input v-model.number="formData.levels" type="number" id="levels" name="levels" min="1" required
                class="w-full h-[30px] p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label for="active" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <div class="mt-1">
                <label class="inline-flex items-center">
                  <input v-model="formData.active" id="active" name="active" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <span class="ml-2">Activo</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-6 border-t border-gray-200">
            <div>
              <button type="button" @click="navigateTo(`/admin/desserts/${route.params.id}/additions`)"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-blue-300 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Adiciones
              </button>
            </div>

            <div class="flex space-x-4">
              <button type="button" @click="navigateTo('/admin/desserts')"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancelar
              </button>
              <button type="submit" :disabled="isSubmitting || !hasChanges"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isSubmitting">
                  <Spinner class="h-4 w-4 inline" />
                  Actualizando...
                </span>
                <span v-else>Actualizar Postre</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dessert, UpdateDessert } from '~/interfaces/Dessert';
import { useDessertsStore } from '~/stores/desserts';
import { useAlert } from '~/composables/useAlert';
import Spinner from '~/components/ui/Spinner.vue';

const route = useRoute();
const dessertsStore = useDessertsStore();
const alert = useAlert();

const loading = ref(true);
const error = ref<string | null>(null);
const isSubmitting = ref(false);
const dessert = ref<Dessert | null>(null);

const formData = reactive<UpdateDessert>({
  name: '',
  price: 0,
  type: 'torta',
  flavor: 'chocolate',
  portions: 1,
  levels: 1,
  active: true
});

const formKeys = ['name', 'price', 'type', 'flavor', 'portions', 'levels', 'active'] as const;

const hasChanges = computed(() => {
  if (!dessert.value) return false;

  return formKeys.some((key) => {
    const formValue = formData[key];
    const originalValue = dessert.value?.[key];

    if (key === 'price' || key === 'portions' || key === 'levels') {
      return Number(formValue) !== Number(originalValue);
    }
    return formValue !== originalValue;
  });
});

onMounted(async () => {
  try {
    const dessertId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    if (!dessertId) throw new Error('ID de postre no válido');

    await dessertsStore.fetchDessertById(dessertId);
    if (!dessertsStore.currentDessert) throw new Error('Postre no encontrado');

    Object.assign(formData, {
      name: dessertsStore.currentDessert.name,
      price: dessertsStore.currentDessert.price,
      type: dessertsStore.currentDessert.type,
      flavor: dessertsStore.currentDessert.flavor,
      portions: dessertsStore.currentDessert.portions,
      levels: dessertsStore.currentDessert.levels,
      active: dessertsStore.currentDessert.active
    });

    dessert.value = dessertsStore.currentDessert;
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el postre';
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

    const changes: Partial<UpdateDessert> = {};
    for (const key of formKeys) {
      if (formData[key] !== dessert.value?.[key]) {
        (changes as any)[key] = formData[key];
      }
    }

    await dessertsStore.updateDessert(route.params.id as string, changes);

    alert.showSuccess('Postre actualizado correctamente');
    navigateTo(`/admin/desserts/${route.params.id}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al actualizar el postre';
    alert.showError(message);
  } finally {
    isSubmitting.value = false;
  }
};

onUnmounted(() => {
  dessertsStore.clearCurrentDessert();
});
</script>