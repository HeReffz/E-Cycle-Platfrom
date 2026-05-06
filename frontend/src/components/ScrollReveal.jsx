import React, { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal — attaches IntersectionObserver to a ref
 * Returns [ref, isVisible]
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // trigger once
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/**
 * ScrollReveal — wrapper component for scroll-triggered animations
 * Props:
 *   animation: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale"
 *   delay: ms delay (default 0)
 *   duration: ms (default 600)
 */
export function ScrollReveal({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 600,
  className = "",
  style = {},
}) {
  const [ref, isVisible] = useScrollReveal();

  const baseHidden = {
    fadeIn: { opacity: 0 },
    slideUp: { opacity: 0, transform: "translateY(32px)" },
    slideLeft: { opacity: 0, transform: "translateX(-32px)" },
    slideRight: { opacity: 0, transform: "translateX(32px)" },
    scale: { opacity: 0, transform: "scale(0.93)" },
  };

  const baseVisible = {
    opacity: 1,
    transform: "none",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...(isVisible ? baseVisible : (baseHidden[animation] || baseHidden.slideUp)),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
