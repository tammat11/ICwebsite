import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Bubbles = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context((self) => {
            const bubbles = self.selector?.('.bubble-item');

            if (bubbles) {
                bubbles.forEach((bubble: any) => {
                    // Randomize start
                    const startX = gsap.utils.random(0, window.innerWidth);
                    const startY = gsap.utils.random(window.innerHeight, window.innerHeight + 200);
                    const speed = gsap.utils.random(15, 30);
                    const delay = gsap.utils.random(0, 10);
                    const scale = gsap.utils.random(0.5, 1.5);

                    gsap.set(bubble, {
                        x: startX,
                        y: startY,
                        scale: scale,
                        opacity: 0
                    });

                    // Upward motion
                    gsap.to(bubble, {
                        y: -100,
                        duration: speed,
                        delay: delay,
                        repeat: -1,
                        ease: "none",
                        onRepeat: () => {
                            gsap.set(bubble, {
                                x: gsap.utils.random(0, window.innerWidth),
                                y: window.innerHeight + 100,
                                opacity: 0
                            });
                        }
                    });

                    // Fade in/out
                    gsap.to(bubble, {
                        opacity: gsap.utils.random(0.3, 0.6),
                        duration: 2,
                        delay: delay,
                        scale: scale * 1.2,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut"
                    });

                    // Horizontal drift
                    gsap.to(bubble, {
                        x: `+=${gsap.utils.random(-100, 100)}`,
                        duration: gsap.utils.random(3, 8),
                        delay: delay,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Generate random bubbles (fewer on mobile)
    const [bubbleCount, setBubbleCount] = useState(15);

    useEffect(() => {
        const updateCount = () => {
            setBubbleCount(window.innerWidth < 768 ? 6 : 15);
        };
        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    const bubbles = Array.from({ length: bubbleCount });

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {bubbles.map((_, i) => (
                <div
                    key={i}
                    className="bubble-item absolute w-12 h-12 rounded-full bg-brand-green/10 backdrop-blur-[1px] border border-white/20 shadow-[0_0_15px_rgba(131,182,67,0.1)]"
                />
            ))}
        </div>
    );
};

export default Bubbles;
