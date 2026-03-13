import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, inView]. When the element enters viewport, inView becomes true and stays true (once).
 */
export function useInView(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.08, rootMargin = '0px 0px -40px 0px' } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold, rootMargin, triggerOnce: true }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView] as const;
}
