<template>
    <div class="relative w-full h-[650px] flex items-center overflow-hidden">
        <img :src="image" alt="dessert" class="inset-0 w-full h-full  object-cover object-left" style="z-index: 1;"
            draggable="false" />
        <div class="absolute inset-0 bg-black opacity-65" style="z-index: 2;"></div>
        <div class="absolute inset-0"
            style="background: linear-gradient(to right, rgba(255,255,255,0) 10%, rgba(255,255,255,0.95) 100%); z-index: 3;">
        </div>
        <div class="relative z-10 flex w-full h-full items-center justify-center">
            <div class="max-w-lg text-center">
                <h2 class="text-5xl font-bold font-moondance text-[#6b3e26] mb-4">{{ title }}</h2>
                <p class="text-[#6b3e26] text-lg ">
                    {{ p1 }}
                    <br /><br />
                    {{ p2 }}
                </p>
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

})
</script>