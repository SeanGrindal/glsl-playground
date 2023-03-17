<template>
  <div class="app" ref="appWrapper">
    <canvas ref="canvas"></canvas>

    <div data-hover="/images/sunset.jpg" class="center-img gl-image" data-ar="2401x1600"></div>
  </div>
</template>

<script lang="ts" setup>
import { useGooey } from './useGooey'

const appWrapper = ref(null)
const canvas = ref(null)

useGooey(appWrapper, canvas)
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700;900&display=swap');

.app {
  background-color: #fffefe;
  position: fixed;
  height: 100%;
  width: 100%;
}

canvas {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 2;
}

.center-img {
  width: 60%;
  height: 60%;
  overflow: hidden;
  border: 1px solid theme('colors.slate.300');
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: 10;
}
</style>
