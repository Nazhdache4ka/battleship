export function getScaleAnimation(duration: number = 700) {
  return {
    animation: `scaleFadeIn ${duration}ms ease-out`,
    '@keyframes scaleFadeIn': {
      '0%': { opacity: 0, transform: 'scale(0.9)' },
      '50%': { opacity: 0.5, transform: 'scale(1.1)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  };
}
