'use client';

import { ReactNode } from 'react';
import { motion, MotionProps, Variant, Variants } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

// Define common animation variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideInVariants = (direction: 'left' | 'right' | 'up' | 'down' = 'up'): Variants => {
  const directions = {
    left: { x: -50 },
    right: { x: 50 },
    up: { y: 50 },
    down: { y: -50 },
  };

  return {
    hidden: { opacity: 0, ...directions[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface MotionWrapperProps extends MotionProps {
  children: ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'pop' | 'none';
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export default function MotionWrapper({
  children,
  variant = 'fade',
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
  threshold = 0.1,
  ...props
}: MotionWrapperProps) {
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();

  // Select the appropriate animation variant
  const getVariants = (): Variants => {
    if (prefersReducedMotion) return fadeInVariants;

    switch (variant) {
      case 'fade':
        return fadeInVariants;
      case 'slide':
        return slideInVariants(direction);
      case 'scale':
        return scaleVariants;
      case 'pop':
        return popVariants;
      case 'none':
        return { visible: {}, hidden: {} };
      default:
        return fadeInVariants;
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
      variants={getVariants()}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
} 