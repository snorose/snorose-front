import confetti from 'canvas-confetti';

export const fireConfetti = (options = {}) => {
  try {
    const {
      count = 200,
      origin = { y: 0.7 },
      colors = [
        '#FFD700', // 금색
        '#FF6B6B', // 빨간색
        '#4ECDC4', // 청록색
        '#45B7D1', // 파란색
        '#96CEB4', // 연두색
        '#FFEAA7', // 노란색
      ],
    } = options;

    const defaults = {
      origin,
      colors,
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // 여러 단계의 폭죽 효과로 화려한 연출
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch (error) {
    console.warn('폭죽 효과 실행 중 오류:', error);
  }
};
