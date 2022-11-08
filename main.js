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
  countdownEl = null
  loadingEl = null
  refreshEl = null
  accountBalanceEl = null
  neededGoodsEls = []
  message = new Message()
  menuEls = {}
  helpMenuEls = {}
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
  musics = {}
  portMesh = null
  needInboundPlay = false
  setNeedInboundPlayTimer = null
  countdownTimer = null
  trainAnimationTimer = null
  constructor() {
    this.initUI();
    this.initMusics();
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
    this.producedButtonEls = [
      $('#btn-one'),
      $('#btn-two'),
      $('#btn-three'),
    ]
    this.goodsEls = [
      $('#goods-one'),
      $('#goods-two'),
      $('#goods-three'),
    ]

    this.loadingEl = $(`<div
      id="loading"
      class="flex flex-col items-center fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <span class="text-white font-[huakang] text-[2.8vw]"
        >码上掘金 即将到来</span
      >
      <img />
      <span id="countdown" class="text-white font-[huakang] text-[2.8vw]"
        >10s</span
      >
    </div>`)

    const loadingImgEl = this.loadingEl.find('img')

    const parseIdx = (idx) => {
      if (idx < 10) {
        return `00${idx}`
      }
      if (idx < 100) {
        return `0${idx}`
      }
      return `${idx}`
    }
    const getUrl = (idx) => queue.getResult(`assets.images.loading.进度条${parseIdx(idx)}.png`)
    this.loadingControl = new Loading({
      el: loadingImgEl,
      getUrl,
      time: 10_000,
      frame: 250
    })

    $('body').append(this.loadingEl)
    this.loadingEl.hide()
    this.countdownEl = $('#countdown')

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

    // 绑定装货/卸货事件
    this.producedButtonEls.forEach((btnEl, idx) => {
      btnEl.on('click', () => {
        // 卸载货物
        if (this.producedGoods[idx].loaded) {
          this.loadedGoods[this.producedGoods[idx].cabin] = null
          this.producedGoods[idx].loaded = false

          this.accountBalance += this.carryMoney
          this.message.show(`卸载成功！${this.carryMoney}`, 'error')
          this.updateAccountBalanceUI()
        }
        // 选择货物
        else {
          const goods = this.producedGoods[idx].name
          for (let i = 0; i < this.loadedGoods.length; i++) {
            if (!!!this.loadedGoods[i]) {
              this.loadedGoods[i] = goods
              this.producedGoods[idx].cabin = i
              this.producedGoods[idx].loaded = true

              this.accountBalance += this.carryMoney
              this.message.show(`搬运成功！${this.carryMoney}`, 'error')
              this.updateAccountBalanceUI()
              break;
            }
          }
        }

        this.musics.load[0].play()
        this.updateProducedGoodsButtonUI()
        this.updateLoadedGoodsMesh()
      })
    })

    this.menuEls = {
      'music': $('#bgm'),
      'pause': $('#pause'),
      'pauseText': $('#pause-text'),
      'help': $('#help'),
    }

    this.menuEls.music.on('click', this.bgmPlay.bind(this))
    this.menuEls.pause.on('click', () => {
      this.isPause ? this.resume() : this.pause()
    })
    this.menuEls.help.on('click', () => {
      this.pause()
      this.helpMenuEls.helpMenu.show()
      this.helpMenuEls.helpMenu.data('isOpen', true)
      this.helpMenuEls.closeButton.on('click', () => {
        this.helpMenuEls.helpMenu.hide()
        this.helpMenuEls.helpMenu.data('isOpen', false)
        this.resume()
      })
    })

    this.initMenuEls = {
      initMenu: $('#init-menu'),
      startButton: $('#start-button'),
      helpButton: $('#help-button'),
    }
    this.initMenuEls.startButton.on('click', () => {
      this.play()
      this.helpMenuEls.closeButton.off('click')
      this.initMenuEls.initMenu.hide()
    })
    this.initMenuEls.helpButton.on('click', () => {
      this.initMenuEls.initMenu.hide()
      this.helpMenuEls.helpMenu.show()
      this.helpMenuEls.helpMenu.data('isOpen', true)
      this.helpMenuEls.closeButton.on('click', () => {
        this.helpMenuEls.helpMenu.hide()
        this.helpMenuEls.helpMenu.data('isOpen', true)
        this.initMenuEls.initMenu.show()
      })
    })

    this.helpMenuEls = {
      helpMenu: $('#help-menu'),
      closeButton: $('#help-close-button'),
      scrollbarButtonEl: $('#scrollbar-button'),
      scrollbarTrackEl: $('#scrollbar-track'),
      helpContentEl: $('#help-content')
    }
    const scrollbarButtonEl = this.helpMenuEls.scrollbarButtonEl
    const scrollbarTrackEl = this.helpMenuEls.scrollbarTrackEl
    const helpContent = this.helpMenuEls.helpContentEl
    const body = $('body')
    scrollbarButtonEl.on('mousedown', (e) => {
      const top = Number(scrollbarButtonEl.css('top').replace('px', ''))
      const start = e.originalEvent.clientY - top
      const moveCallback = (e) => {
        e.preventDefault()
        const clientY = e.originalEvent.clientY
        const delta = clientY - start
        if (delta < 0) {
          return
        }
        if (delta > scrollbarTrackEl.height() - scrollbarButtonEl.height()) {
          return
        }

        scrollbarButtonEl.css('top', `${delta}px`)
        const ratio = delta / (scrollbarTrackEl.height() - scrollbarButtonEl.height())
        helpContent.css('transform', `translateY(calc(-${ratio * (helpContent.height() - body.height())}px))`)
      }
      body.on('mousemove', moveCallback)
      const upCallback = () => {
        body.off('mousemove', moveCallback)
        body.off('mouseup', upCallback)
      }
      body.on('mouseup', upCallback)
    })

    this.helpMenuEls.helpMenu.on('mousewheel', (e) => {
      e.preventDefault()
      const top = Number(scrollbarButtonEl.css('top').replace('px', ''))
      const delta = top - e.originalEvent.wheelDelta / 20

      if (delta < 0) {
        delta = 0
      }
      if (delta > scrollbarTrackEl.height() - scrollbarButtonEl.height()) {
        delta = scrollbarTrackEl.height() - scrollbarButtonEl.height()
      }

      scrollbarButtonEl.css('top', `${delta}px`)
      const ratio = delta / (scrollbarTrackEl.height() - scrollbarButtonEl.height())
      helpContent.css('transform', `translateY(calc(-${ratio * (helpContent.height() - body.height())}px))`)
    })

    body.on('keyup', (e) => {
      e.preventDefault()
      if (this.helpMenuEls.helpMenu.data('isOpen')) {
        if (e.key === 'Escape') {
          this.helpMenuEls.closeButton.click()
        }
      }
    })

    this.helpMenuEls.helpMenu.data('isOpen', false)
    this.helpMenuEls.helpMenu.hide()

    this.gameOverEl = $('#game-over')
    this.gameOverEl.hide()
    this.restartButtonEl = $('#restart-button')
    this.restartButtonEl.on('click', this.restart.bind(this))

    this.updateAccountBalanceUI()

    this.disableGoodsControl()
  }
  initMusics() {
    this.musics.bgm = $(`<audio src="./assets/audio/bgm.mp3" loop="loop"></audio>`)
    this.musics.load = $(`<audio src="./assets/audio/load.mp3"></audio>`)
    this.musics.refresh = $(`<audio src="./assets/audio/refresh.mp3"></audio>`)
    this.musics.inbound = $(`<audio src="./assets/audio/inbound.mp3"></audio>`)
    this.musics.outbound = $(`<audio src="./assets/audio/outbound.mp3"></audio>`)
    $('body').append(...Object.values(this.musics))
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
      this.updateProducedGoodsButtonUI()
      this.producedButtonEls.forEach(btnEl => btnEl.show())
      this.activeGoodsControl()
      this.refreshEl.css('filter', 'none')
      this.loadedGoods = [null, null, null]
      this.updateLoadedGoodsMesh()
      this.neededGoodsEls.forEach(neededGoodsEl => neededGoodsEl.show())
      this.nextLoop()
      this.tradeRecords = []
    }
  }
  departure() {
    this.producedButtonEls.forEach(btnEl => btnEl.hide())
    this.disableGoodsControl()
    this.refreshEl.css('filter', 'grayscale(100%)')

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
    this.bgmPlay()
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
  }
  nextLoop() {
    let countdown = this.countdown;
    this.countdownEl.text(`${countdown}s`)
    this.loadingEl.show()
    // this.loadingEl.find('img').attr('src', this.loadingImage.src);
    this.loadingControl.play()
    const cbFn = () => {
      this.countdownEl.text(`${countdown -= 1}s`)
      if (countdown === 0) {
        this.loadingEl.hide()
        this.trainAnimationPlay()
        this.countdownTimer.clear()
        return
      }

      this?.countdownTimer?.clear()
      this.countdownTimer = new Timer(cbFn, 1_000)
    }
    this?.countdownTimer?.clear()
    this.countdownTimer = new Timer(cbFn, 1_000)
  }
  makeProducedGoods() {
    for (let i = 0; i < 3; i++) {
      let goods = Object.keys(this.allGoods)[Math.floor(Math.random() * Object.keys(this.allGoods).length)]
      this.producedGoods[i] = {
        name: goods,
        loaded: false
      }
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
  trainAnimationPlay() {
    this.trainAnimation.play();
    this.departure()
    this.trainMixer.addEventListener('loop', (e) => {
      this.trainAnimation.stop();
      this.arrival()
    });
  }
  disableGoodsControl() {
    this.goodsEls.forEach((goodsEl, idx) => {
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx]?.name || 'gpu'}_off@2x.png)`
      )
    })
    this.producedButtonEls.forEach((btnEl) => {
      btnEl.hide()
    })
    this.refreshEl.css(
      'filter',
      'grayscale(100%)'
    )
    this.refreshEl.css('pointer-events', 'none');
  }
  activeGoodsControl() {
    this.producedButtonEls.forEach((btnEl) => {
      btnEl.show()
    })

    this.refreshEl.css(
      'filter',
      'none'
    )
    this.refreshEl.css('pointer-events', 'auto');
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
      this.message.show(`交易成功！+${money}`, 'success')
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
  refreshMusicPlay() {
    const refreshMusicPlayer = this.musics.refresh[0]
    refreshMusicPlayer.currentTime = 0
    refreshMusicPlayer.play();
  }
  bgmPlay() {
    const bgmPlayer = this.musics.bgm[0]
    if (bgmPlayer.paused) {
      bgmPlayer.currentTime = 0
      bgmPlayer.play();
      this.menuEls.music.attr('src', './assets/images/music_off@2x.png')
    } else {
      bgmPlayer.pause();
      this.menuEls.music.attr('src', './assets/images/music_on@2x.png')
    }
  }
  inboundPlay() {
    const inboundPlayer = this.musics.inbound[0]
    inboundPlayer.currentTime = 0
    inboundPlayer.play();
  }
  outboundPlay() {
    const outboundPlayer = this.musics.outbound[0]
    outboundPlayer.currentTime = 0
    outboundPlayer.play();
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
  updateProducedGoodsButtonUI() {
    this.producedGoods.forEach((goods, idx) => {
      if (goods.loaded) {
        this.goodsEls[idx].css(
          'background-image',
          `url(./assets/images/goods_${goods.name}_off@2x.png)`
        )
        this.producedButtonEls[idx].css(
          'background-image',
          'url("./assets/images/reselect-btn.png")'
        )
        this.producedButtonEls[idx].hover(
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/reselect-btn-hover.png")')
          },
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/reselect-btn.png")')
          }
        )
        this.producedButtonEls[idx].text('卸货')
      } else {
        this.goodsEls[idx].css(
          'background-image',
          `url(./assets/images/goods_${goods.name}_on@2x.png)`
        )
        this.producedButtonEls[idx].css(
          'background-image',
          'url("./assets/images/btn.png")'
        )
        this.producedButtonEls[idx].hover(
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/btn-hover.png")')
          },
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/btn.png")')
          },
        )
        this.producedButtonEls[idx].text('装货')
      }
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
    this.message.show(`刷新成功！${this.refreshMoney}`, 'error')
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
    this.updateProducedGoodsButtonUI()
    this.bgmPlay()
    this.play()
  }
}

class Message {
  duration = 1600
  timers = []

  show(text, type = 'info', duration = this.duration) {
    const colors = {
      success: '#C0FF00',
      error: '#FF001E',
      info: '#FFFFFF'
    }
    const color = colors[type]
    const el = $(`<div
    id="msg"
    class="text-[2vw] text-white fixed left-[18vw] bottom-[24vh] font-[huakang] -translate-x-1/2 text-[${color}] -translate-y-[${this.timers.length * 6}vh]"
    style="display: none;">${text}</div>`)
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

class Timer {
  timerId = null
  start = null
  remaining = 0
  callback = () => { }
  constructor(callback, delay) {
    this.callback = callback
    this.remaining = delay;
    this.resume();
  }
  pause() {
    window.clearTimeout(this.timerId);
    this.timerId = null;
    this.remaining -= Date.now() - this.start;
  }
  resume() {
    if (this.timerId) {
      return;
    }
    this.start = Date.now();
    this.timerId = window.setTimeout(this.callback, this.remaining);
  }
  clear() {
    window.clearTimeout(this.timerId);
    this.timerId = null;
  }
}

class Loading {
  el = null
  idx = 0
  time = 0
  frame = 0
  constructor({ el, getUrl, time, frame } = {}) {
    this.el = el
    this.getUrl = getUrl
    this.time = time
    this.frame = frame
  }
  play() {
    const next = () => {
      const nextEl = this.getUrl(this.idx++)
      if (this.el) {
        this.el.replaceWith(nextEl)
        this.el = nextEl
        this.timer.clear()
        if (this.idx === 250) {
          this.idx = 0
          return
        }
        this.timer = new Timer(next, this.time / this.frame)
      }
    }
    this.timer = new Timer(next, this.time / this.frame)
  }
  pause() {
    this.timer.pause()
  }
  resume() {
    this.timer.resume()
  }
}

