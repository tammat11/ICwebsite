import { useInView } from '../hooks/useInView';

const ContactSection = ({ onCalcOpen }: { onCalcOpen?: () => void }) => {
    const [sectionRef, inView] = useInView();
    return (
        <section ref={sectionRef} id="contacts" className={`relative py-12 md:py-16 bg-white text-center transform-gpu overflow-hidden ${inView ? 'in-view' : ''}`}>
            <div className="pointer-events-none absolute left-[8%] top-8 h-24 w-24 rounded-full bg-brand-green/8 blur-3xl animate-pulse-glow" />
            <div className="pointer-events-none absolute right-[10%] bottom-12 h-28 w-28 rounded-full bg-brand-dark/5 blur-3xl animate-bob-soft-alt" />
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="relative inline-flex flex-col items-center w-full max-w-4xl mx-auto mb-12 mt-8 reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <img 
                        src="/decor/decor1.png" 
                        alt="Дрон доставки" 
                        className="drone-anim absolute -top-8 right-0 md:-top-16 md:-right-16 w-32 md:w-[280px] h-auto object-contain drop-shadow-2xl pointer-events-none z-20 animate-bob-soft" 
                    />
                    <h2 className="section-header text-brand-dark overflow-visible flex flex-col items-center relative z-10 w-full text-center">
                        <span className="block mb-2">ПОЛУЧИТЬ</span>
                        <span className="relative inline-block">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(131,182,67,0.2)]">КОНСУЛЬТАЦИЮ</span>
                            </span>
                        </span>
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    <button
                        onClick={onCalcOpen}
                        className="hidden md:inline-flex group relative items-center gap-4 bg-brand-dark text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-green transition-all duration-500 overflow-hidden shadow-2xl"
                    >
                        <span className="relative z-10">Оставить заявку</span>
                    </button>
                </div>

                <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-8 reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
                    <div className="group relative flex flex-col items-center md:items-start gap-2 rounded-[28px] px-5 py-5 bg-[#f7f8f4] border border-black/5 shadow-sm animate-bob-soft">
                        <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Продажи</span>
                        <a href="tel:+77770087360" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">+7 777 008 73 60</a>
                    </div>
                    <div className="group relative flex flex-col items-center md:items-start gap-2 rounded-[28px] px-5 py-5 bg-[#f7f8f4] border border-black/5 shadow-sm animate-bob-soft-alt">
                        <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">HR</span>
                        <a href="tel:+77717802366" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">+7 771 780 2366</a>
                    </div>
                    <div className="group relative flex flex-col items-center md:items-start gap-2 rounded-[28px] px-5 py-5 bg-[#f7f8f4] border border-black/5 shadow-sm animate-bob-soft">
                        <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Тендерный отдел</span>
                        <a href="tel:+77078083003" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">+7 707 808 3003</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
