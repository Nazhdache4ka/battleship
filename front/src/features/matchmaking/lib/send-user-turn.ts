import { getMultiplayerSocket } from '../api';
import { useMultiplayerSessionStore } from '../store';

export async function sendUserTurn(x: number, y: number) {
  const { gameId } = useMultiplayerSessionStore.getState();

  const socket = getMultiplayerSocket();

  if (gameId === null) return;

  socket.emit('game:move', { gameId, x, y });
}
