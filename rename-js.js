const fs = require('fs');
const path = require('path');

const jsDir = path.resolve(__dirname, 'dist/common/js');

const files = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));

if (!files.length) {
  console.log('JSがありません');
  process.exit(0);
}

// 一番サイズが大きいJSを main.js にする
const mainFile = files
  .map(file => ({
    file,
    size: fs.statSync(path.join(jsDir, file)).size
  }))
  .sort((a, b) => b.size - a.size)[0].file;

for (const file of files) {
  const filePath = path.join(jsDir, file);

  if (file === mainFile) {
    fs.renameSync(filePath, path.join(jsDir, 'main.js'));
  } else {
    fs.unlinkSync(filePath);
  }
}

// HTML内のJS参照を全部 main.js に置換
const distDir = path.resolve(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));

for (const html of htmlFiles) {
  const htmlPath = path.join(distDir, html);
  let content = fs.readFileSync(htmlPath, 'utf8');

  content = content.replace(
    /\/common\/js\/[^"']+\.js/g,
    '/common/js/main.js'
  );

  fs.writeFileSync(htmlPath, content);
}