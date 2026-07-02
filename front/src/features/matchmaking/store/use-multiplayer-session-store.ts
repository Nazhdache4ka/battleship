import { GameStatus, MultiplayerPhase } from '@/shared';
import { create } from 'zustand';

interface MultiplayerSessionStore {
  gameStatus: GameStatus;
  setGameStatus: (gameStatus: GameStatus) => void;
  gameId: number | null;
  setGameId: (gameId: number | null) => void;
  multiplayerPhase: MultiplayerPhase;
  setMultiplayerPhase: (multiplayerPhase: MultiplayerPhase) => void;
  winnerUserId: number | null;
  setWinnerUserId: (winnerUserId: number | null) => void;
  opponentName: string | null;
  setOpponentName: (opponentName: string | null) => void;
  errorMessage: string | null;
  setErrorMessage: (errorMessage: string | null) => void;
}

export const useMultiplayerSessionStore = create<MultiplayerSessionStore>(set => ({
  gameStatus: GameStatus.WAITING,
  setGameStatus: (gameStatus: GameStatus) => set({ gameStatus }),
  gameId: null,
  setGameId: (gameId: number | null) => set({ gameId }),
  multiplayerPhase: MultiplayerPhase.IDLE,
  setMultiplayerPhase: (multiplayerPhase: MultiplayerPhase) => set({ multiplayerPhase }),
  winnerUserId: null,
  setWinnerUserId: (winnerUserId: number | null) => set({ winnerUserId }),
  opponentName: null,
  setOpponentName: (opponentName: string | null) => set({ opponentName }),
  errorMessage: null,
  setErrorMessage: (errorMessage: string | null) => set({ errorMessage }),
}));
