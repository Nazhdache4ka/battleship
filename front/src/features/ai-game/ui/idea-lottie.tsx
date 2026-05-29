import { useLottie } from 'lottie-react';
import animationData from './assets/idea.json';

interface IdeaLottieProps {
  width?: number;
  height?: number;
}

export function IdeaLottie({ width = 70, height = 70 }: IdeaLottieProps) {
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
