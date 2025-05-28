<template>
    <div class="w-full">
        <div v-if="!scriptLoaded" class="flex justify-center py-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
        </div>

        <div v-show="scriptLoaded" id="google-signin-button" class="w-full"></div>

        <div v-if="isLoading" class="flex justify-center mt-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useGoogleAuth } from '~/composables/useGoogleAuth'

const { renderGoogleButton, isLoading } = useGoogleAuth()
const scriptLoaded = ref(false)

onMounted(async () => {
    if (import.meta.client) {
        await loadGoogleScript()
        await nextTick()
        renderGoogleButton('google-signin-button')
        scriptLoaded.value = true
        setTimeout(() => {
            const btn = document.querySelector('#google-signin-button > div');
            if (btn) {
                (btn as HTMLElement).style.width = '100%';
            }
        }, 300);
    }
})

const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts) {
            resolve()
            return
        }

        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve())
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Google script')))
            return
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true

        script.onload = () => {
            setTimeout(() => resolve(), 100)
        }

        script.onerror = () => {
            reject(new Error('Failed to load Google Sign-In script'))
        }

        document.head.appendChild(script)
    })
}

declare global {
    interface Window {
        google: any
    }
}
</script>
