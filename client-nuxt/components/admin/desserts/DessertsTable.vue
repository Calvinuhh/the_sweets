<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4 border-b">
      <label class="block text-sm font-medium text-gray-700 mb-1">Filtrar por tipo:</label>
      <div class="flex space-x-2">
        <select v-model="selectedType" @change="updateDesserts"
          class="border rounded-md px-3 py-2 text-sm w-full md:w-64">
          <option value="">Todos los tipos ({{ dessertsStore.desserts.length }})</option>
          <option v-for="type in dessertsStore.availableTypes" :key="type" :value="type">
            {{ formatType(type) }} ({{dessertsStore.desserts.filter(d => d.type === type).length}})
          </option>
        </select>
        <button @click="refreshDesserts" class="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm">
          <Icon name="heroicons:arrow-path" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sabor
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="dessertsStore.loading">
            <td colspan="7" class="px-6 py-4 text-center">
              <Spinner class="mx-auto" />
            </td>
          </tr>
          <tr v-else-if="dessertsStore.error">
            <td colspan="7" class="px-6 py-4 text-center text-red-500">
              {{ dessertsStore.error }}
            </td>
          </tr>
          <tr v-else-if="dessertsStore.filteredDesserts.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
              No se encontraron postres
            </td>
          </tr>
          <tr v-for="dessert in dessertsStore.filteredDesserts" :key="dessert._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div v-if="dessert.picture" class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full object-cover" :src="dessert.picture" :alt="dessert.name">
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ dessert.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ dessert.portions }} porciones / {{ dessert.levels }} niveles
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="{
                'bg-green-100 text-green-800': dessert.picture,
                'bg-gray-100 text-gray-800': !dessert.picture
              }" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ dessert.picture ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatType(dessert.type) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ dessert.price.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
              {{ dessert.flavor }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'bg-green-100 text-green-800': dessert.active,
                'bg-red-100 text-red-800': !dessert.active
              }" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ dessert.active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink :to="`/admin/desserts/${dessert._id}`" class="text-green-600 hover:text-green-900 mr-3">
                Ver
              </NuxtLink>
              <NuxtLink :to="`/admin/desserts/${dessert._id}/edit`" class="text-blue-600 hover:text-blue-900 mr-3">
                Editar
              </NuxtLink>
              <button @click="handleDelete(dessert._id, dessert.name)" class="text-red-600 hover:text-red-900">
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
import { useDessertsStore } from '~/stores/desserts';
import Spinner from '~/components/ui/Spinner.vue';
import { useAlert } from '~/composables/useAlert';

const alert = useAlert();
const dessertsStore = useDessertsStore();

const selectedType = ref('');

const formatType = (type: string) => {
  const typesMap: Record<string, string> = {
    torta: 'Torta',
    postre_frio: 'Postre Frío',
    rollo: 'Rollo',
    galleta: 'Galleta'
  };
  return typesMap[type] || type;
};

const updateDesserts = () => {
  dessertsStore.fetchDesserts(selectedType.value);
};

const refreshDesserts = () => {
  selectedType.value = '';
  dessertsStore.fetchDesserts();
};

const handleDelete = async (id: string, name: string) => {
  await alert.confirmDelete({
    itemName: name,
    deleteFn: async () => {
      await dessertsStore.deleteDessert(id);
    }
  });
};

onMounted(() => {
  dessertsStore.fetchDesserts();
});
</script>