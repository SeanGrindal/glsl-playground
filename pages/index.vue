<template>
  <div class="width-container pt-32">
    <nav class="nav">
      <ul>
        <li><nuxt-link to="/gooey">Gooey</nuxt-link></li>
        <li><nuxt-link to="/particle-scroll">Particle Scroll</nuxt-link></li>
        <li><nuxt-link to="/particle-hover">Particle Hover</nuxt-link></li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  ul {
    li + li {
      margin-top: 1rem;
    }
  }
}
</style>
