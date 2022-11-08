const queue = new createjs.LoadQueue();

const loadResourceEl = $('#load-resource')
const loadResourceProcess = $('#load-resource-process')
const loadResourceProcessBar = $('#load-resource-process-bar')
const loadResourceProcessBarInner = $('#load-resource-progress-inner')

queue.on("complete", () => {
  loadResourceEl.hide()
  new Game()
});

queue.on("progress", (progress) => {
  const parseIdx = (idx) => {
    if (idx < 10) {
      return `100${idx}`
    }
    if (idx < 100) {
      return `10${idx}`
    }
    return `1${idx}`
  }
  const percentage = `${Math.floor(progress.loaded * 100)}%`
  loadResourceProcessBarInner.css('width', percentage)
  loadResourceProcess.text(percentage)
});

const resources = [
  {
    "id": "assets.audio.bgm.mp3",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/audio/bgm.mp3"
  },
  {
    "id": "assets.audio.inbound.mp3",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/audio/inbound.mp3"
  },
  {
    "id": "assets.audio.load.mp3",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/audio/load.mp3"
  },
  {
    "id": "assets.audio.outbound.mp3",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/audio/outbound.mp3"
  },
  {
    "id": "assets.audio.refresh.mp3",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/audio/refresh.mp3"
  },
  {
    "id": "assets.fonts.SOURCEHANSANSCN-MEDIUM.OTF",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/fonts/SOURCEHANSANSCN-MEDIUM.OTF"
  },
  {
    "id": "assets.fonts.华康海报体W12.ttf",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/fonts/华康海报体W12.ttf"
  },
  {
    "id": "assets.images.Div@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/Div@2x.png"
  },
  {
    "id": "assets.images.bg.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/bg.png"
  },
  {
    "id": "assets.images.bggame.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/bggame.png"
  },
  {
    "id": "assets.images.bottom-bg.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/bottom-bg.png"
  },
  {
    "id": "assets.images.btn-hover.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/btn-hover.png"
  },
  {
    "id": "assets.images.btn.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/btn.png"
  },
  {
    "id": "assets.images.bubble.gif",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/bubble.gif"
  },
  {
    "id": "assets.images.bubble.jpg",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/bubble.jpg"
  },
  {
    "id": "assets.images.close@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/close@2x.png"
  },
  {
    "id": "assets.images.display.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/display.png"
  },
  {
    "id": "assets.images.drop_down box@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/drop_down box@2x.png"
  },
  {
    "id": "assets.images.element1@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/element1@2x.png"
  },
  {
    "id": "assets.images.element2@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/element2@2x.png"
  },
  {
    "id": "assets.images.element3@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/element3@2x.png"
  },
  {
    "id": "assets.images.explain@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/explain@2x.png"
  },
  {
    "id": "assets.images.food.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/food.png"
  },
  {
    "id": "assets.images.game-bg.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/game-bg.png"
  },
  {
    "id": "assets.images.go.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/go.png"
  },
  {
    "id": "assets.images.goods_coal_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_coal_off@2x.png"
  },
  {
    "id": "assets.images.goods_coal_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_coal_on@2x.png"
  },
  {
    "id": "assets.images.goods_coal_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_coal_on@3x.png"
  },
  {
    "id": "assets.images.goods_cotton_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_cotton_off@2x.png"
  },
  {
    "id": "assets.images.goods_cotton_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_cotton_on@2x.png"
  },
  {
    "id": "assets.images.goods_cotton_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_cotton_on@3x.png"
  },
  {
    "id": "assets.images.goods_cpu_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_cpu_off@2x.png"
  },
  {
    "id": "assets.images.goods_cpu_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_cpu_on@2x.png"
  },
  {
    "id": "assets.images.goods_cpu_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_cpu_on@3x.png"
  },
  {
    "id": "assets.images.goods_fish_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_fish_off@2x.png"
  },
  {
    "id": "assets.images.goods_fish_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_fish_on@2x.png"
  },
  {
    "id": "assets.images.goods_fish_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_fish_on@3x.png"
  },
  {
    "id": "assets.images.goods_gpu_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_gpu_off@2x.png"
  },
  {
    "id": "assets.images.goods_gpu_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_gpu_on@2x.png"
  },
  {
    "id": "assets.images.goods_gpu_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_gpu_on@3x.png"
  },
  {
    "id": "assets.images.goods_iron_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_iron_off@2x.png"
  },
  {
    "id": "assets.images.goods_iron_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_iron_on@2x.png"
  },
  {
    "id": "assets.images.goods_iron_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_iron_on@3x.png"
  },
  {
    "id": "assets.images.goods_meat_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_meat_off@2x.png"
  },
  {
    "id": "assets.images.goods_meat_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_meat_on@2x.png"
  },
  {
    "id": "assets.images.goods_meat_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_meat_on@3x.png"
  },
  {
    "id": "assets.images.goods_oil_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_oil_off@2x.png"
  },
  {
    "id": "assets.images.goods_oil_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_oil_on@2x.png"
  },
  {
    "id": "assets.images.goods_oil_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_oil_on@3x.png"
  },
  {
    "id": "assets.images.goods_radish_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_radish_off@2x.png"
  },
  {
    "id": "assets.images.goods_radish_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_radish_on@2x.png"
  },
  {
    "id": "assets.images.goods_radish_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_radish_on@3x.png"
  },
  {
    "id": "assets.images.goods_wood_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_wood_off@2x.png"
  },
  {
    "id": "assets.images.goods_wood_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_wood_on@2x.png"
  },
  {
    "id": "assets.images.goods_wood_on@3x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/goods_wood_on@3x.png"
  },
  {
    "id": "assets.images.loading.进度条000.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条000.png"
  },
  {
    "id": "assets.images.loading.进度条001.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条001.png"
  },
  {
    "id": "assets.images.loading.进度条002.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条002.png"
  },
  {
    "id": "assets.images.loading.进度条003.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条003.png"
  },
  {
    "id": "assets.images.loading.进度条004.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条004.png"
  },
  {
    "id": "assets.images.loading.进度条005.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条005.png"
  },
  {
    "id": "assets.images.loading.进度条006.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条006.png"
  },
  {
    "id": "assets.images.loading.进度条007.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条007.png"
  },
  {
    "id": "assets.images.loading.进度条008.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条008.png"
  },
  {
    "id": "assets.images.loading.进度条009.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条009.png"
  },
  {
    "id": "assets.images.loading.进度条010.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条010.png"
  },
  {
    "id": "assets.images.loading.进度条011.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条011.png"
  },
  {
    "id": "assets.images.loading.进度条012.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条012.png"
  },
  {
    "id": "assets.images.loading.进度条013.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条013.png"
  },
  {
    "id": "assets.images.loading.进度条014.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条014.png"
  },
  {
    "id": "assets.images.loading.进度条015.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条015.png"
  },
  {
    "id": "assets.images.loading.进度条016.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条016.png"
  },
  {
    "id": "assets.images.loading.进度条017.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条017.png"
  },
  {
    "id": "assets.images.loading.进度条018.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条018.png"
  },
  {
    "id": "assets.images.loading.进度条019.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条019.png"
  },
  {
    "id": "assets.images.loading.进度条020.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条020.png"
  },
  {
    "id": "assets.images.loading.进度条021.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条021.png"
  },
  {
    "id": "assets.images.loading.进度条022.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条022.png"
  },
  {
    "id": "assets.images.loading.进度条023.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条023.png"
  },
  {
    "id": "assets.images.loading.进度条024.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条024.png"
  },
  {
    "id": "assets.images.loading.进度条025.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条025.png"
  },
  {
    "id": "assets.images.loading.进度条026.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条026.png"
  },
  {
    "id": "assets.images.loading.进度条027.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条027.png"
  },
  {
    "id": "assets.images.loading.进度条028.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条028.png"
  },
  {
    "id": "assets.images.loading.进度条029.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条029.png"
  },
  {
    "id": "assets.images.loading.进度条030.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条030.png"
  },
  {
    "id": "assets.images.loading.进度条031.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条031.png"
  },
  {
    "id": "assets.images.loading.进度条032.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条032.png"
  },
  {
    "id": "assets.images.loading.进度条033.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条033.png"
  },
  {
    "id": "assets.images.loading.进度条034.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条034.png"
  },
  {
    "id": "assets.images.loading.进度条035.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条035.png"
  },
  {
    "id": "assets.images.loading.进度条036.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条036.png"
  },
  {
    "id": "assets.images.loading.进度条037.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条037.png"
  },
  {
    "id": "assets.images.loading.进度条038.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条038.png"
  },
  {
    "id": "assets.images.loading.进度条039.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条039.png"
  },
  {
    "id": "assets.images.loading.进度条040.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条040.png"
  },
  {
    "id": "assets.images.loading.进度条041.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条041.png"
  },
  {
    "id": "assets.images.loading.进度条042.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条042.png"
  },
  {
    "id": "assets.images.loading.进度条043.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条043.png"
  },
  {
    "id": "assets.images.loading.进度条044.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条044.png"
  },
  {
    "id": "assets.images.loading.进度条045.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条045.png"
  },
  {
    "id": "assets.images.loading.进度条046.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条046.png"
  },
  {
    "id": "assets.images.loading.进度条047.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条047.png"
  },
  {
    "id": "assets.images.loading.进度条048.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条048.png"
  },
  {
    "id": "assets.images.loading.进度条049.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条049.png"
  },
  {
    "id": "assets.images.loading.进度条050.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条050.png"
  },
  {
    "id": "assets.images.loading.进度条051.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条051.png"
  },
  {
    "id": "assets.images.loading.进度条052.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条052.png"
  },
  {
    "id": "assets.images.loading.进度条053.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条053.png"
  },
  {
    "id": "assets.images.loading.进度条054.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条054.png"
  },
  {
    "id": "assets.images.loading.进度条055.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条055.png"
  },
  {
    "id": "assets.images.loading.进度条056.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条056.png"
  },
  {
    "id": "assets.images.loading.进度条057.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条057.png"
  },
  {
    "id": "assets.images.loading.进度条058.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条058.png"
  },
  {
    "id": "assets.images.loading.进度条059.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条059.png"
  },
  {
    "id": "assets.images.loading.进度条060.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条060.png"
  },
  {
    "id": "assets.images.loading.进度条061.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条061.png"
  },
  {
    "id": "assets.images.loading.进度条062.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条062.png"
  },
  {
    "id": "assets.images.loading.进度条063.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条063.png"
  },
  {
    "id": "assets.images.loading.进度条064.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条064.png"
  },
  {
    "id": "assets.images.loading.进度条065.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条065.png"
  },
  {
    "id": "assets.images.loading.进度条066.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条066.png"
  },
  {
    "id": "assets.images.loading.进度条067.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条067.png"
  },
  {
    "id": "assets.images.loading.进度条068.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条068.png"
  },
  {
    "id": "assets.images.loading.进度条069.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条069.png"
  },
  {
    "id": "assets.images.loading.进度条070.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条070.png"
  },
  {
    "id": "assets.images.loading.进度条071.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条071.png"
  },
  {
    "id": "assets.images.loading.进度条072.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条072.png"
  },
  {
    "id": "assets.images.loading.进度条073.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条073.png"
  },
  {
    "id": "assets.images.loading.进度条074.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条074.png"
  },
  {
    "id": "assets.images.loading.进度条075.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条075.png"
  },
  {
    "id": "assets.images.loading.进度条076.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条076.png"
  },
  {
    "id": "assets.images.loading.进度条077.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条077.png"
  },
  {
    "id": "assets.images.loading.进度条078.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条078.png"
  },
  {
    "id": "assets.images.loading.进度条079.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条079.png"
  },
  {
    "id": "assets.images.loading.进度条080.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条080.png"
  },
  {
    "id": "assets.images.loading.进度条081.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条081.png"
  },
  {
    "id": "assets.images.loading.进度条082.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条082.png"
  },
  {
    "id": "assets.images.loading.进度条083.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条083.png"
  },
  {
    "id": "assets.images.loading.进度条084.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条084.png"
  },
  {
    "id": "assets.images.loading.进度条085.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条085.png"
  },
  {
    "id": "assets.images.loading.进度条086.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条086.png"
  },
  {
    "id": "assets.images.loading.进度条087.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条087.png"
  },
  {
    "id": "assets.images.loading.进度条088.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条088.png"
  },
  {
    "id": "assets.images.loading.进度条089.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条089.png"
  },
  {
    "id": "assets.images.loading.进度条090.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条090.png"
  },
  {
    "id": "assets.images.loading.进度条091.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条091.png"
  },
  {
    "id": "assets.images.loading.进度条092.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条092.png"
  },
  {
    "id": "assets.images.loading.进度条093.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条093.png"
  },
  {
    "id": "assets.images.loading.进度条094.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条094.png"
  },
  {
    "id": "assets.images.loading.进度条095.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条095.png"
  },
  {
    "id": "assets.images.loading.进度条096.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条096.png"
  },
  {
    "id": "assets.images.loading.进度条097.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条097.png"
  },
  {
    "id": "assets.images.loading.进度条098.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条098.png"
  },
  {
    "id": "assets.images.loading.进度条099.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条099.png"
  },
  {
    "id": "assets.images.loading.进度条100.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条100.png"
  },
  {
    "id": "assets.images.loading.进度条101.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条101.png"
  },
  {
    "id": "assets.images.loading.进度条102.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条102.png"
  },
  {
    "id": "assets.images.loading.进度条103.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条103.png"
  },
  {
    "id": "assets.images.loading.进度条104.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条104.png"
  },
  {
    "id": "assets.images.loading.进度条105.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条105.png"
  },
  {
    "id": "assets.images.loading.进度条106.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条106.png"
  },
  {
    "id": "assets.images.loading.进度条107.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条107.png"
  },
  {
    "id": "assets.images.loading.进度条108.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条108.png"
  },
  {
    "id": "assets.images.loading.进度条109.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条109.png"
  },
  {
    "id": "assets.images.loading.进度条110.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条110.png"
  },
  {
    "id": "assets.images.loading.进度条111.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条111.png"
  },
  {
    "id": "assets.images.loading.进度条112.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条112.png"
  },
  {
    "id": "assets.images.loading.进度条113.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条113.png"
  },
  {
    "id": "assets.images.loading.进度条114.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条114.png"
  },
  {
    "id": "assets.images.loading.进度条115.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条115.png"
  },
  {
    "id": "assets.images.loading.进度条116.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条116.png"
  },
  {
    "id": "assets.images.loading.进度条117.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条117.png"
  },
  {
    "id": "assets.images.loading.进度条118.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条118.png"
  },
  {
    "id": "assets.images.loading.进度条119.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条119.png"
  },
  {
    "id": "assets.images.loading.进度条120.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条120.png"
  },
  {
    "id": "assets.images.loading.进度条121.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条121.png"
  },
  {
    "id": "assets.images.loading.进度条122.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条122.png"
  },
  {
    "id": "assets.images.loading.进度条123.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条123.png"
  },
  {
    "id": "assets.images.loading.进度条124.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条124.png"
  },
  {
    "id": "assets.images.loading.进度条125.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条125.png"
  },
  {
    "id": "assets.images.loading.进度条126.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条126.png"
  },
  {
    "id": "assets.images.loading.进度条127.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条127.png"
  },
  {
    "id": "assets.images.loading.进度条128.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条128.png"
  },
  {
    "id": "assets.images.loading.进度条129.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条129.png"
  },
  {
    "id": "assets.images.loading.进度条130.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条130.png"
  },
  {
    "id": "assets.images.loading.进度条131.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条131.png"
  },
  {
    "id": "assets.images.loading.进度条132.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条132.png"
  },
  {
    "id": "assets.images.loading.进度条133.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条133.png"
  },
  {
    "id": "assets.images.loading.进度条134.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条134.png"
  },
  {
    "id": "assets.images.loading.进度条135.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条135.png"
  },
  {
    "id": "assets.images.loading.进度条136.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条136.png"
  },
  {
    "id": "assets.images.loading.进度条137.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条137.png"
  },
  {
    "id": "assets.images.loading.进度条138.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条138.png"
  },
  {
    "id": "assets.images.loading.进度条139.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条139.png"
  },
  {
    "id": "assets.images.loading.进度条140.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条140.png"
  },
  {
    "id": "assets.images.loading.进度条141.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条141.png"
  },
  {
    "id": "assets.images.loading.进度条142.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条142.png"
  },
  {
    "id": "assets.images.loading.进度条143.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条143.png"
  },
  {
    "id": "assets.images.loading.进度条144.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条144.png"
  },
  {
    "id": "assets.images.loading.进度条145.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条145.png"
  },
  {
    "id": "assets.images.loading.进度条146.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条146.png"
  },
  {
    "id": "assets.images.loading.进度条147.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条147.png"
  },
  {
    "id": "assets.images.loading.进度条148.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条148.png"
  },
  {
    "id": "assets.images.loading.进度条149.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条149.png"
  },
  {
    "id": "assets.images.loading.进度条150.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条150.png"
  },
  {
    "id": "assets.images.loading.进度条151.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条151.png"
  },
  {
    "id": "assets.images.loading.进度条152.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条152.png"
  },
  {
    "id": "assets.images.loading.进度条153.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条153.png"
  },
  {
    "id": "assets.images.loading.进度条154.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条154.png"
  },
  {
    "id": "assets.images.loading.进度条155.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条155.png"
  },
  {
    "id": "assets.images.loading.进度条156.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条156.png"
  },
  {
    "id": "assets.images.loading.进度条157.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条157.png"
  },
  {
    "id": "assets.images.loading.进度条158.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条158.png"
  },
  {
    "id": "assets.images.loading.进度条159.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条159.png"
  },
  {
    "id": "assets.images.loading.进度条160.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条160.png"
  },
  {
    "id": "assets.images.loading.进度条161.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条161.png"
  },
  {
    "id": "assets.images.loading.进度条162.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条162.png"
  },
  {
    "id": "assets.images.loading.进度条163.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条163.png"
  },
  {
    "id": "assets.images.loading.进度条164.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条164.png"
  },
  {
    "id": "assets.images.loading.进度条165.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条165.png"
  },
  {
    "id": "assets.images.loading.进度条166.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条166.png"
  },
  {
    "id": "assets.images.loading.进度条167.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条167.png"
  },
  {
    "id": "assets.images.loading.进度条168.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条168.png"
  },
  {
    "id": "assets.images.loading.进度条169.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条169.png"
  },
  {
    "id": "assets.images.loading.进度条170.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条170.png"
  },
  {
    "id": "assets.images.loading.进度条171.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条171.png"
  },
  {
    "id": "assets.images.loading.进度条172.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条172.png"
  },
  {
    "id": "assets.images.loading.进度条173.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条173.png"
  },
  {
    "id": "assets.images.loading.进度条174.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条174.png"
  },
  {
    "id": "assets.images.loading.进度条175.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条175.png"
  },
  {
    "id": "assets.images.loading.进度条176.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条176.png"
  },
  {
    "id": "assets.images.loading.进度条177.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条177.png"
  },
  {
    "id": "assets.images.loading.进度条178.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条178.png"
  },
  {
    "id": "assets.images.loading.进度条179.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条179.png"
  },
  {
    "id": "assets.images.loading.进度条180.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条180.png"
  },
  {
    "id": "assets.images.loading.进度条181.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条181.png"
  },
  {
    "id": "assets.images.loading.进度条182.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条182.png"
  },
  {
    "id": "assets.images.loading.进度条183.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条183.png"
  },
  {
    "id": "assets.images.loading.进度条184.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条184.png"
  },
  {
    "id": "assets.images.loading.进度条185.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条185.png"
  },
  {
    "id": "assets.images.loading.进度条186.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条186.png"
  },
  {
    "id": "assets.images.loading.进度条187.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条187.png"
  },
  {
    "id": "assets.images.loading.进度条188.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条188.png"
  },
  {
    "id": "assets.images.loading.进度条189.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条189.png"
  },
  {
    "id": "assets.images.loading.进度条190.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条190.png"
  },
  {
    "id": "assets.images.loading.进度条191.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条191.png"
  },
  {
    "id": "assets.images.loading.进度条192.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条192.png"
  },
  {
    "id": "assets.images.loading.进度条193.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条193.png"
  },
  {
    "id": "assets.images.loading.进度条194.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条194.png"
  },
  {
    "id": "assets.images.loading.进度条195.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条195.png"
  },
  {
    "id": "assets.images.loading.进度条196.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条196.png"
  },
  {
    "id": "assets.images.loading.进度条197.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条197.png"
  },
  {
    "id": "assets.images.loading.进度条198.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条198.png"
  },
  {
    "id": "assets.images.loading.进度条199.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条199.png"
  },
  {
    "id": "assets.images.loading.进度条200.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条200.png"
  },
  {
    "id": "assets.images.loading.进度条201.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条201.png"
  },
  {
    "id": "assets.images.loading.进度条202.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条202.png"
  },
  {
    "id": "assets.images.loading.进度条203.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条203.png"
  },
  {
    "id": "assets.images.loading.进度条204.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条204.png"
  },
  {
    "id": "assets.images.loading.进度条205.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条205.png"
  },
  {
    "id": "assets.images.loading.进度条206.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条206.png"
  },
  {
    "id": "assets.images.loading.进度条207.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条207.png"
  },
  {
    "id": "assets.images.loading.进度条208.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条208.png"
  },
  {
    "id": "assets.images.loading.进度条209.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条209.png"
  },
  {
    "id": "assets.images.loading.进度条210.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条210.png"
  },
  {
    "id": "assets.images.loading.进度条211.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条211.png"
  },
  {
    "id": "assets.images.loading.进度条212.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条212.png"
  },
  {
    "id": "assets.images.loading.进度条213.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条213.png"
  },
  {
    "id": "assets.images.loading.进度条214.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条214.png"
  },
  {
    "id": "assets.images.loading.进度条215.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条215.png"
  },
  {
    "id": "assets.images.loading.进度条216.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条216.png"
  },
  {
    "id": "assets.images.loading.进度条217.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条217.png"
  },
  {
    "id": "assets.images.loading.进度条218.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条218.png"
  },
  {
    "id": "assets.images.loading.进度条219.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条219.png"
  },
  {
    "id": "assets.images.loading.进度条220.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条220.png"
  },
  {
    "id": "assets.images.loading.进度条221.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条221.png"
  },
  {
    "id": "assets.images.loading.进度条222.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条222.png"
  },
  {
    "id": "assets.images.loading.进度条223.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条223.png"
  },
  {
    "id": "assets.images.loading.进度条224.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条224.png"
  },
  {
    "id": "assets.images.loading.进度条225.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条225.png"
  },
  {
    "id": "assets.images.loading.进度条226.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条226.png"
  },
  {
    "id": "assets.images.loading.进度条227.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条227.png"
  },
  {
    "id": "assets.images.loading.进度条228.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条228.png"
  },
  {
    "id": "assets.images.loading.进度条229.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条229.png"
  },
  {
    "id": "assets.images.loading.进度条230.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条230.png"
  },
  {
    "id": "assets.images.loading.进度条231.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条231.png"
  },
  {
    "id": "assets.images.loading.进度条232.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条232.png"
  },
  {
    "id": "assets.images.loading.进度条233.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条233.png"
  },
  {
    "id": "assets.images.loading.进度条234.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条234.png"
  },
  {
    "id": "assets.images.loading.进度条235.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条235.png"
  },
  {
    "id": "assets.images.loading.进度条236.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条236.png"
  },
  {
    "id": "assets.images.loading.进度条237.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条237.png"
  },
  {
    "id": "assets.images.loading.进度条238.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条238.png"
  },
  {
    "id": "assets.images.loading.进度条239.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条239.png"
  },
  {
    "id": "assets.images.loading.进度条240.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条240.png"
  },
  {
    "id": "assets.images.loading.进度条241.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条241.png"
  },
  {
    "id": "assets.images.loading.进度条242.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条242.png"
  },
  {
    "id": "assets.images.loading.进度条243.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条243.png"
  },
  {
    "id": "assets.images.loading.进度条244.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条244.png"
  },
  {
    "id": "assets.images.loading.进度条245.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条245.png"
  },
  {
    "id": "assets.images.loading.进度条246.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条246.png"
  },
  {
    "id": "assets.images.loading.进度条247.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条247.png"
  },
  {
    "id": "assets.images.loading.进度条248.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条248.png"
  },
  {
    "id": "assets.images.loading.进度条249.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading/进度条249.png"
  },
  {
    "id": "assets.images.loading-bg.jpg",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading-bg.jpg"
  },
  {
    "id": "assets.images.loading.gif",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/loading.gif"
  },
  {
    "id": "assets.images.money.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/money.png"
  },
  {
    "id": "assets.images.music_off@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/music_off@2x.png"
  },
  {
    "id": "assets.images.music_on@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/music_on@2x.png"
  },
  {
    "id": "assets.images.pause@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/pause@2x.png"
  },
  {
    "id": "assets.images.progress@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/progress@2x.png"
  },
  {
    "id": "assets.images.reselect-btn-hover.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/reselect-btn-hover.png"
  },
  {
    "id": "assets.images.reselect-btn.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/reselect-btn.png"
  },
  {
    "id": "assets.images.reset.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/reset.png"
  },
  {
    "id": "assets.images.rule.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/rule.png"
  },
  {
    "id": "assets.images.start@2x.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/start@2x.png"
  },
  {
    "id": "assets.images.wood.png",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/images/wood.png"
  },
  {
    "id": "assets.model.base.gltf",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/model/base.gltf"
  },
  {
    "id": "assets.model.terrain.gltf",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/model/terrain.gltf"
  },
  {
    "id": "assets.model.train.gltf",
    "src": "https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/./assets/model/train.gltf"
  }
]

queue.loadManifest(resources);