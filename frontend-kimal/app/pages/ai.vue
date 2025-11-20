<template>
  <ClientOnly>
    <ChatUI />
  </ClientOnly>
</template>

<script setup lang="ts">
import ChatUI from '~/components/IA/ChatUI.vue'
// Removido definePageMeta({ layout: false }) para que use el layout default con navbar
</script>
