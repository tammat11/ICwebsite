import React, { useState, useRef, useEffect } from 'react';

export default function BeforeAfterImage({ src, alt, className = '' }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (x: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let currentX = Math.max(0, Math.min(x - rect.left, rect.width));
        setSliderPos((currentX / rect.width) * 100);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden select-none cursor-ew-resize group ${className}`}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDragging(false)}
            onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
            onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
        >
            {/* Dirty Before */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img src={src} alt={alt} className="w-full h-full object-cover filter sepia-[0.4] contrast-75 brightness-75 grayscale-[0.2]" />
            </div>

            {/* Clean After (clipped) */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img src={src} alt={alt} className="w-full h-full object-cover filter brightness-110 contrast-110 saturate-110" />
            </div>

            {/* Slider Divider */}
            <div
                className="absolute top-0 bottom-0 z-20 w-[2px] bg-brand-green/80 flex items-center justify-center -translate-x-[1px] pointer-events-none"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-brand-green text-brand-green transition-transform duration-200 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    );
}
