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
