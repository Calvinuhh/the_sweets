<template>
    <div class="max-w-7xl mx-auto py-8 px-4">
        <NuxtLink to="/" class="flex items-center text-blue-600 mb-4 hover:underline">
            <Icon name="mdi:arrow-left" class="mr-2" /> Volver
        </NuxtLink>
        <h1 class="text-3xl font-bold mb-6">Finalizar Compra</h1>

        <client-only>
            <div v-if="cartItems.length === 0" class="bg-white rounded-lg shadow p-8 text-center text-gray-500 text-lg">
                No tienes productos en el carrito.
            </div>

            <template v-else>
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded">
                    <div class="flex items-start gap-2">
                        <Icon name="mdi:information" class="text-blue-400 mt-1" />
                        <div>
                            <p class="font-semibold">Proceso de confirmación de pedido</p>
                            <p class="text-sm">
                                Al hacer clic en "Realizar Solicitud de Pedido", no se realizará el pago inmediatamente.
                                Primero enviaremos una solicitud a la pastelería para que confirmen tu pedido.
                                Una vez confirmado, recibirás un correo electrónico con el enlace de pago para completar
                                tu
                                compra.
                            </p>
                            <NuxtLink to="/contact" class="text-blue-600 text-sm hover:underline">
                                ¿Tienes dudas? Contáctanos →
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div v-for="item in cartItems" :key="item.productId" class="flex items-start justify-between mb-6">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name"
                                    class="object-cover w-full h-full" />
                                <span v-else>Sin imagen</span>
                            </div>
                            <div>
                                <div class="font-semibold text-lg">{{ item.name }}</div>
                                <div class="text-sm text-gray-500">{{ item.quantity }} unidad{{ item.quantity > 1 ? 'es'
                                    :
                                    '' }}
                                </div>
                                <div v-if="item.additions && item.additions.length" class="text-sm mt-1">
                                    <span class="font-medium">Adiciones:</span>
                                    <ul class="list-disc ml-5">
                                        <li v-for="add in item.additions" :key="add.id">
                                            + {{ add.name }} <span v-if="add.price">(${{
                                                add.price.toLocaleString()
                                                }})</span>
                                        </li>
                                    </ul>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Total adiciones: ${{(item.additions.reduce((a, b) => a + (b.price || 0), 0) *
                                            item.quantity).toLocaleString()}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-right font-semibold text-lg">
                            ${{ (item.price * item.quantity).toLocaleString() }}
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded p-4 mt-4">
                        <div class="font-semibold mb-2">Resumen del pedido</div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Subtotal:</span>
                            <span>${{ subtotal.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Adiciones:</span>
                            <span>${{ additionsTotal.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>${{ total.toLocaleString() }}</span>
                        </div>
                    </div>

                    <button
                        class="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition">
                        Ingresar datos para el pedido
                    </button>
                </div>
            </template>
        </client-only>
    </div>
</template>

<script lang="ts" setup>
import { cartItems } from '~/stores/cart'

const subtotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const additionsTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        if (item.additions && Array.isArray(item.additions) && item.additions.length > 0) {
            const itemAdditionsTotal = item.additions.reduce(
                (sum, addition) => sum + (Number(addition.price) || 0),
                0
            );
            return total + (itemAdditionsTotal * item.quantity);
        }
        return total;
    }, 0);
})

const total = computed(() => subtotal.value + additionsTotal.value)

definePageMeta({
    layout: "clients"
})
</script>
