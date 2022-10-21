import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target: HTMLElement | Window, event, callback) {
  // if you want, you can also make this
  // support selector strings as target
  target.addEventListener(event, callback)
  onUnmounted(() => target.removeEventListener(event, callback))
}
