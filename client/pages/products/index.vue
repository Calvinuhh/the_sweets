<template>
    <div class="flex flex-col md:flex-row gap-8 max-w-[1600px] mx-auto px-4 py-8">
        <Sidebar class="md:sticky md:top-24" />
        <div class="flex-1">
            <Desserts />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Sidebar from '~/components/clients/Sidebar.vue'
import Desserts from '~/components/clients/Desserts.vue'

definePageMeta({
    layout: "clients"
})
</script>
