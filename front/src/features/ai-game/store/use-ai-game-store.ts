import type { Board, IShip, AiShotHistory } from '@/shared';
import { CurrentTurn, generateAiBoardAndFleet } from '../lib';
import { create } from 'zustand';

const { board, ships } = generateAiBoardAndFleet();

interface AiGameStore {
  currentTurn: CurrentTurn;
  setCurrentTurn: (currentTurn: CurrentTurn) => void;
  aiBoard: Board;
  setAiBoard: (aiBoard: Board) => void;
  aiShips: IShip[];
  setAiShips: (aiShips: IShip[]) => void;
  aiMessage: string;
  setAiMessage: (aiMessage: string) => void;
  sessionId: number | null;
  setSessionId: (sessionId: number | null) => void;
  aiShotsHistory: AiShotHistory[];
  setAiShotsHistory: (aiShotsHistory: AiShotHistory[]) => void;
}

export const useAiGameStore = create<AiGameStore>(set => ({
  currentTurn: CurrentTurn.USER,
  setCurrentTurn: (currentTurn: CurrentTurn) => set({ currentTurn }),
  aiBoard: board,
  setAiBoard: (aiBoard: Board) => set({ aiBoard }),
  aiShips: ships,
  setAiShips: (aiShips: IShip[]) => set({ aiShips }),
  aiMessage: '',
  setAiMessage: (aiMessage: string) => set({ aiMessage }),
  sessionId: null,
  setSessionId: (sessionId: number | null) => set({ sessionId }),
  aiShotsHistory: [],
  setAiShotsHistory: (aiShotsHistory: AiShotHistory[]) => set({ aiShotsHistory }),
}));
