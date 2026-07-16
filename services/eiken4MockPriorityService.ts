const KEY = 'eiken4MockPriorityV1';
type MockPriority = { availableOn: string; ids: string[]; sourceDate: string };
const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const tomorrow = () => { const date = new Date(); date.setDate(date.getDate() + 1); return localDateKey(date); };
export const scheduleMockPriorities = (ids: string[]) => {
  if (typeof localStorage === 'undefined') return;
  const valid = Array.from(new Set(ids.filter(id => /^(word|listening|exam|sentence)-/.test(id)))).slice(0, 18);
  localStorage.setItem(KEY, JSON.stringify({ availableOn: tomorrow(), ids: valid, sourceDate: localDateKey() } satisfies MockPriority));
};
export const loadAvailableMockPriorities = (date = localDateKey()): string[] => {
  if (typeof localStorage === 'undefined') return [];
  try { const value = JSON.parse(localStorage.getItem(KEY) || 'null') as MockPriority | null; return value && value.availableOn <= date ? value.ids : []; } catch { return []; }
};
