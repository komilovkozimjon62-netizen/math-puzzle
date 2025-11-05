
import React from 'react';
import { Clock, Star, Award } from 'lucide-react';

interface HeaderProps {
  score: number;
  highScore: number;
  timer: number;
}

const StatBox: React.FC<{ icon: React.ReactNode; label: string; value: number | string; colorClass: string }> = ({ icon, label, value, colorClass }) => (
  <div className={`flex flex-col items-center justify-center p-2 md:p-4 rounded-lg bg-white/60 dark:bg-slate-800/70 shadow-lg text-slate-800 dark:text-white w-24 md:w-32 ${colorClass}`}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium hidden md:inline">{label}</span>
    </div>
    <span className="text-2xl md:text-3xl font-bold tracking-tighter">{value}</span>
  </div>
);

const Header: React.FC<HeaderProps> = ({ score, highScore, timer }) => {
  return (
    <div className="w-full flex justify-between items-center gap-2 md:gap-4 p-4">
      <StatBox icon={<Star size={20}/>} label="Score" value={score} colorClass="border-b-4 border-blue-400 dark:border-blue-500" />
      <StatBox icon={<Clock size={20} />} label="Time" value={timer} colorClass={timer <= 10 ? "text-red-500 dark:text-red-400 border-b-4 border-red-400 dark:border-red-500 animate-pulse" : "border-b-4 border-green-400 dark:border-green-500"} />
      <StatBox icon={<Award size={20} />} label="Best" value={highScore} colorClass="border-b-4 border-yellow-400 dark:border-yellow-500" />
    </div>
  );
};

export default Header;