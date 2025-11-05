export type BlockType = {
  id: string;
  value: number;
  isBlocker?: boolean;
};

export type BoardType = (BlockType | null)[][];

export type Position = {
  row: number;
  col: number;
};

export enum GameState {
  Playing,
  GameOver,
  StartMenu,
}

export type ScoreRecord = {
  score: number;
  date: string;
};
