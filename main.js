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
  train = [];
  start = false
  trainAnimation = null;
  cabin1 = null
  cabin2 = null
  cabin3 = null
  goods1 = null
  goods2 = null
  goods3 = null
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
  // ui elements
  btnOneEl = null
  btnTwoEl = null
  btnThreeEl = null
  goods1El = null
  goods2El = null
  goods3El = null
  countdownEl = null
  loadingEl = null
  msgEl = null
  // arguments
  dwellTime = 3_000
  countdown = 3
  start = false
  accountBalance = 1000
  accountBalanceEl = null
  cityMeshes = []
  neededGoodsEls = null
  loadedGoods = []
  neededGoods = []
  constructor() {
    this.initCanvas();
    this.initUI();
    this.autoScale();
  }
  initCanvas() {
    this.initRenderer()
    this.initScene()
    this.initCamera()
    this.initControls()
    this.loadModel()
    this.initEnvironment()
  }
  initUI() {
    this.btnOneEl = $('#btn1')
    this.btnTwoEl = $('#btn2')
    this.btnThreeEl = $('#btn3')
    this.goods1El = $('#goods1')
    this.goods2El = $('#goods2')
    this.goods3El = $('#goods3')
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

    const makeVisibleFn = () => {
      let i = 0
      return () => {
        const goodsMeshes = [
          this.goods1,
          this.goods2,
          this.goods3,
        ]
        if (i === goodsMeshes.length) {
          i = 0
        }
        goodsMeshes[i++].visible = true
      }
    }

    const visible = makeVisibleFn()

    this.btnOneEl.on('click', () => {
      const goods = this.goods1El.data('goods')
      this.goods3.material.map = this.goods2.material.map
      this.goods2.material.map = this.goods1.material.map
      this.goods1.material.map = new THREE.TextureLoader().load(`./assets/images/goods_${goods}_on@2x.png`)
      visible()
    })
    this.btnTwoEl.on('click', () => {
      const goods = this.goods2El.data('goods')
      this.goods3.material.map = this.goods2.material.map
      this.goods2.material.map = this.goods1.material.map
      this.goods1.material.map = new THREE.TextureLoader().load(`./assets/images/goods_${goods}_on@2x.png`)
      visible()
    })
    this.btnThreeEl.on('click', () => {
      const goods = this.goods3El.data('goods')
      this.goods3.material.map = this.goods2.material.map
      this.goods2.material.map = this.goods1.material.map
      this.goods1.material.map = new THREE.TextureLoader().load(`./assets/images/goods_${goods}_on@2x.png`)
      visible()
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
    scene.add(new THREE.AxesHelper(3));
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
  loadModel() {
    const loader = new GLTFLoader();
    loader.load('./assets/model/terrain.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(this.modelScale, this.modelScale, this.modelScale);
      model.children.forEach(child => {
        console.log(child.name);
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
          this.western1 = child
          this.goods1 = this.makeGoods(child)
        }
        if (child.name === 'locomotive-wagon-western2') {
          this.western2 = child
          this.goods2 = this.makeGoods(child)
        }
        if (child.name === 'locomotive-wagon-western3') {
          this.western3 = child
          this.goods3 = this.makeGoods(child);
        }
      })

      this.scene.add(model);

      // Create a mixer
      this.trainMixer = new THREE.AnimationMixer(model);
      this.trainAnimation = this.trainMixer.clipAction(gltf.animations[0])
    })
  }
  arrival() {
    this.btnOneEl.show()
    this.btnTwoEl.show()
    this.btnThreeEl.show()
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
  }
  departure() {
    this.goods1.visible = false;
    this.goods2.visible = false;
    this.goods3.visible = false;
    this.btnOneEl.hide()
    this.btnTwoEl.hide()
    this.btnThreeEl.hide()
    this.disableGoods()
    this.msgEl.css('opacity', '0')
  }
  settlement() {
    // 每次消耗燃料 -50
    // 每卖出一件商品 +50
    let res = -100
    this.accountBalance += res
    return res
  }
  makeGoods(containerMesh) {
    const geometry = new THREE.BoxGeometry(
      this.goodsSize,
      this.goodsSize,
      this.goodsSize);
    const material = new THREE.MeshBasicMaterial({
      map: null
    });
    const goods = new THREE.Mesh(geometry, material);
    var { x, y, z } = containerMesh.position;
    goods.position.x = x * this.modelScale - 0.35
    goods.position.y = y * this.modelScale + 0.22
    goods.position.z = z * this.modelScale
    containerMesh.children.push(goods)
    goods.visible = false
    return goods;
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
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  play() {
    let countdown = this.countdown;
    this.countdownEl.text(`${countdown -= 1}s`)
    // this.disableGoods()
    const timer = setInterval(() => {
      this.countdownEl.text(`${countdown -= 1}s`)
      if (countdown === 0) {
        this.loadingEl.hide()
        clearInterval(timer)
        this.start = true

        this.randomGoods()
        this.makeNeededGoods()
        setTimeout(this.trainAnimationPlay.bind(this), this.dwellTime)

        this.animate()
      }
    }, 1_000)
  }
  randomGoods() {
    const goodsArr = []
    for (let i = 0; i < 3; i++) {
      let goods = this.goods[Math.floor(Math.random() * this.goods.length)]
      for (; goodsArr.includes(goods);) {
        goods = this.goods[Math.floor(Math.random() * this.goods.length)]
      }
      goodsArr.push(goods)
    }
    this.goods1El.css('background-image', `url(./assets/images/goods_${goodsArr[0]}_on@2x.png)`)
    this.goods2El.css('background-image', `url(./assets/images/goods_${goodsArr[1]}_on@2x.png)`)
    this.goods3El.css('background-image', `url(./assets/images/goods_${goodsArr[2]}_on@2x.png)`)
    this.goods1El.data('goods', goodsArr[0])
    this.goods2El.data('goods', goodsArr[1])
    this.goods3El.data('goods', goodsArr[2])
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
        `./assets/images/goods_${goods}_on@2x.png`
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
  disableGoods() {
    this.goods1El.css('background-image', `url(./assets/images/goods_${this.goods1El.data('goods')}_off@2x.png)`)
    this.goods2El.css('background-image', `url(./assets/images/goods_${this.goods2El.data('goods')}_off@2x.png)`)
    this.goods3El.css('background-image', `url(./assets/images/goods_${this.goods3El.data('goods')}_off@2x.png)`)
    this.btnOneEl.hide()
    this.btnTwoEl.hide()
    this.btnThreeEl.hide()
  }
}

new Game().play()