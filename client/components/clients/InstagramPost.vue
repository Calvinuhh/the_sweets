<template>
    <div class="flex justify-center my-8">
        <blockquote class="instagram-media" :data-instgrm-permalink="url" data-instgrm-version="14"
            style="background:#FFF; border:0; margin: 1px auto; max-width:540px; width:100%; min-width:326px;">
        </blockquote>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'

declare global {
    interface Window {
        instgrm?: any
    }
}

const props = defineProps({
    url: {
        type: String,
        required: true
    }
})

function processInstagram() {
    if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process()
    }
}

if (import.meta.client) {
    if (!window.instgrm) {
        const script = document.createElement('script')
        script.setAttribute('src', 'https://www.instagram.com/embed.js')
        script.async = true
        script.onload = processInstagram
        document.body.appendChild(script)
    }
}

onMounted(() => {
    processInstagram()
})

watch(() => props.url, () => {
    processInstagram()
})
</script>