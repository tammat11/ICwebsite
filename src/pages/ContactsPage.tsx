import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail, ArrowUpRight, Globe, Building2 } from 'lucide-react';

const ContactsPage = () => {
    const root = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation - Reveal
            gsap.to(".page-title", {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                delay: 0,
                stagger: 0.1
            });

            // Cards Animation - Simple Fade In (Delayed)
            gsap.to(".contact-card", {
                opacity: 1,
                duration: 0,
                ease: "power2.out",
                delay: 0.1,
                stagger: 0.1
            });
        }, root);

        return () => ctx.revert();
    }, []);

    const offices = [
        {
            city: "Алматы",
            role: "Headquarters",
            address: "ул. Розыбакиева 289/1, ЖК Айгерим",
            phone: "+7 (727) 378-08-41",
            email: "info@ic-group.kz",
            coords: "43.2081, 76.8906",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        },
        {
            city: "Астана",
            role: "Regional Office",
            address: "ул. Достык 18, БЦ Москва, 7 этаж",
            phone: "+7 (7172) 78-08-41",
            email: "astana@ic-group.kz",
            coords: "51.1284, 71.4305",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
        },
        {
            city: "Дубай",
            role: "International",
            address: "Business Bay, The Binary Tower",
            phone: "+971 50 123 4567",
            email: "dubai@ic-group.kz",
            coords: "25.1866, 55.2758",
            image: "https://images.unsplash.com/photo-1512418490979-92798ced138a?auto=format&fit=crop&q=80&w=800"
        }
    ];

    const departments = [
        { title: "Отдел продаж", email: "sales@ic-group.kz", phone: "+7 (771) 000-00-01", icon: Building2 },
        { title: "HR Департамент", email: "hr@ic-group.kz", phone: "+7 (771) 000-00-02", icon: Globe },
        { title: "Тендерный отдел", email: "tenders@ic-group.kz", phone: "+7 (771) 000-00-03", icon: Mail },
    ];

    return (
        <div ref={root} className="min-h-screen bg-[#F5F5F7] text-brand-dark selection:bg-brand-green/30">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-6">

                {/* Header */}
                <div className="max-w-7xl mx-auto mb-16 md:mb-20 relative text-center sm:text-left">
                    <span className="text-brand-green font-black tracking-[0.4em] uppercase text-xs md:text-sm block mb-6 page-title opacity-0 translate-y-12">
                        Contacts
                    </span>
                    <h1 className="text-[clamp(2.5rem,10vw,100px)] font-black tracking-tighter leading-[0.9] mb-8 page-title opacity-0 translate-y-12">
                        СВЯЖИТЕСЬ <br />
                        <span className="text-brand-green italic">С НАМИ</span>
                    </h1>
                </div>

                {/* Offices Grid */}
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 mb-32">
                    {offices.map((office, i) => (
                        <div key={i} className="contact-card group relative rounded-[40px] overflow-hidden bg-white border border-white/50 hover:border-brand-green/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 shadow-lg shadow-black/5 opacity-0">
                            <div className="h-48 overflow-hidden relative">
                                <img src={office.image} alt={office.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                                    {office.role}
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-3xl font-black mb-6">{office.city}</h3>
                                <div className="space-y-4 text-sm font-medium text-gray-500">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-brand-green shrink-0" size={18} />
                                        <span>{office.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="text-brand-green shrink-0" size={18} />
                                        <span>{office.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-brand-green shrink-0" size={18} />
                                        <span>{office.email}</span>
                                    </div>
                                </div>
                                <button className="mt-8 w-full py-4 rounded-2xl bg-brand-light font-bold flex items-center justify-center gap-2 group-hover:bg-brand-dark group-hover:text-white transition-colors">
                                    Показать на карте <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Departments & Form */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-16 mb-20">

                    {/* Departments List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl sm:text-4xl font-black mb-10 contact-card opacity-0">ДЕПАРТАМЕНТЫ</h2>
                        {departments.map((dep, i) => (
                            <div key={i} className="contact-card opacity-0 flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-3xl bg-white border border-white/50 shadow-md shadow-black/5 hover:border-brand-green/30 transition-colors">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green shrink-0">
                                    <dep.icon size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-base sm:text-lg truncate">{dep.title}</h4>
                                    <p className="text-gray-400 text-xs sm:text-sm truncate">{dep.email}</p>
                                    <p className="text-brand-dark font-mono text-xs sm:text-sm mt-1">{dep.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Form */}
                    <div className="contact-card opacity-0 bg-brand-dark text-white p-6 sm:p-10 md:p-14 rounded-[30px] sm:rounded-[40px] relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h2 className="text-[clamp(1.75rem,5vw,36px)] font-black mb-2 uppercase">Напишите нам</h2>
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
