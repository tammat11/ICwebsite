const clients = [
    { name: "Magnum", domain: "magnum.kz" },
    { name: "Kaspi Bank", domain: "kaspi.kz" },
    { name: "Forte Bank", domain: "forte.kz" },
    { name: "Technodom", domain: "technodom.kz" },
    { name: "H&M", domain: "hm.com" },
    { name: "Bank RBK", domain: "bankrbk.kz" },
    { name: "Home Credit", domain: "homecredit.kz" },
    { name: "Eurasian Bank", domain: "eubank.kz" },
    { name: "JTI", domain: "jti.com" },
    { name: "Defacto", domain: "defacto.com.tr" },
    { name: "LPP", domain: "lpp.com" },
    { name: "KOTON", domain: "koton.com" },
    { name: "Air Astana", domain: "airastana.com" },
    { name: "Samsung", domain: "samsung.com" },
];

import { useRef, useState, useEffect } from 'react';

const ClientsMarquee = () => {
    const [sectionRef, inView] = useInView();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const onMouseUp = () => setIsDragging(false);
    const onMouseLeave = () => setIsDragging(false);

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section ref={sectionRef} className={`py-12 md:py-20 bg-white border-y border-black/5 overflow-hidden relative ${inView ? 'in-view' : ''}`}>
            <div className="pointer-events-none absolute left-12 top-10 h-20 w-20 rounded-full bg-brand-green/8 blur-3xl animate-bob-soft" />
            <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12 reveal-on-scroll" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-brand-dark/30 whitespace-nowrap">Наши ключевые партнеры</span>
                    <div className="h-px w-full bg-black/5" />
                </div>
            </div>

            <div 
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                className={`relative overflow-x-auto scrollbar-hide select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                <div className="flex whitespace-nowrap gap-12 md:gap-24 items-center w-max animate-marquee hover:pause-animation">
                    {[1, 2, 3].map((set) => (
                        <div key={set} className="flex items-center gap-12 md:gap-24 px-6 md:px-12">
                            {clients.map((client, i) => (
                                <div
                                    key={`${set}-${i}`}
                                    className="flex flex-col items-center gap-3 md:gap-4 group cursor-default"
                                >
                                    <div className={`w-20 h-20 md:w-32 md:h-32 rounded-full bg-white border border-black/5 flex items-center justify-center p-5 md:p-6 transition-all duration-500 group-hover:border-brand-green/30 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] group-hover:-translate-y-2 relative overflow-hidden ${i % 2 === 0 ? 'animate-bob-soft' : 'animate-bob-soft-alt'}`}>
                                        <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />
                                        <img
                                            src={`https://logo.clearbit.com/${client.domain}`}
                                            alt={client.name}
                                            className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 animate-logo-drift"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (!target.src.includes('google.com')) {
                                                    target.src = `https://www.google.com/s2/favicons?sz=128&domain=${client.domain}`;
                                                } else {
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                                                        parent.innerHTML = `<span class="text-xl font-black text-brand-dark/20">${initials}</span>`;
                                                    }
                                                }
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/20 group-hover:text-brand-green transition-colors duration-500">
                                        {client.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Visual fading for seamless loop edges */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default ClientsMarquee;
