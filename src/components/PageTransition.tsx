import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PageTransition = () => {
    const container = useRef<HTMLDivElement>(null);
    const path = useRef<SVGPathElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            const tl = gsap.timeline();

            // Начальное состояние: Шторка полностью закрывает экран
            // Мы это зададим в CSS/JSX, но на всякий случай тут тоже
            gsap.set(container.current, { yPercent: 0 });

            // Кривая плоская снизу: M0,100 L100,100 L100,100 Q50,100 0,100
            // Идея: Шторка уезжает вверх, а низ изгибается

            tl.to(path.current, {
                duration: 0.8,
                attr: { d: "M0 0 L100 0 L100 85 Q50 100 0 85 Z" }, // Curve out logic... wait
                // Проще: Шторка это DIV + SVG Curve внизу.
                ease: "power2.in",
            });

            // Slide UP
            tl.to(container.current, {
                yPercent: -100,
                duration: 0.8,
                ease: "power2.inOut",
            }, 0);

            // Flatten curve at end
            tl.to(path.current, {
                attr: { d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" }, // Flat at top
                duration: 0.4,
                ease: "power2.out"
            }, ">-0.4");

        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={container}
            className="fixed inset-0 z-[9999] flex flex-col justify-end pointer-events-none"
            style={{ height: '120vh', top: '-10vh' }} // Чуть больше экрана
        >
            <div className="bg-brand-dark flex-grow w-full" /> {/* Main body */}
            <svg
                className="w-full h-[20vh] fill-brand-dark translate-y-[-1px]" // Connect seamlessly
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <path
                    ref={path}
                    d="M0 0 L100 0 L100 100 Q50 100 0 100 Z" // Initial flat bottom
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    );
};

export default PageTransition;
