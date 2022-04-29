import confetti from 'canvas-confetti';

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// 胜利礼花
export const winRitual = () => {
  confetti({
    angle: randomInRange(40, 60),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { x: 0 },
  });
  confetti({
    angle: randomInRange(120, 140),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { x: 1 },
  });
};

let duration = 6 * 1000;
let animationEnd = Date.now() + duration;
let skew = 1;

export const generateConfig = () => {
  duration = 6 * 1000;
  animationEnd = Date.now() + duration;
  skew = 1;
};

// 失败的雪花
export const loseSnow = function () {
  let timeLeft = animationEnd - Date.now();
  let ticks = Math.max(200, 500 * (timeLeft / duration));
  skew = Math.max(0.8, skew - 0.001);

  confetti({
    particleCount: 1,
    startVelocity: 0,
    ticks: ticks,
    origin: {
      x: Math.random(),
      // since particles fall down, skew start toward the top
      y: Math.random() * skew - 0.2,
    },
    colors: ['#f1c40f', '#e67e22', '#e74c3c'],
    shapes: ['circle'],
    gravity: randomInRange(0.4, 0.6),
    scalar: randomInRange(0.4, 1),
    drift: randomInRange(-0.4, 0.4),
  });
  if (timeLeft > 0) {
    requestAnimationFrame(loseSnow);
  }
};
