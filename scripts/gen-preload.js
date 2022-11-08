const fs = require('fs')
const path = require('path')

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

fs.writeFileSync(path.resolve(__dirname, '../preload.js'), `const queue = new createjs.LoadQueue();

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
      return \`100\${idx}\`
    }
    if (idx < 100) {
      return \`10\${idx}\`
    }
    return \`1\${idx}\`
  }
  const percentage = \`\${Math.floor(progress.loaded * 100)}%\`
  loadResourceProcessBarInner.css('width', percentage)
  loadResourceProcess.text(percentage)
});

const resources = ${JSON.stringify(resources, null, 2)}

queue.loadManifest(resources);`)
