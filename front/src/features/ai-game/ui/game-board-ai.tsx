import { Board } from '@/entities';
import { AiGamePhase, useGameStore } from '@/shared';
import { useAiGameStore } from '../store';
import { useAiGameButtonHandlers, useAiGameEffects, useAiGameHandler } from '../hooks';
import { Box, Button, Typography } from '@mui/material';
import versusIcon from './assets/versus.png';

export function GameBoardAi() {
  const { board, ships } = useGameStore();
  const { aiBoard, aiShips, phase } = useAiGameStore();

  const handleUserClick = useAiGameHandler();

  const { handleStartGame, handleResignGame } = useAiGameButtonHandlers();

  useAiGameEffects();

  return (
    <Box
      sx={{
        mt: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 4 },
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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleStartGame}
          disabled={phase === AiGamePhase.ONGOING}
        >
          <Typography variant="body2">Start Game</Typography>
        </Button>
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
        <Button
          variant="contained"
          size="large"
          onClick={handleResignGame}
          disabled={phase !== AiGamePhase.ONGOING}
        >
          <Typography variant="body2">Resign</Typography>
        </Button>
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
