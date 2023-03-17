<template>
  <div class="particle-images-demo">
    <p class="absolute text-center pointer-events-none z-10 w-full mt-[16vh] text-2xl font-medium">Scroll 👇🏻</p>
    <canvas />
  </div>
</template>

<script>
import * as THREE from 'three'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

if (process.client) {
  var dat = await import('dat.gui')
}

export default {
  data: () => ({
    scene: null,
    camera: null,
    renderer: null,
    move: 4400,
  }),
  methods: {
    render() {
      this.renderRequest = requestAnimationFrame(this.render.bind(this))

      this.material.uniforms.uMove.value = this.move
      this.material.uniforms.uTime.value = this.clock.getElapsedTime()

      this.renderer.render(toRaw(this.scene), this.camera)
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000)

      this.camera.position.z = 800
    },
    addMesh() {
      const particles = {
        w: 2400 / 2,
        h: 1543 / 2,
      }

      this.geometry = new THREE.BufferGeometry()
      const particleNumber = particles.w * particles.h

      const positions = new THREE.BufferAttribute(new Float32Array(particleNumber * 3), 3)
      const coordinates = new THREE.BufferAttribute(new Float32Array(particleNumber * 3), 3)
      const speeds = new THREE.BufferAttribute(new Float32Array(particleNumber), 1)
      const offsets = new THREE.BufferAttribute(new Float32Array(particleNumber), 1)
      const direction = new THREE.BufferAttribute(new Float32Array(particleNumber), 1)
      const press = new THREE.BufferAttribute(new Float32Array(particleNumber), 1)

      const rand = (a, b) => {
        return a + (b - a) * Math.random()
      }

      let index = 0
      for (let i = 0; i < particles.w; i++) {
        for (let j = 0; j < particles.h; j++) {
          positions.setXYZ(index, i - particles.w / 2, j - particles.h / 2, 0)
          coordinates.setXYZ(index, i, j, 0)
          speeds.setX(index, rand(0.06, 2))
          offsets.setX(index, rand(-1000, 1000))
          direction.setX(index, Math.random() > 0.5 ? 1 : -1)
          press.setX(index, rand(0.4, 1))

          index++
        }
      }

      this.geometry.setAttribute('position', positions)
      this.geometry.setAttribute('aCoordinates', coordinates)
      this.geometry.setAttribute('aSpeed', speeds)
      this.geometry.setAttribute('aOffset', offsets)
      this.geometry.setAttribute('aDirection', direction)
      this.geometry.setAttribute('aPress', press)

      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: {
            value: 0,
          },
          uImage: {
            value: this.image,
          },
          uMove: {
            value: 0,
          },
          uArea: {
            value: 300,
          },
          uXEffect: {
            value: 60,
          },
          uYEffect: {
            value: 60,
          },
          uZEffect: {
            value: 60,
          },
          uSpeed: {
            value: 8,
          },
          uParticleSize: {
            value: 1,
          },
          uMouse: {
            value: this.mouse,
          },
          uSize: {
            value: new THREE.Vector2(particles.w, particles.h),
          },
          uPR: {
            value: window.devicePixelRatio,
          },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })

      this.mesh = new THREE.Points(this.geometry, this.material)

      this.testMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(4000, 4000), new THREE.MeshBasicMaterial())

      this.scene.add(this.mesh)
    },
    loadTextures() {
      this.loader = new THREE.TextureLoader()

      this.image = this.loader.load('/images/sunset.jpg')
    },
    onScroll() {
      this.move = 4400 - window.scrollY * 2
    },
    initGUI() {
      this.gui = new dat.GUI()

      this.gui.add(this.material.uniforms.uArea, 'value', 10, 1000, 1).name('Area')
      this.gui.add(this.material.uniforms.uSpeed, 'value', 0.5, 30, 0.5).name('Speed')
      this.gui.add(this.material.uniforms.uParticleSize, 'value', 0.1, 2, 0.01).name('Size')
      this.gui.add(this.material.uniforms.uXEffect, 'value', 0, 200, 1).name('X Effect')
      this.gui.add(this.material.uniforms.uYEffect, 'value', 0, 200, 1).name('Y Effect')
      this.gui.add(this.material.uniforms.uZEffect, 'value', 0, 200, 1).name('Z Effect')
    },
  },
  mounted() {
    this.loadTextures()

    this.scene = new THREE.Scene()
    this.canvas = this.$el.querySelector('canvas')
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2(-10000, -10000)

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.initCamera()
    this.addMesh()

    // this.initGUI()

    this.clock = new THREE.Clock()

    window.addEventListener('scroll', this.onScroll)

    this.render()
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderRequest)

    window.removeEventListener('scroll', this.onScroll)

    this.gui.destroy()

    this.scene = null
    this.renderer = null
  },
}
</script>

<style lang="scss" scoped>
.particle-images-demo {
  height: calc(2200px + 100vh);
  width: 100%;

  canvas {
    top: 0;
    left: 0;
    position: fixed;
    background-color: #ffffff;
    height: 100%;
    width: 100%;
    z-index: 0;
  }

  .text-hero {
    position: absolute;
    top: 24%;
    left: 0;
    line-height: 1.2;
    font-weight: 900;
    z-index: 100;
  }
}
</style>
