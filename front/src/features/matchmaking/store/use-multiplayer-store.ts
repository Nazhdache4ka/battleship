import { GameStatus, MultiplayerPhase, type BoardEnemy, type IShip, type IUser } from '@/shared';
import { create } from 'zustand';

interface MultiplayerStore {
  gameStatus: GameStatus;
  setGameStatus: (gameStatus: GameStatus) => void;
  gameId: number | null;
  setGameId: (gameId: number | null) => void;
  multiplayerPhase: MultiplayerPhase;
  setMultiplayerPhase: (multiplayerPhase: MultiplayerPhase) => void;
  enemyBoard: BoardEnemy | null;
  setEnemyBoard: (enemyBoard: BoardEnemy | null) => void;
  enemyShips: IShip[];
  setEnemyShips: (enemyShips: IShip[]) => void;
  currentTurnUserId: number | null;
  setCurrentTurnUserId: (currentTurnUserId: number | null) => void;
  winnerUserId: number | null;
  setWinnerUserId: (winnerUserId: number | null) => void;
  opponent: Pick<IUser, 'id' | 'name'> | null;
  setOpponent: (opponent: Pick<IUser, 'id' | 'name'> | null) => void;
  errorMessage: string | null;
  setErrorMessage: (errorMessage: string | null) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>(set => ({
  gameStatus: GameStatus.WAITING,
  setGameStatus: (gameStatus: GameStatus) => set({ gameStatus }),
  gameId: null,
  setGameId: (gameId: number | null) => set({ gameId }),
  multiplayerPhase: MultiplayerPhase.IDLE,
  setMultiplayerPhase: (multiplayerPhase: MultiplayerPhase) => set({ multiplayerPhase }),
  enemyBoard: null,
  setEnemyBoard: (enemyBoard: BoardEnemy | null) => set({ enemyBoard }),
  enemyShips: [],
  setEnemyShips: (enemyShips: IShip[]) => set({ enemyShips }),
  currentTurnUserId: null,
  setCurrentTurnUserId: (currentTurnUserId: number | null) => set({ currentTurnUserId }),
  winnerUserId: null,
  setWinnerUserId: (winnerUserId: number | null) => set({ winnerUserId }),
  opponent: null,
  setOpponent: (opponent: Pick<IUser, 'id' | 'name'> | null) => set({ opponent }),
  errorMessage: null,
  setErrorMessage: (errorMessage: string | null) => set({ errorMessage }),
}));
