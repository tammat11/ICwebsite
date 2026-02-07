import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Intro = () => {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // 1. Logo Pop
            tl.from(".intro-logo", {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
                // 2. Slide Up fast
                .to(root.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut",
                    delay: 0.2
                });

        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={root} className="fixed inset-0 z-[9999] bg-brand-dark flex items-center justify-center">
            <div className="intro-logo flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(131,182,67,0.4)]">
                    <span className="text-brand-dark font-black text-2xl">ic</span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter text-white">
                    IC GROUP
                </h1>
            </div>
        </div>
    );
};

export default Intro;
