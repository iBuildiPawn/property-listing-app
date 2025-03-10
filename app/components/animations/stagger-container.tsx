'use client';

import { ReactNode } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface StaggerContainerProps extends MotionProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delay = 0,
  className = '',
  once = true,
  threshold = 0.1,
  ...props
}: StaggerContainerProps) {
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();

  // Define container variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
} 