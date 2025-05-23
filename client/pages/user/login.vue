<template>
    <div class="login-page py-12">
        <div class="container mx-auto px-4">
            <LoginForm @login-success="onLoginSuccess" @login-error="onLoginError" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useUsersStore } from '~/stores/users';
import LoginForm from '~/components/clients/LoginForm.vue';

definePageMeta({
    layout: 'clients',
    middleware: 'auth-guest'
})

const usersStore = useUsersStore();

onMounted(() => {
    usersStore.loadFromLocalStorage();

    if (usersStore.isAuthenticated) {
        navigateTo('/');
    }
});

const onLoginSuccess = () => {
};

const onLoginError = (message: string) => {
};
</script>

<style scoped>
.login-page {
    min-height: 60vh;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 0;
    padding-bottom: 0;
}
</style>