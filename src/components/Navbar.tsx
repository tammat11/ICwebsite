import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    alwaysVisible?: boolean;
    onCalcOpen?: () => void;
}

const Navbar = ({ alwaysVisible = false, onCalcOpen }: NavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

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

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const navLinks = [
        { label: 'Услуги', to: '/services' },
        { label: 'Карьера', to: '/careers' },
        { label: 'Новости', to: '/news' },
        { label: 'Контакты', to: '/contacts' },
    ];

    return (
        <>
            <nav ref={navRef} className="fixed top-0 left-0 w-full z-[110] transition-all duration-500 px-4 md:px-6 py-4 font-sans">
                <div className={`max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 rounded-full border border-black/5 backdrop-blur-md transition-all duration-500 ${alwaysVisible ? 'bg-white/95 shadow-xl' : ''}`}>
                    <Link to="/" className="flex items-center gap-1 shrink-0">
                        <img src="/logo.png" alt="IC GROUP" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>

                    {/* Main Nav Items (Always visible now) */}
                    <div className="flex items-center gap-2 md:gap-4 lg:gap-10 text-[7px] min-[375px]:text-[8px] md:text-[9px] lg:text-[11px] font-black uppercase tracking-tight min-[375px]:tracking-widest text-brand-dark/40 min-w-0">
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} className="hover:text-brand-green transition-colors whitespace-nowrap">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-2 md:gap-6 shrink-0">
                        <span className="hidden lg:inline text-[11px] font-black text-brand-dark">+7 (771) 780-08-41</span>
                        <button
                            onClick={onCalcOpen}
                            className="btn-premium !px-3 md:!px-6 !py-1.5 md:!py-2.5 !text-[7px] min-[375px]:!text-[9px] md:!text-[10px] min-w-fit"
                        >
                            Расчет
                        </button>
                        {/* Burger only for very narrow screens or as a backup */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-brand-dark lg:hidden"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile overlay menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-[105] bg-white/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 lg:hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className="text-3xl font-black uppercase tracking-tight text-brand-dark hover:text-brand-green transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a href="tel:+77717800841" className="mt-8 text-lg font-black text-brand-dark">
                        +7 (771) 780-08-41
                    </a>
                </div>
            )}
        </>
    );
};

export default Navbar;
