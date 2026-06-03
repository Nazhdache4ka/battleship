import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { alpha, Box, Chip, Paper, Typography } from '@mui/material';
import { useAiGameStore } from '../store';
import { CurrentTurn } from '../lib';
import { IdeaLottie } from './idea-lottie';
import { AiGamePhase } from '@/shared';

export function GameStateAi() {
  const { winner, currentTurn, sessionId, phase } = useAiGameStore();

  const isGameReady = sessionId !== null;
  const isAiTurn = currentTurn === CurrentTurn.AI;
  const isGameFinished = winner !== null;

  const turnChipLabel =
    phase === AiGamePhase.INITIAL
      ? 'Start the game'
      : isGameFinished
        ? 'Game Over'
        : isAiTurn
          ? "AI's Turn"
          : 'Your Turn';
  const turnChipColor = isGameFinished ? 'warning' : isAiTurn ? 'secondary' : 'primary';

  return (
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
          {isGameReady ? (
            <Typography
              variant="body2"
              sx={{ opacity: 0.8 }}
            >
              Session #{sessionId}
            </Typography>
          ) : null}
          <Chip
            color={turnChipColor}
            icon={
              isGameFinished ? (
                <EmojiEventsRoundedIcon />
              ) : (
                <IdeaLottie
                  width={28}
                  height={28}
                />
              )
            }
            label={turnChipLabel}
            variant={isGameFinished ? 'filled' : 'outlined'}
          />
        </Box>

        <Chip
          label={
            phase === AiGamePhase.INITIAL
              ? "We're waiting for you🚀"
              : phase === AiGamePhase.FINISHED
                ? "Let's play again🔄"
                : isAiTurn && !isGameFinished
                  ? 'AI is planning...'
                  : 'Ready for next move'
          }
          variant="outlined"
          color={isAiTurn ? 'secondary' : 'primary'}
          sx={{ mb: 1, fontWeight: 600 }}
        />
      </Paper>
    </Box>
  );
}
