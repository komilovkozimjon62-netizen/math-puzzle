export const GRID_SIZE = 5;
export const INITIAL_TIME = 23;
export const TIME_BONUS = 2;
export const TIME_PENALTY = 3;
export const INITIAL_BLOCKS = 10;
export const INITIAL_SHUFFLES = 3;
export const HINT_TIMEOUT = 5000; // 5 seconds

export const BLOCK_COLORS: { [key: number]: string } = {
  // Low tier - Softer colors, high contrast text
  2: 'bg-slate-200 text-slate-900 dark:bg-slate-600 dark:text-slate-100',
  3: 'bg-stone-200 text-stone-900 dark:bg-stone-600 dark:text-stone-100',
  4: 'bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100',
  5: 'bg-orange-200 text-orange-900 dark:bg-orange-700 dark:text-orange-100',
  6: 'bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-amber-100',
  7: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100',

  // Mid tier - More saturated colors
  8: 'bg-lime-300 text-lime-900 dark:bg-lime-600 dark:text-white',
  10: 'bg-green-300 text-green-900 dark:bg-green-600 dark:text-white',
  12: 'bg-emerald-300 text-emerald-900 dark:bg-emerald-600 dark:text-white',
  14: 'bg-teal-300 text-teal-900 dark:bg-teal-600 dark:text-white',
  16: 'bg-cyan-300 text-cyan-900 dark:bg-cyan-600 dark:text-white',
  20: 'bg-sky-300 text-sky-900 dark:bg-sky-600 dark:text-white',
  24: 'bg-blue-300 text-blue-900 dark:bg-blue-600 dark:text-white',
  28: 'bg-indigo-300 text-indigo-900 dark:bg-indigo-600 dark:text-white',
  
  // High tier - Vibrant colors
  32: 'bg-violet-500 text-white dark:bg-violet-500 dark:text-violet-100',
  40: 'bg-purple-500 text-white dark:bg-purple-500 dark:text-purple-100',
  48: 'bg-fuchsia-500 text-white dark:bg-fuchsia-500 dark:text-fuchsia-100',
  56: 'bg-pink-500 text-white dark:bg-pink-500 dark:text-pink-100',
  64: 'bg-rose-500 text-white dark:bg-rose-500 dark:text-rose-100',
};


export const DEFAULT_BLOCK_COLOR = 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100';

export const POSSIBLE_NEW_BLOCK_VALUES = [2, 3, 4, 5, 6, 7];