import { useState, useEffect, useRef } from 'react';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Check,
    Building2,
    CircleDashed,
    Store,
    Factory,
    Warehouse,
    GraduationCap,
    PackageOpen,
    Landmark,
    Briefcase,
    ShoppingBag,
    Stethoscope,
    Dumbbell,
    Utensils,
    Send,
    Phone,
    MessageSquare,
    Building
} from 'lucide-react';

import { createBitrixLead } from '../utils/bitrix';
import { formatPhone } from '../utils/phone';

interface AICalculatorProps {
    isOpen: boolean;
    onClose: () => void;
}

const AICalculator = ({ isOpen, onClose }: AICalculatorProps) => {
    const [step, setStep] = useState(1);
    const [type, setType] = useState('retail');
    const [size, setSize] = useState(1500);

    // Form State
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [comment, setComment] = useState('');

    const modalRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const sectorTypes = [
        { id: 'retail', label: 'Ритейл', icon: <Store size={22} /> },
        { id: 'production', label: 'Производство', icon: <Factory size={22} /> },
        { id: 'warehouse', label: 'Склады', icon: <Warehouse size={22} /> },
        { id: 'education', label: 'Школы, Универы', icon: <GraduationCap size={22} /> },
        { id: 'ecommerce', label: 'E-com склады', icon: <PackageOpen size={22} /> },
        { id: 'bank', label: 'Банк', icon: <Landmark size={22} /> },
        { id: 'office', label: 'Офисы', icon: <Briefcase size={22} /> },
        { id: 'mall', label: 'ТРЦ', icon: <ShoppingBag size={22} /> },
        { id: 'business_center', label: 'БЦ', icon: <Building2 size={22} /> },
        { id: 'medical', label: 'Мед.центры', icon: <Stethoscope size={22} /> },
        { id: 'fitness', label: 'Фитнес', icon: <Dumbbell size={22} /> },
        { id: 'food', label: 'Общепит', icon: <Utensils size={22} /> }
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setTimeout(() => {
                setStep(1);
                setCompany('');
                setPhone('');
                setComment('');
                setIsSubmitting(false);
            }, 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!phone || phone.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона (минимум 10 цифр)');
            return;
        }

        setIsSubmitting(true);
        try {
            const sectorLabel = sectorTypes.find(s => s.id === type)?.label || type;
            await createBitrixLead({
                title: `Калькулятор: ${sectorLabel} (${size} м²)`,
                company: company,
                phone: phone,
                comments: `Тип объекта: ${sectorLabel}\nПлощадь: ${size} м²\nКомментарий: ${comment}`,
            });
            
            alert('Заявка успешно отправлена!');
            onClose();
        } catch (error) {
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl font-sans overflow-y-auto animate-modal-backdrop"
        >
            {/* Header with Close Switch - FIXED to viewport */}
            <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[300] flex items-center gap-4 md:gap-6">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Система активна // Сбор данных</span>
                </div>
                <button
                    onClick={onClose}
                    className="group flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white px-4 py-3 md:px-6 md:py-4 rounded-full font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] transition-all shadow-2xl backdrop-blur-md active:scale-95"
                >
                    <span className="hidden sm:inline">Закрыть</span> <X size={16} className="md:w-[18px] md:h-[18px] group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>

            <div className="min-h-full w-full flex items-center justify-center p-3 sm:p-4 py-20 md:p-8 md:py-24">
                <div className="max-w-4xl w-full flex flex-col items-center">

                    {/* Step-by-Step Engine */}
                    <div
                        ref={cardRef}
                        className="relative bg-white/95 backdrop-blur-xl rounded-[28px] md:rounded-[50px] shadow-[0_0_50px_rgba(131,182,67,0.15)] overflow-hidden border border-white/20 min-h-[500px] lg:min-h-[680px] flex flex-col w-full animate-modal-card"
                    >
                        {/* Interior Blueprint Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '48px 48px md:64px md:64px' }} />

                        <div className="relative z-10 flex-1 p-5 sm:p-8 md:p-10 lg:p-14 flex flex-col h-full">

                            {/* Phase Indicator */}
                            <div className="flex justify-between items-center mb-6 md:mb-10 px-2 md:px-0">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex flex-col items-center gap-2 md:gap-3 group cursor-help transition-all duration-300">
                                        <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'w-16 sm:w-20 md:w-24 bg-brand-green shadow-[0_0_15px_rgba(131,182,67,0.6)]' : 'w-4 md:w-8 bg-black/5'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] transition-colors ${step >= i ? 'text-black' : 'text-black/20'}`}>ШАГ 0{i}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                {step === 1 && (
                                    <div key="step1" className="space-y-6 md:space-y-8 animate-step-content flex flex-col justify-center w-full">
                                        <div className="text-center space-y-1.5 md:space-y-3">
                                            <div className="inline-flex items-center gap-2 bg-brand-green/10 px-3 md:px-4 py-1.5 rounded-full">
                                                <Building2 size={12} className="text-brand-green" />
                                                <span className="text-[7px] md:text-[9px] font-black text-brand-green uppercase tracking-widest">Выбор целевого сектора</span>
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter">ТИП ОБЪЕКТА</h3>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 w-full">
                                            {sectorTypes.map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => setType(item.id)}
                                                    className={`group relative flex flex-col items-center justify-center py-4 px-2 sm:p-4 md:p-5 rounded-[16px] md:rounded-[24px] border-2 transition-all hover:scale-[1.02] active:scale-95 ${type === item.id ? 'border-brand-green bg-brand-green/10 shadow-sm ring-4 ring-brand-green/10' : 'border-black/5 bg-gray-50/80 hover:bg-white hover:border-brand-green/30 hover:shadow-md'}`}
                                                >
                                                    <div className={`mb-2 md:mb-3 transition-colors ${type === item.id ? 'text-brand-green drop-shadow-sm scale-110' : 'text-black/30 group-hover:text-brand-green'}`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className={`text-[9px] md:text-[10px] font-black uppercase text-center tracking-tight leading-none px-1 ${type === item.id ? 'text-brand-dark' : 'text-black/60 group-hover:text-black'}`}>
                                                        {item.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div key="step2" className="space-y-8 md:space-y-12 animate-step-content flex flex-col justify-center w-full h-full">
                                        <div className="text-center space-y-2 md:space-y-3">
                                            <div className="inline-flex items-center gap-2 bg-brand-green/10 px-3 md:px-4 py-1.5 rounded-full">
                                                <CircleDashed size={12} className="text-brand-green animate-spin-slow" />
                                                <span className="text-[7px] md:text-[9px] font-black text-brand-green uppercase tracking-widest">Определение объема</span>
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tighter">ПЛОЩАДЬ</h3>
                                        </div>
                                        <div className="space-y-12 sm:space-y-16 py-6 border-b border-black/5 pb-12 mt-4">
                                            <div className="relative group flex justify-center">
                                                <div className="absolute inset-0 bg-brand-green/15 blur-[40px] rounded-full scale-100 md:scale-75 opacity-70 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative flex items-end justify-center w-full gap-2 md:gap-3 group-hover:scale-105 transition-transform">
                                                    <input 
                                                        type="number" 
                                                        value={size || ''} 
                                                        onChange={(e) => setSize(parseInt(e.target.value) || 0)}
                                                        className="w-[180px] sm:w-[220px] md:w-[280px] bg-transparent text-[60px] sm:text-[70px] md:text-[90px] font-black text-black tracking-tight tabular-nums text-center outline-none border-b-[3px] border-black/10 hover:border-brand-green/50 focus:border-brand-green transition-colors pb-2"
                                                    />
                                                    <span className="text-[14px] sm:text-[16px] md:text-[20px] font-black text-brand-green uppercase tracking-[0.2em] mb-4 md:mb-6">M²</span>
                                                </div>
                                            </div>
                                            <div className="space-y-6 md:space-y-8 max-w-xs sm:max-w-sm mx-auto w-full">
                                                <input
                                                    type="range" min="50" max="50000" step="50" value={size}
                                                    onChange={(e) => setSize(parseInt(e.target.value))}
                                                    className="w-full h-1 md:h-2 bg-black/10 rounded-full appearance-none cursor-pointer accent-brand-green luxury-slider shadow-inner"
                                                />
                                                <div className="flex justify-between px-2 text-[7px] sm:text-[8px] md:text-[9px] font-black text-black/40 uppercase tracking-widest">
                                                    <span>50</span>
                                                    <span className="text-brand-green font-extrabold hidden sm:inline">Двигайте ползунок</span>
                                                    <span>50,000+</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div key="step3" className="space-y-6 sm:space-y-8 md:space-y-10 animate-step-content w-full h-full flex flex-col justify-center">
                                        <div className="text-center space-y-2 md:space-y-3">
                                            <div className="inline-flex items-center gap-2 bg-brand-green/10 px-3 md:px-4 py-1.5 rounded-full">
                                                <Send size={12} className="text-brand-green" />
                                                <span className="text-[7px] md:text-[9px] font-black text-brand-green uppercase tracking-widest">Сбор бизнес-данных</span>
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter">СВЯЗЬ</h3>
                                        </div>

                                        <div className="space-y-3 sm:space-y-4 max-w-sm mx-auto w-full mt-2 sm:mt-4">
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-brand-green transition-colors">
                                                    <Building size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={company}
                                                    onChange={(e) => setCompany(e.target.value)}
                                                    placeholder="Название компании" 
                                                    className="w-full bg-gray-50 border-[2px] border-black/5 rounded-[16px] sm:rounded-[20px] py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm font-bold placeholder:text-black/30 outline-none focus:border-brand-green focus:bg-brand-green/5 focus:shadow-[0_0_20px_rgba(131,182,67,0.1)] transition-all"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-brand-green transition-colors">
                                                    <Phone size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </div>
                                                <input 
                                                    type="tel" 
                                                    value={phone}
                                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                                    placeholder="+7 (XXX) XXX XX XX*" 
                                                    className="w-full bg-gray-50 border-[2px] border-black/5 rounded-[16px] sm:rounded-[20px] py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm font-bold placeholder:text-black/30 outline-none focus:border-brand-green focus:bg-brand-green/5 focus:shadow-[0_0_20px_rgba(131,182,67,0.1)] transition-all"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-4 text-black/30 group-focus-within:text-brand-green transition-colors">
                                                    <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </div>
                                                <textarea 
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Комментарий (опционально)" 
                                                    rows={3}
                                                    className="w-full bg-gray-50 border-[2px] border-black/5 rounded-[16px] sm:rounded-[20px] py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm font-bold placeholder:text-black/30 outline-none focus:border-brand-green focus:bg-brand-green/5 focus:shadow-[0_0_20px_rgba(131,182,67,0.1)] transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                        
                                    </div>
                                )}
                            </div>

                            {/* Smart Navigation */}
                            <div className="mt-6 md:mt-12 flex items-center justify-between border-t border-black/10 pt-5 md:pt-8 bg-white/10 z-20">
                                {step > 1 ? (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="group flex items-center gap-1 sm:gap-2 lg:gap-4 py-3 px-4 sm:px-6 lg:py-4 lg:px-8 rounded-full bg-gray-50 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black hover:bg-gray-100 transition-all border border-black/5 hover:border-black/20 shadow-sm"
                                    >
                                        <ChevronLeft size={16} className="lg:w-[18px] lg:h-[18px] group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Назад</span>
                                    </button>
                                ) : <div />}

                                {step < 3 ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        className="group flex items-center gap-2 sm:gap-3 lg:gap-5 py-4 px-6 sm:px-8 lg:py-4 lg:px-12 rounded-full bg-black text-white text-[9px] sm:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-brand-green hover:shadow-[0_10px_20px_rgba(131,182,67,0.3)] transition-all shadow-xl active:scale-95 ml-auto"
                                    >
                                        <span className="mt-0.5">ДАЛЕЕ</span> <ChevronRight size={16} strokeWidth={3} className="sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] group-hover:translate-x-2 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`group flex flex-1 ml-3 sm:ml-4 items-center justify-center gap-2 lg:gap-3 py-4 rounded-full bg-brand-green text-white text-[9px] sm:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-[0_15px_30px_rgba(131,182,67,0.4)] transition-all active:scale-95 relative overflow-hidden ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <span className="relative z-10 mt-0.5">{isSubmitting ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}</span>
                                        {!isSubmitting && <Check size={16} strokeWidth={3} className="relative z-10 sm:w-[18px] sm:h-[18px] group-hover:scale-125 transition-transform" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* Скрытие стрелок у type="number" */
                input[type='number']::-webkit-inner-spin-button,
                input[type='number']::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type='number'] {
                    -moz-appearance: textfield;
                }
                
                .luxury-slider {
                    -webkit-appearance: none;
                }
                .luxury-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 28px;
                    width: 28px;
                    border-radius: 10px;
                    background: #83B643;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(131,182,67,0.3);
                    border: 3px solid #fff;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @media (min-width: 640px) {
                    .luxury-slider::-webkit-slider-thumb {
                        height: 32px;
                        width: 32px;
                        border-width: 4px;
                        border-radius: 12px;
                    }
                }
                @media (min-width: 768px) {
                    .luxury-slider::-webkit-slider-thumb {
                        height: 40px;
                        width: 40px;
                        border-width: 5px;
                        border-radius: 14px;
                    }
                }
                .luxury-slider::-webkit-slider-thumb:hover {
                    scale: 1.15;
                    box-shadow: 0 0 25px rgba(131,182,67,0.6);
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
