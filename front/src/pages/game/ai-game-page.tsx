import { GameBoardAi, GameStateAi, AiLottie, UserLottie, PaperLottie, AiMessageBubble } from '@/features';
import { useAuthStore } from '@/shared';
import { Container, Box } from '@mui/material';

export function AiGamePage() {
  const username = useAuthStore(state => state.user?.name);

  return (
    <Container
      maxWidth="xl"
      sx={{ mt: { xs: 6, md: 12 } }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-evenly',
            alignItems: 'center',
            gap: { xs: 2, md: 4 },
          }}
        >
          <PaperLottie text={username ?? 'User'}>
            <UserLottie />
          </PaperLottie>

          <GameStateAi />

          <Box sx={{ position: 'relative' }}>
            <AiMessageBubble />
            <PaperLottie text="AI Opponent">
              <AiLottie />
            </PaperLottie>
          </Box>
        </Box>
      </Box>

      <GameBoardAi />
    </Container>
  );
}
