import React, { useRef } from 'react';

export default function SparklesButton({ children, onClick, className = '' }: { children?: React.ReactNode; onClick?: () => void; className?: string }) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseEnter = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();

        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4 text-brand-green"><path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor"/></svg>`;
            sparkle.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:50;';
            document.body.appendChild(sparkle);

            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            const endX = startX + Math.cos(angle) * distance;
            const endY = startY + Math.sin(angle) * distance;
            const scale = Math.random() * 1.5 + 0.5;
            const rotation = Math.random() * 180;
            const duration = (0.6 + Math.random() * 0.4) * 1000;

            const anim = sparkle.animate([
                { transform: `translate(${startX}px, ${startY}px) scale(0) rotate(0deg)`, opacity: '1' },
                { transform: `translate(${endX}px, ${endY}px) scale(${scale}) rotate(${rotation}deg)`, opacity: '0' },
            ], { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });

            anim.onfinish = () => sparkle.remove();
        }
    };

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            className={`btn-premium relative overflow-hidden group ${className}`}
        >
            <span className="relative z-10 block">{children}</span>
        </button>
    );
}
