import { AiGamePhase, useGameStore } from '@/shared';
import { useAiGameStore } from '../store';
import { AiGameService } from '../api';
import { CurrentTurn } from './model';

const AI_MOVE_DELAY_MS = 1000;

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export async function triggerAiTurns() {
  const { sessionId, setCurrentTurn, setAiMessage, setPhase, setWinner } = useAiGameStore.getState();
  const { setBoard, setShips } = useGameStore.getState();

  if (sessionId === null) return;

  try {
    const { aiTurnResponse, winner } = await AiGameService.triggerAiTurns(sessionId);

    if (!aiTurnResponse) {
      setCurrentTurn(CurrentTurn.USER);
      return;
    }

    if (aiTurnResponse.length === 0) {
      setCurrentTurn(CurrentTurn.USER);
      return;
    }

    for (const move of aiTurnResponse) {
      setBoard(move.board);
      setShips(move.ships);
      setAiMessage(move.message);
      await delay(AI_MOVE_DELAY_MS);
    }

    if (winner) {
      setPhase(AiGamePhase.FINISHED);
      setWinner(winner);
      return;
    }

    const lastMove = aiTurnResponse[aiTurnResponse.length - 1];

    if (!lastMove || lastMove.result !== 'miss') {
      throw new Error('Last move is not a miss');
    }

    setCurrentTurn(CurrentTurn.USER);
  } catch (e) {
    console.error(e);
    setCurrentTurn(CurrentTurn.USER);
  }
}
