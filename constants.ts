import { Day, SubjectOption, TimePeriod, MasterSlotConfig, SlotType } from './types';

export const DAYS: Day[] = [
  { id: 'mon', label: 'Montag', short: 'Mo' },
  { id: 'tue', label: 'Dienstag', short: 'Di' },
  { id: 'wed', label: 'Mittwoch', short: 'Mi' },
  { id: 'thu', label: 'Donnerstag', short: 'Do' },
  { id: 'fri', label: 'Freitag', short: 'Fr' },
];

// Stunden 1 bis 10
export const PERIODS: TimePeriod[] = [
  { id: 1, startTime: '07:55', endTime: '08:40' },
  { id: 2, startTime: '08:40', endTime: '09:25' },
  { id: 3, startTime: '09:45', endTime: '10:30' },
  { id: 4, startTime: '10:30', endTime: '11:15' },
  { id: 5, startTime: '11:35', endTime: '12:20' },
  { id: 6, startTime: '12:20', endTime: '13:05' },
  { id: 7, startTime: '13:15', endTime: '14:00' },
  { id: 8, startTime: '14:05', endTime: '14:50' },
  { id: 9, startTime: '14:50', endTime: '15:35' },
  { id: 10, startTime: '15:40', endTime: '16:25' },
];

// Vorlagen für Farben und Fächer
export const AVAILABLE_SUBJECTS: SubjectOption[] = [
  { id: 'blue', name: 'Englisch', short: 'E', room: '', teacher: '', 
    color: 'border-l-blue-600 bg-blue-50 dark:bg-blue-600/10', modalColor: 'bg-blue-600', textColor: 'text-blue-900 dark:text-blue-200', borderColor: 'border-blue-200 dark:border-blue-800' },
  
  { id: 'rose', name: 'Musik', short: 'MU', room: '', teacher: '', 
    color: 'border-l-rose-500 bg-rose-50 dark:bg-rose-500/10', modalColor: 'bg-rose-500', textColor: 'text-rose-900 dark:text-rose-200', borderColor: 'border-rose-200 dark:border-rose-800' },
  
  { id: 'slate', name: 'Kunst', short: 'KU', room: '', teacher: '', 
    color: 'border-l-slate-600 bg-slate-200 dark:bg-slate-600/10', modalColor: 'bg-slate-700', textColor: 'text-slate-900 dark:text-slate-200', borderColor: 'border-slate-400 dark:border-slate-600' },
  
  { id: 'sky', name: 'Sport', short: 'SP', room: '', teacher: '', 
    color: 'border-l-sky-500 bg-sky-50 dark:bg-sky-500/10', modalColor: 'bg-sky-500', textColor: 'text-sky-900 dark:text-sky-200', borderColor: 'border-sky-200 dark:border-sky-800' },
  
  { id: 'orange', name: 'Informatik', short: 'IF', room: '', teacher: '', 
    color: 'border-l-orange-500 bg-orange-50 dark:bg-orange-500/10', modalColor: 'bg-orange-500', textColor: 'text-orange-900 dark:text-orange-200', borderColor: 'border-orange-200 dark:border-orange-800' },
  
  { id: 'teal', name: 'Geschichte', short: 'GE', room: '', teacher: '', 
    color: 'border-l-teal-800 bg-teal-50 dark:bg-teal-800/10', modalColor: 'bg-teal-800', textColor: 'text-teal-900 dark:text-teal-200', borderColor: 'border-teal-200 dark:border-teal-800' },
  
  { id: 'green', name: 'Erdkunde', short: 'EK', room: '', teacher: '', 
    color: 'border-l-green-700 bg-green-50 dark:bg-green-700/10', modalColor: 'bg-green-700', textColor: 'text-green-900 dark:text-green-200', borderColor: 'border-green-200 dark:border-green-800' },
  
  { id: 'indigo', name: 'Chemie', short: 'CH', room: '', teacher: '', 
    color: 'border-l-indigo-700 bg-indigo-50 dark:bg-indigo-700/10', modalColor: 'bg-indigo-700', textColor: 'text-indigo-900 dark:text-indigo-200', borderColor: 'border-indigo-200 dark:border-indigo-800' },
  
  { id: 'red', name: 'Deutsch', short: 'D', room: '', teacher: '', 
    color: 'border-l-red-600 bg-red-50 dark:bg-red-500/10', modalColor: 'bg-red-600', textColor: 'text-red-900 dark:text-red-200', borderColor: 'border-red-200 dark:border-red-800' },
  
  { id: 'yellow', name: 'Mathe', short: 'M', room: '', teacher: '', 
    color: 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-500/10', modalColor: 'bg-yellow-400', textColor: 'text-yellow-900 dark:text-yellow-200', borderColor: 'border-yellow-200 dark:border-yellow-800' },
  
  { id: 'purple', name: 'Katholische Religion', short: 'KR', room: '', teacher: '', 
    color: 'border-l-purple-500 bg-purple-50 dark:bg-purple-500/10', modalColor: 'bg-purple-500', textColor: 'text-purple-900 dark:text-purple-200', borderColor: 'border-purple-200 dark:border-purple-800' },

  { id: 'nl', name: 'Niederländisch', short: 'NL', room: '', teacher: '', 
    color: 'border-l-orange-500 bg-orange-50 dark:bg-orange-500/10', modalColor: 'bg-orange-500', textColor: 'text-orange-900 dark:text-orange-200', borderColor: 'border-orange-200 dark:border-orange-800' },

  { id: 'violet', name: 'Mathe Vertiefung', short: 'MVX1', room: '', teacher: '', 
    color: 'border-l-slate-400 bg-white dark:bg-slate-100/5', modalColor: 'bg-slate-500', textColor: 'text-slate-800 dark:text-slate-200', borderColor: 'border-slate-300 dark:border-slate-700' },

  { id: 'emerald', name: 'Biologie', short: 'BI', room: '', teacher: '', 
    color: 'border-l-emerald-600 bg-emerald-50 dark:bg-emerald-500/10', modalColor: 'bg-emerald-600', textColor: 'text-emerald-900 dark:text-emerald-200', borderColor: 'border-emerald-200 dark:border-emerald-800' },

  { id: 'fuchsia', name: 'Philosophie', short: 'PL', room: '', teacher: '', 
    color: 'border-l-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-500/10', modalColor: 'bg-fuchsia-600', textColor: 'text-fuchsia-900 dark:text-fuchsia-200', borderColor: 'border-fuchsia-200 dark:border-fuchsia-800' },

  { id: 'cyan', name: 'Pädagogik', short: 'PA', room: '', teacher: '', 
    color: 'border-l-cyan-600 bg-cyan-50 dark:bg-cyan-500/10', modalColor: 'bg-cyan-600', textColor: 'text-cyan-900 dark:text-cyan-200', borderColor: 'border-cyan-200 dark:border-cyan-800' },

  { id: 'sw', name: 'SoWi', short: 'SW', room: '', teacher: '', 
    color: 'border-l-pink-500 bg-pink-50 dark:bg-pink-500/10', modalColor: 'bg-pink-500', textColor: 'text-pink-900 dark:text-pink-200', borderColor: 'border-pink-200 dark:border-pink-800' },
  
  { id: 'spa', name: 'Spanisch', short: 'S', room: '', teacher: '', 
    color: 'border-l-lime-500 bg-lime-50 dark:bg-lime-500/10', modalColor: 'bg-lime-500', textColor: 'text-lime-900 dark:text-lime-200', borderColor: 'border-lime-200 dark:border-lime-800' },
  
  { id: 'fr', name: 'Französisch', short: 'F', room: '', teacher: '', 
    color: 'border-l-violet-600 bg-violet-50 dark:bg-violet-600/10', modalColor: 'bg-violet-600', textColor: 'text-violet-900 dark:text-violet-200', borderColor: 'border-violet-200 dark:border-violet-800' },
  
  { id: 'ph', name: 'Physik', short: 'PH', room: '', teacher: '', 
    color: 'border-l-sky-700 bg-sky-50 dark:bg-sky-700/10', modalColor: 'bg-sky-700', textColor: 'text-sky-900 dark:text-sky-200', borderColor: 'border-sky-200 dark:border-sky-800' },

  { id: 'er', name: 'Ev. Religion', short: 'ER', room: '', teacher: '', 
    color: 'border-l-purple-400 bg-purple-50 dark:bg-purple-400/10', modalColor: 'bg-purple-400', textColor: 'text-purple-900 dark:text-purple-200', borderColor: 'border-purple-200 dark:border-purple-800' },

  { id: 'lat', name: 'Latein', short: 'L', room: '', teacher: '', 
    color: 'border-l-stone-500 bg-stone-50 dark:bg-stone-500/10', modalColor: 'bg-stone-500', textColor: 'text-stone-900 dark:text-stone-200', borderColor: 'border-stone-200 dark:border-stone-800' },

  { id: 'lit', name: 'Literatur', short: 'LI', room: '', teacher: '', 
    color: 'border-l-amber-500 bg-amber-50 dark:bg-amber-500/10', modalColor: 'bg-amber-500', textColor: 'text-amber-900 dark:text-amber-200', borderColor: 'border-amber-200 dark:border-amber-800' },
];

// Map Abbreviations to IDs
const MAP_ABBR_TO_ID: Record<string, string> = {
  'M': 'yellow', 'EK': 'green', 'D': 'red', 'BI': 'emerald',
  'GE': 'teal', 'PL': 'fuchsia', 'E': 'blue', 'PA': 'cyan',
  'SW': 'sw', 'S': 'spa', 'F': 'fr', 'PH': 'ph',
  'ER': 'er', 'KR': 'purple', 'IF': 'orange', 'CH': 'indigo',
  'MU': 'rose', 'NL': 'nl', 'L': 'lat', 'LI': 'lit', 'N': 'nl', 'K': 'purple'
};

// 1. FIXED LESSONS DEFINITION
const FIXED_LESSONS_DATA: Record<string, any> = {
  "mon-3": { name: "Kunst", short: "KU", room: "O 2-14KU", teacher: "THOL", colorId: "slate" },
  "mon-8": { name: "Katholische Religion", short: "KR", room: "Ü 10a", teacher: "SGEU", colorId: "purple" },
  "mon-9": { name: "Katholische Religion", short: "KR", room: "Ü 10a", teacher: "SGEU", colorId: "purple" },
  
  "tue-3": { name: "Sport", short: "SP", room: "O TH1", teacher: "MVCR", colorId: "sky" },
  "tue-4": { name: "Sport", short: "SP", room: "O TH1", teacher: "MVCR", colorId: "sky" },
  "tue-5": { name: "Deutsch", short: "D", room: "O 1-13", teacher: "JDIR", colorId: "red" },
  "tue-6": { name: "Deutsch", short: "D", room: "O 1-13", teacher: "JDIR", colorId: "red" },
  
  "wed-1": { name: "Englisch", short: "E", room: "O 1-01", teacher: "SGEU", colorId: "blue" },
  "wed-2": { name: "Englisch", short: "E", room: "O 1-01", teacher: "SGEU", colorId: "blue" },
  "wed-3": { name: "Informatik", short: "IF", room: "O 2-16NT", teacher: "AMIS", colorId: "orange" },
  "wed-4": { name: "Informatik", short: "IF", room: "O 2-16NT", teacher: "AMIS", colorId: "orange" },
  "wed-5": { name: "Mathe", short: "M", room: "O 2-02", teacher: "TKIN", colorId: "yellow" },
  "wed-6": { name: "Mathe", short: "M", room: "O 2-02", teacher: "TKIN", colorId: "yellow" },
  "wed-8": { name: "Chemie", short: "CH", room: "O 1-17NW", teacher: "IDCA", colorId: "indigo" },
  "wed-9": { name: "Chemie", short: "CH", room: "O 1-17NW", teacher: "IDCA", colorId: "indigo" },
  "wed-10": { name: "Niederländisch", short: "NL", room: "O 2-01", teacher: "MLEI", colorId: "nl" },
  
  "thu-1": { name: "Mathe Vertiefung", short: "MVX1", room: "O 2-11", teacher: "BROT", colorId: "violet" },
  "thu-2": { name: "Mathe Vertiefung", short: "MVX1", room: "O 2-11", teacher: "BROT", colorId: "violet" },
  "thu-3": { name: "Geschichte", short: "GE", room: "O 2-01", teacher: "JBÖR/ NLIN", colorId: "teal" },
  "thu-4": { name: "Geschichte", short: "GE", room: "O 2-01", teacher: "JBÖR/ NLIN", colorId: "teal" },
  "thu-5": { name: "Erdkunde", short: "EK", room: "O 1-01", teacher: "HSCH", colorId: "green" },
  "thu-6": { name: "Erdkunde", short: "EK", room: "O 1-01", teacher: "HSCH", colorId: "green" },
  
  "fri-1": { name: "Kunst", short: "KU", room: "O 2-14KU", teacher: "THOL", colorId: "slate" },
  "fri-2": { name: "Kunst", short: "KU", room: "O 2-14KU", teacher: "THOL", colorId: "slate" },
  "fri-8": { name: "Niederländisch", short: "NL", room: "O 1-02", teacher: "MLEI", colorId: "nl" },
  "fri-9": { name: "Niederländisch", short: "NL", room: "O 1-02", teacher: "MLEI", colorId: "nl" },
};

// 2. USER PROVIDED LERNBÜRO LISTS (Also used as substitution options for cancelled Fixed lessons)
const USER_LB_LISTS: Record<string, string[]> = {
  // MONTAG
  "mon-1": ["M", "EK", "D", "BI"],
  "mon-2": ["GE", "PL", "E", "PA"],
  "mon-3": ["SW", "S", "F", "BI", "GE", "E", "EK", "D", "PL"],
  "mon-4": ["GE", "PL", "PH", "ER", "EK", "IF", "E", "KR", "M", "EK", "M", "E", "GE", "M", "CH", "IF", "PA"],
  "mon-5": ["E", "EK", "PH", "CH", "M", "CH", "IF", "D", "KR", "M", "PA"],
  "mon-6": ["E", "MU", "D", "BI", "E", "EK", "NL", "D", "NL", "PH", "CH"],
  "mon-7": ["BI", "GE", "E", "EK", "M", "CH", "IF"],
  "mon-8": [], // keins
  "mon-9": [], // keins
  "mon-10": ["E", "KR", "M", "PA", "CH", "EK", "MU"],

  // DIENSTAG
  "tue-1": [], // keins
  "tue-2": [], // keins
  "tue-3": ["L", "GE", "SW", "D"],
  "tue-4": ["D", "GE", "MU", "E", "EK", "D", "E", "E", "PH", "ER", "IF", "M", "PA", "BI"],
  "tue-5": ["D", "BI"],
  "tue-6": ["D", "SW", "EK", "D", "NL", "BI"],
  "tue-7": ["D", "L", "LI", "D", "NL", "NL"],

  // MITTWOCH
  "wed-1": ["M", "IF"],
  "wed-2": ["M", "IF"],
  "wed-3": [], // keins
  "wed-4": [], // keins
  "wed-5": ["E", "EK", "SW", "M", "IF", "L", "GE"],
  "wed-6": ["M", "EK", "S", "MU"],
  "wed-7": ["GE", "PL", "D", "PA"],
  "wed-8": ["E", "KR", "CH", "EK"],
  "wed-9": [], // keins
  "wed-10": ["D", "SW"],

  // DONNERSTAG
  "thu-1": [], // keins
  "thu-2": ["D", "SW"],
  "thu-3": ["L", "GE", "E", "EK", "D", "EK", "LI", "E", "KR"],
  "thu-4": ["M", "PA", "E", "EK", "IF", "SW", "L", "GE"],
  "thu-5": ["BI", "CH", "D", "GE", "MU", "M", "PA", "E", "GE"],
  "thu-6": ["L", "GE", "M", "CH", "IF", "BI", "SW", "D"],
  "thu-7": ["BI", "SW", "M", "PA", "D", "L", "LI", "M", "PH"],
  "thu-8": ["M", "PH", "M", "PA", "E", "MU", "E", "BI", "S", "GE", "IF", "SW", "M", "PA"],
  "thu-9": ["E", "MU", "NL", "E", "S", "NL", "M", "M", "CH", "IF"], // Combined per prompt

  // FREITAG
  "fri-1": ["D", "EK", "LI"],
  "fri-2": ["M", "PH"],
  "fri-3": ["M", "PH", "PA", "GE", "S", "M", "CH", "IF", "GE", "PL", "E", "GE", "IF", "SW", "D", "PA"],
  "fri-4": ["PA", "M", "BI", "IF", "SW", "E", "GE", "D", "M", "PA", "D", "PA"],
  "fri-5": ["E", "KR", "D", "SW", "D", "N", "M", "PH", "E", "PL", "D", "KR", "E", "GE", "E", "BI", "M", "PA", "PH", "ER", "IF", "D", "L", "LI"],
  "fri-6": ["GE", "PL", "PH", "ER", "IF", "E", "KR", "M", "PA", "D", "PL"],
};

export const INITIAL_MASTER_SCHEDULE: Record<string, MasterSlotConfig> = {};

// Helper to convert abbr list to LernbueroOption[]
const createLbOptions = (abbrs: string[]) => {
  const uniqueAbbrs = Array.from(new Set(abbrs));
  return uniqueAbbrs.map(abbr => {
    const id = MAP_ABBR_TO_ID[abbr] || 'yellow';
    return { subjectId: id, customRoom: '', customTeacher: '' };
  });
};

// Generate full schedule
DAYS.forEach(day => {
  PERIODS.forEach(period => {
    const key = `${day.id}-${period.id}`;
    const fixedData = FIXED_LESSONS_DATA[key];
    const userList = USER_LB_LISTS[key];

    if (fixedData) {
      // It's a FIXED slot.
      // If userList exists, those are the substitutions.
      INITIAL_MASTER_SCHEDULE[key] = {
        dayId: day.id,
        periodId: period.id,
        type: SlotType.FIXED,
        fixedSubject: fixedData,
        lernbueroOptions: userList ? createLbOptions(userList) : []
      };
    } else if (userList && userList.length > 0) {
      // It's a LERNBÜRO slot
      INITIAL_MASTER_SCHEDULE[key] = {
        dayId: day.id,
        periodId: period.id,
        type: SlotType.LERNBUERO,
        lernbueroOptions: createLbOptions(userList)
      };
    } else {
      // EMPTY slot
      INITIAL_MASTER_SCHEDULE[key] = {
        dayId: day.id,
        periodId: period.id,
        type: SlotType.EMPTY
      };
    }
  });
});