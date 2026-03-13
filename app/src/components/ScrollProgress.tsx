import { useEffect, useRef, useState } from 'react';

export default function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(0);

    useEffect(() => {
        const update = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h <= 0) {
                setScale(1);
                return;
            }
            const p = Math.min(1, window.scrollY / h);
            setScale(p);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <div className="fixed top-0 right-0 w-1.5 h-full z-50 pointer-events-none hidden md:block">
            <div className="w-full h-full bg-black/5" />
            <div
                ref={progressRef}
                className="absolute top-0 w-full h-full bg-brand-green origin-top transition-transform duration-75 ease-out"
                style={{ transform: `scaleY(${scale})` }}
            />
        </div>
    );
}
