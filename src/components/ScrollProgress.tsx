import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
    const progressRef = useRef(null);

    useEffect(() => {
        gsap.to(progressRef.current, {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.1
            }
        });
    }, []);

    return (
        <div className="fixed top-0 right-0 w-1.5 h-full z-50 pointer-events-none hidden md:block">
            <div className="w-full h-full bg-black/5" />
            <div
                ref={progressRef}
                className="absolute top-0 w-full h-full bg-brand-green origin-top"
                style={{ transform: 'scaleY(0)' }}
            />
        </div>
    );
}
