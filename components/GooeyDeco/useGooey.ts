import * as THREE from 'three'
import ImagesToCanvasController from '~~/components/GooeyDeco/ImagesToCanvas'

import { useEventListener } from '~/composables/useListener'

if (process.client) {
  var dat = await import('dat.gui')
}

let renderer = null
let camera = null
let scene = null
let canvasImagesController = null
let updateRequest = null
let gui = null

const initLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2)
  scene.add(ambientLight)
}

const initCamera = () => {
  const perspective = 800

  const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI

  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1200)
  camera.position.set(0, 0, perspective)
}

const update = () => {
  updateRequest = requestAnimationFrame(update)

  renderer.render(scene, camera)
  canvasImagesController.tick()
}

const initGUI = () => {
  console.log(dat)
  gui = new dat.GUI()

  setTimeout(() => {
    const uniforms = canvasImagesController.imageTextures[0].uniforms

    gui.add(uniforms.uRippleFreq, 'value', 1, 200, 1).name('Ripple Freq.')
    gui.add(uniforms.uSize, 'value', 0.05, 0.5, 0.01).name('Size')
    gui.add(uniforms.uSpeed, 'value', 0, 100, 1).name('Speed')
    gui.add(uniforms.uCircleStrength, 'value', 0, 4, 0.1).name('Circle Strength')
  }, 0)
}

export function useGooey(appWrapper, canvas) {
  onMounted(() => {
    scene = new THREE.Scene()

    renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    canvasImagesController = new ImagesToCanvasController(scene, appWrapper.value)

    let resizeTimeout = null
    useEventListener(window, 'resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        renderer.setSize(window.innerWidth, window.innerHeight)
      }, 100)
    })

    initLights()
    initCamera()

    initGUI()

    update()
  })

  onUnmounted(() => {
    cancelAnimationFrame(updateRequest)

    if (gui) {
      gui.destroy()
    }

    canvasImagesController.destroy()

    scene = null
    renderer = null
  })
}
