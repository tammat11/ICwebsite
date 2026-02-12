import { Instagram, Linkedin, ArrowUpRight, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-brand-dark text-white pt-16 md:pt-32 pb-8 md:pb-12 overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-24">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <span className="font-bold text-brand-green text-xl">ic</span>
                            </div>
                            <span className="text-2xl md:text-3xl font-bold tracking-tighter">IC GROUP</span>
                        </div>
                        <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-sm">
                            Инновационные решения в сфере Facility Management. Мы создаем стандарты чистоты и комфорта для вашего бизнеса.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-green hover:text-brand-dark hover:border-brand-green transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Компания</h4>
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
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Контакты</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <Phone className="mt-1 text-brand-green" size={20} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Горячая линия</p>
                                    <p className="text-xl font-medium">+7 (771) 780-08-41</p>
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
                <div className="border-t border-white/10 flex flex-col md:flex-row justify-center md:justify-end items-center gap-4 md:gap-8 py-8 md:py-12">
                    <button className="px-8 md:px-10 py-4 md:py-5 bg-brand-green rounded-full text-brand-dark font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 text-sm md:text-base w-full md:w-auto text-center">
                        Скачать презентацию
                        <ArrowUpRight size={20} />
                    </button>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs font-medium text-white/20 uppercase tracking-widest">
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
