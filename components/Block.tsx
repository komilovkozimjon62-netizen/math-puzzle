import React from 'react';
import { BLOCK_COLORS, DEFAULT_BLOCK_COLOR } from '../constants';
import type { BlockType } from '../types';

interface BlockProps {
  block: BlockType | null;
  isSelected: boolean;
  onClick: () => void;
  isHint: boolean;
  isError: boolean;
}

const Block: React.FC<BlockProps> = ({ block, isSelected, onClick, isHint, isError }) => {
  if (!block) {
    return <div className="aspect-square rounded-lg bg-slate-300/60 dark:bg-slate-700/50"></div>;
  }

  if (block.isBlocker) {
    return (
      <div className="relative aspect-square rounded-lg flex items-center justify-center bg-slate-400 dark:bg-slate-600 shadow-inner cursor-not-allowed">
        <div className="w-1/2 h-1/2 bg-slate-300 dark:bg-slate-500 rounded-full opacity-50"></div>
      </div>
    );
  }

  const color = BLOCK_COLORS[block.value] || DEFAULT_BLOCK_COLOR;
  const selectionClasses = isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2 ring-slate-400/50 dark:ring-black/20';
  const hintClasses = isHint && !isSelected ? 'animate-pulse ring-2 ring-white' : '';
  const errorClasses = isError ? 'animate-shake' : '';

  return (
    <div
      className={`relative aspect-square rounded-lg flex items-center justify-center cursor-pointer select-none transition-all duration-300 transform shadow-lg hover:scale-105 ${color} ${selectionClasses} ${hintClasses} ${errorClasses}`}
      onClick={onClick}
    >
      <span className="text-xl md:text-3xl font-bold">{block.value}</span>
      <div className="absolute inset-0 rounded-lg" style={{ background: 'radial-gradient(circle at 50% 0, rgba(255,255,255,0.4), transparent 70%)' }}></div>
    </div>
  );
};

export default Block;