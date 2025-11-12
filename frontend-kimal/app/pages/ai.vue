<template>
  <ClientOnly>
    <ChatUI />
  </ClientOnly>
</template>

<script setup lang="ts">
import ChatUI from '~/components/IA/ChatUI.vue'
definePageMeta({ layout: false })
</script>
