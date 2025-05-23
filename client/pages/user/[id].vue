<template>
    <div class="max-w-2xl mx-auto p-6">
        <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Perfil de Usuario</h1>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                    </label>
                    <input id="name" v-model="formData.name" type="text" :disabled="!isEditing"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Ingresa tu nombre" />
                </div>

                <div>
                    <label for="lastname" class="block text-sm font-medium text-gray-700 mb-2">
                        Apellido
                    </label>
                    <input id="lastname" v-model="formData.lastname" type="text" :disabled="!isEditing"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Ingresa tu apellido" />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input id="email" v-model="formData.email" type="email" disabled
                        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        placeholder="Email no modificable" />
                    <p class="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
                </div>

                <div>
                    <label for="country_code" class="block text-sm font-medium text-gray-700 mb-2">
                        Código de País
                    </label>
                    <input id="country_code" v-model="formData.country_code" type="text" :disabled="!isEditing"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Ej: +1, +52, +34" />
                </div>

                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                    </label>
                    <input id="phone" v-model="formData.phone" type="tel" :disabled="!isEditing"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Ingresa tu número de teléfono" />
                </div>

                <div class="flex gap-3 pt-4">
                    <button v-if="!isEditing" type="button" @click="startEditing"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                        Editar
                    </button>

                    <template v-else>
                        <button type="submit" :disabled="isLoading"
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isLoading ? 'Guardando...' : 'Guardar' }}
                        </button>

                        <button type="button" @click="cancelEditing" :disabled="isLoading"
                            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Cancelar
                        </button>
                    </template>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useUsersStore } from '~/stores/users'
import { useAlert } from '~/composables/useAlert'
import { usePatchUserData } from '~/composables/usePatchUserData'

definePageMeta({
    layout: 'clients',
    middleware: ['auth-client']
})

const usersStore = useUsersStore()
const { showError } = useAlert()
const { updateUserData, getChangedFields, isLoading } = usePatchUserData()

const isEditing = ref(false)
const originalData = ref<any>(null)

const formData = reactive({
    name: '',
    lastname: '',
    email: '',
    country_code: '',
    phone: ''
})

onMounted(() => {
    loadUserData()
})

function loadUserData() {
    const userData = usersStore.getUserData
    if (userData) {
        formData.name = userData.name || ''
        formData.lastname = userData.lastname || ''
        formData.email = userData.email || ''
        formData.country_code = userData.country_code || ''
        formData.phone = userData.phone || ''
        originalData.value = { ...formData }
    } else {
        showError('No se pudieron cargar los datos del usuario')
        navigateTo('/user/login')
    }
}

function startEditing() {
    isEditing.value = true
    originalData.value = { ...formData }
}

function cancelEditing() {
    if (originalData.value) {
        formData.name = originalData.value.name
        formData.lastname = originalData.value.lastname
        formData.email = originalData.value.email
        formData.country_code = originalData.value.country_code
        formData.phone = originalData.value.phone
    }
    isEditing.value = false
}

async function handleSubmit() {
    if (!formData.name.trim()) {
        showError('El nombre es obligatorio')
        return
    }

    if (!formData.lastname.trim()) {
        showError('El apellido es obligatorio')
        return
    }

    if (!formData.phone.trim()) {
        showError('El teléfono es obligatorio')
        return
    }

    const changedFields = getChangedFields(originalData.value, formData)

    const success = await updateUserData(changedFields)
    if (success) {
        isEditing.value = false
        originalData.value = { ...formData }
    }
}

watch(() => usersStore.getUserData, (newData) => {
    if (newData && !isEditing.value) {
        formData.name = newData.name || ''
        formData.lastname = newData.lastname || ''
        formData.email = newData.email || ''
        formData.country_code = newData.country_code || ''
        formData.phone = newData.phone || ''
    }
}, { deep: true })
</script>