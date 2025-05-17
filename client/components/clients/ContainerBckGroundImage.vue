<template>
    <div class="relative w-full h-[340px] sm:h-[420px] md:h-[650px] flex items-center overflow-hidden">
        <img :src="image" alt="dessert" class="absolute inset-0 w-full h-full object-cover object-left"
            style="z-index: 1;" draggable="false" />
        <div class="absolute inset-0 bg-black opacity-65" style="z-index: 2;"></div>
        <div class="absolute inset-0"
            style="background: linear-gradient(to right, rgba(255,255,255,0) 10%, rgba(255,255,255,0.95) 100%); z-index: 3;">
        </div>
        <div class="relative z-10 flex w-full h-full items-center justify-center px-4">
            <div
                class="w-full max-w-xs sm:max-w-md md:max-w-lg text-center mx-auto bg-black/50 rounded-xl p-6 sm:p-8 shadow-lg">
                <h2
                    class="text-3xl sm:text-4xl md:text-5xl font-bold font-moondance text-white mb-4 leading-tight drop-shadow-lg">
                    {{ title }}
                </h2>
                <p class="text-white text-base sm:text-lg md:text-xl drop-shadow-md">
                    {{ p1 }}
                    <br /><br />
                    {{ p2 }}
                </p>
                <div v-if="btnText" class="mt-8 flex justify-center">
                    <NuxtLink to="/products"
                        class="px-5 py-2.5 sm:px-7 sm:py-3 bg-[#c3ac83] text-[#6b3e26] rounded-xl font-semibold shadow-lg hover:bg-[#b49a6b] hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6b3e26]/40 active:scale-95 text-base sm:text-lg">
                        {{ btnText }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    image: {
        type: String,
        required: true
    },
    title: String,
    p1: String,
    p2: String,
    p3: String,
    btnText: String
})
</script>