const { OrbitControls, RoomEnvironment, GLTFLoader } = THREE;

class Scene extends Component {
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
  materials = {}
  tradeRecords = []
  // meshes
  cityMeshes = []
  cabinMeshes = []
  loadedGoods = [null, null, null]
  producedGoods = []
  portMesh = null
  needInboundPlay = false
  setNeedInboundPlayTimer = null
  countdownTimer = null
  trainAnimationTimer = null

  constructor({ onLoaded } = {}) {
    super({
      state: {
        neededGoods: []
      },
      template: (state) => `<div>
      ${state.neededGoods.map((goods, index) => `
      <div
        class="flex justify-center items-center w-[8.85vw] fixed aspect-[1.3/1] -translate-x-full -translate-y-1/2"
        ref="neededGoods${index}"
      >
        <div
          class="absolute w-full h-full bg-[url('./assets/images/bubble.jpg')] bg-cover opacity-50"
        ></div>
        <img class="w-1/2 z-10"  src="./assets/images/goods_${goods}_on@3x.png"/>
      </div>
      `).join('')}
    </div>`
    })
    this.initCanvas().then(() => {
      this.makeNeededGoods()
      this.animate()
      this.autoScale()
      onLoaded?.()
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
    const goodsList = Object.keys(allGoods)
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

  autoScale() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, this.height);
    }, false);
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

  setAllDemandGoodsPosition() {
    for (let i = 0; i < this.cityMeshes.length; i++) {
      this.setDemandGoodsPosition(this.cityMeshes[i], this.refs[`neededGoods${i}`])
    }
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

  setDemandGoodsPosition(cityMesh, goodsEl) {
    const vector = new THREE.Vector3(
      cityMesh.position.x * this.modelScale,
      cityMesh.position.y * this.modelScale,
      cityMesh.position.z * this.modelScale
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

  makeNeededGoods() {
    const len = Object.keys(allGoods).length
    const goodsNames = Object.keys(allGoods)
    this.updateState('neededGoods', [
      goodsNames[Math.floor(Math.random() * len)],
      goodsNames[Math.floor(Math.random() * len)],
      goodsNames[Math.floor(Math.random() * len)],
      goodsNames[Math.floor(Math.random() * len)],
      goodsNames[Math.floor(Math.random() * len)],
    ])
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
}