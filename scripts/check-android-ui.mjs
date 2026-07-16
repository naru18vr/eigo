import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const checks = [
  ['index.html', /width=device-width, initial-scale=1\.0/, 'Android向けviewportがない'],
  ['services/eiken4WorksheetService.ts', /document\.execCommand\('copy'\)/, 'Clipboard API失敗時のコピー代替がない'],
  ['pages/Eiken4DailyPage.tsx', /playCount >= 2/, '毎日リスニングの2回制限がない'],
  ['pages/Eiken4ListeningPracticePage.tsx', /playCount >= 2/, '特訓リスニングの2回制限がない'],
  ['pages/Eiken4DailyPage.tsx', /saveDailyProgress\(nextProgress\)/, '途中回答の保存がない'],
  ['pages/HomePage.tsx', /getLightweightNextStep/, 'アプリ起動時の軽量な続き導線がない'],
  ['pages/Eiken4DailyPage.tsx', /min-h-11|py-4/, 'スマホ用タップ領域が不足'],
  ['pages/LearningTransferPage.tsx', /transfer\.isLong/, '長い引き継ぎリンクの警告がない'],
  ['pages/LearningTransferPage.tsx', /verifyTransferChecksum/, '引き継ぎリンクの破損検出がない'],
  ['components/PwaUpdatePrompt.tsx', /updateServiceWorker/, 'PWA更新操作がない'],
  ['vite.config.ts', /VitePWA/, 'オフライン対応設定がない'],
  ['pages/Eiken4ListeningFocusPage.tsx', /原因別6問/, '原因別リスニング練習がない'],
  ['pages/Eiken4FullMockPage.tsx', /saveFullMockAttempt/, 'フル模試の途中保存がない'],
  ['pages/StorageRecoveryPage.tsx', /破損項目だけを分離/, '保存データ復旧画面がない'],
  ['pages/StorageRecoveryPage.tsx', /restoreEmergencyBackup/, '一時保存した直前結果を復元できない'],
  ['pages/Eiken4ListeningFocusPage.tsx', /aria-label/, '音声ボタンの読み上げラベルがない'],
  ['pages/Eiken4ListeningFocusPage.tsx', /○ 正解|× 正解/, '正誤を色だけで表示している'],
  ['components/StorageErrorBanner.tsx', /role="alert"/, '保存失敗時の結果退避案内がない'],
];
const errors = checks.filter(([path, pattern]) => !pattern.test(read(path))).map(([, , message]) => message);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Android UIチェックOK: ${checks.length}項目`);
