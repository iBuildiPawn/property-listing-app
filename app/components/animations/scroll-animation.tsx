'use client';

import { ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  effect?: 'fade' | 'parallax' | 'scale' | 'rotate';
  intensity?: number; // 0-1 for effect intensity
}

export default function ScrollAnimation({
  children,
  className = '',
  effect = 'fade',
  intensity = 0.3,
}: ScrollAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Apply different effects based on scroll position
  switch (effect) {
    case 'fade':
      return <FadeOnScroll intensity={intensity} className={className}>{children}</FadeOnScroll>;
    case 'parallax':
      return <ParallaxOnScroll intensity={intensity} className={className}>{children}</ParallaxOnScroll>;
    case 'scale':
      return <ScaleOnScroll intensity={intensity} className={className}>{children}</ScaleOnScroll>;
    case 'rotate':
      return <RotateOnScroll intensity={intensity} className={className}>{children}</RotateOnScroll>;
    default:
      return <div className={className}>{children}</div>;
  }
}

// Fade effect component
function FadeOnScroll({ children, intensity, className }: { children: ReactNode; intensity: number; className: string }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <motion.div style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}

// Parallax effect component
function ParallaxOnScroll({ children, intensity, className }: { children: ReactNode; intensity: number; className: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [100 * intensity, 0]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Scale effect component
function ScaleOnScroll({ children, intensity, className }: { children: ReactNode; intensity: number; className: string }) {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8 + (0.2 * (1 - intensity)), 1]);

  return (
    <motion.div style={{ scale }} className={className}>
      {children}
    </motion.div>
  );
}

// Rotate effect component
function RotateOnScroll({ children, intensity, className }: { children: ReactNode; intensity: number; className: string }) {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [10 * intensity, 0]);

  return (
    <motion.div style={{ rotate }} className={className}>
      {children}
    </motion.div>
  );
} 