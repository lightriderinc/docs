<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import lottie, { type AnimationItem } from 'lottie-web'
import animationData from '../assets/grid-pattern-animation.json'

const container = useTemplateRef<HTMLDivElement>('container')
let anim: AnimationItem | null = null

onMounted(() => {
  anim = lottie.loadAnimation({
    container: container.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData,
  })
})

onBeforeUnmount(() => {
  anim?.destroy()
})
</script>

<template>
  <div ref="container" class="grid-pattern-animation" role="img" aria-label="Grid pattern"></div>
</template>

<style scoped>
.grid-pattern-animation {
  width: 100%;
  height: 100%;
}

html:not(.dark) .grid-pattern-animation {
  filter: invert(1);
}
</style>
