import { useEffect, useMemo } from 'react';
import { getMultiplayerSocket } from '../api';
import { useMultiplayerStore } from '../store';
import { GameStatus, MultiplayerPhase } from '@/shared';

export function useMultiplayerEvents() {
  const { setGameId, setMultiplayerPhase, setGameStatus, setErrorMessage } = useMultiplayerStore();

  const socket = useMemo(() => {
    return getMultiplayerSocket();
  }, []);

  useEffect(() => {
    socket.on('game:start', data => {
      console.log(data);
      setGameId(data.gameId);
      setMultiplayerPhase(MultiplayerPhase.STARTED);
      setGameStatus(GameStatus.ACTIVE);
    });

    socket.on('game:error', data => {
      setErrorMessage(data.message);
      setMultiplayerPhase(MultiplayerPhase.IDLE);
      setGameStatus(GameStatus.WAITING);
    });

    return () => {
      socket.off('game:start');
      socket.off('game:error');
    };
  }, [socket, setGameId, setMultiplayerPhase, setGameStatus, setErrorMessage]);
}
