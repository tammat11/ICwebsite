import Footer from '../components/Footer';
import { Mail, Globe, Building2 } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const ContactsPage = () => {
    const [rootRef, inView] = useInView();
    const departments = [
        { title: "Отдел продаж", email: "sales@ic-group.kz", phone: "+7 777 008 73 60", icon: Building2 },
        { title: "HR Департамент", email: "hr@ic-group.kz", phone: "+7 771 780 2366", icon: Globe },
        { title: "Тендерный отдел", email: "tenders@ic-group.kz", phone: "+7 707 808 3003", icon: Mail },
    ];

    return (
        <div ref={rootRef} className={`min-h-screen bg-[#F5F5F7] text-brand-dark selection:bg-brand-green/30 ${inView ? 'in-view' : ''}`}>

            <main className="pt-24 sm:pt-32 pb-20 px-6">

                {/* Header */}
                <div className="max-w-7xl mx-auto mb-16 md:mb-20 relative text-left reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <span className="text-brand-green font-bold tracking-[0.4em] uppercase text-xs md:text-sm block mb-6">
                        Контакты
                    </span>
                    <h1 className="text-[clamp(2.5rem,7vw,80px)] font-bold tracking-tighter leading-[0.9] mb-8">
                        СВЯЖИТЕСЬ <br />
                        <span className="text-brand-green">С НАМИ</span>
                    </h1>
                </div>

                {/* Departments & Form */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-16 mb-20">

                    {/* Departments List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl sm:text-4xl font-bold mb-10 reveal-on-scroll" style={{ animationDelay: '0.1s' }}>ДЕПАРТАМЕНТЫ</h2>
                        {departments.map((dep, i) => (
                            <div key={i} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-3xl bg-white border border-white/50 shadow-md shadow-black/5 hover:border-brand-green/30 transition-colors reveal-on-scroll" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green shrink-0">
                                    <dep.icon size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-base sm:text-lg truncate">{dep.title}</h4>
                                    <p className="text-brand-dark font-mono text-xs sm:text-sm">{dep.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Form */}
                    <div className="bg-brand-dark text-white p-6 sm:p-10 md:p-14 rounded-[30px] sm:rounded-[40px] relative overflow-hidden shadow-2xl reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h2 className="text-[clamp(1.75rem,5vw,36px)] font-bold mb-2 uppercase">Напишите нам</h2>
                            <p className="text-white/50 mb-8">Мы ответим в течение 15 минут.</p>

                            <form className="space-y-4">
                                <input type="text" placeholder="Ваше Имя" className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors" />
                                <input type="email" placeholder="Email" className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors" />
                                <textarea placeholder="Сообщение" rows={4} className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors resize-none" />
                                <button className="w-full bg-brand-green text-white font-bold uppercase tracking-widest py-5 rounded-2xl hover:bg-white hover:text-brand-dark transition-all">
                                    Отправить
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    );
};

export default ContactsPage;
