import { create } from 'zustand';
import type { Board, BoardEnemy, IShip } from '@/shared';

interface MultiplayerGameStore {
  board: Board | null;
  setBoard: (board: Board) => void;
  ships: IShip[];
  setShips: (ships: IShip[]) => void;
  enemyBoard: BoardEnemy | null;
  setEnemyBoard: (enemyBoard: BoardEnemy) => void;
  enemyShips: IShip[];
  setEnemyShips: (enemyShips: IShip[]) => void;
  currentTurnUserId: number | null;
  setCurrentTurnUserId: (currentTurnUserId: number | null) => void;
}

export const useMultiplayerGameStore = create<MultiplayerGameStore>(set => ({
  board: null,
  setBoard: (board: Board) => set({ board }),
  ships: [],
  setShips: (ships: IShip[]) => set({ ships }),
  enemyBoard: null,
  setEnemyBoard: (enemyBoard: BoardEnemy) => set({ enemyBoard }),
  enemyShips: [],
  setEnemyShips: (enemyShips: IShip[]) => set({ enemyShips }),
  currentTurnUserId: null,
  setCurrentTurnUserId: (currentTurnUserId: number | null) => set({ currentTurnUserId }),
}));
