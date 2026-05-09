import { useGameStore } from '@/shared';
import { useAiGameStore } from '../store';
import { OpenAiSessionService } from '../api';
import { createAiRequest } from './create-ai-request';
import { applyAiShot } from './apply-ai-shot';
import { CurrentTurn } from './model';

let isProcessingAiTurns = false;

export async function sendUsersTurns() {
  const { sessionId, aiShotsHistory, setAiShotsHistory, setCurrentTurn, setAiMessage } = useAiGameStore.getState();
  const { board, ships, setBoard, setShips } = useGameStore.getState();

  if (sessionId === null || isProcessingAiTurns) return;
  isProcessingAiTurns = true;

  const request = createAiRequest(board, aiShotsHistory);

  try {
    const response = await OpenAiSessionService.sendUserTurn(sessionId, request);

    if (!response) {
      setCurrentTurn(CurrentTurn.USER);
      return;
    }

    const { target, message } = response;
    const { newBoard, newShips, result } = applyAiShot(board, ships, target);

    setBoard(newBoard);
    setShips(newShips);
    setAiShotsHistory([...aiShotsHistory, { x: target.x, y: target.y, result }]);
    setAiMessage(message);

    if (result !== 'hit' && result !== 'sunk') {
      setCurrentTurn(CurrentTurn.USER);
      return;
    }

    isProcessingAiTurns = false;
    await sendUsersTurns();
  } catch {
    setCurrentTurn(CurrentTurn.USER);
  } finally {
    isProcessingAiTurns = false;
  }
}
