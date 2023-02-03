import * as THREE from 'three'
import AmmoLib from './ammo.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper'
import { CCDIKHelper } from 'three/examples/jsm/animation/CCDIKSolver'
const { GUI } = require('three/examples/jsm/libs/lil-gui.module.min.js')

// fix Ammo not a function && Ammo.xxx not a constructor
declare global {
  export interface Window {
    Ammo: any
  }
}

class Dancer {
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000,
  )
  private scene: THREE.Scene = new THREE.Scene()
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true })
  private effect: OutlineEffect = new OutlineEffect(this.renderer)
  private stats: Stats = Stats()
  private loader = new MMDLoader()
  private mesh: THREE.SkinnedMesh | undefined = undefined
  private helper: MMDAnimationHelper | undefined = undefined
  private ikHelper: CCDIKHelper | undefined = undefined
  private physicsHelper: CCDIKHelper | undefined = undefined
  private readonly clock: THREE.Clock | undefined = undefined
  constructor() {
    this.clock = new THREE.Clock()
    this.setUp()
  }

  private setUp = async () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this
    AmmoLib().then(function (re: any) {
      window.Ammo = re
      _that.init()
      _that.animate()
    })
  }

  private init = () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this
    const container = document.createElement('div')
    container.classList.add('dancer__Container')
    Object.assign(container.style, {
      width: '100%',
      height: '100%',
    })

    const renderNode = document.getElementById('dancer') ?? document.body
    renderNode.appendChild(container)

    // camera
    this.camera.position.z = 50

    // scene
    this.scene.background = new THREE.Color(0xffffff)

    const gridHelper = new THREE.PolarGridHelper(30, 0)
    gridHelper.position.y = -10
    this.scene.add(gridHelper)

    const ambient = new THREE.AmbientLight(0x666666)
    this.scene.add(ambient)

    const directionalLight = new THREE.DirectionalLight(0x887766)
    directionalLight.position.set(-1, 1, 1).normalize()
    this.scene.add(directionalLight)

    // renderer
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(renderNode.clientWidth, renderNode.clientHeight)
    container.appendChild(this.renderer.domElement)

    // STATS
    renderNode.appendChild(this.stats.dom)

    // model
    function onProgress(xhr: { lengthComputable: any; loaded: number; total: number }) {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100
        console.log(Math.round(percentComplete) + '% downloaded')
      }
    }

    const modelFile = 'models/miku_v2.pmd'
    const vmdFiles = ['models/wavefile_v2.vmd']

    this.helper = new MMDAnimationHelper({
      afterglow: 2.0,
    })

    this.loader.loadWithAnimation(
      modelFile,
      vmdFiles,
      function (mmd) {
        _that.mesh = mmd.mesh
        _that.mesh.position.y = -10
        _that.scene.add(_that.mesh)

        if (_that.helper === undefined) return
        _that.helper.add(_that.mesh, {
          animation: mmd.animation,
          physics: true,
        })

        _that.ikHelper = _that.helper.objects.get(_that.mesh)?.ikSolver.createHelper()!
        _that.ikHelper.visible = false
        _that.scene.add(_that.ikHelper)

        _that.physicsHelper = _that.helper.objects.get(_that.mesh)?.physics?.createHelper()!
        _that.physicsHelper.visible = false
        _that.scene.add(_that.physicsHelper)

        initGui()
      },
      onProgress,
      (e) => {
        return null
      },
    )

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.minDistance = 10
    controls.maxDistance = 100

    window.addEventListener('resize', _that.onWindowResize)

    function initGui() {
      const api = {
        animation: true,
        ik: true,
        outline: true,
        physics: true,
        'show IK bones': false,
        'show rigid bodies': false,
      }

      const gui = new GUI()
      gui.add(api, 'animation').onChange(function () {
        _that.helper?.enable('animation', api['animation'])
      })
      gui.add(api, 'ik').onChange(function () {
        _that.helper?.enable('ik', api['ik'])
      })

      gui.add(api, 'outline').onChange(function () {
        _that.effect.enabled = api['outline']
      })

      gui.add(api, 'physics').onChange(function () {
        _that.helper?.enable('physics', api['physics'])
      })

      gui.add(api, 'show IK bones').onChange(function () {
        if (_that.ikHelper !== undefined) _that.ikHelper.visible = api['show IK bones']
      })

      gui.add(api, 'show rigid bodies').onChange(function () {
        if (_that.physicsHelper !== undefined) _that.physicsHelper.visible = api['show rigid bodies']
      })
    }
  }

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.effect.setSize(window.innerWidth, window.innerHeight)
  }
  private animate = () => {
    requestAnimationFrame(this.animate)

    this.stats.begin()
    this.render()
    this.stats.end()
  }
  private render = () => {
    if (!this.clock) return
    this.helper?.update(this.clock.getDelta())
    this.effect.render(this.scene, this.camera)
  }
}
export default Dancer
