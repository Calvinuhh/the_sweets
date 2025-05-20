<template>
    <div class="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <div v-if="loading" class="text-center">
                <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
                </div>
                <h2 class="mt-6 text-xl font-semibold text-[#6b3e26]">Verificando tu cuenta...</h2>
                <p class="mt-2 text-sm text-gray-600">Por favor espera mientras confirmamos tu registro.</p>
            </div>

            <div v-else-if="success" class="text-center">
                <div class="flex justify-center">
                    <div class="bg-green-100 rounded-full p-3">
                        <Icon name="mdi:check-circle" class="text-green-500 text-5xl" />
                    </div>
                </div>
                <h2 class="mt-6 text-2xl font-bold text-[#6b3e26]">¡Cuenta confirmada!</h2>
                <p class="mt-2 text-gray-600">Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión y
                    disfrutar de nuestros productos.</p>
                <div class="mt-8">
                    <NuxtLink to="/user/login"
                        class="inline-flex items-center justify-center w-full px-5 py-3 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        Iniciar sesión
                    </NuxtLink>
                </div>
            </div>

            <div v-else class="text-center">
                <div class="flex justify-center">
                    <div class="bg-red-100 rounded-full p-3">
                        <Icon name="mdi:close-circle" class="text-red-500 text-5xl" />
                    </div>
                </div>
                <h2 class="mt-6 text-2xl font-bold text-[#6b3e26]">No se pudo confirmar la cuenta</h2>
                <p class="mt-2 text-gray-600">{{ errorMessage }}</p>
                <div class="mt-8 space-y-4">
                    <NuxtLink to="/"
                        class="inline-flex items-center justify-center w-full px-5 py-3 border border-[#c3ac83] text-[#6b3e26] font-medium rounded-lg hover:bg-[#f5efe6] transition-all duration-200">
                        Ir a Inicio
                    </NuxtLink>
                    <NuxtLink to="/contact"
                        class="inline-flex items-center justify-center w-full px-5 py-3 bg-[#6b3e26] text-white font-medium rounded-lg hover:bg-[#8d5334] transition-all duration-200">
                        Contactar soporte
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { public: { SERVER_URL } } = useRuntimeConfig()

const route = useRoute()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('Ocurrió un error al confirmar tu cuenta. Por favor intenta nuevamente o contacta a soporte.')

onMounted(async () => {
    const token = route.query.token as string
    const email = route.query.email as string

    if (!token || !email) {
        loading.value = false
        errorMessage.value = 'El enlace de confirmación es inválido o ha caducado.'
        return
    }

    try {
        const response = await fetch(`${SERVER_URL}/users/register/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, email }),
        })

        const data = await response.json()

        if (response.ok) {
            success.value = true
        } else {
            errorMessage.value = data.message || 'No se pudo confirmar la cuenta. Por favor intenta nuevamente.'
        }
    } catch (error) {
        errorMessage.value = 'Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.'
    } finally {
        loading.value = false
    }
})
</script>