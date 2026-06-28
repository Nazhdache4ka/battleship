import { Board } from '@/entities';
import { Box } from '@mui/material';

export function MultiplayerBoard() {
  return (
    <Box>
      <Board
        board={[]}
        ships={[]}
        variant="player"
      />
    </Box>
  );
}
