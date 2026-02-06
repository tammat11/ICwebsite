import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
        );

        const handleScroll = () => {
            if (window.scrollY > 50) {
                navRef.current?.classList.add('py-4');
                navRef.current?.firstElementChild?.classList.add('shadow-xl', 'bg-white/95');
            } else {
                navRef.current?.classList.remove('py-4');
                navRef.current?.firstElementChild?.classList.remove('shadow-xl', 'bg-white/95');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav ref={navRef} className="fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 rounded-full border border-black/5 backdrop-blur-md transition-all duration-500">
                <Link to="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="IC GROUP" className="h-10 w-auto object-contain" />
                </Link>

                <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40">
                    <Link to="/services" className="hover:text-brand-green transition-colors">
                        Услуги
                    </Link>
                    <a href="#sectors" className="hover:text-brand-green transition-colors">
                        Sectors
                    </a>
                    <a href="#network" className="hover:text-brand-green transition-colors">
                        Network
                    </a>
                </div>

                <div className="flex items-center gap-6">
                    <span className="hidden sm:block text-[11px] font-black text-brand-dark">+7 (771) 780-08-41</span>
                    <button className="btn-premium !px-6 !py-2.5 !text-[10px]">
                        Estimate
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
