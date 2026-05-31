import { useEffect } from 'react';
import { Board } from '@/entities';
import { useAuthStore, useGameStore } from '@/shared';
import { useAiGameStore } from '../store';
import { useAiGameHandler } from '../hooks';
import { Box } from '@mui/material';
import { OpenAiSessionService } from '../api/open-ai-session-service';
import versusIcon from './assets/versus.png';

export function GameBoardAi() {
  const user = useAuthStore(state => state.user);
  const { board, ships } = useGameStore();
  const { aiBoard, aiShips, sessionId, setSessionId, setAiBoard } = useAiGameStore();

  const handleUserClick = useAiGameHandler();

  useEffect(() => {
    if (!user || sessionId) return;

    (async () => {
      const { sessionId, aiBoardEnemy } = await OpenAiSessionService.initializeAiGameSession(user.id, board);
      setSessionId(sessionId);
      setAiBoard(aiBoardEnemy);
    })();
  }, [user, board, sessionId, setSessionId, setAiBoard]);

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
      OpenAiSessionService.deleteAiGameSession(sessionId);
      setSessionId(null);
    };
  }, [sessionId, setSessionId]);

  return (
    <Box
      sx={{
        mt: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
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
        board={aiBoard}
        ships={aiShips}
        variant="enemy"
        onClick={handleUserClick}
      />
    </Box>
  );
}
