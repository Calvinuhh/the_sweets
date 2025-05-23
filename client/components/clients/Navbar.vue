<template>
    <nav class="w-full bg-[#c3ac83] shadow-md">
        <div class="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-4">
            <div class="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
                <span class="font-cinzel text-2xl font-bold text-[#6b3e26]">The Sweet S</span>
            </div>
            <button
                class="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6b3e26]/40"
                @click="open = !open" aria-label="Abrir menú">
                <div class="w-7 h-7 text-[#6b3e26]">
                    <svg v-if="!open" class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </button>
            <ul class="hidden md:flex gap-8">
                <li>
                    <NuxtLink to="/" class="text-[#6b3e26] cursor-pointer font-semibold hover:text-[#a67c52] transition"
                        active-class="!text-pink-700" exact>Inicio</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/products"
                        class="text-[#6b3e26] cursor-pointer font-semibold hover:text-[#a67c52] transition"
                        active-class="!text-pink-700">Productos</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/contact"
                        class="text-[#6b3e26] cursor-pointer font-semibold hover:text-[#a67c52] transition"
                        active-class="!text-pink-700">Contacto</NuxtLink>
                </li>
            </ul>
            <div class="hidden md:flex items-center gap-4">
                <UserIcon :authenticated="isAuthenticated" />
                <client-only>
                    <Cart v-if="isAuthenticated" />
                </client-only>
            </div>
        </div>
        <transition name="fade">
            <div v-if="open" class="md:hidden bg-[#c3ac83] px-4 pb-4">
                <ul class="flex flex-col gap-4">
                    <li>
                        <NuxtLink to="/" class="block text-[#6b3e26] font-semibold py-2 hover:text-[#a67c52] transition"
                            active-class="!text-pink-700" exact @click="open = false">Inicio</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/products"
                            class="block text-[#6b3e26] font-semibold py-2 hover:text-[#a67c52] transition"
                            active-class="!text-pink-700" @click="open = false">Productos</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/contact"
                            class="block text-[#6b3e26] font-semibold py-2 hover:text-[#a67c52] transition"
                            active-class="!text-pink-700" @click="open = false">Contacto</NuxtLink>
                    </li>
                    <li class="flex items-center gap-2">
                        <UserIcon :authenticated="isAuthenticated" />
                        <client-only>
                            <Cart v-if="isAuthenticated" />
                        </client-only>
                    </li>
                </ul>
            </div>
        </transition>
    </nav>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import Cart from '~/components/clients/Cart.vue'
import UserIcon from '~/components/clients/UserIcon.vue'
import { useUsersStore } from '~/stores/users'

const open = ref(false)
const usersStore = useUsersStore()
const isAuthenticated = computed(() => usersStore.isAuthenticated)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>