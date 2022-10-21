import * as THREE from 'three'

import gsap from 'gsap'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

export default class Figure {
  constructor(sketch, wrapper) {
    this.$image = wrapper.querySelector('.gl-image')
    this.sketch = sketch

    this.material = null

    this.loader = new THREE.TextureLoader()

    this.image = this.loader.load(this.$image.dataset.src)
    this.hoverImage = this.loader.load(this.$image.dataset.hover)
    this.sizes = new THREE.Vector2(0, 0)
    this.offset = new THREE.Vector2(0, 0)

    this.mouse = new THREE.Vector2(0, 0)

    this.getSizes()

    this.createMesh()

    this.onMouseMove = (e) => {
      gsap.to(this.mouse, {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        duration: 0.5,
      })
    }

    window.addEventListener('mousemove', this.onMouseMove)
  }

  getSizes() {
    const { width, height, top, left } = this.$image.getBoundingClientRect()

    this.sizes.set(width, height)
    this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
  }

  createMesh() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    this.uniforms = {
      u_image: { type: 't', value: this.image },
      u_imagehover: { type: 't', value: this.hoverImage },
      u_mouse: { value: this.mouse },
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uRippleFreq: { value: 2 },
      uSize: { value: 0.06 },
      uSpeed: { value: 50 },
      uCircleStrength: { value: 2 },
    }

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      defines: {
        PR: window.devicePixelRatio.toFixed(1),
      },
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

    this.sketch.scene.add(this.mesh)
  }

  tick() {
    this.uniforms.u_time.value += 0.01
  }

  destroy() {
    window.removeEventListener('mousemove', this.onMouseMove)
  }
}
