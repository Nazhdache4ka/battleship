import { type IShip, type AiShotHistory, AiGamePhase, type BoardEnemy, createEmptyBoard } from '@/shared';
import { CurrentTurn } from '../lib';
import { create } from 'zustand';

const initialAiBoard = createEmptyBoard();

interface AiGameStore {
  currentTurn: CurrentTurn;
  setCurrentTurn: (currentTurn: CurrentTurn) => void;
  aiBoard: BoardEnemy;
  setAiBoard: (aiBoard: BoardEnemy) => void;
  aiShips: IShip[];
  setAiShips: (aiShips: IShip[]) => void;
  aiMessage: string;
  setAiMessage: (aiMessage: string) => void;
  sessionId: number | null;
  setSessionId: (sessionId: number | null) => void;
  aiShotsHistory: AiShotHistory[];
  setAiShotsHistory: (aiShotsHistory: AiShotHistory[]) => void;
  phase: AiGamePhase;
  setPhase: (phase: AiGamePhase) => void;
  winner: 'user' | 'ai' | null;
  setWinner: (winner: 'user' | 'ai' | null) => void;
}

export const useAiGameStore = create<AiGameStore>(set => ({
  currentTurn: CurrentTurn.USER,
  setCurrentTurn: (currentTurn: CurrentTurn) => set({ currentTurn }),
  aiBoard: initialAiBoard,
  setAiBoard: (aiBoard: BoardEnemy) => set({ aiBoard }),
  aiShips: [],
  setAiShips: (aiShips: IShip[]) => set({ aiShips }),
  aiMessage: '',
  setAiMessage: (aiMessage: string) => set({ aiMessage }),
  sessionId: null,
  setSessionId: (sessionId: number | null) => set({ sessionId }),
  aiShotsHistory: [],
  setAiShotsHistory: (aiShotsHistory: AiShotHistory[]) => set({ aiShotsHistory }),
  phase: AiGamePhase.INITIAL,
  setPhase: (phase: AiGamePhase) => set({ phase }),
  winner: null,
  setWinner: (winner: 'user' | 'ai' | null) => set({ winner }),
}));
