import { create } from 'zustand';
import type { Board, IShip } from '../model';
import { createRandomFleetLayout } from '../utils';

const { board: initialBoard, ships: initialShips } = createRandomFleetLayout();

interface GameStore {
  board: Board;
  setBoard: (board: Board) => void;
  ships: IShip[];
  setShips: (ships: IShip[]) => void;
}

export const useGameStore = create<GameStore>(set => ({
  board: initialBoard,
  setBoard: (board: Board) => set({ board }),
  ships: initialShips,
  setShips: (ships: IShip[]) => set({ ships }),
}));
