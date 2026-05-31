import { AI_TURN_RULES } from 'src/models/models';

export type AiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type Coordinates = {
  x: number;
  y: number;
};

export interface IShip {
  id: string;
  size: number;
  occupiedCells: Coordinates[];
  isSunk: boolean;
}

export const CellState = {
  EMPTY: 'empty',
  SHIP: 'ship',
  HIT: 'hit',
  MISS: 'miss',
} as const;

export type CellState = (typeof CellState)[keyof typeof CellState];

export interface ICell {
  x: number;
  y: number;
  shipId: string | null;
  state: CellState;
}

export interface ICellEnemy {
  x: number;
  y: number;
  state: CellState;
}

export type Board = ICell[][];

export type BoardEnemy = ICellEnemy[][];

export type AiShotHistory = {
  x: number;
  y: number;
  result: 'hit' | 'miss' | 'sunk';
};

export type BoardRequest = {
  playerBoardForAi: ('unknown' | 'hit' | 'miss')[][];
  aiShotHistory: AiShotHistory[];
};

export interface AiTurnRequest {
  board: BoardRequest;
  rules: typeof AI_TURN_RULES;
}

export type AiTurnResponse = {
  board: Board;
  ships: IShip[];
  result: 'hit' | 'miss' | 'sunk';
  target: Coordinates;
  message: string;
};
