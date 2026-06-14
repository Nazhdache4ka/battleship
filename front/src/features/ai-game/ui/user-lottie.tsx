import { useLottie } from 'lottie-react';
import animationData from './assets/user.json';

interface UserLottieProps {
  width?: number;
  height?: number;
}

export function UserLottie({ width = 110, height = 110 }: UserLottieProps) {
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
