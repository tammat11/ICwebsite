import { Instagram, Linkedin, ArrowUpRight, Facebook, MapPin, Phone } from 'lucide-react';

interface FooterProps {
    onCalcOpen?: () => void;
}

const Footer = ({ onCalcOpen }: FooterProps) => {
    return (
        <footer className="relative bg-brand-dark text-white pt-10 md:pt-32 pb-5 md:pb-12 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-64 bg-brand-green/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Huge Background Typography */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-0 opacity-[0.03] select-none">
                <span className="text-[24vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap mix-blend-overlay">IC GROUP</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-16 mb-8 md:mb-24">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-2 space-y-4 md:space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <img
                                    src="/logo_IC_group.png"
                                    alt="IC GROUP"
                                    className="h-6 md:h-7 w-auto object-contain"
                                />
                            </div>
                            <span className="text-xl md:text-3xl font-bold tracking-tighter">IC GROUP</span>
                        </div>
                        <p className="text-white/40 text-sm md:text-lg leading-relaxed max-w-sm">
                            Мы предоставляем широкий спектр услуг от ежедневной уборки до производства чистящих средств. Мы поможем вам подобрать комплекс услуг, отвечающий всем пожеланиям и нуждам вашей компании.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { Icon: Instagram, href: "https://www.instagram.com/icgroup.kz/?__pwa=1", label: "Instagram" },
                                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                                { Icon: Facebook, href: "#", label: "Facebook" }
                            ].map((social, i) => (
                                <a key={i} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-green hover:text-brand-dark hover:border-brand-green transition-all duration-300">
                                    <social.Icon size={18} className="md:w-5 md:h-5" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Контакты</h4>
                        <ul className="space-y-5 md:space-y-6">
                            <li className="flex items-start gap-4">
                                <Phone className="mt-1 text-brand-green" size={18} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Продажи</p>
                                    <a href="tel:+77770087360" className="text-lg md:text-xl font-medium hover:text-brand-green transition-colors">+7 777 008 73 60</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Phone className="mt-1 text-brand-green" size={18} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">HR</p>
                                    <a href="tel:+77717802366" className="text-base md:text-lg font-medium hover:text-brand-green transition-colors">+7 771 780 2366</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Phone className="mt-1 text-brand-green" size={18} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Тендерный отдел</p>
                                    <a href="tel:+77078083003" className="text-base md:text-lg font-medium hover:text-brand-green transition-colors">+7 707 808 3003</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <MapPin className="mt-1 text-brand-green" size={18} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Главный офис</p>
                                    <p className="text-white/80 leading-snug text-sm md:text-base">Алматы, ул. Натарова, 12,<br />050016, Казахстан</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Big Footer CTA */}
                <div className="border-t border-white/10 flex flex-col md:flex-row justify-center md:justify-end items-center gap-3 md:gap-8 py-6 md:py-12">
                    <button
                        onClick={onCalcOpen}
                        className="px-7 md:px-10 py-3.5 md:py-5 bg-brand-green rounded-full text-brand-dark font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 text-[13px] md:text-base w-full md:w-auto text-center"
                    >
                        ОСТАВИТЬ ЗАЯВКУ
                        <ArrowUpRight size={20} />
                    </button>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left text-[10px] md:text-xs font-medium text-white/20 uppercase tracking-widest">
                    <p>© 2026 IC Group Holding. Все права защищены.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                        <a href="#" className="hover:text-white transition-colors">Условия использования</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
