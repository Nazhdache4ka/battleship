import { useEffect } from 'react';
import { Board } from '@/entities';
import { useAuthStore, useGameStore } from '@/shared';
import { useAiGameStore } from '../store';
import { useAiGameHandler } from '../hooks';
import { Box, Typography } from '@mui/material';
import { OpenAiSessionService } from '../api/open-ai-session-service';

export function GameBoardAi() {
  const user = useAuthStore(state => state.user);
  const { board, ships } = useGameStore();
  const { aiBoard, aiShips, sessionId, aiMessage, setSessionId } = useAiGameStore();

  console.log(aiMessage);

  const handleUserClick = useAiGameHandler();

  useEffect(() => {
    if (user && !sessionId) {
      (async () => {
        const sessionId = await OpenAiSessionService.initializeAiGameSession(user.id, board, aiBoard);
        setSessionId(sessionId);
      })();
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, board, aiBoard, sessionId, setSessionId]);

  return (
    <Box
      sx={{
        mt: { xs: 4, md: 10 },
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
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', fontSize: '2rem', fontFamily: 'Creepster', textAlign: 'center' }}
      >
        VS
      </Typography>
      <Board
        board={aiBoard}
        ships={aiShips}
        variant="enemy"
        onClick={handleUserClick}
      />
    </Box>
  );
}
