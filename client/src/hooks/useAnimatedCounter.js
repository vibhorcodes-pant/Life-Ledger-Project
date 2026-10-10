import { useState, useEffect } from 'react';

export function useAnimatedCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime = null;
    let animationFrame;
    const startValue = 0;

    const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easedProgress = easeOutQuart(progress);
      const currentCount = Math.floor(easedProgress * (end - startValue) + startValue);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}
