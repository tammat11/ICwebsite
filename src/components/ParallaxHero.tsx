import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ParallaxHero = () => {
    const root = useRef<HTMLDivElement>(null);
    // const arrowRef = useRef<SVGRectElement>(null); // Removed as per instruction

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top top', // Start when top of component hits top of viewport
                    end: '+=100%', // Scroll distance = 100% of viewport height (pin duration)
                    pin: true, // Lock the section in place
                    scrub: 1, // Smooth linkage to scrollbar
                    anticipatePin: 1
                }
            })
                // Simplified Animations (Performance Optimized)
                .fromTo('.stain1', { y: 200 }, { y: -200 }, 0)
                .fromTo('.stain-bubble', { y: 50 }, { y: -150 }, 0)
                .fromTo('.layerBg', { y: 30 }, { y: -30 }, 0)
                .fromTo('.layerMg', { y: 60 }, { y: -60 }, 0)
                .fromTo('.layerFg', { y: 100 }, { y: -100 }, 0);

            // Arrow interaction remains - REMOVED as per instruction
            // const arrowBtn = arrowRef.current;
            // if (arrowBtn) {
            //     arrowBtn.onmouseenter = () => gsap.to('.arrow', { y: 10, duration: 0.8, ease: 'back.inOut(3)', overwrite: 'auto' });
            //     arrowBtn.onmouseleave = () => gsap.to('.arrow', { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
            //     arrowBtn.onclick = () => gsap.to(window, { scrollTo: window.innerHeight * 1.5, duration: 1.5, ease: 'power1.inOut' });
            // }

        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={root} className="relative w-full h-screen overflow-hidden bg-brand-light">
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden">
                <svg viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full">

                    <defs>
                        <linearGradient id="gradSky" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#FBFDF9', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#E8F0E5', stopOpacity: 1 }} />
                        </linearGradient>
                        {/* Removed blur filter for performance */}
                    </defs>

                    {/* Sky Background */}
                    <rect className="sky" width="100%" height="100%" fill="url(#gradSky)" />

                    {/* Background Layer: Abstract City/Structure (Lightest) */}
                    <path className="layerBg" fill="#E8F0E5" d="M0,900 L1600,900 L1600,400 L1400,300 L1200,500 L800,200 L400,400 L0,300 Z" />

                    {/* Text Background (Brand Dark for contrast in mask) */}
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#E8F0E5" fontSize="250" fontWeight="900" style={{ fontFamily: 'Inter', letterSpacing: '-0.05em' }}>PURE</text>

                    {/* Simple Opacity circles instead of blurred ones */}
                    <circle className="stain-bubble" cx="20%" cy="60%" r="150" fill="#83B643" opacity="0.05" />
                    <circle className="stain-bubble" cx="80%" cy="40%" r="100" fill="#83B643" opacity="0.08" />

                    {/* Middle Layer: Geometric Forms (Mid Tone) */}
                    <path className="layerMg" fill="#D1E2C4" opacity="0.5" d="M0,900 L1600,900 L1600,600 L1300,500 L1000,700 L600,450 L300,550 L0,500 Z" />

                    {/* Foreground Layer: Sharp Lines (Brand Green Accent) */}
                    <path className="layerFg" fill="#83B643" d="M0,900 L1600,900 L1600,750 L1200,850 L800,700 L400,800 L0,750 Z" />

                    {/* Mask Definition */}
                    <mask id="m">
                        <g className="stain1">
                            <rect fill="white" width="100%" height="100%" y="100%" />
                            {/* Large Organic Reveal Shape */}
                            <circle cx="50%" cy="100%" r="800" fill="white" />
                        </g>
                    </mask>

                    {/* Interaction Hint Arrow */}
                    <polyline className="arrow" fill="none" points="790,550 800,560 810,550" stroke="#1A1D1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Revealed Content (Inside "Spotless" Zone) */}
                    <g mask="url(#m)">
                        <rect fill="#1A1D1E" width="100%" height="100%" />
                        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#fff" fontSize="250" fontWeight="900" style={{ fontFamily: 'Inter', letterSpacing: '-0.05em' }}>SPACE</text>
                    </g>

                    {/* Sharp circles instead of blur */}
                    <circle className="stain1" cx="85%" cy="80%" r="60" fill="#83B643" opacity="0.6" />
                    <circle className="stain1" cx="15%" cy="85%" r="90" fill="#83B643" opacity="0.4" />

                    {/* Removed arrowRef rect */}
                    {/* <rect ref={arrowRef} width="100%" height="100%" opacity="0" style={{ cursor: 'pointer' }} /> */}
                </svg>
            </div>
        </div>
    );
};

export default ParallaxHero;
