import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Button from './Button';

const PwaUpdatePrompt: React.FC = () => {
  const { needRefresh: [needRefresh, setNeedRefresh], offlineReady: [offlineReady, setOfflineReady], updateServiceWorker } = useRegisterSW();
  if (!needRefresh && !offlineReady) return null;
  return <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-indigo-200 bg-white p-4 shadow-2xl" role="status"><p className="font-bold text-slate-800">{needRefresh ? '新しい教材があります' : 'オフラインでも使えます'}</p><p className="mt-1 text-sm text-slate-600">{needRefresh ? '学習記録を残したまま最新版へ更新します。' : '次回から通信が不安定でも開けます。'}</p><div className="mt-3 grid grid-cols-2 gap-2">{needRefresh && <Button onClick={()=>updateServiceWorker(true)}>今すぐ更新</Button>}<Button variant="secondary" onClick={()=>{setNeedRefresh(false);setOfflineReady(false)}}>あとで</Button></div></div>;
};
export default PwaUpdatePrompt;
