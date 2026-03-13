import { useEffect, useRef, useState, useMemo } from 'react';

const Bubbles = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [bubbleCount, setBubbleCount] = useState(10);

    useEffect(() => {
        const updateCount = () => {
            if (window.innerWidth < 640) setBubbleCount(4);
            else if (window.innerWidth < 1024) setBubbleCount(7);
            else setBubbleCount(10);
        };
        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    const bubbles = useMemo(() => Array.from({ length: bubbleCount }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 18 + Math.random() * 10,
        scale: 0.6 + Math.random() * 0.6,
        opacity: 0.25 + Math.random() * 0.25,
    })), [bubbleCount]);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <style>{`
                @keyframes bubble-float {
                    0% { transform: translateY(100vh) scale(var(--bubble-scale)); opacity: 0; }
                    5% { opacity: var(--bubble-opacity); }
                    95% { opacity: var(--bubble-opacity); }
                    100% { transform: translateY(-120px) scale(var(--bubble-scale)); opacity: 0; }
                }
            `}</style>
            {bubbles.map((b, i) => (
                <div
                    key={i}
                    className="bubble-item absolute w-10 h-10 rounded-full bg-brand-green/10 backdrop-blur-[1px] border border-white/20 shadow-[0_0_15px_rgba(131,182,67,0.1)]"
                    style={{
                        left: `${b.left}%`,
                        animation: `bubble-float ${b.duration}s linear ${b.delay}s infinite`,
                        ['--bubble-scale' as string]: b.scale,
                        ['--bubble-opacity' as string]: b.opacity,
                    }}
                />
            ))}
        </div>
    );
};

export default Bubbles;
