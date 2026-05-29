<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

import soundtrack from '@/assets/audio/soundtrack.mp3'

const bgMusic = new Audio(soundtrack)

bgMusic.loop = true
bgMusic.volume = 0.015

onMounted(() => {
  bgMusic.play().catch(() => {})
})

onUnmounted(() => {
  bgMusic.pause()
})
</script>