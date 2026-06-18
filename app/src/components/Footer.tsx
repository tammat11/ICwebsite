import { Instagram, Linkedin, ArrowUpRight, Facebook, MapPin, Phone, GraduationCap, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-8 md:mb-24">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-2 space-y-4 md:space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <img
                                    src="/logo_IC_group.png"
                                    alt="IC GROUP вЂ” РєСЂСѓРїРЅРµР№С€Р°СЏ РєР»РёРЅРёРЅРіРѕРІР°СЏ РєРѕРјРїР°РЅРёСЏ РІ РљР°Р·Р°С…СЃС‚Р°РЅРµ"
                                    className="h-6 md:h-7 w-auto object-contain"
                                    loading="lazy"
                                />
                            </div>
                            <span className="text-xl md:text-3xl font-bold tracking-tighter">IC GROUP</span>
                        </div>
                        <p className="text-white/40 text-sm md:text-lg leading-relaxed max-w-sm">
                            РњС‹ РїСЂРµРґРѕСЃС‚Р°РІР»СЏРµРј С€РёСЂРѕРєРёР№ СЃРїРµРєС‚СЂ СѓСЃР»СѓРі РѕС‚ РµР¶РµРґРЅРµРІРЅРѕР№ СѓР±РѕСЂРєРё РґРѕ РїСЂРѕРёР·РІРѕРґСЃС‚РІР° С‡РёСЃС‚СЏС‰РёС… СЃСЂРµРґСЃС‚РІ. РњС‹ РїРѕРјРѕР¶РµРј РІР°Рј РїРѕРґРѕР±СЂР°С‚СЊ РєРѕРјРїР»РµРєСЃ СѓСЃР»СѓРі, РѕС‚РІРµС‡Р°СЋС‰РёР№ РІСЃРµРј РїРѕР¶РµР»Р°РЅРёСЏРј Рё РЅСѓР¶РґР°Рј РІР°С€РµР№ РєРѕРјРїР°РЅРёРё.
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
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">РљРѕРЅС‚Р°РєС‚С‹</h4>
                        <ul className="space-y-5 md:space-y-6">
                            <li className="flex items-start gap-4">
                                <Phone className="mt-1 text-brand-green" size={18} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">РџСЂРѕРґР°Р¶Рё</p>
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
                                <MapPin className="mt-1 text-brand-green" size={18} />
                                <div>
                                    <p className="text-white/40 text-sm mb-1">Р“Р»Р°РІРЅС‹Р№ РѕС„РёСЃ</p>
                                    <p className="text-white/80 leading-snug text-sm md:text-base">Алматы, Ауэзовский район,<br />8-й микрорайон, 55а,<br />050006, Казахстан</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Employees / Resources */}
                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">РЎРѕС‚СЂСѓРґРЅРёРєР°Рј</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link 
                                    to="/training/sanitary" 
                                    className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-green group-hover:text-brand-dark transition-all">
                                        <GraduationCap size={16} />
                                    </div>
                                    <span className="text-sm font-medium">РћР±СѓС‡Р°СЋС‰РёРµ РєСѓСЂСЃС‹</span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/careers" 
                                    className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-green group-hover:text-brand-dark transition-all">
                                        <ArrowUpRight size={16} />
                                    </div>
                                    <span className="text-sm font-medium">Р’Р°РєР°РЅСЃРёРё</span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/interview" 
                                    className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-green group-hover:text-brand-dark transition-all">
                                        <FileText size={16} />
                                    </div>
                                    <span className="text-sm font-medium">РђРЅРєРµС‚Р° РєР°РЅРґРёРґР°С‚Р°</span>
                                </Link>
                            </li>
                        </ul>

                        <div className="pt-4">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green mb-4">РџРѕРїСѓР»СЏСЂРЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/klining-ofisov" className="text-sm text-white/60 hover:text-white transition-colors">
                                        РљР»РёРЅРёРЅРі РѕС„РёСЃРѕРІ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/kliningovaya-kompaniya-almaty" className="text-sm text-white/60 hover:text-white transition-colors">
                                        РљР»РёРЅРёРЅРіРѕРІР°СЏ РєРѕРјРїР°РЅРёСЏ РІ РђР»РјР°С‚С‹
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/kliningovaya-kompaniya-astana" className="text-sm text-white/60 hover:text-white transition-colors">
                                        РљР»РёРЅРёРЅРіРѕРІР°СЏ РєРѕРјРїР°РЅРёСЏ РІ РђСЃС‚Р°РЅРµ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/generalnaya-uborka" className="text-sm text-white/60 hover:text-white transition-colors">
                                        Р“РµРЅРµСЂР°Р»СЊРЅР°СЏ СѓР±РѕСЂРєР°
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/poslestroitelnaya-uborka" className="text-sm text-white/60 hover:text-white transition-colors">
                                        РџРѕСЃР»РµСЃС‚СЂРѕРёС‚РµР»СЊРЅР°СЏ СѓР±РѕСЂРєР°
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/moyka-vitrazhey" className="text-sm text-white/60 hover:text-white transition-colors">
                                        РњРѕР№РєР° РІРёС‚СЂР°Р¶РµР№
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Big Footer CTA */}
                <div className="border-t border-white/10 flex flex-col md:flex-row justify-center md:justify-end items-center gap-3 md:gap-8 py-6 md:py-12">
                    <button
                        onClick={onCalcOpen}
                        className="px-7 md:px-10 py-3.5 md:py-5 bg-brand-green rounded-full text-brand-dark font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 text-[13px] md:text-base w-full md:w-auto text-center"
                    >
                        РћРЎРўРђР’РРўР¬ Р—РђРЇР’РљРЈ
                        <ArrowUpRight size={20} />
                    </button>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left text-[10px] md:text-xs font-medium text-white/20 uppercase tracking-widest">
                    <p>В© 2026 IC Group Holding. Р’СЃРµ РїСЂР°РІР° Р·Р°С‰РёС‰РµРЅС‹.</p>
                    <div className="flex gap-8">
                        <a href="/sitemap.xml" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">РљР°СЂС‚Р° СЃР°Р№С‚Р°</a>
                        <a href="#" className="hover:text-white transition-colors">РџРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</a>
                        <a href="#" className="hover:text-white transition-colors">РЈСЃР»РѕРІРёСЏ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
