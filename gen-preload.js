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

console.log(resources, 'resources');

fs.writeFileSync('./preload.js', `const queue = new createjs.LoadQueue();

console.log("开始加载资源");

queue.on("complete", () => {
  console.log("done");
});

queue.on("progress", (progress) => {
  console.log("progress", progress.loaded);
});

const resources = ${JSON.stringify(resources, null, 2)}

queue.loadManifest(resources);`)