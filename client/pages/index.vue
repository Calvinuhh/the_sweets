<template>
  <ContainerBckGroundImage :image="'/test.jpg'" :title="'Bienvenido a The Sweet S'"
    :p1="'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisi nec erat.'"
    :p2="'Descubre nuestros postres artesanales y disfruta de una experiencia dulce y única.'" />

  <div class="flex flex-col md:flex-row items-center justify-center gap-8 my-12 max-w-5xl mx-auto">
    <div class="flex-1 text-center md:text-left">
      <h2 class="text-3xl font-bold font-moondance text-[#6b3e26] mb-4">¡Síguenos en Instagram!</h2>
      <p class="text-[#6b3e26] text-lg">
        Descubre más de nuestros postres, novedades y promociones en nuestro perfil de Instagram. ¡No te pierdas ninguna
        de nuestras creaciones!
      </p>
    </div>
    <div class="flex-1 flex justify-center">
      <InstagramPost :url="'https://www.instagram.com/p/CIf_XsAnvqr'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ContainerBckGroundImage from "~/components/clients/ContainerBckGroundImage.vue";
import InstagramPost from "~/components/clients/InstagramPost.vue";

definePageMeta({
  layout: "default"
})
</script>