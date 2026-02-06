import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Coordinates tuned for the provided PNG map aspect ratio (likely roughly 2:1)
// These percentages are relative to the image container
const cities = [
    { name: "Astana", x: 52, y: 35, size: 8 },
    { name: "Almaty", x: 76, y: 75, size: 10 },
    { name: "Shymkent", x: 55, y: 85, size: 7 },
    { name: "Atyrau", x: 15, y: 45, size: 6 },
    { name: "Aktau", x: 8, y: 65, size: 6 },
    { name: "Karaganda", x: 58, y: 45, size: 7 },
    { name: "Aktobe", x: 30, y: 35, size: 6 },
    { name: "Oskemen", x: 82, y: 30, size: 6 },
    { name: "Pavlodar", x: 65, y: 22, size: 6 },
    { name: "Kostanay", x: 42, y: 22, size: 6 },
    { name: "Uralsk", x: 10, y: 28, size: 6 },
    { name: "Kyzylorda", x: 45, y: 70, size: 6 },
    { name: "Semey", x: 75, y: 30, size: 6 },
    { name: "Taraz", x: 62, y: 82, size: 6 },
    { name: "Turkestan", x: 50, y: 80, size: 6 },
    { name: "Taldykorgan", x: 76, y: 65, size: 6 },
    { name: "Kokshe", x: 52, y: 28, size: 5 },
];

const MapSection = () => {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Map Image Reveal
            gsap.from(".kz-map-container", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top 70%",
                },
                opacity: 0,
                y: 50,
                duration: 1.5,
                ease: "power2.out"
            });

            // Animate Cities (Pop up)
            gsap.from(".city-marker", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top 60%",
                },
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.05,
                delay: 0.5, // Wait for map to appear
                ease: "back.out(2)"
            });

            // Pulse effect
            gsap.to(".city-pulse", {
                scale: 2.5,
                opacity: 0,
                duration: 2,
                repeat: -1,
                stagger: 0.5,
                ease: "power1.out"
            });

        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="py-24 md:py-32 px-6 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <span className="text-brand-green font-black tracking-[0.4em] uppercase text-sm block mb-4">
                    National Coverage
                </span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-brand-dark leading-none">
                    ГЕОГРАФИЯ <span className="text-brand-green italic">ПРИСУТСТВИЯ</span>
                </h2>
            </div>

            <div className="max-w-6xl mx-auto relative">
                {/* Map Container */}
                <div className="relative aspect-[16/9] w-full kz-map-container">

                    {/* Provided Map Image */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                            src="/kz-map.png"
                            alt="Map of Kazakhstan"
                            className="w-full h-full object-contain drop-shadow-2xl opacity-80"
                            style={{ filter: "brightness(0) saturate(100%) invert(98%) sepia(3%) saturate(163%) hue-rotate(248deg) brightness(88%) contrast(86%)" }}
                        // The filter above makes it light greyish/white if it was black, or tweaks colors. 
                        // Since user said "removebg-preview", it's likely a black or colored outline.
                        // I'll assume it's dark and invert it or just use it as is if it looks good.
                        // Let's remove the filter first to see what user gave, or use a safe grayscale.
                        />
                        {/* Overlay to ensure it's not too stark if it's black */}
                        <img
                            src="/kz-map.png"
                            alt="Map Shadow"
                            className="absolute inset-0 w-full h-full object-contain blur-lg opacity-20 -z-10 translate-y-4"
                        />
                    </div>

                    {/* Cities Overlay - Absolute positioned over the container */}
                    <div className="absolute inset-0 w-full h-full">
                        {cities.map((city, i) => (
                            <div
                                key={i}
                                className="city-marker absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center justify-center z-10"
                                style={{ left: `${city.x}%`, top: `${city.y}%` }}
                            >
                                {/* Pulse Ring */}
                                <div className={`absolute w-8 h-8 rounded-full bg-brand-green/30 city-pulse pointer-events-none`} />

                                {/* Main Dot */}
                                <div className={`relative w-2 h-2 md:w-3 md:h-3 rounded-full bg-brand-green border border-white shadow-sm group-hover:scale-150 transition-transform duration-300`} />

                                {/* Tooltip */}
                                <div className="absolute top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-xl border border-black/5 whitespace-nowrap z-20 text-brand-dark">
                                    {city.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Overlay */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 border-t border-black/5 pt-12">
                    <div className="text-center">
                        <div className="text-3xl font-black text-brand-dark">17</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Регионов</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-brand-dark">1500+</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Объектов</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-brand-dark">3000+</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Сотрудников</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-brand-dark">24/7</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Поддержка</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
