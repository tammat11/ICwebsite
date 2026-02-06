// import { useEffect } from 'react'; // Removed unused
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, CheckCircle, Shield, Sparkles, ShoppingBag, Shirt, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        title: "БАЗОВАЯ УБОРКА",
        time: "1.5-2 часа",
        desc: "Утренняя или вечерняя комплексная уборка помещения («до» или «после» прихода сотрудников на работу). Идеально для небольших офисов с малой проходимостью.",
        icon: <Sparkles size={32} />,
        tags: ["Утро/Вечер", "Малый трафик"]
    },
    {
        title: "ПОДДЕРЖИВАЮЩАЯ",
        time: "6-8 часов",
        desc: "Специалисты работают в течение всего дня. Подходит супермаркетам, ТРЦ и объектам с высокой активностью, где нужна идеальная чистота non-stop.",
        icon: <Clock size={32} />,
        tags: ["Весь день", "Высокий трафик"]
    },
    {
        title: "ГЕНЕРАЛЬНАЯ",
        time: "12-24 часов",
        desc: "Глубокая очистка всех труднодоступных мест раз в несколько месяцев. Полное обеспыливание, мойка окон, химчистка мебели и дезинфекция.",
        icon: <Shield size={32} />,
        tags: ["Раз в квартал", "Глубокая очистка"]
    },
    {
        title: "ПОСЛЕСТРОИТЕЛЬНАЯ",
        time: "12-24 часов",
        desc: "Комплексная очистка с применением спецтехники и промышленных средств. Удаление пятен краски, клея, цемента и строительной пыли.",
        icon: <CheckCircle size={32} />,
        tags: ["Спецтехника", "Сложные загрязнения"]
    }
];

const extras = [
    {
        title: "Входные группы",
        desc: "Замена ковролана и грязезащитные системы.",
        icon: <Shield size={24} />
    },
    {
        title: "Расходники",
        desc: "Поставка бумаги, мыла и диспенсеров.",
        icon: <ShoppingBag size={24} />
    },
    {
        title: "Униформа",
        desc: "Пошив брендированной спецодежды.",
        icon: <Shirt size={24} />
    }
];

const DetailedServices = () => {
    return (
        <section id="detailed-services" className="py-32 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 text-center">
                    <span className="text-brand-green text-sm font-black tracking-[0.4em] uppercase block mb-6">B2B Services</span>
                    <h2 className="text-5xl md:text-8xl font-black text-brand-dark leading-none uppercase">
                        Все виды <span className="text-brand-green italic">Уборок</span>
                    </h2>
                    <p className="mt-8 text-xl text-brand-dark/50 max-w-2xl mx-auto">
                        Профессиональные решения для бизнеса любого масштаба. От ежедневной поддержки до сложных индустриальных задач.
                    </p>
                </div>

                {/* Main Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    {services.map((s, i) => (
                        <div key={i} className="group p-10 rounded-[40px] bg-brand-light border border-black/5 hover:border-brand-green/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className="text-brand-green transform scale-150">{s.icon}</div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-8">
                                {s.tags.map((t, idx) => (
                                    <span key={idx} className="px-4 py-2 rounded-full bg-white text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 border border-black/5">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-3xl font-black text-brand-dark mb-4 uppercase">{s.title}</h3>
                            <div className="flex items-center gap-2 mb-6 text-brand-green font-bold text-sm uppercase tracking-widest">
                                <Clock size={16} />
                                <span>{s.time}</span>
                            </div>

                            <p className="text-lg text-brand-dark/60 leading-relaxed mb-10">
                                {s.desc}
                            </p>

                            <button className="w-full py-4 rounded-xl bg-white border border-black/5 font-bold uppercase tracking-widest hover:bg-brand-green hover:text-white transition-colors">
                                Рассчитать стоимость
                            </button>
                        </div>
                    ))}
                </div>

                {/* Extra Services & Quality Control Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Extra Services Column */}
                    <div className="lg:col-span-1 p-10 rounded-[40px] bg-brand-dark text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-10">ДОПОЛНИТЕЛЬНО</h3>
                            <div className="space-y-8">
                                {extras.map((e, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-white/10 text-brand-green shrink-0">
                                            {e.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{e.title}</h4>
                                            <p className="text-white/40 text-sm leading-snug">{e.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl" />
                    </div>

                    {/* Quality Control Wide Column */}
                    <div className="lg:col-span-2 p-10 md:p-14 rounded-[40px] border border-black/5 bg-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-full bg-brand-green text-white">
                                    <Phone size={24} />
                                </div>
                                <span className="text-brand-green font-black tracking-[0.2em] uppercase text-sm">Quality Control</span>
                            </div>

                            <h3 className="text-3xl md:text-5xl font-black text-brand-dark mb-6 leading-tight">
                                ЕДИНСТВЕННЫЙ СОБСТВЕННЫЙ <br /><span className="text-brand-green">CONTACT CENTER</span>
                            </h3>
                            <p className="text-xl text-brand-dark/50 max-w-md mb-12">
                                Мы не теряем заявки. Каждое обращение фиксируется в CRM и контролируется персональным менеджером до полного решения.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { step: "01", text: "Звонок / Заявка" },
                                    { step: "02", text: "Фиксация в CRM" },
                                    { step: "03", text: "Менеджер" },
                                    { step: "04", text: "Решение" }
                                ].map((step, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-brand-light border border-black/5 text-center">
                                        <div className="text-2xl font-black text-brand-green/20 mb-2">{step.step}</div>
                                        <div className="font-bold text-brand-dark text-sm">{step.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailedServices;
