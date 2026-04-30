import { BoardSetting } from '@/features';
import { createRandomFleetLayout, useGameStore } from '@/shared';
import { Paper, Box, Typography, Button, Stack, alpha } from '@mui/material';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';

export function ShipPlacement() {
  const setBoard = useGameStore(state => state.setBoard);
  const setShips = useGameStore(state => state.setShips);

  const handleRandomize = () => {
    const { board, ships } = createRandomFleetLayout();
    setBoard(board);
    setShips(ships);
  };
  return (
    <Paper
      elevation={0}
      sx={{
        position: { md: 'sticky' },
        top: { md: 24 },
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: theme =>
          `0 4px 24px ${alpha(theme.palette.common.black, 0.06)}, 0 0 0 1px ${alpha(theme.palette.divider, 0.5)} inset`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <TouchAppOutlinedIcon
          color="primary"
          sx={{ mt: 0.25, opacity: 0.9 }}
        />
        <Box>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 1.2, color: 'text.secondary', lineHeight: 1.2, display: 'block' }}
          >
            Setup
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, mt: 0.25 }}
          >
            Fleet placement
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75, lineHeight: 1.65 }}
          >
            Drag a ship onto the grid. If there is no room in the current orientation, it will try the other one
            automatically.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          pt: 0.5,
        }}
      >
        <BoardSetting />
        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{ minWidth: 100, maxWidth: 100 }}
            onClick={handleRandomize}
          >
            Randomize
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ minWidth: 100, maxWidth: 100 }}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
