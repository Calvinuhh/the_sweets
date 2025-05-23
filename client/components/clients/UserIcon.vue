<template>
    <div class="relative flex items-center" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div>
            <ClientOnly>
                <template #default>
                    <svg v-if="!isAuthenticated" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="20" fill="#cfd8dc" />
                        <circle cx="20" cy="16" r="7" fill="#78909c" />
                        <ellipse cx="20" cy="29" rx="12" ry="7" fill="#b0bec5" />
                    </svg>
                    <div v-else class="relative">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="20" fill="#ffe0e6" />
                            <circle cx="20" cy="16" r="7" fill="#ec4899" />
                            <ellipse cx="20" cy="29" rx="12" ry="7" fill="#fbbf24" />
                        </svg>
                        <span
                            class="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 shadow">
                            {{ displayName }}</span>
                    </div>
                </template>
                <template #fallback>
                    <div class="w-[40px] h-[40px] bg-gray-200 rounded-full"></div>
                </template>
            </ClientOnly>
        </div>
        <ClientOnly>
            <div v-if="showModal && isMounted"
                class="absolute top-12 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col gap-2 min-w-[160px]">

                <template v-if="!isAuthenticated">
                    <button @click="goToRegister"
                        class="w-full px-3 py-2 rounded text-sm font-semibold text-pink-700 hover:bg-pink-50 transition">
                        Registrarse
                    </button>
                    <button @click="goToLogin"
                        class="w-full px-3 py-2 rounded text-sm font-semibold text-yellow-700 hover:bg-yellow-50 transition">
                        Iniciar sesión
                    </button>
                </template>

                <template v-else>
                    <button @click="goToProfile"
                        class="w-full px-3 py-2 rounded text-sm font-semibold text-pink-700 hover:bg-pink-50 transition">
                        Perfil
                    </button>
                    <button @click="handleLogout"
                        class="w-full px-3 py-2 rounded text-sm font-semibold text-red-700 hover:bg-red-50 transition">
                        Cerrar sesión
                    </button>
                </template>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '~/stores/users'
import { useAlert } from '~/composables/useAlert'

const usersStore = useUsersStore()
const isAuthenticated = computed(() => usersStore.isAuthenticated)
const userData = computed(() => usersStore.getUserData)
const displayName = computed(() => userData.value?.name || 'Usuario')
const router = useRouter()
const { showSuccess } = useAlert()

const showModal = ref(false)
const isMounted = ref(false)
let hideTimeout = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
    isMounted.value = true
    usersStore.loadFromLocalStorage()
})

function handleMouseEnter() {
    if (hideTimeout.value) {
        clearTimeout(hideTimeout.value)
        hideTimeout.value = null
    }
    showModal.value = true
}

function handleMouseLeave() {
    hideTimeout.value = setTimeout(() => {
        showModal.value = false
    }, 300)
}

function goToRegister() {
    router.push('/user/register')
    showModal.value = false
}

function goToLogin() {
    router.push('/user/login')
    showModal.value = false
}

function goToProfile() {
    router.push('/user/profile')
    showModal.value = false
}

function handleLogout() {
    usersStore.logout()
    showSuccess('Has cerrado sesión correctamente')
    showModal.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>