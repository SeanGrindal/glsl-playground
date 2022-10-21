import { createApp } from 'vue'
import App from '../app.vue'
import VueGtag from 'vue-gtag'

export default function () {
  createApp(App)
    .use(VueGtag, {
      config: { id: 'G-XT8WE2P5JL' },
    })
    .mount('#app')
}
