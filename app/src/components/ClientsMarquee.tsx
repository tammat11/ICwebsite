import { useInView } from '../hooks/useInView';

type Client = {
    name: string;
    accentClassName: string;
    logoSrc: string;
    logoAlt: string;
    logoClassName?: string;
};

const clients: Client[] = [
    {
        name: 'Magnum',
        accentClassName: 'from-[#f04a5a]/12 to-transparent',
        logoSrc: '/partners/magnum.png',
        logoAlt: 'Magnum logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Kaspi Bank',
        accentClassName: 'from-[#ef2b56]/12 to-transparent',
        logoSrc: '/partners/kaspi.png',
        logoAlt: 'Kaspi Bank logo',
        logoClassName: 'max-h-11 md:max-h-14',
    },
    {
        name: 'Forte Bank',
        accentClassName: 'from-[#7d1538]/12 to-transparent',
        logoSrc: '/partners/forte.png',
        logoAlt: 'Forte Bank logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Technodom',
        accentClassName: 'from-[#2a9d4b]/12 to-transparent',
        logoSrc: '/partners/technodom.png',
        logoAlt: 'Technodom logo',
        logoClassName: 'max-h-11 md:max-h-14',
    },
    {
        name: 'H&M',
        accentClassName: 'from-[#cf102d]/12 to-transparent',
        logoSrc: '/partners/hm.png',
        logoAlt: 'H&M logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Bank RBK',
        accentClassName: 'from-[#69d4d1]/14 to-transparent',
        logoSrc: '/partners/rbk.png',
        logoAlt: 'Bank RBK logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Home Credit',
        accentClassName: 'from-[#e0204f]/12 to-transparent',
        logoSrc: '/partners/home-credit.png',
        logoAlt: 'Home Credit logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Eurasian Bank',
        accentClassName: 'from-[#f2b233]/12 to-transparent',
        logoSrc: '/partners/eurasian.png',
        logoAlt: 'Eurasian Bank logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'JTI',
        accentClassName: 'from-[#2d5be3]/12 to-transparent',
        logoSrc: '/partners/jti.png',
        logoAlt: 'JTI logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Defacto',
        accentClassName: 'from-[#4b2ca3]/12 to-transparent',
        logoSrc: '/partners/defacto.png',
        logoAlt: 'Defacto logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'LPP',
        accentClassName: 'from-black/10 to-transparent',
        logoSrc: '/partners/lpp.png',
        logoAlt: 'LPP logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'KOTON',
        accentClassName: 'from-black/10 to-transparent',
        logoSrc: '/partners/koton.png',
        logoAlt: 'Koton logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Air Astana',
        accentClassName: 'from-[#0c5a87]/12 to-transparent',
        logoSrc: '/partners/air-astana.png',
        logoAlt: 'Air Astana logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
    {
        name: 'Samsung',
        accentClassName: 'from-[#1428a0]/12 to-transparent',
        logoSrc: '/partners/samsung.png',
        logoAlt: 'Samsung logo',
        logoClassName: 'max-h-10 md:max-h-12',
    },
];

const ClientsMarquee = () => {
    const [sectionRef, inView] = useInView();
    const marqueeSets = [0, 1];

    return (
        <section ref={sectionRef} className={`bg-white border-y border-black/5 py-12 md:py-20 relative overflow-hidden ${inView ? 'in-view' : ''}`}>
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8 flex items-center gap-6 md:mb-12 reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30 md:text-[12px]">
                        Наши ключевые партнеры
                    </span>
                    <div className="h-px w-full bg-black/5" />
                </div>
            </div>

            <div className="relative select-none py-2">
                <div className="partners-marquee-track flex w-max items-stretch">
                    {marqueeSets.map((setIndex) => (
                        <div key={setIndex} className="flex shrink-0 items-stretch gap-4 px-2 md:gap-6 md:px-3">
                            {clients.map((client) => (
                                <div
                                    key={`${setIndex}-${client.name}`}
                                    className="group flex w-[152px] shrink-0 flex-col items-center justify-center gap-3 rounded-[8px] border border-black/5 bg-white p-4 shadow-[0_10px_28px_rgba(26,29,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/25 hover:shadow-[0_16px_34px_rgba(26,29,30,0.07)] md:w-[176px]"
                                >
                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-black/6 bg-white p-3 md:h-24 md:w-24">
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${client.accentClassName} opacity-80 transition-opacity duration-300 group-hover:opacity-100`} />
                                        <img
                                            src={client.logoSrc}
                                            alt={client.logoAlt}
                                            className={`relative z-10 h-auto w-auto max-w-[68px] object-contain md:max-w-[82px] ${client.logoClassName ?? 'max-h-12 md:max-h-14'}`}
                                            loading="eager"
                                            decoding="async"
                                            draggable={false}
                                        />
                                    </div>
                                    <span className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-brand-dark/35 transition-colors duration-300 group-hover:text-brand-green md:text-[10px]">
                                        {client.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-white via-white/85 to-transparent md:w-28" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-white via-white/85 to-transparent md:w-28" />
            </div>

            <style>{`
                @keyframes partnersMarquee {
                    from {
                        transform: translate3d(0, 0, 0);
                    }
                    to {
                        transform: translate3d(-50%, 0, 0);
                    }
                }

                .partners-marquee-track {
                    animation: partnersMarquee 42s linear infinite;
                    will-change: transform;
                    backface-visibility: hidden;
                    transform: translate3d(0, 0, 0);
                }

                .partners-marquee-track:hover {
                    animation-play-state: paused;
                }

                @media (prefers-reduced-motion: reduce) {
                    .partners-marquee-track {
                        animation-duration: 120s;
                    }
                }
            `}</style>
        </section>
    );
};

export default ClientsMarquee;
