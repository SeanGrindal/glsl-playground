import * as THREE from 'three'

import gsap from 'gsap'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

export default class ImagesToCanvasController {
  imageEls: any
  imageTextures: {
    el: HTMLElement
    imgAR: number
    texture: any
    hoverTexture: any
    sizes: THREE.Vector2
    offset: THREE.Vector2
    mesh: any
    uniforms: any
  }[]
  loader: THREE.TextureLoader
  mouse: THREE.Vector2

  onMouseMove: any
  onWindowResize: any

  constructor(scene, wrapper) {
    this.imageEls = wrapper.querySelectorAll('.gl-image')

    this.loadImageTextures(() => {
      this.getMeshSizes()
      this.createMeshes(scene)
    })

    this.mouse = new THREE.Vector2(0, 0)

    this.onMouseMove = (e) => {
      gsap.to(this.mouse, {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        duration: 0.5,
      })
    }

    let resizeTimeout = null
    this.onWindowResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.updateUniforms()
      }, 100)
    }

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('resize', this.onWindowResize)
  }

  async loadImageTextures(cb) {
    const formatAR = (arString) => {
      if (!arString) return 1

      const arArray = arString.split('x')
      const ar = arArray[0] / arArray[1]

      if (isNaN(ar)) {
        return 1
      } else {
        return ar
      }
    }

    this.imageTextures = []
    const loader = new THREE.TextureLoader()

    await Promise.all(
      [...this.imageEls].map(async (imgEl) => {
        const texture = await loader.load(imgEl.dataset.src)
        const hoverTexture = await loader.load(imgEl.dataset.hover)

        this.imageTextures.push({
          el: imgEl,
          imgAR: formatAR(imgEl.dataset.ar),
          texture: texture,
          hoverTexture: hoverTexture,
          sizes: new THREE.Vector2(0, 0),
          offset: new THREE.Vector2(0, 0),
          mesh: null,
          uniforms: null,
        })
      })
    )

    if (typeof cb === 'function') {
      cb()
    }
  }

  getMeshSizes() {
    this.imageTextures.forEach((imgTexture) => {
      const { width, height, top, left } = imgTexture.el.getBoundingClientRect()

      imgTexture.sizes.set(width, height)
      imgTexture.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
    })
  }

  updateUniforms() {
    this.imageTextures.forEach(({ uniforms }) => {
      uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
    })
  }

  createMeshes(scene) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    this.imageTextures.forEach((imgTexture) => {
      const { texture, hoverTexture, sizes, offset } = imgTexture

      const uniforms = {
        u_image: { type: 't', value: texture },
        u_imagehover: { type: 't', value: hoverTexture },
        u_img_ar: { value: imgTexture.imgAR },
        u_geom_ar: { value: imgTexture.sizes.x / imgTexture.sizes.y },
        u_mouse: { value: this.mouse },
        u_time: { value: 0 },
        u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uRippleFreq: { value: 9 },
        uSize: { value: 300 * (1 / window.innerWidth) },
        uSpeed: { value: 38 },
        uCircleStrength: { value: 2 },
      }

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        defines: {
          PR: window.devicePixelRatio.toFixed(1),
        },
      })

      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(offset.x, offset.y, 0)
      mesh.scale.set(sizes.x, sizes.y, 1)

      imgTexture.mesh = mesh
      imgTexture.uniforms = uniforms

      scene.add(imgTexture.mesh)
    })
  }

  tick() {
    this.imageTextures.forEach(({ uniforms }) => {
      uniforms.u_time.value += 0.01
    })
  }

  destroy() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.onWindowResize)
  }
}
