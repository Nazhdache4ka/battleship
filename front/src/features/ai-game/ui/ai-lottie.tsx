import { useLottie } from 'lottie-react';
import animationData from './assets/robot.json';

interface AiLottieProps {
  width?: number;
  height?: number;
}

export function AiLottie({ width = 110, height = 110 }: AiLottieProps) {
  const options = {
    animationData,
    loop: true,
    autoplay: true,
  };

  const style = {
    width,
    height,
  };

  const { View } = useLottie(options, style);

  return View;
}
