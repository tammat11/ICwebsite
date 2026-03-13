import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
    alwaysVisible?: boolean;
    onCalcOpen?: () => void;
}

const Navbar = ({ alwaysVisible = false, onCalcOpen }: NavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(alwaysVisible);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [logoVisible, setLogoVisible] = useState(!isHomePage || alwaysVisible);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(alwaysVisible || isScrolled);

            if (isHomePage) {
                setLogoVisible(window.scrollY > 100 || alwaysVisible);
            } else {
                setLogoVisible(true);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [alwaysVisible, isHomePage]);

    const navLinks = [
        { label: 'Услуги', to: '/services' },
        { label: 'Карьера', to: '/careers' },
        { label: 'Новости', to: '/news' },
        { label: 'Контакты', to: '/contacts' },
    ];

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 w-full z-[110] transition-all duration-700 ease-expo px-2 md:px-6 
                ${scrolled ? 'py-2 md:py-5' : 'py-3 md:py-8'}`}
            >
                <div
                    className={`max-w-5xl mx-auto flex items-center gap-0.5 md:gap-4 px-2 md:px-6 py-1.5 md:py-5 
                    rounded-full border transition-all duration-700 ease-expo backdrop-blur-xl relative
                    ${scrolled
                            ? 'bg-white/80 border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
                            : 'bg-white/40 border-black/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.02)]'
                        }`}
                >
                    {/* Background Inner Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

                    {/* Left: Logo & Status */}
                    <div className="flex items-center gap-3 md:gap-4 relative z-10 flex-shrink-0">
                        <Link
                            to="/"
                            className={`flex items-center gap-1 md:gap-2 shrink-0 transition-all duration-500 transform
                            ${logoVisible ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 -translate-x-4 pointer-events-none'}`}
                        >
                            <img src="/logo_IC_group.png" alt="IC GROUP" className="h-5 md:h-9 w-auto object-contain filter saturate-[1.1]" />
                        </Link>
                    </div>

                    {/* Middle: Main Nav (visible on all breakpoints) */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-0 md:gap-2 lg:gap-4 px-0.5 py-0.5 md:px-1.5 md:py-1 bg-black/[0.03] rounded-full relative z-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`relative flex items-center justify-center px-1.5 md:px-4 py-1 md:py-2 rounded-full text-[7.5px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-widest transition-all duration-500
                                ${location.pathname === link.to
                                        ? 'text-white bg-black shadow-lg scale-105'
                                        : 'text-brand-dark/50 hover:text-brand-dark hover:bg-white/50'
                                    }`}
                            >
                                <span className="pt-[1.5px] leading-none">{link.label}</span>
                            </Link>
                        ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 md:gap-4 relative z-10 flex-shrink-0">
                        <a
                            href="tel:+77717656353"
                            className={`hidden xl:flex items-center gap-2 group transition-all duration-500
                            ${scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none width-0'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <span className="text-[11px] font-black text-brand-dark">+7 771 765 6353</span>
                        </a>

                        <button
                            onClick={onCalcOpen}
                            className={`relative flex items-center justify-center px-1.5 md:px-4 py-1 md:py-2 rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_15px_30px_rgba(162,192,55,0.3)]
                            ${scrolled ? 'bg-brand-green text-white' : 'bg-brand-dark text-white'}`}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 text-[7.5px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-widest leading-none pt-[1.5px]">
                                Заявка
                            </span>
                        </button>

                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
