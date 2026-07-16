import fs from 'node:fs';
import path from 'node:path';

const files = fs.readdirSync('dist/assets');
const indexFile = files.find(file => /^index-.*\.js$/.test(file) && !file.startsWith('index.es-'));
const errors = [];
if (!indexFile) errors.push('初期JavaScriptが見つからない');
else if (fs.statSync(path.join('dist/assets', indexFile)).size > 300_000) errors.push(`初期JavaScriptが大きすぎる: ${fs.statSync(path.join('dist/assets', indexFile)).size} bytes`);
if (!fs.existsSync('dist/sw.js')) errors.push('PWA Service Workerがない');
if (!fs.existsSync('dist/manifest.webmanifest')) errors.push('PWA manifestがない');
const manifest = JSON.parse(fs.readFileSync('dist/manifest.webmanifest', 'utf8'));
if (manifest.display !== 'standalone' || !manifest.icons?.length) errors.push('PWA manifestの必須設定がない');
if (!files.some(file => file.startsWith('Eiken4ListeningFocusPage-'))) errors.push('原因別リスニングが遅延分割されていない');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`公開ビルドチェックOK: 初期JS ${Math.round(fs.statSync(path.join('dist/assets', indexFile)).size / 1024)}KB・PWA・遅延読込`);
