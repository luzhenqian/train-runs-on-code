import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader'
import { RoomEnvironment } from "RoomEnvironment"

class Game {
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  terrainMixer = null;
  trainMixer = null;
  clock = new THREE.Clock();
  railway = null;
  start = false
  trainAnimation = null
  goodsMeshes = []
  height = window.innerHeight * 0.8
  modelScale = 0.0017
  goodsSize = 0.2
  goods = [
    'meat',
    'iron',
    'coal',
    'oil',
    'fish',
    'cotton',
    'cpu',
    'radish',
    'wood',
    'gpu'
  ]
  materials = {}
  // ui elements
  btnEls = []
  goodsEls = []
  countdownEl = null
  loadingEl = null
  msgEl = null
  refreshEl = null
  accountBalanceEl = null
  neededGoodsEls = []
  // arguments
  dwellTime = 5_000
  countdown = 10
  start = false
  accountBalance = 1000
  // meshes
  cityMeshes = []
  cabinMeshes = []
  loadedGoods = []
  neededGoods = []
  producedGoods = []
  constructor() {
    this.initCanvas();
    this.initUI();
    this.autoScale();
  }
  initCanvas() {
    this.initMaterials()
    this.initRenderer()
    this.initScene()
    this.initCamera()
    this.initControls()
    this.loadModel()
    this.initEnvironment()
  }
  initUI() {
    this.btnEls = [
      $('#btn-one'),
      $('#btn-two'),
      $('#btn-three'),
    ]
    this.goodsEls = [
      $('#goods-one'),
      $('#goods-two'),
      $('#goods-three'),
    ]
    this.countdownEl = $('#countdown')
    this.loadingEl = $('#loading')
    this.msgEl = $('#msg')
    this.neededGoodsEls = [
      $("#needed-goods-one"),
      $("#needed-goods-two"),
      $("#needed-goods-three"),
      $("#needed-goods-four"),
      $("#needed-goods-five")
    ]
    this.accountBalanceEl = $('#account-balance')
    this.refreshEl = $('#refresh')

    this.btnEls.forEach((btnEl, idx) => {
      btnEl.on('click', () => {
        const goods = this.producedGoods[idx]
        this.loadedGoods.unshift(goods)
        this.goodsMeshRenderer()
      })
    })
  }
  initRenderer() {
    // Create a WebGL renderer
    const renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, this.height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);
  }
  initCamera() {
    // Create a camera
    const camera = this.camera = new THREE.PerspectiveCamera(25, window.innerWidth / (window.innerHeight * 0.8), 0.25, 20);
    camera.position.set(6.4, 2.5, 10);
  }
  initScene() {
    // Create a scene
    const scene = this.scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    loader.load('./assets/images/game-bg.png', function (texture) {
      scene.background = texture;
    });
    // scene.add(new THREE.AxesHelper(3));
  }
  initControls() {
    // Create a Controls
    const controls = this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();
    controls.enablePan = false;
    // controls.enableZoom = false;
    // controls.enableRotate = false;
    controls.enableDamping = true;
  }
  initEnvironment() {
    // Add a room environment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
  }
  initMaterials() {
    const loader = new THREE.TextureLoader();
    this.goods.forEach(goods => {
      loader.load(`./assets/images/goods_${goods}_on@3x.png`, (texture) => {
        texture.needsUpdate = true
        this.materials[goods] = new THREE.MeshBasicMaterial({
          map: texture,
        })
      })
    })
  }
  loadModel() {
    const loader = new GLTFLoader();
    loader.load('./assets/model/terrain.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(this.modelScale, this.modelScale, this.modelScale);
      model.children.forEach(child => {
        if (child.name === 'castle_T1') {
          this.cityMeshes[0] = child
        }
        if (child.name === 'castle_T2') {
          this.cityMeshes[1] = child
        }
        if (child.name === 'castle_T3') {
          this.cityMeshes[2] = child
        }
        if (child.name === 'castle_T4') {
          this.cityMeshes[3] = child
        }
        if (child.name === 'castle_T5') {
          this.cityMeshes[4] = child
        }
      })
      this.scene.add(model);

      const terrainMixer = this.terrainMixer = new THREE.AnimationMixer(model);
      terrainMixer.clipAction(gltf.animations[0]).play();
    })

    loader.load('./assets/model/ani.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(this.modelScale, this.modelScale, this.modelScale);

      model.children.forEach(child => {
        if (child.name === 'locomotive-wagon-western1') {
          this.cabinMeshes[0] = child
        }
        if (child.name === 'locomotive-wagon-western2') {
          this.cabinMeshes[1] = child
        }
        if (child.name === 'locomotive-wagon-western3') {
          this.cabinMeshes[2] = child
        }
        if (child.name === 'box1_') {
          this.goodsMeshes[0] = child;
        }
        if (child.name === 'box2') {
          this.goodsMeshes[1] = child;
        }
        if (child.name === 'box3') {
          this.goodsMeshes[2] = child;
        }
      })

      this.scene.add(model);

      // Create a mixer
      this.trainMixer = new THREE.AnimationMixer(model);
      this.trainAnimation = this.trainMixer.clipAction(gltf.animations[0])
    })
  }
  arrival() {
    this.btnEls.forEach(btnEl => btnEl.show())
    this.randomGoods()
    this.makeNeededGoods()
    const profit = this.settlement()
    if (profit > 0) {
      this.msgEl.text(`本次盈利！+${profit}￥`)
      this.msgEl.css('color', '#C0FF00')
    } else if (profit === 0) {
      this.msgEl.text(`本次没有获利！`)
      this.msgEl.css('color', 'white')
    } else {
      this.msgEl.text(`本次亏损！${profit}￥`)
      this.msgEl.css('color', '#FF001E')
    }
    this.msgEl.css('opacity', '1')
    this.accountBalanceEl.text(`${this.accountBalance}￥`)

    this.loadedGoods = []
    this.goodsMeshRenderer()
  }
  departure() {
    // this.goodsMeshes.forEach(goodsMesh => goodsMesh.visible = false)
    this.btnEls.forEach(btnEl => btnEl.hide())
    this.disableGoodsControl()
    this.msgEl.css('opacity', '0')
  }
  settlement() {
    // 每次消耗燃料 -50
    // 每卖出一件商品 +50
    let res = -100
    this.accountBalance += res
    return res
  }
  autoScale() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, this.height);
    }, false);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();
    if (this.terrainMixer) {
      this.terrainMixer.update(delta);
      this.setAllDemandGoodsPosition()
    }
    if (this.start && this.trainMixer) {
      this.trainMixer.update(delta);
      // this.goodsMeshRenderer()
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  play() {
    let countdown = this.countdown;
    this.countdownEl.text(`${countdown -= 1}s`)
    this.disableGoodsControl()
    const timer = setInterval(() => {
      this.countdownEl.text(`${countdown -= 1}s`)
      if (countdown === 0) {
        this.loadingEl.hide()
        this.activeGoodsControl()
        clearInterval(timer)
        this.start = true

        this.randomGoods()
        this.makeNeededGoods()
        setTimeout(this.trainAnimationPlay.bind(this), this.dwellTime)
      }
    }, 1_000)

    this.animate()
  }
  randomGoods() {
    for (let i = 0; i < 3; i++) {
      let goods = this.goods[Math.floor(Math.random() * this.goods.length)]
      for (; this.producedGoods.includes(goods);) {
        goods = this.goods[Math.floor(Math.random() * this.goods.length)]
      }
      this.producedGoods[i] = goods
      this.goodsEls[i].css(
        'background-image',
        `url(./assets/images/goods_${goods}_on@2x.png)`)
      this.goodsEls[i].data(
        'goods',
        goods
      )
    }
  }
  makeNeededGoods() {
    this.neededGoods = [
      this.goods[Math.floor(Math.random() * this.goods.length)],
      this.goods[Math.floor(Math.random() * this.goods.length)],
      this.goods[Math.floor(Math.random() * this.goods.length)],
      this.goods[Math.floor(Math.random() * this.goods.length)],
      this.goods[Math.floor(Math.random() * this.goods.length)]
    ]

    this.neededGoods.forEach((goods, idx) => {
      this.neededGoodsEls[idx].find('img').attr(
        'src',
        `./assets/images/goods_${goods}_on@3x.png`
      )
    })
  }
  setAllDemandGoodsPosition() {
    this.neededGoodsEls.forEach((el, idx) => {
      this.setDemandGoodsPosition(this.cityMeshes[idx], el)
    })
  }
  setDemandGoodsPosition(city, goodsEl) {
    const vector = new THREE.Vector3(
      city.position.x * this.modelScale,
      city.position.y * this.modelScale,
      city.position.z * this.modelScale
    ).project(this.camera)
    let halfWidth = window.innerWidth / 2;
    let halfHeight = this.height / 2;
    let left = vector.x * halfWidth + halfWidth
    let top = -vector.y * halfHeight + halfHeight
    goodsEl.css({
      left,
      top
    });
  }
  trainAnimationPlay() {
    this.trainAnimation.play();
    this.departure()
    this.trainMixer.addEventListener('loop', (e) => {
      this.trainAnimation.stop();
      this.arrival()
      setTimeout(() => {
        this.trainAnimation.play();
        this.departure()
      }, this.dwellTime)
    });
  }
  disableGoodsControl() {
    this.goodsEls.forEach((goodsEl, idx) => {
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx] || 'gpu'}_off@2x.png)`
      )
    })
    this.btnEls.forEach((btnEl) => {
      btnEl.hide()
    })
    this.refreshEl.css(
      'filter',
      'grayscale(100%)'
    )
  }
  activeGoodsControl() {
    this.btnEls.forEach((btnEl) => {
      btnEl.show()
    })

    this.refreshEl.css(
      'filter',
      'none'
    )
  }
  goodsMeshRenderer() {
    this.goodsMeshes.forEach((goodsMesh, idx) => {
      const goods = this.loadedGoods[idx]
      if (!goods) {
        goodsMesh.visible = false
        return
      }
      goodsMesh.material = this.materials[goods]
      goodsMesh.visible = true
    })
  }
}

new Game().play()