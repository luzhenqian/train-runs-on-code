const fs = require('fs');
const replaceAll = require("replaceall");
const parse = require('node-html-parser').parse

const entry = './index.html'
const resourceLocalPath = './assets'
const resourceOSSPath = 'https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/assets/'
const output = './dist'

function replacePath(source, rule, replacement) {
  return replaceAll(rule, replacement, source);
}

function replaceResourcesPath(source) {
  return replacePath(source, resourceLocalPath, resourceOSSPath)
}

function merge(...source) {
  return source.join('\n')
}

function extractJS(document) {
  const scripts = document.querySelectorAll(`script`)
  let externalScriptCode = ''
  const internalScripts = []
  Array.from(scripts).forEach(script => {
    const src = script.getAttribute('src')
    if (!src.startsWith('http')) {
      const source = fs.readFileSync(src, 'utf8')
      externalScriptCode = merge(externalScriptCode, source)
    } else {
      internalScripts.push(script.outerHTML)
    }
    script.remove()
  })
  return {
    externalScriptCode,
    internalScripts
  }
}

function extractCSS(document) {
  const styles = document.querySelectorAll(`style`)
  let externalStyleCode = ''
  Array.from(styles).forEach(style => {
    externalStyleCode = merge(externalStyleCode, style.outerHTML)
    style.remove()
  })

  const links = document.querySelectorAll(`link`)
  const internalLinks = []
  Array.from(links).forEach(link => {
    const href = link.getAttribute('href')
    if (!href.startsWith('http')) {
      externalStyleCode = merge(externalStyleCode, fs.readFileSync(href, 'utf8'))
    } else {
      internalLinks.push(link.outerHTML)
    }
    link.remove()
  })
  return {
    externalStyleCode,
    internalLinks
  }
}

function generateCode(document) {
  const { externalScriptCode, internalScripts } = extractJS(document)
  const { externalStyleCode, internalLinks } = extractCSS(document)
  const body = document.querySelector('body')
  const html = replaceResourcesPath(merge(internalScripts.join('\n'), internalLinks.join('\n'), body))
  const css = replaceResourcesPath(externalStyleCode)
  const js = replaceResourcesPath(externalScriptCode)
  return {
    html,
    css,
    js
  }
}

function rmOldDir() {
  if (fs.existsSync(output)) {
    fs.rmSync(output, {
      recursive: true,
      force: true
    })
  }
}

function generateFile(js, css, html) {
  fs.mkdirSync(output)
  fs.writeFileSync(`${output}/main.js`, js);
  fs.writeFileSync(`${output}/styles.css`, css);
  fs.writeFileSync(`${output}/index.html`, html);
}

function main() {
  const root = parse(fs.readFileSync(entry, 'utf8'))
  const { html, css, js } = generateCode(root)
  rmOldDir()
  generateFile(js, css, html)
}

main()
