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
  ['pages/Eiken4ResultPage.tsx', /おうちの人に報告をコピー/, '毎日の保護者報告をコピーできない'],
  ['pages/Eiken4ProgressPage.tsx', /7日分の学習計画をコピー/, '学習計画アプリ向け出力がない'],
  ['pages/Eiken4HomePage.tsx', /文法を選んで練習/, '文法別練習への入口がない'],
  ['pages/Eiken4HomePage.tsx', /習ったことをまぜて練習しよう/, '学習済み内容を混ぜる復習への入口がない'],
  ['pages/Eiken4HomePage.tsx', /今日のおまかせ問題/, '既存の自動復習モードが分かりにくい'],
  ['pages/Eiken4HomePage.tsx', /英検4級の勉強をはじめよう！/, '初心者向けの最初の案内がない'],
  ['pages/Eiken4HomePage.tsx', /順番に学ぼう/, '段階別学習が最優先に表示されない'],
  ['pages/Eiken4StepLearningPage.tsx', /確認問題/, '段階別学習の確認問題がない'],
  ['pages/Eiken4StepLearningPage.tsx', /min-h-12/, '段階別学習の選択肢が押しにくい'],
  ['App.tsx', /grammar-practice\/:categoryId/, '文法別問題のURLルートがない'],
  ['App.tsx', /eiken4\/mixed-review/, '学習済み内容を混ぜる復習のURLルートがない'],
  ['pages/Eiken4GrammarPracticeSelectPage.tsx', /練習する文法を選ぼう/, '文法選択画面がない'],
  ['pages/Eiken4GrammarPracticePage.tsx', /useParams/, 'URLから文法カテゴリを受け取れない'],
  ['pages/Eiken4GrammarPracticePage.tsx', /間違えた問題だけ復習/, '文法別練習の復習導線がない'],
  ['pages/Eiken4GrammarGuidePage.tsx', /この文法を練習する/, '文法解説から練習へ進めない'],
  ['pages/Eiken4ListeningFocusPage.tsx', /aria-label/, '音声ボタンの読み上げラベルがない'],
  ['pages/Eiken4ListeningFocusPage.tsx', /○ 正解|× 正解/, '正誤を色だけで表示している'],
  ['components/StorageErrorBanner.tsx', /role="alert"/, '保存失敗時の結果退避案内がない'],
];
const errors = checks.filter(([path, pattern]) => !pattern.test(read(path))).map(([, , message]) => message);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Android UIチェックOK: ${checks.length}項目`);
