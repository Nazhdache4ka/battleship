import { useCallback } from 'react';
import { useAiGameStore } from '../store';
import { AiGameService } from '../api';
import { AiGamePhase, createEmptyBoard, resetBoardAndShips, useAuthStore, useGameStore } from '@/shared';
import { CurrentTurn } from '../lib';

export function useAiGameButtonHandlers() {
  const {
    phase,
    sessionId,
    setCurrentTurn,
    setSessionId,
    setAiBoard,
    setAiShips,
    setAiMessage,
    setAiShotsHistory,
    setPhase,
    setWinner,
  } = useAiGameStore();
  const { board, ships, setBoard, setShips } = useGameStore();
  const user = useAuthStore(state => state.user);

  const handleStartGame = useCallback(async () => {
    if (phase === AiGamePhase.ONGOING) return;

    if (!user) return;

    const { newBoard, newShips } = resetBoardAndShips(board, ships);

    const { sessionId, aiBoardEnemy } = await AiGameService.initializeAiGameSession(newBoard);
    setBoard(newBoard);
    setShips(newShips);
    setCurrentTurn(CurrentTurn.USER);
    setAiShotsHistory([]);
    setWinner(null);
    setAiMessage('');
    setSessionId(sessionId);
    setAiBoard(aiBoardEnemy);
    setPhase(AiGamePhase.ONGOING);
  }, [
    phase,
    user,
    board,
    ships,
    setBoard,
    setShips,
    setCurrentTurn,
    setWinner,
    setAiMessage,
    setAiShotsHistory,
    setSessionId,
    setAiBoard,
    setPhase,
  ]);

  const handleResignGame = useCallback(async () => {
    if (phase !== AiGamePhase.ONGOING) return;

    await AiGameService.deleteAiGameSession(sessionId);
    setSessionId(null);
    setAiBoard(createEmptyBoard());
    setAiShips([]);
    setPhase(AiGamePhase.FINISHED);
    setWinner('ai');
  }, [phase, sessionId, setSessionId, setAiBoard, setAiShips, setPhase, setWinner]);

  return { handleStartGame, handleResignGame };
}
