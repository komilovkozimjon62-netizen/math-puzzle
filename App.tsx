import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import GameOverModal from './components/GameOverModal';
import ThemeSwitcher from './components/ThemeSwitcher';
import MergeAnimation from './components/MergeAnimation';
import { GameState } from './types';
import type { BoardType, BlockType, Position, ScoreRecord } from './types';
import {
  GRID_SIZE,
  INITIAL_TIME,
  TIME_BONUS,
  TIME_PENALTY,
  INITIAL_BLOCKS,
  POSSIBLE_NEW_BLOCK_VALUES,
  INITIAL_SHUFFLES,
  HINT_TIMEOUT,
} from './constants';
import { RefreshCw, Shuffle } from 'lucide-react';
import { playSound, SoundType, startBackgroundMusic, stopBackgroundMusic } from './utils/audio';

// Using Math.random for this simple game is sufficient.
const generateId = () => Math.random().toString(36).substring(2, 9);

type MergeAnimationState = { id: string; row: number; col: number; };

const createNewBlock = (): BlockType => {
  const value = POSSIBLE_NEW_BLOCK_VALUES[Math.floor(Math.random() * POSSIBLE_NEW_BLOCK_VALUES.length)];
  return { id: generateId(), value };
};

const createEmptyBoard = (): BoardType => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

const findPossibleMoves = (board: BoardType): { from: Position, to: Position }[] => {
  const moves: { from: Position, to: Position }[] = [];
  const directions = [{ dr: 0, dc: 1 }, { dr: 1, dc: 0 }]; // Check right and down

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const block = board[r][c];
      if (block && !block.isBlocker) {
        for (const dir of directions) {
          const nr = r + dir.dr;
          const nc = c + dir.dc;
          if (nr < GRID_SIZE && nc < GRID_SIZE) {
            const neighbor = board[nr][nc];
            if (neighbor && !neighbor.isBlocker) {
              const areIdentical = neighbor.value === block.value;
              const sumIsTarget = neighbor.value + block.value === 10;
              if (areIdentical || sumIsTarget) {
                 moves.push({ from: { row: r, col: c }, to: { row: nr, col: nc } });
              }
            }
          }
        }
      }
    }
  }
  return moves;
};


const App: React.FC = () => {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('highScore')) || 0);
  const [timer, setTime] = useState(INITIAL_TIME);
  const [gameState, setGameState] = useState<GameState>(GameState.StartMenu);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [shuffles, setShuffles] = useState(INITIAL_SHUFFLES);
  const [hintedPositions, setHintedPositions] = useState<Position[]>([]);
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>(() => {
    try {
      const savedHistory = localStorage.getItem('scoreHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error("Failed to parse score history from localStorage", e);
      return [];
    }
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [mergeAnimations, setMergeAnimations] = useState<MergeAnimationState[]>([]);
  const [errorPosition, setErrorPosition] = useState<Position | null>(null);


  // Fix: Use ReturnType<typeof setInterval> for browser-compatible timer IDs.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Fix: Use ReturnType<typeof setTimeout> for browser-compatible timer IDs.
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const clearHintTimer = useCallback(() => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
    setHintedPositions([]);
  }, []);

  const startHintTimer = useCallback(() => {
    clearHintTimer();
    hintTimerRef.current = setTimeout(() => {
      const moves = findPossibleMoves(board);
      if (moves.length > 0) {
        setHintedPositions([moves[0].from, moves[0].to]);
      }
    }, HINT_TIMEOUT);
  }, [board, clearHintTimer]);


  const startGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    
    // Start with two identical, adjacent blocks for an easy start
    const startValue = POSSIBLE_NEW_BLOCK_VALUES[Math.floor(Math.random() * POSSIBLE_NEW_BLOCK_VALUES.length)];
    const row = Math.floor(Math.random() * (GRID_SIZE - 1));
    const col = Math.floor(Math.random() * GRID_SIZE);
    newBoard[row][col] = { id: generateId(), value: startValue };
    newBoard[row + 1][col] = { id: generateId(), value: startValue };

    // Fill the rest of the board
    let filledBlocks = 2;
    while (filledBlocks < INITIAL_BLOCKS) {
        let r, c;
        do {
            r = Math.floor(Math.random() * GRID_SIZE);
            c = Math.floor(Math.random() * GRID_SIZE);
        } while (newBoard[r][c]);
        newBoard[r][c] = createNewBlock();
        filledBlocks++;
    }

    setBoard(newBoard);
    setScore(0);
    setTime(INITIAL_TIME);
    setGameState(GameState.Playing);
    setSelectedPosition(null);
    setShuffles(INITIAL_SHUFFLES);
    playSound(SoundType.UIClick);

    stopBackgroundMusic(backgroundMusicRef.current);
    backgroundMusicRef.current = startBackgroundMusic();
  }, []);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      timerRef.current = setInterval(() => {
        setTime(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setGameState(GameState.GameOver);
            playSound(SoundType.GameOver);
            stopBackgroundMusic(backgroundMusicRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', String(score));
    }
  }, [score, highScore]);
  
  // This effect runs when the game ends to save the score.
  useEffect(() => {
    if (gameState === GameState.GameOver && score > 0) {
      const newRecord: ScoreRecord = { score, date: new Date().toLocaleDateString() };
      setScoreHistory(prevHistory => {
        const updatedHistory = [...prevHistory, newRecord]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Keep top 10

        localStorage.setItem('scoreHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }
  }, [gameState, score]);

  useEffect(() => {
    if(gameState === GameState.Playing) {
        startHintTimer();
    } else {
        clearHintTimer();
    }

    return () => clearHintTimer();
  }, [gameState, board, startHintTimer, clearHintTimer]);


  const dropAndFillBlocks = useCallback((newBoard: BoardType) => {
    // Simple gravity: blocks fall down
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (newBoard[r][c]) {
          [newBoard[emptyRow][c], newBoard[r][c]] = [newBoard[r][c], newBoard[emptyRow][c]];
          emptyRow--;
        }
      }
    }

    // Fill empty spaces
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newBoard[r][c]) {
            const shouldBeBlocker = score >= 800 && Math.random() < 0.1; // 10% chance after 800 score
            if (shouldBeBlocker) {
                newBoard[r][c] = { id: generateId(), value: -1, isBlocker: true };
            } else {
                newBoard[r][c] = createNewBlock();
            }
        }
      }
    }
    return newBoard;
  }, [score]);

  const handleAnimationComplete = (id: string) => {
    setMergeAnimations(prev => prev.filter(anim => anim.id !== id));
  };

  const handleBlockClick = (row: number, col: number) => {
    if (gameState !== GameState.Playing) return;

    const clickedBlock = board[row][col];
    if (!clickedBlock) return;

    if (clickedBlock.isBlocker) {
        playSound(SoundType.Error);
        setErrorPosition({ row, col });
        setTimeout(() => setErrorPosition(null), 500);
        return;
    }

    clearHintTimer();
    startHintTimer();

    if (!selectedPosition) {
      playSound(SoundType.Click);
      setSelectedPosition({ row, col });
    } else {
      const selectedBlock = board[selectedPosition.row][selectedPosition.col];
      const isAdjacent = Math.abs(selectedPosition.row - row) + Math.abs(selectedPosition.col - col) === 1;

      let isValidMove = false;
      if (selectedBlock && clickedBlock && isAdjacent) {
          const areIdentical = selectedBlock.value === clickedBlock.value;
          const sumIsTarget = selectedBlock.value + clickedBlock.value === 10;
          if (areIdentical || sumIsTarget) {
              isValidMove = true;
          }
      }

      if (isValidMove && selectedBlock) {
        // Merge
        const newBoard = board.map(r => r.slice());
        const newBlockValue = selectedBlock.value + clickedBlock.value;
        newBoard[row][col] = { id: generateId(), value: newBlockValue };
        newBoard[selectedPosition.row][selectedPosition.col] = null;
        
        const finalBoard = dropAndFillBlocks(newBoard);
        setBoard(finalBoard);

        const timeBonus = score > 1000 ? TIME_BONUS - 1 : TIME_BONUS;
        setTime(t => t + timeBonus);
        setScore(s => s + newBlockValue);
        playSound(SoundType.Merge);

        const animationId = generateId();
        setMergeAnimations(prev => [...prev, { id: animationId, row, col }]);

      } else {
        // Invalid move or deselection
        playSound(SoundType.Error);
        setTime(t => Math.max(0, t - TIME_PENALTY));
        setErrorPosition({ row, col });
        setTimeout(() => setErrorPosition(null), 500);
      }
      setSelectedPosition(null);
    }
  };

  const handleShuffle = useCallback(() => {
    if (shuffles > 0 && gameState === GameState.Playing) {
      playSound(SoundType.Shuffle);
      setShuffles(prev => prev - 1);
      setSelectedPosition(null);

      const newBoard = board.map(row => row.map(block => {
        if (block && !block.isBlocker) {
            // Replace with a new random block
            return createNewBlock();
        }
        // Keep blockers and empty spaces as they are
        return block;
      }));
  
      setBoard(newBoard);
      clearHintTimer();
      startHintTimer();
    }
  }, [board, shuffles, gameState, clearHintTimer, startHintTimer]);

  const StartMenu = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="bg-white/70 dark:bg-slate-800/70 p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-200 dark:border-slate-700 relative">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-900 dark:text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">Math Puzzle</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm">
                Bir xil sonlarni birlashtirib, vaqt tugamasdan eng yuqori ballni to'plang!
            </p>
            <button
                onClick={startGame}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 text-xl"
            >
                O'yinni Boshlash
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">Created by Komilov . K</p>
        </div>
    </div>
);


  return (
    <main className="w-full h-screen flex flex-col items-center justify-center p-2 md:p-4 bg-gradient-to-br from-slate-200 to-slate-50 dark:from-slate-900 dark:to-slate-800 font-sans transition-colors duration-300">
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      </div>
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {gameState === GameState.StartMenu && <StartMenu />}
        {gameState !== GameState.StartMenu && (
             <>
                <Header score={score} highScore={highScore} timer={timer} />
                <div className="relative">
                  <GameBoard 
                      board={board} 
                      selectedPosition={selectedPosition}
                      onBlockClick={handleBlockClick}
                      hintedPositions={hintedPositions}
                      errorPosition={errorPosition}
                  />
                  {mergeAnimations.map(anim => (
                      <MergeAnimation
                          key={anim.id}
                          row={anim.row}
                          col={anim.col}
                          onComplete={() => handleAnimationComplete(anim.id)}
                      />
                  ))}
                </div>
                <div className="mt-4 w-full flex justify-center items-center gap-4">
                    <button 
                        onClick={handleShuffle}
                        disabled={shuffles === 0 || gameState !== GameState.Playing}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                    >
                        <Shuffle size={20} />
                        Aralashtirish
                        <span className="bg-blue-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{shuffles}</span>
                    </button>
                    <button
                        onClick={startGame}
                        className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                    >
                        <RefreshCw size={20} />
                        Qayta
                    </button>
                </div>
             </>
        )}
       
        {gameState === GameState.GameOver && (
          <GameOverModal 
            score={score} 
            highScore={highScore} 
            onRestart={startGame}
            scoreHistory={scoreHistory} 
          />
        )}
      </div>
    </main>
  );
};

export default App;