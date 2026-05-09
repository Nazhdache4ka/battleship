import { alpha, Box, Card, CardActionArea, CardContent, Container, Stack, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { LuSwords } from 'react-icons/lu';
import { FaRobot, FaUserSecret } from 'react-icons/fa6';

const GAME_MODES = [
  {
    title: 'Against AI',
    description: 'Try your skills and luck in the battle against AI',
    path: '/single-player',
    icon: <FaRobot size={48} />,
  },
  {
    title: 'Multiplayer',
    description: 'Meet your opponent in a real-time battle for rating points',
    path: '/multiplayer',
    icon: <LuSwords size={48} />,
  },
  {
    title: 'Local two-player',
    description: 'Play with your friend on the same device',
    path: '/local-two-player',
    icon: <FaUserSecret size={48} />,
  },
];

export function GameModesPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ textAlign: 'center', my: { xs: 4, md: 6 } }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontFamily: 'monospace',
            letterSpacing: '-0.02em',
            color: 'primary.main',
          }}
        >
          Game modes
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            mt: 1.5,
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.15rem' },
            color: 'text.secondary',
            maxWidth: 520,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Choose how you want to play — each mode opens on its own rules and pace.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        useFlexGap
        sx={{
          justifyContent: 'center',
          alignItems: 'stretch',
          pb: { xs: 4, md: 8 },
        }}
      >
        {GAME_MODES.map(mode => (
          <Card
            key={mode.path}
            elevation={0}
            sx={{
              flex: { md: '1 1 0' },
              maxWidth: { xs: '100%', md: 360 },
              minHeight: 260,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
              overflow: 'visible',
              transition: theme =>
                theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
                  duration: theme.transitions.duration.shorter,
                }),
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: theme => `0 12px 40px ${alpha(theme.palette.primary.main, 0.18)}`,
                transform: 'translateY(-4px)',
                '& .game-mode-icon-wrap': {
                  transform: 'scale(1.12)',
                  bgcolor: theme => alpha(theme.palette.primary.main, 0.14),
                },
              },
              '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: theme =>
                  `0 0 0 3px ${alpha(theme.palette.primary.main, 0.35)}, 0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                '& .game-mode-icon-wrap': {
                  transform: 'scale(1.12)',
                },
              },
            }}
          >
            <CardActionArea
              component={Link}
              to={mode.path}
              sx={{
                height: '100%',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                py: 3,
                px: 2.5,
              }}
            >
              <CardContent sx={{ width: '100%' }}>
                <Box
                  className="game-mode-icon-wrap"
                  sx={{
                    width: 96,
                    height: 96,
                    mx: 'auto',
                    mb: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    color: 'primary.main',
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                    transition: theme =>
                      theme.transitions.create(['transform', 'background-color'], {
                        duration: theme.transitions.duration.shorter,
                        easing: theme.transitions.easing.easeOut,
                      }),
                    transformOrigin: 'center center',
                  }}
                >
                  {mode.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    mb: 1,
                  }}
                >
                  {mode.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    lineHeight: 1.65,
                    px: 0.5,
                  }}
                >
                  {mode.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
