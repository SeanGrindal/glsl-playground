<template>
  <header class="header width-container">
    <div class="flex items-center gap-4 w-1/2 pointer-events-auto">
      <nuxt-link to="/" class="underline font-medium">Home</nuxt-link>
      <nuxt-link to="/" class="underline font-medium">How do I use this?</nuxt-link>
      <h1 class="font-medium">built by <a target="_blank" href="https://twitter.com/seangrindal">@seangrindal</a></h1>
    </div>
  </header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.header {
  @apply py-2;

  position: fixed;
  pointer-events: none;
  z-index: 1;
  right: 0;
  left: 0;
}
</style>
