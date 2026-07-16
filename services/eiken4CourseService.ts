import { WORKSHEET_DONE_KEY, getLightweightNextStep, getLightweightTodayCourseSteps } from './eiken4CourseSummaryService';

const localDateKey = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; };

export const isWorksheetDoneToday = () => typeof localStorage !== 'undefined' && localStorage.getItem(WORKSHEET_DONE_KEY) === localDateKey();
export const recordWorksheetDone = () => { if (typeof localStorage !== 'undefined') localStorage.setItem(WORKSHEET_DONE_KEY, localDateKey()); };
export const resetTodayWorksheetDone = () => { if (typeof localStorage !== 'undefined') localStorage.removeItem(WORKSHEET_DONE_KEY); };

export const getTodayCourseSteps = getLightweightTodayCourseSteps;
export const getNextTodayCourseStep = getLightweightNextStep;
