import { Instagram, Linkedin, ArrowUpRight, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-brand-dark text-white pt-32 pb-12 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <span className="font-black text-brand-green text-xl">ic</span>
                            </div>
                            <span className="text-3xl font-black tracking-tighter">IC GROUP</span>
                        </div>
                        <p className="text-white/40 text-lg leading-relaxed max-w-sm">
                            Инновационные решения в сфере Facility Management. Мы создаем стандарты чистоты и комфорта для вашего бизнеса.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-green hover:text-brand-dark hover:border-brand-green transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-green">Компания</h4>
                        <ul className="space-y-4">
                            {['О нас', 'Услуги', 'Проекты', 'Карьера', 'Контакты'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                                        <div className="w-1 h-1 bg-brand-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-green">Контакты</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <Phone className="mt-1 text-brand-green" size={20} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Горячая линия</p>
                                    <p className="text-xl font-bold">+7 (771) 780-08-41</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Mail className="mt-1 text-brand-green" size={20} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Email</p>
                                    <p className="text-lg font-medium">office@ic-group.kz</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <MapPin className="mt-1 text-brand-green" size={20} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Главный офис</p>
                                    <p className="text-white/80 leading-snug">Казахстан, г. Астана,<br />ул. Достык 18, БЦ "Москва"</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Big Footer CTA (Visual element) */}
                <div className="border-t border-white/10 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <h2 className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-white/5 leading-none select-none pointer-events-none">
                        IC GROUP
                    </h2>
                    <button className="px-10 py-5 bg-brand-green rounded-full text-brand-dark font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                        Скачать презентацию
                        <ArrowUpRight size={20} />
                    </button>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-white/20 uppercase tracking-widest">
                    <p>© 2026 IC Group Holding. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
