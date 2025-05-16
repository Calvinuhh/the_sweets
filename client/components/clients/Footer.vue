<template>
    <footer class="bg-[#f5efe6]/80 pt-12 pb-6 mt-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                    <div class="flex items-center gap-2 mb-4">

                        <span class="text-xl font-bold text-[#6b3e26]">The Sweet S</span>
                    </div>
                    <p class="text-[#a58d6f]">
                        Elaborando los mejores postres artesanales para endulzar tu día.
                    </p>
                </div>
                <div>
                    <h3 class="font-bold mb-4 text-[#6b3e26]">Enlaces Rápidos</h3>
                    <ul class="space-y-2">
                        <li>
                            <NuxtLink to="/" class="text-[#a58d6f] hover:text-[#c3ac83] transition-colors"
                                :aria-current="route.path === '/' ? 'page' : undefined"
                                @click.prevent="route.path === '/' && $event.preventDefault()">
                                Inicio
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/products" class="text-[#a58d6f] hover:text-[#c3ac83] transition-colors"
                                :aria-current="route.path === '/products' ? 'page' : undefined"
                                @click.prevent="route.path === '/products' && $event.preventDefault()">
                                Productos
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/contact" class="text-[#a58d6f] hover:text-[#c3ac83] transition-colors"
                                :aria-current="route.path === '/contact' ? 'page' : undefined"
                                @click.prevent="route.path === '/contact' && $event.preventDefault()">
                                Contacto
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold mb-4 text-[#6b3e26]">Contacto</h3>
                    <address class="not-italic text-[#a58d6f]">
                        <p>Calle Principal 123</p>
                        <p>San Andres Isla</p>
                        <p>susanne.martinezh@gmail.com</p>
                        <p>+57 318 8481242</p>
                    </address>
                </div>
            </div>
            <div class="border-t border-[#c3ac83]/30 my-6"></div>
            <div class="flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-[#a58d6f]">
                    &copy; {{ new Date().getFullYear() }} The Sweet S. Todos los derechos reservados.
                </p>
                <div class="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" class="text-[#a58d6f] hover:text-[#c3ac83] transition-colors">
                        Política de Privacidad
                    </a>
                    <a href="#" class="text-[#a58d6f] hover:text-[#c3ac83] transition-colors">
                        Términos y Condiciones
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>