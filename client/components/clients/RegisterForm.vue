<template>
    <div class="w-full max-w-md mx-auto">
        <div class="mb-6">
            <GoogleSignInButton />
        </div>

        <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">O regístrate con email</span>
            </div>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
            <div v-if="apiError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <Icon name="mdi:alert-circle" class="h-5 w-5 text-red-500" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{{ apiError }}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-[#6b3e26]">Nombre</label>
                    <input type="text" id="name" name="name" v-model="formData.name" autocomplete="given-name"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.name }" />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
                <div>
                    <label for="lastName" class="block text-sm font-medium text-[#6b3e26]">Apellido</label>
                    <input type="text" id="lastName" name="lastName" v-model="formData.lastName"
                        autocomplete="family-name"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.lastName }" />
                    <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
                </div>
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-[#6b3e26]">Correo electrónico</label>
                <input type="email" id="email" name="email" v-model="formData.email" autocomplete="email"
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    :class="{ 'border-red-500': errors.email }" />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div>
                <label for="phone" class="block text-sm font-medium text-[#6b3e26]">Teléfono</label>
                <div class="mt-1 grid grid-cols-3 gap-2">
                    <div>
                        <label for="countryCode" class="block text-xs font-medium text-gray-500">Código país</label>
                        <input type="text" id="countryCode" name="countryCode" v-model="formData.countryCode"
                            autocomplete="tel-country-code"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            :class="{ 'border-red-500': errors.countryCode }" placeholder="57" maxlength="4" />
                    </div>
                    <div class="col-span-2">
                        <label for="phone" class="block text-xs font-medium text-gray-500">Número</label>
                        <input type="tel" id="phone" name="phone" v-model="formData.phone" autocomplete="tel-national"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            :class="{ 'border-red-500': errors.phone }" placeholder="Número de teléfono" />
                    </div>
                </div>
                <p v-if="errors.countryCode" class="mt-1 text-sm text-red-600">{{ errors.countryCode }}</p>
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-[#6b3e26]">Contraseña</label>
                <div class="relative mt-1">
                    <input :type="showPassword ? 'text' : 'password'" id="password" name="password"
                        v-model="formData.password" autocomplete="new-password"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.password }" />
                    <button type="button" @click="showPassword = !showPassword" aria-label="Mostrar/ocultar contraseña"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" class="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                <p class="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres, incluyendo una
                    mayúscula, una minúscula, un número y un símbolo.</p>
            </div>

            <div>
                <label for="confirmPassword" class="block text-sm font-medium text-[#6b3e26]">Confirmar
                    contraseña</label>
                <div class="relative mt-1">
                    <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" name="confirmPassword"
                        v-model="formData.confirmPassword" autocomplete="new-password"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.confirmPassword }" />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                        aria-label="Mostrar/ocultar confirmación de contraseña"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Icon :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" class="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>

            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input id="terms" type="checkbox" v-model="formData.acceptTerms"
                        class="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                </div>
                <div class="ml-3 text-sm">
                    <label for="terms" class="font-medium text-[#6b3e26]">Acepto los
                        <NuxtLink to="#" class="text-pink-600 hover:text-pink-500 underline">términos y condiciones
                        </NuxtLink>
                    </label>
                    <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">{{ errors.acceptTerms }}</p>
                </div>
            </div>

            <div>
                <button type="submit" :disabled="isSubmitting"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isSubmitting ? 'Registrando...' : 'Registrarse' }}
                </button>
            </div>

            <div class="text-sm text-center">
                ¿Ya tienes una cuenta?
                <NuxtLink to="/user/login" class="font-medium text-pink-600 hover:text-pink-500">
                    Inicia sesión
                </NuxtLink>
            </div>
        </form>

        <Teleport to="body">
            <div v-if="showSuccessModal"
                class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                    <div class="text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <Icon name="mdi:check-circle" class="h-8 w-8 text-green-500" />
                        </div>
                        <h3 class="text-lg font-bold text-[#6b3e26] mb-1">¡Registro exitoso!</h3>
                        <p class="text-sm text-gray-600 mb-4">
                            Hemos enviado un correo electrónico a <strong>{{ formData.email }}</strong> con un enlace
                            para confirmar tu cuenta.
                            Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                        </p>
                        <button
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-base font-medium text-white hover:from-pink-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            @click="goToHome">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRegisterForm } from '~/composables/useRegisterForm'
import GoogleSignInButton from './GoogleSignInButton.vue'

const router = useRouter()

const {
    formData,
    errors,
    isSubmitting,
    apiError,
    showSuccessModal,
    submitForm,
    closeSuccessModal,
} = useRegisterForm()

const formWasSubmitted = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const onSubmit = async () => {
    formWasSubmitted.value = true
    await submitForm()
}

const goToHome = () => {
    closeSuccessModal()
    router.push('/user/login')
}
</script>