import { useRef, useState, type MouseEvent } from 'react';
import { gsap } from 'gsap';

interface BeforeAfterImageProps {
    src: string;
    alt: string;
    className?: string; // used for inner sizing and object-fit
    wrapperClassName?: string;
}

export default function BeforeAfterImage({ src, alt, className = "", wrapperClassName = "" }: BeforeAfterImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Filter values for the "Dirty" image layer
    const dirtyFilter = "sepia(0.3) blur(2px) contrast(0.7) brightness(0.8) grayscale(0.2)";

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !sliderRef.current || !dividerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        // Clip the clean image and move divider
        gsap.to(sliderRef.current, {
            clipPath: `inset(0 0 0 ${percentage}%)`,
            duration: 0.2, // smoothing
            ease: "power2.out"
        });

        gsap.to(dividerRef.current, {
            left: `${percentage}%`,
            duration: 0.2,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (!sliderRef.current || !dividerRef.current) return;

        // Reset to 0 (Fully clean)
        gsap.to(sliderRef.current, {
            clipPath: `inset(0 0 0 0%)`,
            duration: 0.8,
            ease: "power4.out"
        });

        gsap.to(dividerRef.current, {
            left: `0%`,
            duration: 0.8,
            ease: "power4.out"
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-crosshair group ${wrapperClassName}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
                WebkitUserSelect: 'none',
                userSelect: 'none'
            }}
        >
            {/* The "Dirty" Image (Background) */}
            <img
                src={src}
                alt={`Before ${alt}`}
                className={`absolute inset-0 select-none ${className}`}
                style={{ filter: dirtyFilter }}
                draggable={false}
            />

            {/* The "Clean" Image (Foreground, Clipped) */}
            <div
                ref={sliderRef}
                className="absolute inset-0 w-full h-full z-10 pointer-events-none origin-left"
                style={{ clipPath: "inset(0 0 0 0%)" }}
            >
                <img
                    src={src}
                    alt={`After ${alt}`}
                    className={`absolute inset-0 w-full h-full select-none ${className}`}
                    draggable={false}
                />
            </div>

            {/* The Drag Divider */}
            <div
                ref={dividerRef}
                className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-md z-20 pointer-events-none -translate-x-1/2 left-0 shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-opacity duration-300"
                style={{ opacity: isHovered ? 1 : 0 }}
            >
                {/* Visual Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur border border-black/10 flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-6 md:h-6 text-brand-green">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
                    </svg>
                </div>
            </div>

            {/* Tooltip hint visible once on hover */}
            <div
                className="absolute top-4 right-4 z-30 pointer-events-none mix-blend-difference text-white/80 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] transition-opacity duration-500"
                style={{ opacity: isHovered ? 1 : 0 }}
            >
                До / После
            </div>
        </div>
    );
}
