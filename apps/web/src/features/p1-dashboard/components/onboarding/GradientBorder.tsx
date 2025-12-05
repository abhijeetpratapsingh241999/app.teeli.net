"use client";

/**
 * Gradient Border Component
 * Reusable frosted glass border effect for cards
 */

export function GradientBorder() {
  return (
    <div 
      className="absolute inset-0 rounded-xl pointer-events-none"
      style={{
        padding: "1.5px",
        background: "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0.15) 100%)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude"
      }}
    />
  );
}
