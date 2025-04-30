<template>
    <nav class="w-full bg-[#c3ac83] shadow-md">
        <div class="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-4">
            <div class="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" class="h-10 w-10 object-contain" />
                <span class="font-cinzel text-2xl font-bold text-[#6b3e26]">The Sweet S</span>
            </div>
            <ul class="flex gap-8">
                <li>
                    <NuxtLink to="/" class="text-[#6b3e26] font-semibold hover:text-[#a67c52] transition"
                        active-class="!text-pink-700" exact>Inicio</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/products" class="text-[#6b3e26] font-semibold hover:text-[#a67c52] transition"
                        active-class="!text-pink-700">Productos</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/contact" class="text-[#6b3e26] font-semibold hover:text-[#a67c52] transition"
                        active-class="!text-pink-700">Contacto</NuxtLink>
                </li>
            </ul>
            <Cart />
        </div>
    </nav>
</template>

<script lang="ts" setup>
import Cart from '~/components/clients/Cart.vue'
</script>