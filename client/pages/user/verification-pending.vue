<template>
    <div class="max-w-2xl mx-auto mt-12 p-6">
        <div class="bg-white shadow-md rounded-lg p-8 text-center">
            <div class="flex justify-center mb-6">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="mdi:email" class="text-blue-600 text-3xl" />
                </div>
            </div>

            <h1 class="text-2xl font-bold text-[#6b3e26] mb-4">Verificación pendiente</h1>

            <p class="text-gray-600 mb-4">
                Hemos enviado un correo electrónico con un enlace de activación.
                Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>

            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <Icon name="mdi:information" class="h-5 w-5 text-blue-400" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">
                            Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <NuxtLink to="/"
                    class="inline-block px-5 py-3 border border-[#c3ac83] text-[#6b3e26] font-medium rounded-md hover:bg-[#f5efe6] transition">
                    Volver a Inicio
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "clients"
});
</script>
