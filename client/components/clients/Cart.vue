<script setup lang="ts">
import { cartItems, cartTotal, clearCart } from '~/stores/cart'
import { computed, ref } from 'vue'

const itemsCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
)

const showDropdown = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

function handleMouseEnter() {
    if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
    }
    showDropdown.value = true
}
function handleMouseLeave() {
    hideTimeout = setTimeout(() => {
        showDropdown.value = false
    }, 500)
}
</script>

<template>
    <div class="flex items-center gap-4 relative" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <button class="relative">
            <svg class="w-7 h-7 text-[#6b3e26]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v7"></path>
            </svg>
            <span class="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1">
                {{ itemsCount }}
            </span>
        </button>
        <transition name="fade">
            <div v-if="showDropdown && cartItems.length"
                class="absolute right-0 top-10 z-30 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <div class="font-bold text-[#6b3e26] mb-2">Carrito de compra</div>
                <div class="flex flex-col gap-3 max-h-64 overflow-y-auto">
                    <div v-for="item in cartItems" :key="item.productId"
                        class="flex gap-3 items-center border-b pb-2 last:border-b-0 last:pb-0">
                        <img v-if="item.imageUrl" :src="item.imageUrl" alt="Imagen"
                            class="w-12 h-12 object-cover rounded" />
                        <div v-else
                            class="w-12 h-12 bg-gray-100 flex items-center justify-center rounded text-gray-400 text-xs">
                            Sin imagen</div>
                        <div class="flex-1">
                            <div class="font-semibold text-sm text-[#6b3e26] truncate">{{ item.name }}</div>
                            <div class="text-xs text-gray-500">Cantidad: {{ item.quantity }}</div>
                        </div>
                        <div class="font-bold text-sm text-[#6b3e26] min-w-[60px] text-right">
                            ${{ (item.price * item.quantity).toLocaleString() }}
                        </div>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-3 pt-2 border-t">
                    <span class="font-semibold text-[#6b3e26]">Total:</span>
                    <span class="font-bold text-[#6b3e26]">${{ cartTotal.toLocaleString() }}</span>
                </div>
                <button v-if="cartItems.length" @click="clearCart"
                    class="mt-3 w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-2 rounded transition text-sm">
                    Vaciar carrito
                </button>
                <button v-if="cartItems.length"
                    class="mt-2 w-full bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold py-2 rounded-lg shadow transition text-base flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 10-8 0v4m8 0v2m0 0h-6"></path>
                    </svg>
                    ¡Ir al Checkout!
                </button>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>