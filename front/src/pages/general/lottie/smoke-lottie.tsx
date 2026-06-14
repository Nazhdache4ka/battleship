import { useLottie } from 'lottie-react';
import animationData from './Smoke.json';
import { Box } from '@mui/material';
import { useEffect } from 'react';

export function SmokeLottie() {
  const { View, setSpeed } = useLottie({
    animationData,
    loop: true,
    autoplay: true,
  });

  useEffect(() => {
    setSpeed(0.4);
  }, [setSpeed]);

  return <Box sx={{ width: 100, height: 100 }}>{View}</Box>;
}
