import { useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import AnimatedWave from './AnimatedWave';
import { useInView } from '../hooks/useInView';

const PhilosophySection = () => {
    const [sectionRef, inView] = useInView();
    const photoPath = "IMG_7169.jpg";

    return (
        <section ref={sectionRef} className={`section-padding-compact bg-white overflow-hidden relative ${inView ? 'in-view' : ''}`} id="philosophy">
            <div className="absolute top-0 left-0 w-full rotate-180 transform -translate-y-[1px]">
                <AnimatedWave />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center pt-24 md:pt-32">
                <div className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden border-[10px] md:border-[16px] border-white shadow-[0_45px_100px_-20px_rgba(0,0,0,0.2)] mb-8 md:mb-12 relative bg-gray-50 flex-shrink-0 group reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <img
                        src={photoPath}
                        alt="Larion Lyan"
                        className="w-full h-full object-cover scale-[1.3] translate-y-7 transition-transform duration-1000 group-hover:scale-[1.4]"
                    />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-green/30" />
                    </svg>
                    <div className="absolute top-4 right-4 md:top-10 md:right-10 text-brand-secondary animate-pulse">
                        <Star className="w-6 h-6 md:w-10 md:h-10" fill="currentColor" />
                    </div>
                </div>

                <h2 className="section-header mb-8 reveal-on-scroll" style={{ animationDelay: '0.15s' }}>
                    <span className="flex flex-col md:flex-row gap-y-1 gap-x-6 justify-center">
                        <span className="block text-black">Каждое</span>
                        <span className="block text-black">пространство</span>
                    </span>
                    <span className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-10 mt-1 md:mt-2">
                        <span className="block text-black">должно</span>
                        <span className="relative inline-block px-4">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(143,198,64,0.2)]">дышать.</span>
                            </span>
                            <div className="absolute inset-x-0 h-[85%] top-[7%] bg-brand-green/15 -z-10 transform -rotate-1 skew-x-[-12deg] scale-y-110" />
                        </span>
                    </span>
                </h2>

                <div className="flex items-center justify-center gap-6 md:gap-12 w-full max-w-full md:max-w-4xl mb-3 md:mb-4">
                    <div className="h-[1px] flex-1 bg-brand-secondary/30" />
                    <p className="text-lg md:text-2xl font-medium text-black whitespace-nowrap tracking-tight">
                        Лян Ларион Викторович
                    </p>
                    <div className="h-[1px] flex-1 bg-brand-secondary/30" />
                </div>
                <p className="text-[9px] md:text-xs font-medium uppercase tracking-[0.3em] md:tracking-[0.4em] text-brand-dark/30 mb-8 md:mb-12">
                    Основатель IC GROUP • Лидер отрасли клининга
                </p>

                <button className="group flex items-center gap-4 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.3em] md:tracking-[0.5em] text-brand-secondary hover:text-brand-green transition-colors">
                    Узнать больше о философии
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
            </div>
        </section>
    );
};

export default PhilosophySection;
