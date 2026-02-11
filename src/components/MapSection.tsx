import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Navigation } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MapSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Map Tilt Effect
            gsap.from(".map-container", {
                rotationX: 20,
                opacity: 0,
                scale: 0.9,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true
                }
            });

            // Pins Pop-up
            gsap.from(".map-pin", {
                scale: 0,
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                    once: true
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const cities = [
        { name: "Astana", top: "40%", left: "45%", size: "w-8 h-8", type: "HQ" },
        { name: "Almaty", top: "70%", left: "60%", size: "w-6 h-6", type: "Hub" },
        { name: "Shymkent", top: "75%", left: "40%", size: "w-5 h-5", type: "Hub" },
        { name: "Atyrau", top: "45%", left: "20%", size: "w-5 h-5", type: "Hub" },
        { name: "Aktau", top: "60%", left: "15%", size: "w-4 h-4", type: "Branch" },
        { name: "Karaganda", top: "50%", left: "55%", size: "w-4 h-4", type: "Branch" },
        { name: "Ust-Kamenogorsk", top: "35%", left: "70%", size: "w-4 h-4", type: "Branch" }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-gray-50 relative overflow-hidden perspective-1000">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-16">
                    <h2 className="text-[clamp(3rem,8vw,100px)] font-black uppercase leading-[0.8] tracking-tighter text-brand-dark mb-6">
                        National <span className="text-brand-green">Scale</span>
                    </h2>
                    <div className="flex justify-center gap-4 md:gap-12 flex-wrap">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <Building2 size={29} className="text-brand-green" />
                            <div className="text-left">
                                <div className="text-xl font-black text-brand-dark leading-none">17</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Branches</div>
                            </div>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <Navigation size={20} className="text-brand-green" />
                            <div className="text-left">
                                <div className="text-xl font-black text-brand-dark leading-none">100+</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cities</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="map-container relative w-full aspect-[16/9] md:aspect-[2.2/1] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 transform-gpu hover:scale-[1.02] transition-transform duration-700">

                    {/* Isometric Grid */}
                    <div className="absolute inset-0 opacity-[0.3]"
                        style={{ backgroundImage: 'linear-gradient(30deg, #E2E8F0 1px, transparent 1px), linear-gradient(150deg, #E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    {/* Abstract Kaz Map (Morph) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%]">
                        <div className="w-full h-full bg-gray-100/50 rounded-[40px] blur-3xl" />

                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                            <path d="M400,200 L600,300 L300,400" stroke="#22C55E" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                            <path d="M200,300 L400,200 L500,250" stroke="#22C55E" strokeWidth="1" fill="none" />
                        </svg>
                    </div>

                    {/* Cities Pins */}
                    {cities.map((city, i) => (
                        <div key={i} className="map-pin absolute group cursor-pointer z-10" style={{ top: city.top, left: city.left }}>
                            <div className="relative flex flex-col items-center">
                                {/* Pin Head */}
                                <div className={`${city.size} rounded-full ${city.type === 'HQ' ? 'bg-brand-green shadow-green-500/50' : 'bg-white border-2 border-brand-green'} shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform duration-300 relative z-10`}>
                                    {city.type === 'HQ' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                </div>
                                {/* Pin Stick (Abstract) */}
                                <div className="w-[2px] h-8 bg-brand-green/30 -mt-2 group-hover:h-12 transition-all duration-300" />

                                {/* Base */}
                                <div className="w-8 h-2 bg-black/10 rounded-full blur-[2px] mt-[-2px] group-hover:scale-150 transition-transform duration-300" />

                                {/* Floating Label */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transform -translate-y-2 group-hover:translate-y-0 pointer-events-none">
                                    {city.name}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default MapSection;
