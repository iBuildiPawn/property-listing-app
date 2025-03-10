'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  className?: string;
}

export default function PageTransition({
  children,
  mode = 'wait',
  className = '',
}: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Define page transition variants
  const pageVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: 'easeInOut' 
      }
    },
    exit: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : -20,
      transition: { 
        duration: 0.3, 
        ease: 'easeInOut' 
      }
    },
  };

  return (
    <AnimatePresence mode={mode} initial={false}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 