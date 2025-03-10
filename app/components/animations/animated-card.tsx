'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'border' | 'none';
  delay?: number;
  index?: number;
}

export default function AnimatedCard({
  children,
  className = '',
  onClick,
  href,
  hoverEffect = 'lift',
  delay = 0,
  index = 0,
}: AnimatedCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Define card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay + index * 0.1,
        ease: 'easeOut',
      },
    },
  };

  // Define hover animations based on effect type
  const getHoverAnimation = () => {
    if (prefersReducedMotion) return {};

    switch (hoverEffect) {
      case 'lift':
        return {
          whileHover: { y: -8, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' },
          transition: { duration: 0.2 },
        };
      case 'scale':
        return {
          whileHover: { scale: 1.03 },
          transition: { duration: 0.2 },
        };
      case 'glow':
        return {
          whileHover: { boxShadow: '0 0 15px 5px rgba(59, 130, 246, 0.3)' },
          transition: { duration: 0.2 },
        };
      case 'border':
        return {
          whileHover: { borderColor: 'rgba(59, 130, 246, 1)' },
          transition: { duration: 0.2 },
        };
      case 'none':
      default:
        return {};
    }
  };

  // Combine all animations
  const animations = {
    ...cardVariants,
    ...getHoverAnimation(),
  };

  // Render the card
  const CardComponent = (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-card transition-all',
        className
      )}
      initial="hidden"
      animate="visible"
      variants={animations}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  // If href is provided, wrap with an anchor tag
  if (href) {
    return (
      <a href={href} className="block">
        {CardComponent}
      </a>
    );
  }

  return CardComponent;
} 