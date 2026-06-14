import { useCallback } from 'react';
import { Paper, Box, Typography, Button, Stack, Tooltip, alpha } from '@mui/material';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import { BoardSetting } from '@/features';
import { createRandomFleetLayout, useAuthStore, useGameStore, ErrorAlert, getShipsFromBoardPreset } from '@/shared';
import { useFetchShipsPreset, useSaveShipsPreset } from './hooks';

export function ShipPlacement() {
  const { setBoard, setShips, board } = useGameStore();
  const { setUserBoard } = useAuthStore();

  const { isPending, errorMessage, openSnackbar, setOpenSnackbar, saveShipsPreset } = useSaveShipsPreset();

  const { data: shipsPreset, isFetching } = useFetchShipsPreset();

  const handleRandomize = useCallback(() => {
    const { board, ships } = createRandomFleetLayout();
    setBoard(board);
    setShips(ships);
  }, [setBoard, setShips]);

  const handleFetchPreset = useCallback(() => {
    if (shipsPreset && shipsPreset.length > 0) {
      setBoard(shipsPreset);
      setShips(getShipsFromBoardPreset(shipsPreset));
      setUserBoard(shipsPreset);
    }
  }, [shipsPreset, setBoard, setShips, setUserBoard]);

  const handleSave = useCallback(() => {
    if (!board) return;

    setUserBoard(board);
    saveShipsPreset({ boardPreset: board });
  }, [setUserBoard, board, saveShipsPreset]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
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
              automatically. The displayed grid is the one that will be used in the game.
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
            <Tooltip title="Place all ships in a new random valid layout">
              <Button
                variant="outlined"
                size="small"
                sx={{ minWidth: 100, maxWidth: 100 }}
                onClick={handleRandomize}
              >
                Randomize
              </Button>
            </Tooltip>
            <Tooltip title="Load your saved board preset from the server. Replaces the current grid">
              <Button
                variant="outlined"
                size="small"
                sx={{ minWidth: 100, maxWidth: 100 }}
                disabled={isFetching}
                onClick={handleFetchPreset}
              >
                Fetch preset
              </Button>
            </Tooltip>
            <Tooltip title="Save the current layout as your preset on the server">
              <Button
                variant="contained"
                size="small"
                sx={{ minWidth: 100, maxWidth: 100 }}
                disabled={isPending}
                onClick={handleSave}
              >
                Save
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Paper>
      <ErrorAlert
        open={openSnackbar}
        message={errorMessage ?? ''}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}
