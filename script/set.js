/*
 * @Author: ShawnPhang
 * @Date: 2021-08-21 21:49:05
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-22 23:30:27
 * @site: book.palxp.com / blog.palxp.com
 */

const target = 'src' // 填写目标配置目录路径
const fileName = 'configs.ts' // 目标文件名

const fs = require('fs')
const path = require('path')

let param = null
process.argv.forEach((val, index) => {
  const _ = `${val}`.split('.')
  param = _[_.length - 1] === 'json' ? val : null
})

if (!param) {
  return
}
const config = JSON.parse(JSON.stringify(require(path.join(__dirname, '..', param))))

change()

function change() {
  const targetPath = target + '/' + fileName
  fs.readFile(path.join(__dirname, '..', targetPath), 'utf8', function (err, files) {
    fs.writeFile(path.join(__dirname, fileName), files + '', 'utf8', function (err) {
      var result = files
      for (const key in config) {
        if (Object.hasOwnProperty.call(config, key)) {
          result = result.replace(`$\{${key}\}`, config[key])
        }
      }
      fs.writeFile(path.join(__dirname, '..', targetPath), result, 'utf8', function (err) {})
    })
  })
}
