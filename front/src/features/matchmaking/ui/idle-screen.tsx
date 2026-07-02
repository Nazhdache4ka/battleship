import { useMemo } from 'react';
import { Box, Button, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useMultiplayerSessionStore } from '../store';
import { MultiplayerPhase, ErrorAlert } from '@/shared';

interface IdleScreenProps {
  onJoinQueue: () => void;
  onLeaveQueue: () => void;
  onReconnect: () => void;
}

export function IdleScreen({ onJoinQueue, onLeaveQueue, onReconnect }: IdleScreenProps) {
  const multiplayerPhase = useMultiplayerSessionStore(state => state.multiplayerPhase);
  const errorMessage = useMultiplayerSessionStore(state => state.errorMessage);
  const setErrorMessage = useMultiplayerSessionStore(state => state.setErrorMessage);

  const button = useMemo(() => {
    if (multiplayerPhase === MultiplayerPhase.IDLE) {
      return (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={onJoinQueue}
          >
            Start Game
          </Button>
          <Tooltip title="Reconnect to the game, please don't use for no reason">
            <Button
              variant="contained"
              color="secondary"
              onClick={onReconnect}
            >
              Reconnect
            </Button>
          </Tooltip>
        </>
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
  }, [multiplayerPhase, onJoinQueue, onLeaveQueue, onReconnect]);

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
