import type { Transition } from "framer-motion";

// ============================================================================
// SPRING TRANSITIONS
// ============================================================================

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export const bouncySpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

// ============================================================================
// EASE TRANSITIONS
// ============================================================================

export const smoothEase: Transition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const quickEase: Transition = {
  duration: 0.2,
  ease: "easeOut",
};

export const slowEase: Transition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.23, 0.96],
};

// ============================================================================
// STAGGER DELAYS
// ============================================================================

export const getStaggerDelay = (index: number, baseDelay = 0.1): Transition => ({
  delay: index * baseDelay,
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
});

// ============================================================================
// CARD DELAYS
// ============================================================================

export const CARD_DELAYS = {
  scan: 0.4,
  heal: 0.5,
  render: 0.6,
  co2: 0.7,
  cost: 0.8,
} as const;
