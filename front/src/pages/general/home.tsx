import type { ReactNode } from 'react';
import {
  alpha,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import AnchorOutlinedIcon from '@mui/icons-material/AnchorOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsports';
import { ShipPlacement } from '@/widgets';

export function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100%',
        py: { xs: 3, sm: 5, md: 6 },
        background: theme =>
          `linear-gradient(165deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 42%),
             linear-gradient(180deg, ${alpha(theme.palette.divider, 0.06)} 0%, transparent 28%)`,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 5, lg: 7 },
            alignItems: 'start',
          }}
        >
          <Stack spacing={{ xs: 3, sm: 4 }}>
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                  fontFamily: 'monospace',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  color: 'primary.main',
                }}
              >
                Battleship
              </Typography>
              <Typography
                variant="h6"
                component="p"
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  fontWeight: 500,
                  maxWidth: 520,
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                }}
              >
                Two fleets, one sea. Find the enemy ships before they find yours.
              </Typography>
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 540, lineHeight: 1.75 }}
            >
              A game of logic and focus: place your ships on your grid, then take turns calling shots on the enemy map.
              Here you can randomize your layout or arrange it yourself; game modes for two on one device, vs AI, or
              online are on the way.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <List
                disablePadding
                sx={{ '& .MuiListItem-root': { alignItems: 'flex-start', py: 1.25 } }}
              >
                {HIGHLIGHTS.map(item => (
                  <ListItem
                    key={item.primary}
                    disableGutters
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        mt: 0.25,
                        color: 'primary.main',
                        '& svg': { fontSize: 22 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {item.primary}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6, display: 'block', mt: 0.25 }}
                        >
                          {item.secondary}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
            >
              <Button
                variant="outlined"
                size="large"
                sx={{ minWidth: { sm: 200 }, py: 1.25, fontWeight: 600 }}
              >
                vs AI
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ minWidth: { sm: 200 }, py: 1.25, fontWeight: 600 }}
              >
                Local two-player
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ minWidth: { sm: 200 }, py: 1.25, fontWeight: 600 }}
              >
                Online play
              </Button>
            </Stack>
          </Stack>

          <ShipPlacement />
        </Box>
      </Container>
    </Box>
  );
}

const HIGHLIGHTS: { icon: ReactNode; primary: string; secondary: string }[] = [
  {
    icon: <GridOnOutlinedIcon fontSize="small" />,
    primary: '10×10 grid',
    secondary: 'Classic layout: deploy your fleet and keep your map hidden from the opponent.',
  },
  {
    icon: <AnchorOutlinedIcon fontSize="small" />,
    primary: 'Ten ships',
    secondary:
      'One battleship, two cruisers, three destroyers, and four patrol boats — no touching sides and one cell gap between ships.',
  },
  {
    icon: <SportsEsportsOutlinedIcon fontSize="small" />,
    primary: 'Turn-by-turn salvos',
    secondary: 'A hit lets you shoot again; a miss passes the turn. Sink every enemy ship to win.',
  },
];
