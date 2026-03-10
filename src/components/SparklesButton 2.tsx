import { useRef } from 'react';
import { gsap } from 'gsap';

interface SparklesButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
}

export default function SparklesButton({ onClick, children }: SparklesButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseEnter = () => {
        if (!buttonRef.current) return;

        // Create 4-6 sparkles
        const numSparkles = Math.floor(Math.random() * 3) + 4;

        for (let i = 0; i < numSparkles; i++) {
            const sparkle = document.createElement("div");
            sparkle.classList.add("absolute", "pointer-events-none");
            // Standard SVG Star
            sparkle.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4 md:w-6 md:h-6 text-brand-green">
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
                </svg>
            `;

            buttonRef.current.appendChild(sparkle);

            // Random starting position inside the button
            const startX = Math.random() * buttonRef.current.offsetWidth;
            const startY = Math.random() * buttonRef.current.offsetHeight;

            gsap.set(sparkle, {
                x: startX - 12,
                y: startY - 12,
                scale: 0,
                opacity: 1,
                rotate: 0,
                transformOrigin: "center center"
            });

            // Random ending position (bursting out)
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 40;
            const endX = startX + Math.cos(angle) * distance;
            const endY = startY + Math.sin(angle) * distance;

            const tl = gsap.timeline({
                onComplete: () => {
                    if (buttonRef.current?.contains(sparkle)) {
                        buttonRef.current.removeChild(sparkle);
                    }
                }
            });

            tl.to(sparkle, {
                scale: 0.8 + Math.random() * 0.5,
                rotate: 90 + Math.random() * 90,
                x: endX - 12,
                y: endY - 12,
                duration: 0.4 + Math.random() * 0.2,
                ease: "power2.out"
            }).to(sparkle, {
                scale: 0,
                opacity: 0,
                duration: 0.2 + Math.random() * 0.2,
                ease: "power2.in"
            }, "-=0.2");
        }
    };

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            className="group relative px-12 py-6 overflow-hidden rounded-full transition-all duration-700 hover:scale-105 active:scale-95 border border-transparent hover:border-brand-green/30 hover:shadow-[0_0_40px_-10px_rgba(46,204,113,0.4)]"
        >
            <div className="absolute inset-0 bg-brand-dark group-hover:bg-brand-green transition-colors duration-700" />
            <span className="relative z-10 text-white text-xs font-bold uppercase tracking-[0.3em]">
                {children}
            </span>
        </button>
    );
}
