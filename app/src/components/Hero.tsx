import { useRef } from 'react';
import SparklesButton from './SparklesButton';

const Hero = ({ onCalcOpen }: { onCalcOpen?: () => void }) => {
    const root = useRef<HTMLDivElement>(null);

    return (
        <section ref={root} className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white pt-24 md:pt-28">

            {/* ── Background is pure white, removed central glows/blobs and arches ── */}

            <div className="max-w-7xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
                <div className="hero-fade-in mb-8 p-4 transition-transform duration-700 hover:scale-105">
                    <img src="/logo_IC_group.png" alt="IC GROUP" className="w-[110px] md:w-[150px] h-auto object-contain opacity-90 overflow-visible filter saturate-[1.1]" />
                </div>

                <h1 className="flex flex-col items-center mb-6 select-none font-bold tracking-tighter uppercase whitespace-normal lg:whitespace-nowrap leading-[0.8] relative z-20">
                    <span className="hero-title-reveal block text-[clamp(44px,11vw,80px)] text-brand-dark transition-all duration-700">
                        Создать
                    </span>
                    <span className="hero-title-reveal block text-[clamp(50px,12vw,92px)] relative inline-block px-4 py-2 overflow-visible group">
                        <span className="relative z-20 text-brand-green">Чистоту</span>
                        <div className="clean-dirt absolute top-1/2 right-[-10%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 pointer-events-none z-30 opacity-50 flex items-center justify-center mix-blend-multiply">
                            <svg viewBox="0 0 200 200" className="w-full h-full text-[#5c6066] fill-current">
                                <path d="M41.7,-72.4C53.4,-64.7,62.1,-53.4,68.9,-41.4C75.7,-29.4,80.6,-16.7,81.1,-3.7C81.6,9.3,77.7,22.6,71.2,34.8C64.7,47,55.6,58.1,44.4,66.5C33.2,74.9,19.9,80.6,6.1,80.9C-7.7,81.2,-21.9,76.1,-34.5,68.9C-47.1,61.7,-58.1,52.4,-66.4,41.2C-74.7,30,-80.3,16.9,-81.1,3.4C-81.9,-10.1,-77.9,-24,-69.9,-35.8C-61.9,-47.6,-49.9,-57.3,-37.4,-64.5C-24.9,-71.7,-11.9,-76.4,2.1,-79.8C16.1,-83.2,30,-80.1,41.7,-72.4Z" transform="translate(100 100)" />
                            </svg>
                        </div>
                        <div className="clean-sparkle absolute top-0 right-0 w-24 h-24 pointer-events-none z-[50] opacity-0 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brand-dark/15">
                                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
                            </svg>
                        </div>
                        <img
                            src="/rag.png"
                            alt="Клининг"
                            className="cleaning-hand absolute top-0 right-[-20%] w-40 md:w-64 h-auto pointer-events-none z-[60] opacity-0"
                        />
                    </span>
                    <span className="hero-title-reveal block text-[clamp(44px,11vw,80px)] text-brand-dark">
                        Во всем
                    </span>
                </h1>

                <div className="hero-fade-in max-w-2xl mb-8 px-6 text-center z-20">
                    <p className="text-lg md:text-xl font-bold leading-snug tracking-tight">
                        <span className="text-brand-dark">Профессиональный клининг.</span>
                        <br />
                        <span className="text-brand-dark/45 font-medium text-base md:text-lg">
                            IC Group — самая крупная компания, предоставляющая{' '}
                            <br className="hidden md:block" />
                            профессиональные клининговые услуги на рынке Казахстана.
                        </span>
                    </p>
                </div>

                <div className="hero-fade-in flex flex-col items-center mt-4 z-20">
                    <SparklesButton onClick={onCalcOpen} className="px-12 py-6 text-sm font-semibold tracking-widest bg-brand-dark hover:bg-brand-green shadow-2xl hover:shadow-brand-green/40 hover:-translate-y-1 transition-all duration-300">
                        Получить консультацию
                    </SparklesButton>
                </div>
            </div>
        </section>
    );
};

export default Hero;
