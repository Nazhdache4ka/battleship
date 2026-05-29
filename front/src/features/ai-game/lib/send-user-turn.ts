import { AiGamePhase, type Coordinates } from '@/shared';
import { OpenAiSessionService } from '../api';
import { useAiGameStore } from '../store';
import { CurrentTurn } from './model';

let isProcessing = false;

export async function sendUserTurn(target: Coordinates): Promise<'hit' | 'miss' | 'sunk' | null> {
  const { sessionId, setAiBoard, setAiShips, setCurrentTurn, setPhase, setWinner } = useAiGameStore.getState();

  if (sessionId === null) return null;

  if (isProcessing) return null;

  isProcessing = true;

  try {
    const { newBoard, newShips, result, winner } = await OpenAiSessionService.applyUserTurn(sessionId, target);

    if (!newBoard || !newShips || !result) {
      setCurrentTurn(CurrentTurn.USER);
      return null;
    }

    if (result === 'miss') {
      setCurrentTurn(CurrentTurn.AI);
    }

    if (winner) {
      setWinner(winner);
      setPhase(AiGamePhase.FINISHED);
    }

    setAiBoard(newBoard);
    setAiShips(newShips);

    return result;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    isProcessing = false;
  }
}
