<template>
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-center text-[#6b3e26] mb-12">Contáctanos</h1>

        <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div class="grid md:grid-cols-2">
                <div class="p-8">
                    <h2 class="text-2xl font-semibold text-[#6b3e26] mb-6">Envíanos un mensaje</h2>

                    <div v-if="isSubmitted" class="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <Icon name="mdi:check-circle" class="text-green-500 text-xl" />
                            </div>
                            <div class="ml-3">
                                <p class="text-green-700 font-medium">¡Mensaje enviado con éxito!</p>
                                <p class="text-green-600 text-sm">Nos pondremos en contacto contigo pronto.</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="apiError" class="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <Icon name="mdi:alert-circle" class="text-red-500 text-xl" />
                            </div>
                            <div class="ml-3">
                                <p class="text-red-700 font-medium">Error al enviar el formulario</p>
                                <p class="text-red-600 text-sm">{{ apiError }}</p>
                            </div>
                        </div>
                    </div>

                    <form v-if="!isSubmitted" class="space-y-4" @submit.prevent="onSubmit">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre <span
                                        class="text-red-500">*</span></label>
                                <input type="text" v-model="formData.firstName"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                                    :class="{ 'border-red-500': errors.firstName }" placeholder="Tu nombre" />
                                <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido <span
                                        class="text-red-500">*</span></label>
                                <input type="text" v-model="formData.lastName"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                                    :class="{ 'border-red-500': errors.lastName }" placeholder="Tu apellido" />
                                <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico <span
                                    class="text-red-500">*</span></label>
                            <input type="email" v-model="formData.email"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                                :class="{ 'border-red-500': errors.email }" placeholder="ejemplo@correo.com" />
                            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número de contacto <span
                                    class="text-red-500">*</span></label>
                            <div class="flex gap-3">
                                <div class="w-24">
                                    <input type="text" v-model="formData.countryCode"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                                        :class="{ 'border-red-500': errors.countryCode }" placeholder="Ej: +57" />
                                    <p v-if="errors.countryCode" class="mt-1 text-sm text-red-600">*</p>
                                </div>
                                <div class="flex-1">
                                    <input type="tel" v-model="formData.phone"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                                        :class="{ 'border-red-500': errors.phone }" placeholder="318 123 4567" />
                                    <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Incluye tu código de país (Ej: +57 para Colombia)</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tu mensaje <span
                                    class="text-red-500">*</span></label>
                            <textarea rows="4" v-model="formData.message"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                                :class="{ 'border-red-500': errors.message }"
                                placeholder="¿En qué podemos ayudarte?"></textarea>
                            <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
                        </div>
                        <div class="flex justify-between items-center">
                            <button type="button" @click="resetForm"
                                class="text-gray-500 hover:text-gray-700 text-sm underline">
                                Limpiar formulario
                            </button>

                            <button type="submit"
                                class="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow transition flex justify-center items-center min-w-[180px]"
                                :disabled="isSubmitting">
                                <span v-if="isSubmitting" class="mr-2">
                                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                </span>
                                {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
                            </button>
                        </div>

                        <p v-if="hasErrors && formWasSubmitted" class="text-center text-red-500 text-sm mt-2">
                            Por favor corrige los errores antes de enviar el formulario.
                        </p>
                    </form>

                    <div v-else class="text-center mt-4">
                        <button @click="resetForm" class="text-blue-600 hover:text-blue-800 font-medium underline">
                            Enviar otro mensaje
                        </button>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-pink-100 to-yellow-100 p-8 flex flex-col justify-between">
                    <div>
                        <h2 class="text-2xl font-semibold text-[#6b3e26] mb-6">Información de contacto</h2>

                        <div class="space-y-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                                    <Icon name="mdi:location" class="text-2xl text-pink-600" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-[#6b3e26]">Dirección</h3>
                                    <p class="text-gray-600">Calle de los Postres 123</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                                    <Icon name="mdi:email" class="text-2xl text-pink-600" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-[#6b3e26]">Correo</h3>
                                    <p class="text-gray-600">susanne.martinezh@gmail.com</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                                    <Icon name="mdi:phone" class="text-2xl text-pink-600" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-[#6b3e26]">Teléfono</h3>
                                    <p class="text-gray-600">+57 318 8481242</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                                    <Icon name="mdi:clock" class="text-2xl text-pink-600" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-[#6b3e26]">Horario</h3>
                                    <p class="text-gray-600">Lun - Sáb: 9:00 AM - 6:00 PM</p>
                                    <p class="text-gray-600">Domingos: Cerrado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 bg-white bg-opacity-60 rounded-xl p-5 border border-pink-100">
                        <h3 class="text-xl font-semibold text-[#6b3e26] mb-4 text-center">Contáctanos por WhatsApp</h3>

                        <div class="flex flex-col md:flex-row items-center justify-center gap-8">
                            <div class="text-center">
                                <a href="https://wa.link/d9qg2t" target="_blank" rel="noopener noreferrer"
                                    class="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md transition-all hover:shadow-lg">
                                    <img src="/wp.jpg" alt="WhatsApp" class="w-7 h-7 rounded-full" />
                                    <span class="font-medium">Escríbenos ahora</span>
                                </a>
                            </div>

                            <div class="text-center md:border-l md:pl-8 pt-6 md:pt-0">
                                <div class="mb-2 text-sm font-medium text-gray-700">O escanea nuestro código QR</div>
                                <div class="bg-white p-2 rounded-lg shadow-sm inline-block">
                                    <img src="/qr.png" alt="Código QR WhatsApp" class="w-32 h-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-16 flex justify-center">
            <div class="grid grid-cols-3 gap-6 max-w-3xl">
                <div class="bg-pink-50 p-6 rounded-xl text-center transform hover:scale-105 transition">
                    <Icon name="mdi:cake-variant" class="text-5xl text-pink-400 mb-3 mx-auto" />
                    <h3 class="text-lg font-semibold text-[#6b3e26]">Postres personalizados</h3>
                    <p class="text-gray-600 text-sm">Creamos postres a tu gusto y necesidad</p>
                </div>

                <div class="bg-yellow-50 p-6 rounded-xl text-center transform hover:scale-105 transition">
                    <Icon name="mdi:cupcake" class="text-5xl text-yellow-400 mb-3 mx-auto" />
                    <h3 class="text-lg font-semibold text-[#6b3e26]">Ocasiones especiales</h3>
                    <p class="text-gray-600 text-sm">Endulza tu celebración con nosotros</p>
                </div>

                <div class="bg-blue-50 p-6 rounded-xl text-center transform hover:scale-105 transition">
                    <Icon name="mdi:gift" class="text-5xl text-blue-400 mb-3 mx-auto" />
                    <h3 class="text-lg font-semibold text-[#6b3e26]">Entrega a domicilio</h3>
                    <p class="text-gray-600 text-sm">Llevamos dulzura hasta tu puerta</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useContactForm } from '~/composables/useContactForm'

const {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    apiError,
    submitForm,
    resetForm,
    hasErrors
} = useContactForm()

const formWasSubmitted = ref(false)

const onSubmit = async () => {
    formWasSubmitted.value = true
    await submitForm()
}

definePageMeta({
    layout: "clients"
})
</script>

<style scoped>
input:focus,
textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(244, 114, 182, 0.2);
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }

    100% {
        transform: translateY(0px);
    }
}

.transform {
    transition: all 0.3s ease;
}

.hover\:scale-105:hover {
    transform: scale(1.05);
}
</style>