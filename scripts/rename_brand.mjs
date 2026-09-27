import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walk(filePath, fileList)
      }
    } else {
      if (/\.(jsx?|tsx?|html|json|md|css)$/.test(file)) {
        fileList.push(filePath)
      }
    }
  }
  return fileList
}

const targetFiles = walk(rootDir)
let totalReplaced = 0

for (const file of targetFiles) {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false

  if (content.includes('TripSaathi')) {
    content = content.replace(/TripSaathi/g, 'Navora')
    changed = true
  }
  if (content.includes('tripsaathi')) {
    content = content.replace(/tripsaathi/g, 'navora')
    changed = true
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8')
    console.log(`Updated: ${path.relative(rootDir, file)}`)
    totalReplaced++
  }
}

console.log(`\n✅ Completed brand rename in ${totalReplaced} files.`)
