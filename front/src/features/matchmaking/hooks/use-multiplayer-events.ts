import { useEffect, useMemo } from 'react';
import { getMultiplayerSocket } from '../api';
import { useMultiplayerGameStore, useMultiplayerSessionStore } from '../store';
import { GameStatus, MultiplayerPhase } from '@/shared';

export function useMultiplayerEvents() {
  const {
    setGameId,
    setMultiplayerPhase,
    setGameStatus,
    setErrorMessage,
    opponentInfo,
    setOpponentInfo,
    setWinnerUserId,
    setPlayerRating,
  } = useMultiplayerSessionStore();
  const { setBoard, setShips, setEnemyBoard, setEnemyShips, setCurrentTurnUserId, setUpdatedPlayerRating } =
    useMultiplayerGameStore();

  const socket = useMemo(() => {
    return getMultiplayerSocket();
  }, []);

  useEffect(() => {
    socket.on('game:move:state', data => {
      setBoard(data.board);
      setShips(data.ships);
      setEnemyBoard(data.enemyBoard);
      setEnemyShips(data.enemyShips);
      setCurrentTurnUserId(data.currentTurnUserId);
      setWinnerUserId(data.winnerUserId);

      if (typeof data.playerRating === 'number') {
        setUpdatedPlayerRating(data.playerRating);
      }

      if (typeof data.opponentRating === 'number' && opponentInfo) {
        setOpponentInfo({
          ...opponentInfo,
          rating: data.opponentRating,
        });
      }

      if (data.winnerUserId) {
        setMultiplayerPhase(MultiplayerPhase.FINISHED);
        setGameStatus(GameStatus.FINISHED);
      }
    });

    return () => {
      socket.off('game:move:state');
    };
  }, [
    socket,
    setBoard,
    setShips,
    setEnemyBoard,
    setEnemyShips,
    setCurrentTurnUserId,
    setWinnerUserId,
    setPlayerRating,
    opponentInfo,
    setOpponentInfo,
    setMultiplayerPhase,
    setGameStatus,
    setUpdatedPlayerRating,
  ]);

  useEffect(() => {
    socket.on('game:state', data => {
      setBoard(data.board);
      setShips(data.ships);
      setEnemyBoard(data.enemyBoard);
      setEnemyShips(data.enemyShips);
      setGameId(data.gameId);
      setMultiplayerPhase(MultiplayerPhase.STARTED);
      setGameStatus(data.status);
      setOpponentInfo(data.opponent);
      setCurrentTurnUserId(data.currentTurnUserId);
      setWinnerUserId(data.winnerUserId ?? null);
      setPlayerRating(data.playerRating);
    });

    socket.on('game:start', data => {
      setBoard(data.board);
      setShips(data.ships);
      setEnemyBoard(data.enemyBoard);
      setEnemyShips(data.enemyShips);
      setGameId(data.gameId);
      setMultiplayerPhase(MultiplayerPhase.STARTED);
      setGameStatus(GameStatus.ACTIVE);
      setOpponentInfo(data.opponent);
      setCurrentTurnUserId(data.currentTurnUserId);
      setWinnerUserId(null);
      setPlayerRating(data.playerRating);
      setUpdatedPlayerRating(null);
    });

    socket.on('game:error', data => {
      setErrorMessage(data.message);
      setMultiplayerPhase(MultiplayerPhase.IDLE);
      setGameStatus(GameStatus.WAITING);
    });

    socket.on('game:resume:not-found', data => {
      setErrorMessage(data.message ?? 'No active game found');
      setMultiplayerPhase(MultiplayerPhase.IDLE);
      setGameStatus(GameStatus.WAITING);
    });

    return () => {
      socket.off('game:state');
      socket.off('game:start');
      socket.off('game:error');
      socket.off('game:resume:not-found');
    };
  }, [
    socket,
    setGameId,
    setMultiplayerPhase,
    setGameStatus,
    setErrorMessage,
    setOpponentInfo,
    setBoard,
    setShips,
    setEnemyBoard,
    setEnemyShips,
    setCurrentTurnUserId,
    setWinnerUserId,
    setPlayerRating,
    setUpdatedPlayerRating,
  ]);
}
