<template>
  <div class="app" ref="appWrapper">
    <canvas ref="canvas"></canvas>

    <div>
      <div class="GooeyDeco">
        <div data-hover="/pink.jpg" class="center-img gl-image" data-ar="2401x1600"></div>
        <img src="/landing-text.png" class="center-text" data-ar="2400x1600" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGooey } from './useGooey'

const appWrapper = ref(null)
const canvas = ref(null)

useGooey(appWrapper, canvas)
</script>

<style lang="scss">
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
}

.GooeyDeco {
  background-color: #fff;

  .center-img {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    top: 0;
    position: absolute;
    z-index: 10;
    // mix-blend-mode: multiply;
  }

  img.center-text {
    width: 100%;
    max-width: 940px;
    max-height: 100%;
    object-fit: contain;
    padding: 4rem 2rem;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50%));
    z-index: 10;

    @media (min-aspect-ratio: 12/9) {
      transform: translate(-50%, calc(-50% - 10px));
    }
  }

  img.bottom-circle {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 1600px;
  }

  form {
    display: flex;
    flex-direction: column;
    padding: 2rem 0;

    input {
      padding: 0.75rem 1.5rem;
      border: 1px solid gray;
      border-radius: 0.5em;
      margin: 0.5rem 8px;
    }
  }
}
</style>
