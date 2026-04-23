import { BOARD_CELL_PX, DND_SHIP_TYPE, type IShip } from '@/shared';
import { Box } from '@mui/material';
import { useDraggable } from '@dnd-kit/react';
import shipUrl from '../../../../assets/kenney_pirate-pack/PNG/Default size/Ships/ship4.png';

interface ShipProps {
  ship: IShip;
  horizontal?: boolean;
}

export function Ship({ ship, horizontal = true }: ShipProps) {
  const { ref, handleRef } = useDraggable({
    id: ship.id,
    type: DND_SHIP_TYPE,
    data: {
      type: 'ship',
      ship,
    },
  });

  return (
    <Box
      ref={ref}
      sx={{
        width: horizontal ? ship.size * BOARD_CELL_PX : BOARD_CELL_PX,
        height: horizontal ? BOARD_CELL_PX : ship.size * BOARD_CELL_PX,
      }}
    >
      <Box
        ref={handleRef}
        sx={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${shipUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          transform: horizontal ? 'rotate(-90deg)' : undefined,
          transformOrigin: 'center center',
        }}
      />
    </Box>
  );
}
