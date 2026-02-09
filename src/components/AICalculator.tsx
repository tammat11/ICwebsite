import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Check,
    Sparkles,
    Zap,
    FlaskConical,
    Users,
    Target,
    Building2,
    ShieldCheck,
    Microscope,
    Dna,
    Award,
    CircleDashed
} from 'lucide-react';

interface AICalculatorProps {
    isOpen: boolean;
    onClose: () => void;
}

const AICalculator = ({ isOpen, onClose }: AICalculatorProps) => {
    const [step, setStep] = useState(1);
    const [type, setType] = useState('Office');
    const [size, setSize] = useState(2500);
    const [chemistry, setChemistry] = useState('Eco');
    const [staff, setStaff] = useState(3);

    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // More realistic pricing map (KZT per m2)
    const priceMap: any = {
        'Office': 180,
        'Retail': 240,
        'Industry': 350
    };

    const chemMap: any = {
        'Standard': { label: 'Standard', mult: 1, icon: <FlaskConical size={14} /> },
        'Eco': { label: 'Pure Eco', mult: 1.15, icon: <Microscope size={14} /> },
        'Premium': { label: 'Nano-Tech', mult: 1.35, icon: <Dna size={14} /> }
    };

    const calculateBudget = () => {
        // Budget = (M2 * PricePerM2 * ChemMult) + (Staff * AvgSalary)
        const baseService = size * priceMap[type];
        const chemicalCosts = baseService * (chemMap[chemistry].mult - 1);
        const staffCosts = staff * 125000; // Salary + taxes

        const total = baseService + chemicalCosts + staffCosts;
        // Apply rounding to nearest 100
        return Math.round(total / 100) * 100;
    };

    const formattedBudget = calculateBudget().toLocaleString('ru-RU');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 1.05 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" }
            );
            gsap.fromTo(cardRef.current,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 0.2 }
            );
        } else {
            document.body.style.overflow = 'unset';
            setStep(1);
        }
    }, [isOpen]);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 15, filter: "blur(8px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
            );
        }
    }, [step]);

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-3xl font-sans"
        >
            {/* Header with Close Switch */}
            <div className="absolute top-8 right-8 z-[100] flex items-center gap-6">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">System Active // Secure Calc</span>
                </div>
                <button
                    onClick={onClose}
                    className="group flex items-center gap-3 bg-white text-black px-6 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-green hover:text-white transition-all shadow-2xl active:scale-90"
                >
                    Закрыть <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>

            <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left Side: Modern Data Typography */}
                <div className="hidden lg:block space-y-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-green/10 border border-brand-green/20">
                        <Zap size={14} className="text-brand-green fill-brand-green" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-green">Alpha Calc v.3.0.1</span>
                    </div>
                    <h2 className="text-[clamp(4.5rem,8vw,110px)] font-[1000] text-white leading-[0.85] tracking-tighter uppercase italic">
                        ТОЧНЫЙ <br />
                        <span className="text-brand-green relative inline-block">
                            РАСЧЕТ
                            <div className="absolute -right-12 -top-4 text-white/10 rotate-12">
                                <ShieldCheck size={48} />
                            </div>
                        </span> <br />
                        <span className="opacity-40">БЮДЖЕТА</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/10 max-w-lg">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white/30">
                                <Award size={14} />
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Standard</p>
                            </div>
                            <p className="text-5xl font-black text-white italic">99.8%</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white/30">
                                <Target size={14} />
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Security</p>
                            </div>
                            <p className="text-5xl font-black text-brand-green italic">100%</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Step-by-Step Engine */}
                <div
                    ref={cardRef}
                    className="relative bg-white rounded-[50px] shadow-[0_60px_180px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 min-h-[680px] flex flex-col"
                >
                    {/* Interior Blueprint Overlay */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '64px 64px' }} />

                    <div className="relative z-10 flex-1 p-8 md:p-14 flex flex-col" ref={contentRef}>

                        {/* Phase Indicator */}
                        <div className="flex justify-between items-center mb-16 px-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex flex-col items-center gap-3 group cursor-help">
                                    <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'w-20 bg-brand-green shadow-[0_0_20px_rgba(131,182,67,0.5)]' : 'w-6 bg-black/5 group-hover:bg-black/10'}`} />
                                    <span className={`text-[8px] font-bold uppercase tracking-[0.2em] transition-colors ${step >= i ? 'text-black' : 'text-black/10'}`}>0{i}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            {step === 1 && (
                                <div className="space-y-12 animate-in fade-in duration-500">
                                    <div className="text-center space-y-3">
                                        <div className="inline-flex items-center gap-2 bg-brand-green/10 px-4 py-1.5 rounded-full">
                                            <Building2 size={12} className="text-brand-green" />
                                            <span className="text-[9px] font-black text-brand-green uppercase tracking-widest">Target sector selection</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic">ТИП ОБЪЕКТА.</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 max-w-md mx-auto w-full">
                                        {[
                                            { id: 'Office', label: 'Бизнес-центры', icon: <Building2 />, note: 'Professional spaces' },
                                            { id: 'Retail', label: 'Торговые сети', icon: <Target />, note: 'High traffic areas' },
                                            { id: 'Industry', label: 'Промбазы', icon: <Zap />, note: 'Complex environments' }
                                        ].map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => setType(item.id)}
                                                className={`group relative flex items-center justify-between p-7 rounded-[32px] border-2 transition-all hover:translate-x-1 ${type === item.id ? 'border-black bg-black text-white' : 'border-black/5 bg-gray-50 hover:border-black/20 text-black/40'}`}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${type === item.id ? 'bg-brand-green text-white' : 'bg-white text-black/20'}`}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="text-lg font-black uppercase tracking-tight italic block leading-none">{item.label}</span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest mt-2 block ${type === item.id ? 'text-white/40' : 'text-black/10'}`}>{item.note}</span>
                                                    </div>
                                                </div>
                                                {type === item.id && <Check className="text-brand-green" size={24} strokeWidth={4} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-12">
                                    <div className="text-center space-y-3">
                                        <div className="inline-flex items-center gap-2 bg-brand-green/10 px-4 py-1.5 rounded-full">
                                            <CircleDashed size={12} className="text-brand-green animate-spin-slow" />
                                            <span className="text-[9px] font-black text-brand-green uppercase tracking-widest">Volume definition</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic">МАСШТАБ.</h3>
                                    </div>
                                    <div className="space-y-16 py-6">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-brand-green/5 blur-3xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative text-[100px] md:text-[140px] font-[1000] text-black leading-none tracking-tighter italic tabular-nums text-center group-hover:scale-105 transition-transform">
                                                {size.toLocaleString()}
                                            </div>
                                            <div className="text-center text-sm font-black text-brand-green uppercase tracking-[1em] mt-4 italic">МЕТРОВ²</div>
                                        </div>
                                        <div className="space-y-8">
                                            <input
                                                type="range" min="100" max="100000" step="100" value={size}
                                                onChange={(e) => setSize(parseInt(e.target.value))}
                                                className="w-full h-3 bg-black/5 rounded-full appearance-none cursor-pointer accent-brand-green luxury-slider"
                                            />
                                            <div className="flex justify-between px-2 text-[9px] font-black text-black/20 uppercase tracking-widest">
                                                <span>Min load</span>
                                                <span className="text-brand-green">Precision control range</span>
                                                <span>Max load</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-10">
                                    <div className="text-center space-y-3">
                                        <div className="inline-flex items-center gap-2 bg-brand-green/10 px-4 py-1.5 rounded-full">
                                            <Sparkles size={12} className="text-brand-green" />
                                            <span className="text-[9px] font-black text-brand-green uppercase tracking-widest">Quality standards phase</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic">РЕСУРСЫ.</h3>
                                    </div>

                                    <div className="space-y-8 max-w-md mx-auto w-full">
                                        <div className="space-y-4">
                                            <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                                                <FlaskConical size={10} /> КЛАСС ХИМИИ
                                            </p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {Object.entries(chemMap).map(([key, val]: [string, any]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setChemistry(key)}
                                                        className={`py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${chemistry === key ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 border-black/5 text-black/30 hover:border-black/20'}`}
                                                    >
                                                        {val.icon}
                                                        {val.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-8 bg-black text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10 space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <Users size={18} className="text-brand-green" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">ПЕРСОНАЛ</span>
                                                    </div>
                                                    <span className="text-5xl font-black italic tracking-tighter tabular-nums flex items-center gap-2">
                                                        {staff}
                                                        <span className="text-xs text-brand-green font-black uppercase tracking-normal">Staff</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="range" min="1" max="50" value={staff}
                                                    onChange={(e) => setStaff(parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-green luxury-slider"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-12 py-10">
                                    <div className="text-center space-y-4">
                                        <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.8em] animate-pulse">Generated Budget Result</p>
                                        <div className="text-[60px] md:text-[85px] font-[1000] text-black tracking-tighter leading-none italic tabular-nums drop-shadow-sm select-none">
                                            ~{formattedBudget}
                                        </div>
                                        <div className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.4em] text-black/20">
                                            <Check size={16} className="text-brand-green" /> Tenge / Per month
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                                        <div className="bg-gray-50 p-6 rounded-[32px] border border-black/5 flex flex-col gap-2 group hover:bg-white transition-colors">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/20">
                                                {chemMap[chemistry].icon} <span className="text-black/40">ХИМИЯ</span>
                                            </div>
                                            <span className="text-xs font-black uppercase italic tracking-tight">{chemMap[chemistry].label}</span>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-[32px] border border-black/5 flex flex-col gap-2 group hover:bg-white transition-colors">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/20">
                                                <Users size={12} className="text-brand-green" /> <span className="text-black/40">КОМАНДА</span>
                                            </div>
                                            <span className="text-xs font-black uppercase italic tracking-tight">{staff} сотрудников</span>
                                        </div>
                                    </div>

                                    <button className="group w-full py-9 bg-brand-green text-white font-black text-2xl uppercase tracking-tighter rounded-full shadow-[0_30px_60px_rgba(131,182,67,0.4)] hover:scale-[1.03] transition-all active:scale-95 flex items-center justify-center gap-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <span className="relative z-10">ЗАКАЗАТЬ ОФФЕР</span>
                                        <ChevronRight size={32} strokeWidth={4} className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Smart Navigation */}
                        <div className="mt-12 flex items-center justify-between border-t border-black/5 pt-10">
                            {step > 1 ? (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="group flex items-center gap-4 py-4 px-10 rounded-full bg-gray-50 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-all border border-transparent hover:border-black/10"
                                >
                                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Назад
                                </button>
                            ) : <div />}

                            {step < 4 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    className="group flex items-center gap-5 py-5 px-14 rounded-full bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-green transition-all shadow-2xl active:scale-95"
                                >
                                    Phase Next <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/20 hover:text-brand-green transition-all group"
                                >
                                    <CircleDashed size={14} className="group-hover:rotate-180 transition-transform duration-700" /> СБРОСИТЬ
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .luxury-slider {
                    -webkit-appearance: none;
                }
                .luxury-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 40px;
                    width: 40px;
                    border-radius: 14px;
                    background: #83B643;
                    cursor: pointer;
                    box-shadow: 0 10px 20px rgba(131,182,67,0.3);
                    border: 5px solid #fff;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .luxury-slider::-webkit-slider-thumb:hover {
                    scale: 1.15;
                    box-shadow: 0 0 35px rgba(131,182,67,0.6);
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default AICalculator;
