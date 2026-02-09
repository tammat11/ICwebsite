import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Bubbles = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate random bubbles (fewer overall to reduce GPU/CPU load)
    const [bubbleCount, setBubbleCount] = useState(10);

    useEffect(() => {
        const updateCount = () => {
            // На мобильных еще меньше пузырей, чтобы убрать лаги
            if (window.innerWidth < 640) {
                setBubbleCount(4);
            } else if (window.innerWidth < 1024) {
                setBubbleCount(7);
            } else {
                setBubbleCount(10);
            }
        };

        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    useEffect(() => {
        const ctx = gsap.context((self) => {
            const bubbles = self.selector?.('.bubble-item');

            if (!bubbles || bubbles.length === 0) return;

            // Одна анимация на пузырь вместо трёх разных — намного легче для браузера
            (bubbles as HTMLElement[]).forEach((bubble) => {
                const startX = gsap.utils.random(0, window.innerWidth);
                const startY = gsap.utils.random(window.innerHeight, window.innerHeight + 150);
                const speed = gsap.utils.random(18, 28);
                const delay = gsap.utils.random(0, 8);
                const scale = gsap.utils.random(0.6, 1.2);

                gsap.set(bubble, {
                    x: startX,
                    y: startY,
                    scale,
                    opacity: 0,
                });

                gsap.to(bubble, {
                    y: -120,
                    opacity: gsap.utils.random(0.25, 0.5),
                    duration: speed,
                    delay,
                    repeat: -1,
                    ease: 'none',
                    onRepeat: () => {
                        gsap.set(bubble, {
                            x: gsap.utils.random(0, window.innerWidth),
                            y: window.innerHeight + 120,
                            opacity: 0,
                        });
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [bubbleCount]);

    const bubbles = Array.from({ length: bubbleCount });

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {bubbles.map((_, i) => (
                <div
                    key={i}
                    className="bubble-item absolute w-10 h-10 rounded-full bg-brand-green/10 backdrop-blur-[1px] border border-white/20 shadow-[0_0_15px_rgba(131,182,67,0.1)] will-change-transform"
                />
            ))}
        </div>
    );
};

export default Bubbles;
