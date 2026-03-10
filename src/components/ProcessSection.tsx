import { Search, Calculator, CalendarCheck, Sparkles } from 'lucide-react';

const ProcessSection = () => {
    const steps = [
        {
            id: "01",
            title: "Аудит",
            desc: "Анализируем объект за 1 день. Поиск скрытых проблем.",
            icon: <Search className="w-6 h-6" />
        },
        {
            id: "02",
            title: "Смета",
            desc: "Прозрачный расчет и подбор профессиональной химии.",
            icon: <Calculator className="w-6 h-6" />
        },
        {
            id: "03",
            title: "Запуск",
            desc: "Формирование команды и старт работ за 48 часов.",
            icon: <CalendarCheck className="w-6 h-6" />
        },
        {
            id: "04",
            title: "Контроль",
            desc: "Ежедневный цифровой чек-лист в вашем смартфоне.",
            icon: <Sparkles className="w-6 h-6" />
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="process">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header with fixed brush stroke */}
                <div className="text-center mb-28">
                    <h2 className="section-header text-brand-dark">
                        Легкий путь <br />
                        <span className="text-brand-green italic">К результату</span>
                    </h2>
                </div>

                {/* Horizontal Sequence with Connection Line */}
                <div className="relative">

                    {/* The Connecting Line (Desktop Only) */}
                    <div className="hidden lg:block absolute top-[47px] left-[10%] right-[10%] h-[2px] z-0 overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <line x1="0" y1="1" x2="100%" y2="1" stroke="#F3F4F6" strokeWidth="2" />
                            <path
                                d="M0,1 L1000,1"
                                stroke="#83B643"
                                strokeWidth="2"
                                strokeDasharray="100 200"
                                className="animate-[dash_3s_linear_infinite]"
                            />
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, i) => (
                            <div key={i} className="group relative flex flex-col">

                                {/* Timeline Dot that sits on the line */}
                                <div className="hidden lg:flex absolute top-[44px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-gray-100 group-hover:border-brand-green group-hover:scale-125 transition-all duration-500 z-20 shadow-sm" />

                                {/* Card Body */}
                                <div className="mt-20 relative bg-white border border-gray-100 rounded-[40px] p-8 md:p-10 h-full min-h-[300px] flex flex-col transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] hover:border-brand-green/30 group-hover:-translate-y-3">

                                    {/* Large Background ID */}
                                    <div className="absolute top-6 right-8 text-8xl font-black text-gray-50/80 group-hover:text-brand-green/[0.06] transition-colors duration-700 select-none italic">
                                        {step.id}
                                    </div>

                                    {/* Elevated Icon */}
                                    <div className="mb-10 w-20 h-20 bg-gray-50 rounded-[24px] flex items-center justify-center text-brand-dark shadow-sm transition-all duration-500 group-hover:bg-brand-green group-hover:text-white group-hover:shadow-[0_20px_40px_rgba(131,182,67,0.3)] group-hover:scale-110 group-hover:rotate-6">
                                        <div className="transform transition-transform duration-500 group-hover:scale-110">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-auto relative z-10">
                                        <h3 className="text-2xl font-black uppercase tracking-tight text-brand-dark mb-4 transition-colors duration-500 group-hover:text-brand-green leading-none">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-400 leading-relaxed uppercase tracking-wider group-hover:text-gray-500 transition-colors">
                                            {step.desc}
                                        </p>
                                    </div>

                                    {/* Dynamic Bottom Accent */}
                                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-brand-green origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-b-[40px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
