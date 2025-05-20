<template>
    <div class="w-full max-w-md mx-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
                    <input type="text" id="name" v-model="formData.name"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.name }" />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
                <div>
                    <label for="lastname" class="block text-sm font-medium text-[#6b3e26]">Apellido</label>
                    <input type="text" id="lastname" v-model="formData.lastname"
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.lastname }" />
                    <p v-if="errors.lastname" class="mt-1 text-sm text-red-600">{{ errors.lastname }}</p>
                </div>
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-[#6b3e26]">Correo electrónico</label>
                <input type="email" id="email" v-model="formData.email"
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    :class="{ 'border-red-500': errors.email }" />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div>
                <label for="phone" class="block text-sm font-medium text-[#6b3e26]">Teléfono</label>
                <div class="mt-1 grid grid-cols-3 gap-2">
                    <div>
                        <label for="country_code" class="block text-xs font-medium text-gray-500">Código país</label>
                        <input type="text" id="country_code" v-model="formData.country_code"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            :class="{ 'border-red-500': errors.country_code }" placeholder="57" maxlength="4" />
                    </div>
                    <div class="col-span-2">
                        <label for="phone" class="block text-xs font-medium text-gray-500">Número</label>
                        <input type="tel" id="phone" v-model="formData.phone"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            :class="{ 'border-red-500': errors.phone }" placeholder="Número de teléfono" />
                    </div>
                </div>
                <p v-if="errors.country_code" class="mt-1 text-sm text-red-600">{{ errors.country_code }}</p>
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-[#6b3e26]">Contraseña</label>
                <div class="relative mt-1">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.password }" />
                    <button type="button" @click="showPassword = !showPassword"
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
                    <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword"
                        v-model="formData.confirmPassword"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        :class="{ 'border-red-500': errors.confirmPassword }" />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const { public: { SERVER_URL } } = useRuntimeConfig();

const router = useRouter();

const formData = reactive({
    name: '',
    lastname: '',
    email: '',
    country_code: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
});

const errors = reactive({
    name: '',
    lastname: '',
    email: '',
    country_code: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
});

const isSubmitting = ref(false);
const apiError = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showSuccessModal = ref(false);

const validateForm = () => {
    let isValid = true;

    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
    });

    if (!formData.name) {
        errors.name = 'El nombre es obligatorio';
        isValid = false;
    } else if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(formData.name)) {
        errors.name = 'El nombre solo puede contener letras, números y espacios';
        isValid = false;
    }

    if (!formData.lastname) {
        errors.lastname = 'El apellido es obligatorio';
        isValid = false;
    } else if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(formData.lastname)) {
        errors.lastname = 'El apellido solo puede contener letras, números y espacios';
        isValid = false;
    }

    if (!formData.email) {
        errors.email = 'El correo electrónico es obligatorio';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'El correo electrónico no es válido';
        isValid = false;
    }

    if (!formData.country_code) {
        errors.country_code = 'El código de país es obligatorio';
        isValid = false;
    }

    if (!formData.phone) {
        errors.phone = 'El teléfono es obligatorio';
        isValid = false;
    } else if (formData.phone.length < 10 || formData.phone.length > 15) {
        errors.phone = 'El teléfono debe tener entre 10 y 15 dígitos';
        isValid = false;
    } else if (!/^\d+$/.test(formData.phone)) {
        errors.phone = 'El teléfono solo debe contener números';
        isValid = false;
    }

    if (!formData.password) {
        errors.password = 'La contraseña es obligatoria';
        isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        errors.password = 'La contraseña no cumple con los requisitos de seguridad';
        isValid = false;
    }

    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Debes confirmar tu contraseña';
        isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
        isValid = false;
    }

    if (!formData.acceptTerms) {
        errors.acceptTerms = 'Debes aceptar los términos y condiciones';
        isValid = false;
    }

    return isValid;
};


const handleSubmit = async () => {
    if (!validateForm()) return;

    isSubmitting.value = true;
    apiError.value = '';

    try {
        const response = await fetch(`${SERVER_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                lastname: formData.lastname,
                email: formData.email,
                country_code: formData.country_code,
                phone: formData.phone,
                password: formData.password,
            }),
        });

        const data = await response.json();

        if (data === "El usuario ya existe") {
            apiError.value = "El usuario ya existe";
            isSubmitting.value = false;
            return;
        }

        if (!response.ok) {
            throw new Error(data.message);
        }

        showSuccessModal.value = true;
    } catch (error) {
        if (error instanceof Error) apiError.value = "Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.";
        else apiError.value = "Hemos tenido problemas con el servidor. Por favor, inténtalo más tarde.";
    } finally {
        isSubmitting.value = false;
    }
};

const goToHome = () => {
    showSuccessModal.value = false;
    router.push('/');
};
</script>