import { Board } from '@/entities';
import { Box } from '@mui/material';
import { useMultiplayerGameStore, useMultiplayerSessionStore } from '../store';
import versusIcon from './assets/versus.png';
import { MultiplayerGameState } from './multiplayer-game-state';
import { useMultiplayerGameHandler } from '../hooks';
import { useEffect } from 'react';

export function MultiplayerBoard() {
  const board = useMultiplayerGameStore(state => state.board);
  const ships = useMultiplayerGameStore(state => state.ships);
  const enemyBoard = useMultiplayerGameStore(state => state.enemyBoard);
  const enemyShips = useMultiplayerGameStore(state => state.enemyShips);
  const sessionId = useMultiplayerSessionStore(state => state.gameId);

  const handleUserClick = useMultiplayerGameHandler();

  useEffect(() => {
    if (!sessionId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  return (
    <>
      <MultiplayerGameState />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 8 },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Board
          board={board}
          ships={ships}
          variant="player"
        />
        <Box
          sx={{
            maxWidth: 100,
            maxHeight: 100,
          }}
        >
          <img
            src={versusIcon}
            alt="Versus"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
        <Board
          board={enemyBoard}
          ships={enemyShips}
          variant="enemy"
          onClick={handleUserClick}
        />
      </Box>
    </>
  );
}
