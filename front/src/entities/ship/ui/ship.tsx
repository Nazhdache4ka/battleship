import { BOARD_CELL_PX, DND_SHIP_TYPE, isHorizontalShip, type IShip } from '@/shared';
import { getShipImage } from '../lib';
import { Box } from '@mui/material';
import { useDraggable } from '@dnd-kit/react';

interface ShipProps {
  ship: IShip;
  variant: 'player' | 'enemy' | 'setting';
}

export function Ship({ ship, variant }: ShipProps) {
  const { ref, handleRef } = useDraggable({
    id: ship.id,
    type: DND_SHIP_TYPE,
    data: {
      type: 'ship',
      ship,
    },
    disabled: variant !== 'setting',
  });

  const isHorizontal = isHorizontalShip(ship);

  const shipUrl = getShipImage(ship, isHorizontal);

  const width = isHorizontal ? ship.size * BOARD_CELL_PX : BOARD_CELL_PX;
  const height = isHorizontal ? BOARD_CELL_PX : ship.size * BOARD_CELL_PX;

  return (
    <Box ref={ref}>
      <Box
        ref={handleRef}
        sx={{
          width,
          height,
          backgroundImage: `url(${shipUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      />
    </Box>
  );
}
