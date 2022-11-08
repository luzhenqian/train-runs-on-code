const fs = require('fs')
const path = require('path')
const resolve = path.join

const resources = []
const baseUrl = 'https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com'

function genPreload(path, pathKey) {
  const files = fs.readdirSync(path)
  files
    .filter(file => file !== '.DS_Store')
    .forEach(file => {
      const stats = fs.statSync(`./${path}/${file}`)
      if (!stats.isFile()) {
        genPreload(`${path}/${file}`, `${pathKey}${file}.`)
        return
      }
      const id = `${pathKey}${file}`
      const src = `${baseUrl}/${path}/${file}`
      resources.push({ id, src })
    })
}

genPreload('./assets', 'assets.')

fs.writeFileSync('./preload.js', `const queue = new createjs.LoadQueue();

const loadResourceEl = $('#load-resource')
loadResourceEl.text('开始加载资源')

queue.on("complete", () => {
  loadResourceEl.hide()
  new Game()
});

queue.on("progress", (progress) => {
  loadResourceEl.text('游戏加载资源中 ' + Math.floor(progress.loaded * 100) + '%')
});

const resources = ${JSON.stringify(resources, null, 2)}

queue.loadManifest(resources);`)
