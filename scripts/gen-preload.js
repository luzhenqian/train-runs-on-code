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

fs.writeFileSync(path.resolve(__dirname, '../preload.js'), `const resources = ${JSON.stringify(resources, null, 2)}`)
