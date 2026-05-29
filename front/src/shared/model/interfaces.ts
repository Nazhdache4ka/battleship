import type { AI_TURN_RULES } from './models';

export interface IUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export type Coordinates = {
  x: number;
  y: number;
};

export type Board = ICell[][];

export type BoardEnemy = ICellEnemy[][];

export interface IShip {
  id: string;
  size: number;
  occupiedCells: Coordinates[];
  isSunk: boolean;
}

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

export const CellState = {
  EMPTY: 'empty',
  SHIP: 'ship',
  HIT: 'hit',
  MISS: 'miss',
} as const;

export type CellState = (typeof CellState)[keyof typeof CellState];

export type CellDropData = {
  type: 'cell';
  cell: ICell;
};

export type ShipDragData = {
  type: 'ship';
  ship: IShip;
};

export type AiShotHistory = {
  x: number;
  y: number;
  result: 'hit' | 'miss' | 'sunk';
};

export type BoardRequest = {
  playerBoardForAi: ('unknown' | 'hit' | 'miss')[][];
  aiShotHistory: AiShotHistory[];
};

export type AiTurnRequest = {
  board: BoardRequest;
  rules: AiTurnRules;
};

export type AiTurnRules = typeof AI_TURN_RULES;

export type AiTurnResponse = {
  board: Board;
  ships: IShip[];
  result: 'hit' | 'miss' | 'sunk';
  target: Coordinates;
  message: string;
};

export const AiGamePhase = {
  ONGOING: 'ongoing',
  FINISHED: 'finished',
  INITIAL: 'initial',
} as const;

export type AiGamePhase = (typeof AiGamePhase)[keyof typeof AiGamePhase];
