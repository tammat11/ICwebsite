import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    alwaysVisible?: boolean;
    onCalcOpen?: () => void;
}

const Navbar = ({ alwaysVisible = false, onCalcOpen }: NavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navRef.current?.classList.add('py-4');
                navRef.current?.firstElementChild?.classList.add('shadow-xl', 'bg-white/95');
            } else {
                navRef.current?.classList.remove('py-4');
                if (!alwaysVisible) {
                    navRef.current?.firstElementChild?.classList.remove('shadow-xl', 'bg-white/95');
                }
            }
        };

        if (alwaysVisible) {
            navRef.current?.firstElementChild?.classList.add('shadow-xl', 'bg-white/95');
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [alwaysVisible]);

    const navLinks = [
        { label: 'Услуги', to: '/services' },
        { label: 'Карьера', to: '/careers' },
        { label: 'Кейсы', to: '/#cases' },
        { label: 'Контакты', to: '/contacts' },
    ];

    return (
        <nav ref={navRef} className="fixed top-0 left-0 w-full z-[110] transition-all duration-500 px-4 md:px-6 py-6 md:py-8 font-sans">
            <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-3 md:py-4 rounded-full border border-black/5 backdrop-blur-md transition-all duration-500 ${alwaysVisible ? 'bg-white/95 shadow-xl' : ''}`}>
                <Link to="/" className="flex items-center gap-1 shrink-0">
                    <img src="/logo.png" alt="IC GROUP" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />
                </Link>

                {/* Navigation Links - Ultra-compact for mobile */}
                <div className="flex items-center gap-2 sm:gap-6 md:gap-10 text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.05em] sm:tracking-[0.3em] text-brand-dark/40 min-w-0">
                    {navLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="hover:text-brand-green transition-colors whitespace-nowrap">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-1 sm:gap-4 md:gap-6 shrink-0">
                    <span className="hidden lg:block text-[11px] font-black text-brand-dark">+7 (771) 780-08-41</span>
                    <button
                        onClick={onCalcOpen}
                        className="btn-premium !px-2 sm:!px-4 md:!px-6 !py-1.5 sm:!py-2 md:!py-2.5 !text-[7px] sm:!text-[9px] md:!text-[10px]"
                    >
                        {/* Short text for mobile */}
                        <span className="sm:hidden">$$</span>
                        <span className="hidden sm:inline">Расчет</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
