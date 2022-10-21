import { defineNuxtConfig } from 'nuxt'
const markdownRawPlugin = require('vite-raw-plugin')

export default defineNuxtConfig({
  meta: {
    title: 'Playground',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'Description',
        content: "Sean Grindal's GLSL playground.",
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
      {
        rel: 'icon',
        href: '/favicons/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
  css: ['@/assets/styles/main.scss'],
  modules: ['@nuxtjs/tailwindcss'],
  buildModules: ['@nuxtjs/google-fonts'],
  plugins: ['@/plugins/gtag.client.js'],
  googleFonts: {
    families: {
      Raleway: {
        wght: [100, 400, 700],
      },
    },
  },
  vite: {
    plugins: [
      markdownRawPlugin({
        fileRegex: /\.glsl$/,
      }),
    ],
  },
})
