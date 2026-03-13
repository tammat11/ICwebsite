import { useInView } from '../hooks/useInView';

const ManifestoSection = () => {
    const [sectionRef, inView] = useInView();

    return (
        <section ref={sectionRef} className={`relative py-24 md:py-32 bg-brand-light flex flex-col items-center justify-center ${inView ? 'in-view' : ''}`}>

            {/* Decorative arches removed */}

            <div className="max-w-7xl mx-auto px-6 w-full text-center">

                {/* 1. Header Info- Styled with new brand-secondary */}
                <div className="reveal-manifesto mb-12 flex items-center justify-center gap-4 reveal-on-scroll" style={{ animationDelay: '0.1s' }}>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-secondary">Философия</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-secondary">Стандарты чистоты</span>
                </div>

                {/* 2. Main Slogan - High Impact & Robust Layout */}
                <h2 className="flex flex-col items-center gap-2 md:gap-4">
                    <div className="overflow-hidden">
                        <span className="reveal-manifesto block text-[clamp(2.5rem,8vw,120px)] font-[1000] text-brand-dark leading-[0.9] tracking-tighter uppercase reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
                            МЫ СОЗДАЕМ
                        </span>
                    </div>

                    <div className="overflow-hidden">
                        <span className="reveal-manifesto block text-[clamp(2.5rem,8vw,120px)] font-[1000] text-brand-green leading-[0.8] tracking-[-0.05em] uppercase px-4 reveal-on-scroll" style={{ animationDelay: '0.35s' }}>
                            СТАНДАРТЫ
                        </span>
                    </div>

                    <div className="overflow-hidden">
                        <span className="reveal-manifesto block text-[clamp(2.5rem,8vw,120px)] font-[1000] text-brand-dark leading-[0.9] tracking-tighter uppercase shadow-text reveal-on-scroll" style={{ animationDelay: '0.5s' }}>
                            ЧИСТОТЫ<span className="text-brand-secondary"></span>
                        </span>
                    </div>
                </h2>

                {/* 3. The Impact Statement */}
                <div className="mt-20 md:mt-32 reveal-manifesto reveal-on-scroll" style={{ animationDelay: '0.7s' }}>
                    <p className="text-xl md:text-3xl font-[1000] text-brand-dark/20 uppercase tracking-tighter leading-[0.8]">
                        КОТОРЫЕ МЕНЯЮТ ИНДУСТРИЮ <br />
                        <span className="text-brand-secondary drop-shadow-[0_0_30px_rgba(123,133,167,0.3)]">КАЗАХСТАНА ЕЖЕДНЕВНО.</span>
                    </p>
                </div>

                {/* 4. Footer Decor */}
                <div className="mt-20 reveal-manifesto flex items-center justify-center gap-10 opacity-5">
                    <span className="text-[8px] font-black uppercase tracking-[1em]">ICG_SYS_2025</span>
                </div>

            </div>

            {/* Aesthetic Side Details */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none hidden lg:block">
                <span className="text-[15vh] font-black uppercase tracking-tighter [writing-mode:vertical-lr] rotate-180">INTEGRITY</span>
            </div>

        </section>
    );
};

export default ManifestoSection;
