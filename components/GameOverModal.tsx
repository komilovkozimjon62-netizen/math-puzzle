import React, { useState } from 'react';
import type { ScoreRecord } from '../types';
import { playSound, SoundType } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  scoreHistory: ScoreRecord[];
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart, scoreHistory }) => {
  const [showHistory, setShowHistory] = useState(false);
  const isNewHighScore = score > 0 && score === highScore;

  if (showHistory) {
    return (
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-white to-slate-100 text-slate-900 dark:from-slate-700 dark:to-slate-800 dark:text-white p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-600 text-center w-11/12 max-w-sm transform transition-all animate-in fade-in zoom-in-95">
          <h2 className="text-3xl font-extrabold mb-4 text-yellow-600 dark:text-yellow-300">Rekordlar Tarixi</h2>
          {scoreHistory && scoreHistory.length > 0 ? (
            <ul className="text-left space-y-2 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {scoreHistory.map((record, index) => (
                <li key={index} className="flex justify-between items-center bg-slate-200/80 dark:bg-slate-600/50 p-2 rounded-md animate-in fade-in slide-in-from-bottom-2 duration-300" style={{animationDelay: `${index * 50}ms`}}>
                  <span className="font-bold text-lg"><span className="text-slate-500 dark:text-slate-400 text-sm w-6 inline-block">{index + 1}.</span> {record.score} ball</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{record.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 my-8">Hali rekordlar yo'q.</p>
          )}
          <button
            onClick={() => {
                playSound(SoundType.UIClick);
                setShowHistory(false);
            }}
            className="w-full bg-slate-300 hover:bg-slate-400 text-slate-800 dark:bg-slate-500 dark:hover:bg-slate-600 dark:text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            Orqaga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-white to-slate-100 text-slate-900 dark:from-slate-700 dark:to-slate-800 dark:text-white p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-600 text-center w-11/12 max-w-sm transform transition-all animate-in fade-in zoom-in-95">
        <h2 className="text-4xl font-extrabold mb-2 text-yellow-600 dark:text-yellow-300">Vaqt Tugadi!</h2>
        <p className="text-slate-500 dark:text-slate-300 mb-6">O'yin tugadi.</p>
        
        {isNewHighScore && (
          <div className="bg-yellow-400/30 border border-yellow-500 text-yellow-600 dark:text-yellow-300 p-3 rounded-lg mb-6 animate-pulse">
            <p className="font-bold text-lg">Yangi Rekord!</p>
          </div>
        )}

        <div className="flex justify-around mb-8">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ball</p>
            <p className="text-3xl font-bold">{score}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Eng Yuqori</p>
            <p className="text-3xl font-bold">{highScore}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Qayta Boshlash
          </button>
          <button
            onClick={() => {
                playSound(SoundType.UIClick);
                setShowHistory(true);
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            Rekordlar Tarixi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;