const { OrbitControls, RoomEnvironment, GLTFLoader } = THREE;

class Game {
  // three arguments
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  terrainMixer = null;
  trainMixer = null;
  clock = new THREE.Clock();
  railway = null;
  trainAnimation = null
  goodsMeshes = []
  height = window.innerHeight * 0.8
  modelScale = 0.0017
  goodsSize = 0.2
  allGoods = {
    'meat': {
      price: 40
    },
    'iron': {
      price: 50
    },
    'coal': {
      price: 60
    },
    'oil': {
      price: 70
    },
    'fish': {
      price: 35
    },
    'cotton': {
      price: 30
    },
    'cpu': {
      price: 80
    },
    'radish': {
      price: 15
    },
    'wood': {
      price: 20
    },
    'gpu': {
      price: 80
    }
  }
  materials = {}
  tradeRecords = []
  loadingControl = null
  // ui elements
  producedButtonEls = []
  goodsEls = []
  refreshEl = null
  accountBalanceEl = null
  neededGoodsEls = []
  message = new Message()
  menuEls = {}
  gameOverEl = null
  restartButtonEl = null
  // arguments
  countdown = 10
  isPause = false
  accountBalance = 500
  energyConsumptionMoney = -50
  carryMoney = -5
  refreshMoney = -20
  // meshes
  cityMeshes = []
  cabinMeshes = []
  loadedGoods = [null, null, null]
  neededGoods = []
  producedGoods = []
  portMesh = null
  needInboundPlay = false
  setNeedInboundPlayTimer = null
  countdownTimer = null
  trainAnimationTimer = null
  constructor() {
    this.initUI();
    this.autoScale();
    this.initCanvas().then(() => {
      // 
    })
  }
  async initCanvas() {
    this.initRenderer()
    this.initScene()
    this.initCamera()
    this.initControls()
    this.initEnvironment()
    return Promise.all(
      [this.initMaterials(), this.loadModel()]
    )
  }
  initUI() {
    this.neededGoodsEls = [
      $("#needed-goods-one"),
      $("#needed-goods-two"),
      $("#needed-goods-three"),
      $("#needed-goods-four"),
      $("#needed-goods-five")
    ]
    this.accountBalanceEl = $('#account-balance')
    this.refreshEl = $('#refresh')
    this.refreshEl.on('click', this.refreshProducedGoods.bind(this))
    $('#refresh-money').text(`${-this.refreshMoney}￥`)

    // this.menuEls = {
    //   'music': $('#bgm'),
    //   'pause': $('#pause'),
    //   'pauseText': $('#pause-text'),
    //   'help': $('#help'),
    // }

    // this.menuEls.music.on('click', this.bgmPlay.bind(this))
    // this.menuEls.pause.on('click', () => {
    //   this.isPause ? this.resume() : this.pause()
    // })
    // this.menuEls.help.on('click', () => {
    //   this.pause()
    //   new Help()
    // })

    this.Main = new Main()
    this.initMenu = new InitMenu({
      onStart: () => {
        this.play()
        this.Main.Music.play('bgm')
      }
    })

    this.gameOverEl = $('#game-over')
    this.gameOverEl.hide()
    this.restartButtonEl = $('#restart-button')
    this.restartButtonEl.on('click', this.restart.bind(this))
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
  async initMaterials() {
    const goodsList = Object.keys(this.allGoods)
    return await this.loadMaterials(goodsList, new THREE.TextureLoader())
  }
  async loadMaterials(goodsList, loader) {
    return new Promise(async (resolve, reject) => {
      loader = loader || new THREE.TextureLoader();
      const goods = goodsList.pop()
      loader.load(`./assets/images/goods_${goods}_on@3x.png`, (texture) => {
        texture.needsUpdate = true
        this.materials[goods] = new THREE.MeshBasicMaterial({
          map: texture,
        })
        if (goodsList.length > 0) {
          this.loadMaterials(goodsList, loader).then(resolve)
        }
        resolve()
      }, undefined, (err) => {
        reject(err)
      })
    })
  }
  async loadModel() {
    return Promise.all([this.loadTerrainModel(), this.loadBaseModel(), this.loadTrainModel()])
  }
  async loadTerrainModel() {
    return new Promise((resolve) => {
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
          if (child.name === 'box2') {
            this.portMesh = child
          }
        })
        this.scene.add(model);

        const terrainMixer = this.terrainMixer = new THREE.AnimationMixer(model);
        terrainMixer.clipAction(gltf.animations[0]).play();
        resolve(null)
      })
    })
  }
  async loadBaseModel() {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load('./assets/model/base.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(this.modelScale, this.modelScale, this.modelScale);
        this.scene.add(model);
        resolve(null)
      })
    })
  }
  async loadTrainModel() {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();

      loader.load('./assets/model/train.gltf', (gltf) => {
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

        this.updateLoadedGoodsMesh()

        this.scene.add(model);

        // Create a mixer
        this.trainMixer = new THREE.AnimationMixer(model);
        this.trainAnimation = this.trainMixer.clipAction(gltf.animations[0])
        resolve(null)
      })
    })
  }
  arrival() {
    if (this.checkStatus()) {
      this.makeProducedGoods()
      this.makeNeededGoods()
      this.activeGoodsControl()
      this.loadedGoods = [null, null, null]
      this.updateLoadedGoodsMesh()
      this.neededGoodsEls.forEach(neededGoodsEl => neededGoodsEl.show())
      this.nextLoop()
      this.tradeRecords = []
    }
  }
  departure() {
    this.accountBalance += this.energyConsumptionMoney
    this.message.show(`消耗能源！${this.energyConsumptionMoney}`, 'error')
    this.outboundPlay()
    this.updateAccountBalanceUI()
    if (this.setNeedInboundPlayTimer !== null) {
      this.setNeedInboundPlayTimer.clear()
    }
    this.setNeedInboundPlayTimer = new Timer(() => {
      this.needInboundPlay = true
    }, 2_000)
  }
  checkStatus() {
    if (this.accountBalance < 50) {
      this.over()
      return false
    }
    return true
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
    if (!this.isPause && this.trainMixer) {
      this.trainMixer.update(delta);

      // 交易
      this.cityMeshes.forEach((cityMesh, idx) => {
        if (this.cabinMeshes[1].position.distanceTo(this.cityMeshes[idx].position) < 800) {
          if (this.tradeRecords[idx]) { return }
          this.tradeRecords[idx] = true
          this.trade(idx)
        }
      })

      // 到达
      if (this.needInboundPlay) {
        if (this.cabinMeshes[0].position.distanceTo(this.portMesh.position) < 600) {
          this.inboundPlay()
          this.needInboundPlay = false
        }
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  play() {
    this.activeGoodsControl()
    this.makeProducedGoods()
    this.makeNeededGoods()
    this.nextLoop()
    this.animate()
  }
  pause() {
    this.isPause = true
    this.menuEls.pause.attr('src', './assets/images/start@2x.png')
    this.menuEls.pauseText.text('开始')
    if (this.setNeedInboundPlayTimer) { this.setNeedInboundPlayTimer.pause() }
    this.countdownTimer.pause()
    this?.trainAnimationTimer?.pause()
    this?.loadingControl?.pause()
  }
  resume() {
    this.isPause = false
    this.menuEls.pause.attr('src', './assets/images/pause@2x.png')
    this.menuEls.pauseText.text('暂停')
    if (this.setNeedInboundPlayTimer) { this.setNeedInboundPlayTimer.resume() }
    this.countdownTimer.resume()
    this?.trainAnimationTimer?.resume()
    this?.loadingControl?.resume()
    this.activeGoodsControl()
  }
  nextLoop() {
    this.Main.nextLoop()
  }
  makeProducedGoods() {
    this.Main.makeProducedGoods()
  }
  makeNeededGoods() {
    const len = Object.keys(this.allGoods).length
    const allGoods = Object.keys(this.allGoods)
    this.neededGoods = [
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
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
  project3Dto2D(vector3) {
    const vector2 = new THREE.Vector3(
      vector3.x * this.modelScale,
      vector3.y * this.modelScale,
      vector3.z * this.modelScale
    ).project(this.camera)
    let halfWidth = window.innerWidth / 2;
    let halfHeight = this.height / 2;
    let left = vector2.x * halfWidth + halfWidth
    let top = -vector2.y * halfHeight + halfHeight
    return { left, top }
  }
  trainAnimationPlay() {
    this.trainAnimation.play();
    this.departure()
    this.trainMixer.addEventListener('loop', (e) => {
      this.trainAnimation.stop();
      this.arrival()
    });
  }
  activeGoodsControl() {
    this.goodsEls.forEach((goodsEl, idx) => {
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx]?.name || 'gpu'}_on@2x.png)`
      )
    })
  }
  trade(cityIdx) {
    const successIdx = this.loadedGoods.findIndex(goods => goods === this.neededGoods[cityIdx])
    if (successIdx > -1) {
      const goods = this.loadedGoods[successIdx]
      this.goodsMeshes[successIdx].visible = false
      this.loadedGoods[successIdx] = null
      this.neededGoodsEls[cityIdx].hide()
      const money = this.allGoods[goods].price
      this.accountBalance += money
      const vector = this.cabinMeshes[successIdx].position
      const { left, top } = this.project3Dto2D(vector)
      this.message.show(`交易成功！+${money}`, 'success', { left, top: top - 100 })
      this.refreshMusicPlay()
      this.updateAccountBalanceUI()
    }
  }
  refreshProducedGoods() {
    if (this.accountBalance + this.refreshMoney + this.energyConsumptionMoney < 0) {
      this.message.show('余额不足', 'error')
      return
    }
    this.producedGoods.forEach(goods => {
      if (!goods.loaded) {
        const keys = Object.keys(this.allGoods)
        const len = keys.length
        goods.name = keys[Math.floor(Math.random() * len)]
      }
    })
    this.refreshMusicPlay()
    this.updateProducedGoodsUI()
  }
  updateLoadedGoodsMesh() {
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
  updateAccountBalanceUI() {
    this.accountBalanceEl.text(`${this.accountBalance}￥`)
  }
  updateProducedGoodsUI() {
    this.goodsEls.forEach((goodsEl, idx) => {
      const status = this.producedGoods[idx].loaded ? 'off' : 'on'
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx].name}_${status}@2x.png)`
      )
    })
    this.accountBalance += this.refreshMoney
    const { left, top } = this.refreshEl[0].getBoundingClientRect()
    this.message.show(`刷新成功！${this.refreshMoney}`, 'error', { left, top }, 'transform: translate(50%, -100%);')
    this.updateAccountBalanceUI()
  }
  over() {
    this.gameOverEl.show()
  }
  restart() {
    this.gameOverEl.hide()
    this.accountBalance = 5_00
    this.updateAccountBalanceUI()
    this.makeNeededGoods()
    this.makeProducedGoods()
    this.bgmPlay()
    this.play()
  }
}

class Message {
  duration = 1600
  timers = []

  show(text, type = 'info', position = undefined, style = '', duration = this.duration) {
    const colors = {
      success: '#C0FF00',
      error: '#FF001E',
      info: '#FFFFFF'
    }
    const color = colors[type]
    const el = $(`<div
    id="msg"
    class="text-[2vw] text-white fixed left-[18vw] bottom-[24vh] font-[huakang] -translate-x-1/2 text-[${color}] -translate-y-[${this.timers.length * 6}vh]"
    style="display: none; ${position ? `left: ${position.left}px; top: ${position.top}px; ${style}` : ''}" > ${text}</div > `)
    $('body').append(el)
    el.fadeIn()
    const timer = setTimeout(() => {
      el.fadeOut()
      const idx = this.timers.findIndex(t => t === timer)
      this.timers.splice(idx, 1)
      el.remove()
    }, duration)
    this.timers.push(timer)
  }
}

new ResourceLoading().start()
