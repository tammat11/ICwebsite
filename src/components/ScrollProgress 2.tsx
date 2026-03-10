import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement>(null);
    const spongeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(progressRef.current, {
                scaleY: 1,
                transformOrigin: "top",
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.2
                }
            });

            gsap.to(spongeRef.current, {
                top: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.2
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // We keep z-index extremely high so it sits above everything, acting as a progress bar
    return (
        <div ref={containerRef} className="fixed right-0 top-0 bottom-0 w-3 z-[100] pointer-events-none mix-blend-normal hidden md:block">
            {/* The dirty/background path */}
            <div className="absolute inset-y-0 right-1.5 w-[2px] bg-black/5 rounded-full" />

            {/* The Clean path */}
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div
                ref={progressRef}
                className="absolute top-0 right-1.5 w-[2px] bg-brand-green rounded-full shadow-[0_0_8px_rgba(46,204,113,0.6)]"
                style={{ transform: 'scaleY(0)' }}
            />

            {/* The Sponge/Wiper */}
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div
                ref={spongeRef}
                className="absolute right-0 -translate-y-1/2 w-8 h-4 text-brand-dark flex items-center justify-center translate-x-1 rotate-0"
                style={{ top: '0%' }}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-md">
                    {/* Custom squeegee icon */}
                    <path d="M4 17h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2zm0-8h16v6H4V9zm4-5h8v2H8V4z" />
                </svg>
            </div>
        </div>
    );
}
