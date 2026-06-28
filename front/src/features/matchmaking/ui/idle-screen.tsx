import { useMemo } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useMultiplayerStore } from '../store';
import { MultiplayerPhase, ErrorAlert } from '@/shared';

interface IdleScreenProps {
  onJoinQueue: () => void;
  onLeaveQueue: () => void;
}

export function IdleScreen({ onJoinQueue, onLeaveQueue }: IdleScreenProps) {
  const multiplayerPhase = useMultiplayerStore(state => state.multiplayerPhase);
  const errorMessage = useMultiplayerStore(state => state.errorMessage);
  const setErrorMessage = useMultiplayerStore(state => state.setErrorMessage);

  const button = useMemo(() => {
    if (multiplayerPhase === MultiplayerPhase.IDLE) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={onJoinQueue}
        >
          Start Game
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        color="primary"
        onClick={onLeaveQueue}
      >
        Stop Searching
      </Button>
    );
  }, [multiplayerPhase, onJoinQueue, onLeaveQueue]);

  const handleCloseErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{ textAlign: 'center' }}
        >
          Try your luck against another player!
        </Typography>
        {button}
        {multiplayerPhase === MultiplayerPhase.SEARCHING && <CircularProgress />}
      </Box>
      <ErrorAlert
        open={!!errorMessage}
        message={errorMessage ?? 'Unknown error'}
        onClose={handleCloseErrorMessage}
      />
    </>
  );
}
