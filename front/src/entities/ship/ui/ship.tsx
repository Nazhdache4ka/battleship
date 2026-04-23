import { BOARD_CELL_PX, DND_SHIP_TYPE, type IShip } from '@/shared';
import { isHorizontalShip } from '../lib';
import { Box } from '@mui/material';
import { useDraggable } from '@dnd-kit/react';
import shipUrlVertical from '../../../../assets/kenney_pirate-pack/PNG/Default size/Ships/ship4.png';
import shipUrlHorizontal from '../../../../assets/kenney_pirate-pack/PNG/Default size/Ships/ship4-h.png';

interface ShipProps {
  ship: IShip;
}

export function Ship({ ship }: ShipProps) {
  const { ref, handleRef } = useDraggable({
    id: ship.id,
    type: DND_SHIP_TYPE,
    data: {
      type: 'ship',
      ship,
    },
  });

  const isHorizontal = isHorizontalShip(ship);

  const shipUrl = isHorizontal ? shipUrlHorizontal : shipUrlVertical;

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
