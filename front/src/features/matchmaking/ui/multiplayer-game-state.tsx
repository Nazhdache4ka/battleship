import { useMemo } from 'react';
import { Box, Chip, Paper, Typography, alpha } from '@mui/material';
import { FaRegCircleStop } from 'react-icons/fa6';
import { LuSwords } from 'react-icons/lu';
import { useAuthStore, PaperLottie, UserLottie } from '@/shared';
import { useMultiplayerGameStore, useMultiplayerSessionStore } from '../store';

export function MultiplayerGameState() {
  const currentTurnUserId = useMultiplayerGameStore(state => state.currentTurnUserId);
  const updatedPlayerRating = useMultiplayerGameStore(state => state.updatedPlayerRating);
  const gameId = useMultiplayerSessionStore(state => state.gameId);
  const winnerUserId = useMultiplayerSessionStore(state => state.winnerUserId);
  const user = useAuthStore(state => state.user);
  const opponentInfo = useMultiplayerSessionStore(state => state.opponentInfo);
  const playerRating = useMultiplayerSessionStore(state => state.playerRating);

  const isUserTurn = useMemo(() => currentTurnUserId === user?.id, [currentTurnUserId, user]);
  const isGameFinished = useMemo(() => winnerUserId !== null, [winnerUserId]);

  const winner = useMemo(() => {
    if (winnerUserId === null) return null;
    if (winnerUserId === user?.id) return user?.name ?? 'You';
    return opponentInfo?.name ?? 'Opponent';
  }, [winnerUserId, user, opponentInfo]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 2, md: 40 },
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        mb: 4,
      }}
    >
      <PaperLottie
        text={user?.name}
        rating={playerRating}
        updatedRating={updatedPlayerRating}
      >
        <UserLottie />
      </PaperLottie>
      <Box
        sx={{
          display: 'flex',
          maxWidth: 200,
          minHeight: 160,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            maxWidth: { xs: '160px', md: 200 },
            flexDirection: 'column',
            justifyContent: 'center',
            px: 2,
            py: 1,
            borderRadius: 3,
            border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
            background: theme =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.12)})`,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 1.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ opacity: 0.8 }}
            >
              Session #{gameId}
            </Typography>
            <Chip
              color="primary"
              icon={isGameFinished ? <FaRegCircleStop /> : <LuSwords />}
              label={isGameFinished ? 'Game Over' : 'Clash'}
              variant="outlined"
            />
          </Box>

          {!isGameFinished && (
            <Chip
              label={isUserTurn ? 'Your Turn' : "Opponent's Turn"}
              variant="outlined"
              color={isUserTurn ? 'secondary' : 'primary'}
              sx={{ mb: 1, fontWeight: 600 }}
            />
          )}
          {winner && (
            <Chip
              label={`Winner: ${winner}`}
              variant="outlined"
              color="warning"
              sx={{ mb: 1, fontWeight: 600 }}
            />
          )}
        </Paper>
      </Box>
      <PaperLottie
        text={opponentInfo?.name}
        rating={opponentInfo?.rating}
      >
        <UserLottie />
      </PaperLottie>
    </Box>
  );
}
