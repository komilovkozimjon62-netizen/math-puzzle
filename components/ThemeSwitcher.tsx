import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeSwitcherProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ toggleTheme, theme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-800 dark:text-yellow-300 bg-slate-300/50 dark:bg-slate-900/50 hover:bg-slate-400/50 dark:hover:bg-slate-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-blue-500"
      aria-label="Mavzuni o'zgartirish"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeSwitcher;