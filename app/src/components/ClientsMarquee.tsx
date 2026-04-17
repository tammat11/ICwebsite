import { useRef, useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';

type Client = {
    name: string;
    accent: string;
    textClassName: string;
    logo: {
        primary: string;
        secondary?: string;
        badge?: string;
        shape?: 'rounded' | 'pill';
        size?: 'default' | 'wide';
    };
};

const clients: Client[] = [
    {
        name: "Magnum",
        accent: "from-red-500/15 to-transparent",
        textClassName: "text-[#d71920]",
        logo: { primary: "Magnum", shape: "rounded" },
    },
    {
        name: "Kaspi Bank",
        accent: "from-[#ef2b56]/15 to-transparent",
        textClassName: "text-[#ef2b56]",
        logo: { primary: "Kaspi", secondary: "Bank", shape: "rounded" },
    },
    {
        name: "Forte Bank",
        accent: "from-[#7d1538]/15 to-transparent",
        textClassName: "text-[#7d1538]",
        logo: { primary: "Forte", secondary: "Bank", badge: "f", shape: "rounded" },
    },
    {
        name: "Technodom",
        accent: "from-[#2a9d4b]/15 to-transparent",
        textClassName: "text-[#2a9d4b]",
        logo: { primary: "TECHNODOM", shape: "rounded" },
    },
    {
        name: "H&M",
        accent: "from-[#cf102d]/15 to-transparent",
        textClassName: "text-[#cf102d]",
        logo: { primary: "H&M", shape: "rounded" },
    },
    {
        name: "Bank RBK",
        accent: "from-[#69d4d1]/20 to-transparent",
        textClassName: "text-[#69d4d1]",
        logo: { primary: "BANK", secondary: "RBK", shape: "rounded" },
    },
    {
        name: "Home Credit",
        accent: "from-[#e0204f]/15 to-transparent",
        textClassName: "text-[#e0204f]",
        logo: { primary: "Home", secondary: "Credit", badge: "HC", shape: "rounded" },
    },
    {
        name: "Eurasian Bank",
        accent: "from-[#f2b233]/15 to-transparent",
        textClassName: "text-[#f2b233]",
        logo: { primary: "Eurasian", secondary: "Bank", shape: "rounded" },
    },
    {
        name: "JTI",
        accent: "from-[#2d5be3]/15 to-transparent",
        textClassName: "text-[#2d5be3]",
        logo: { primary: "JTI", shape: "pill" },
    },
    {
        name: "Defacto",
        accent: "from-[#4b2ca3]/15 to-transparent",
        textClassName: "text-[#4b2ca3]",
        logo: { primary: "DeFacto", shape: "rounded" },
    },
    {
        name: "LPP",
        accent: "from-[#111111]/10 to-transparent",
        textClassName: "text-[#111111]",
        logo: { primary: "LPP", shape: "pill" },
    },
    {
        name: "KOTON",
        accent: "from-[#000000]/10 to-transparent",
        textClassName: "text-[#000000]",
        logo: { primary: "KOTON", shape: "wide" },
    },
    {
        name: "Air Astana",
        accent: "from-[#0c5a87]/15 to-transparent",
        textClassName: "text-[#0c5a87]",
        logo: { primary: "Air", secondary: "Astana", shape: "rounded" },
    },
    {
        name: "Samsung",
        accent: "from-[#1428a0]/15 to-transparent",
        textClassName: "text-[#1428a0]",
        logo: { primary: "SAMSUNG", shape: "pill" },
    },
];

const ClientLogo = ({ client }: { client: Client }) => {
    const shapeClassName = client.logo.shape === 'pill'
        ? 'rounded-full px-3 py-2'
        : client.logo.size === 'wide'
            ? 'rounded-2xl px-3 py-2'
            : 'rounded-2xl p-3';

    return (
        <div className={`relative z-10 flex min-h-[56px] min-w-[56px] max-w-full items-center justify-center border border-black/5 bg-white/90 shadow-[0_10px_30px_rgba(255,255,255,0.65)] ${shapeClassName}`}>
            <div className="flex items-center gap-2 text-center leading-none">
                {client.logo.badge ? (
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-[11px] font-black uppercase ${client.textClassName}`}>
                        {client.logo.badge}
                    </span>
                ) : null}
                <div className="flex flex-col items-center">
                    <span className={`text-[12px] md:text-[14px] font-black uppercase tracking-[0.08em] ${client.textClassName}`}>
                        {client.logo.primary}
                    </span>
                    {client.logo.secondary ? (
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.22em] text-brand-dark/45">
                            {client.logo.secondary}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

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
                                        <ClientLogo client={client} />
                                        <div className={`absolute inset-0 bg-gradient-to-tr ${client.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />
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
