const fs = require('fs');
const replaceAll = require("replaceall");

function replacePath(source, rule, replacement) {
  return replaceAll(rule, replacement, source);
}

function merge(source1, source2) {
  return `${source1}
  ${source2}`;
}

const preloadJS = fs.readFileSync('./preload.js', 'utf8')
const mainJS = fs.readFileSync('./main.js', 'utf8')
const indexHTML = fs.readFileSync('./index.html', 'utf8')
const stylesCSS = fs.readFileSync('./styles.css', 'utf8')

const newMainJS = replacePath(mainJS, './assets/', 'https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/assets/')
const newHTML = replacePath(indexHTML, './assets/', 'https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/assets/')
const newCSS = replacePath(stylesCSS, './assets/', 'https://train-runs-on-code.oss-cn-hangzhou.aliyuncs.com/assets/')
const newJS = merge(preloadJS, newMainJS);

if (fs.existsSync('./dist')) {
  fs.rmSync('./dist', {
    recursive: true,
    force: true
  })
}

fs.mkdirSync('./dist')
fs.writeFileSync(`./dist/main.js`, newJS);
fs.writeFileSync(`./dist/index.html`, newHTML);
fs.writeFileSync(`./dist/styles.css`, newCSS);
