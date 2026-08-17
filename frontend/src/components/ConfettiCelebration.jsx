import confetti from 'canvas-confetti';

export const triggerConfetti = (originY = 0.6) => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: originY },
    colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
  });
};

export const triggerBigCelebration = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

export default triggerConfetti;
