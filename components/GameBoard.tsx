
import React from 'react';
import Block from './Block';
import type { BoardType, Position } from '../types';

interface GameBoardProps {
  board: BoardType;
  selectedPosition: Position | null;
  onBlockClick: (row: number, col: number) => void;
  hintedPositions: Position[];
  errorPosition: Position | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, selectedPosition, onBlockClick, hintedPositions, errorPosition }) => {
  return (
    <div className={`grid grid-cols-${board.length} grid-rows-${board.length} gap-2 md:gap-3 p-3 md:p-4 bg-slate-300 dark:bg-slate-900/50 rounded-xl shadow-2xl`}>
      {board.map((row, rowIndex) =>
        row.map((block, colIndex) => (
          <Block
            key={`${rowIndex}-${colIndex}`}
            block={block}
            isSelected={selectedPosition?.row === rowIndex && selectedPosition?.col === colIndex}
            isHint={hintedPositions.some(p => p.row === rowIndex && p.col === colIndex)}
            onClick={() => onBlockClick(rowIndex, colIndex)}
            isError={errorPosition?.row === rowIndex && errorPosition?.col === colIndex}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;