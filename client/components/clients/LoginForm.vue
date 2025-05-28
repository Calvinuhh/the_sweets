<template>
    <div class="login-form">
        <h2 class="text-2xl font-bold mb-6">Iniciar Sesión</h2>

        <div class="mb-6">
            <GoogleSignInButton />
        </div>

        <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">O inicia sesión con email</span>
            </div>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium mb-1">Correo electrónico</label>
                <input v-model="formData.email" type="email" id="email"
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    :class="{ 'border-red-500': errors.email }" placeholder="ejemplo@correo.com">
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div>
                <label for="password" class="block text-sm font-medium mb-1">Contraseña</label>
                <div class="relative">
                    <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" id="password"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        :class="{ 'border-red-500': errors.password }" placeholder="Ingresa tu contraseña">
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" class="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <div class="text-right">
                <NuxtLink to="/user/forgot-password" class="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                </NuxtLink>
            </div>

            <button type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSubmitting">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <span>{{ isSubmitting ? 'Cargando...' : 'Iniciar sesión' }}</span>
            </button>

            <div class="text-center mt-4">
                <p class="text-sm">
                    ¿No tienes una cuenta?
                    <NuxtLink to="/user/register" class="text-primary hover:underline">
                        Regístrate aquí
                    </NuxtLink>
                </p>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLoginForm } from '~/composables/useLoginForm';
import { useRouter } from 'vue-router';
import GoogleSignInButton from './GoogleSignInButton.vue'

const router = useRouter();
const showPassword = ref(false);

const {
    formData,
    errors,
    isSubmitting,
    submitForm,
} = useLoginForm();

const emit = defineEmits(['login-success', 'login-error']);

const onSubmit = async () => {
    try {
        const success = await submitForm();
        if (success) {
            emit('login-success');
            router.push('/products');
        }
    } catch (error) {
        if (error instanceof Error) {
            emit('login-error', error.message);
        }
    }
};
</script>

<style scoped>
.login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
}
</style>