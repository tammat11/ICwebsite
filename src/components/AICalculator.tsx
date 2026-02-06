import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calculator, ChevronRight, Check, ChevronLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AICalculator = () => {
    const [step, setStep] = useState(1);
    const [type, setType] = useState('Office');
    const [size, setSize] = useState(1000);
    const root = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const priceMap: any = {
        'Office': 450,
        'Retail': 600,
        'Industry': 850
    };

    const estimate = (size * priceMap[type]).toLocaleString();

    useEffect(() => {
        const mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            // Initial state
            gsap.set(".calc-reveal", { opacity: 0, y: 30 });

            mm.add("(min-width: 768px)", () => {
                // Desktop Animation
                gsap.to(".calc-reveal", {
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top 85%",
                        once: true
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power2.out"
                });
            });

            mm.add("(max-width: 767px)", () => {
                // Mobile Animation - simpler/faster
                gsap.to(".calc-reveal", {
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top 90%",
                        once: true
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            });
        }, root);
        return () => ctx.revert();
    }, []);

    // Animate content when step changes
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [step]);

    return (
        <section ref={root} className="py-24 px-6 bg-brand-light">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="calc-reveal">
                        <span className="text-brand-green text-[11px] font-black tracking-[0.4em] uppercase block mb-8">Service Estimator</span>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-brand-dark mb-10 leading-none">AI <span className="text-brand-green italic">Estimator</span></h2>
                        <p className="text-brand-dark/40 text-xl font-medium leading-relaxed max-w-lg mb-12">
                            Получите мгновенный расчет стоимости обслуживания вашего объекта на базе нейронного анализа площади и типа индустрии.
                        </p>

                        <div className="space-y-4">
                            {["Точный алгоритм расчета", "Учет специфики индустрии", "Прозрачное ценообразование"].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 text-sm font-bold">
                                    <div className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                                        <Check size={14} />
                                    </div>
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="calc-reveal premium-card rounded-[60px] p-12 md:p-16 relative overflow-hidden bg-white shadow-3xl min-h-[500px] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-brand-green' : 'w-4 bg-brand-accent'}`} />
                                    ))}
                                </div>
                                <Calculator className="text-brand-green opacity-20" size={32} />
                            </div>

                            <div ref={contentRef}>
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <h3 className="text-3xl font-black tracking-tight text-brand-dark">Тип объекта</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {['Office', 'Retail', 'Industry'].map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setType(t)}
                                                    className={`p-6 rounded-3xl border-2 transition-all font-bold text-sm ${type === t ? 'border-brand-green bg-brand-green/5 text-brand-green' : 'border-black/5 hover:border-brand-green/20 text-brand-dark/40'}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <h3 className="text-3xl font-black tracking-tight text-brand-dark">Укажите площадь</h3>
                                        <div className="space-y-12">
                                            <input
                                                type="range"
                                                min="100"
                                                max="50000"
                                                step="100"
                                                value={size}
                                                onChange={(e) => setSize(parseInt(e.target.value))}
                                                className="w-full h-2 bg-brand-accent rounded-lg appearance-none cursor-pointer accent-brand-green"
                                            />
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm font-black text-brand-dark/20 uppercase tracking-widest">Square Meters</span>
                                                <span className="text-5xl font-black text-brand-dark leading-none">{size.toLocaleString()} <span className="text-lg opacity-20">m²</span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-10 text-center">
                                        <div>
                                            <span className="text-brand-green text-[10px] font-black tracking-[0.4em] uppercase block mb-4 font-sans">Estimated Monthly Plan</span>
                                            <div className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter leading-none mb-4 italic">
                                                ~{estimate} <span className="text-2xl not-italic opacity-20 font-sans">KZT</span>
                                            </div>
                                            <p className="text-sm text-brand-dark/40 font-medium">Это предварительная оценка. Точный расчет <br /> после аудита объекта.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                            {step > 1 && (
                                <button onClick={() => setStep(step - 1)} className="p-5 rounded-full border border-black/5 hover:bg-brand-accent transition-colors">
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            {step < 3 ? (
                                <button onClick={() => setStep(step + 1)} className="btn-premium flex-grow flex items-center justify-center gap-4">
                                    Next Step <ChevronRight size={20} />
                                </button>
                            ) : (
                                <div className="flex flex-col flex-grow gap-4">
                                    <button className="btn-premium w-full">Request Audit</button>
                                    <button onClick={() => setStep(1)} className="text-xs font-black text-brand-dark/20 uppercase tracking-widest hover:text-brand-green transition-colors">Start Over</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AICalculator;
