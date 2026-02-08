import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, HelpCircle, ArrowUpRight, MessageSquareCode } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
    {
        question: "Как быстро вы можете вывести персонал на объект?",
        answer: "Стандартный запуск занимает 5-7 рабочих дней. В экстренных случаях мы можем обеспечить мобильную бригаду в течение 24 часов."
    },
    {
        question: "Входит ли стоимость химии и инвентаря в тариф?",
        answer: "Да, мы работаем по системе «All-Inclusive». В стоимость включены профессиональные моющие средства (EU Ecolabel), техника Tennant и расходные материалы."
    },
    {
        question: "Как вы контролируете качество работы сотрудников?",
        answer: "Мы внедрили QR-чек-листы. На каждом участке есть QR-код, который сотрудник сканирует после уборки и прикрепляет фотоотчет. Вы видите это в личном кабинете."
    },
    {
        question: "Проходит ли ваш персонал проверку безопасности?",
        answer: "Безусловно. Каждый сотрудник проходит биометрическую проверку, проверку по базам МВД и обучение в нашей собственной академии IC Academy."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".faq-header-animate", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            gsap.from(".faq-item-animate", {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".faq-list-container",
                    start: "top 75%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 bg-[#F9FAFB] relative overflow-hidden">
            {/* Minimal Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-green/[0.02] -skew-x-12 translate-x-1/4" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="faq-header-animate mb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-gray-100 rounded-full mb-8">
                        <HelpCircle size={16} className="text-brand-green" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Knowledge Base</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-brand-dark mb-6">
                        Остались <span className="text-brand-green">вопросы?</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Собрали ответы на самые частые вопросы о процессах, контроле и запуске объектов.
                    </p>
                </div>

                <div className="faq-list-container grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left: Interactive List */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`faq-item-animate group border transition-all duration-500 rounded-[32px] overflow-hidden ${openIndex === i ? 'bg-white border-brand-green/20 shadow-xl' : 'bg-white/50 border-gray-100 hover:border-gray-200'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full p-8 lg:p-10 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className={`text-sm font-mono font-bold transition-colors ${openIndex === i ? 'text-brand-green' : 'text-gray-300'}`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className={`text-xl lg:text-2xl font-black uppercase tracking-tighter transition-colors ${openIndex === i ? 'text-brand-green' : 'text-brand-dark'}`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === i ? 'bg-brand-dark text-white rotate-45' : 'bg-gray-100 text-brand-dark'}`}>
                                        <Plus size={20} />
                                    </div>
                                </button>

                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-8 lg:px-10 pb-10 ml-11 md:ml-12 border-t border-gray-50 pt-8">
                                        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Premium CTA Card */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-brand-dark p-10 rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 blur-[60px]" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-brand-green transition-colors">
                                    <MessageSquareCode size={32} className="text-brand-green group-hover:text-white" />
                                </div>

                                <h4 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">
                                    Персональная <br /> консультация
                                </h4>
                                <p className="text-white/40 text-lg mb-10 font-medium">
                                    Не нашли ответ? Оставьте номер, и наш эксперт перезвонит через 15 минут.
                                </p>

                                <div className="space-y-4">
                                    <input
                                        type="tel"
                                        placeholder="+7 (___) ___ __ __"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-bold outline-none focus:border-brand-green transition-colors"
                                    />
                                    <button className="w-full bg-brand-green text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3">
                                        Получить ответ <ArrowUpRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-8 border border-dashed border-gray-200 rounded-[32px] flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                                <HelpCircle size={20} />
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-tight">
                                IC Academy <br /> Support 24/7
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FAQSection;
