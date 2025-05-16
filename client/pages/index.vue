<template>
  <ContainerBckGroundImage :image="'/test.jpg'" :title="'Bienvenido a The Sweet S'"
    :p1="'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisi nec erat.'"
    :p2="'Descubre nuestros postres artesanales y disfruta de una experiencia dulce y única.'"
    :btnText="'Explorar Productos'" />

  <section class="py-16 px-4">
    <div class="container mx-auto">
      <div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="p-8 md:p-12 flex flex-col justify-center">
            <div class="inline-block bg-primary/10 p-2 rounded-full mb-4">
              <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" stroke="currentColor" stroke-width="2" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" stroke-width="2" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" stroke="currentColor" stroke-width="2" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold mb-4 text-foreground">¡Síguenos en Instagram!</h2>
            <p class="text-muted-foreground">
              Descubre más de nuestros postres, novedades y promociones en nuestro perfil de Instagram.
              ¡No te pierdas ninguna de nuestras creaciones!
            </p>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
              class="mt-6 inline-flex items-center text-primary hover:underline">
              @the.sweet.s
              <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                </path>
              </svg>
            </a>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-pink-100">
            <div class="p-8 md:p-12">
              <div
                class="aspect-square rounded-lg overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-all duration-300">
                <InstagramPost :url="'https://www.instagram.com/p/CIf_XsAnvqr'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import ContainerBckGroundImage from "~/components/clients/ContainerBckGroundImage.vue";
import InstagramPost from "~/components/clients/InstagramPost.vue";

definePageMeta({
  layout: "clients"
})
</script>