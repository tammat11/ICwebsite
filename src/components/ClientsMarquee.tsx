import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const clients = [
    { name: "Magnum", domain: "magnum.kz" },
    { name: "Kaspi Bank", domain: "kaspi.kz" },
    { name: "Forte Bank", domain: "forte.kz" },
    { name: "Technodom", domain: "technodom.kz" },
    { name: "H&M", domain: "hm.com" },
    { name: "Bank RBK", domain: "bankrbk.kz" },
    { name: "Home Credit", domain: "homecredit.kz" },
    { name: "Eurasian Bank", domain: "eubank.kz" },
    { name: "JTI", domain: "jti.com" },
    { name: "Defacto", domain: "defacto.com.tr" },
    { name: "LPP", domain: "lpp.com" },
    { name: "KOTON", domain: "koton.com" },
    { name: "Air Astana", domain: "airastana.com" },
    { name: "Samsung", domain: "samsung.com" },
];

const ClientsMarquee = () => {
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        if (!marquee) return;

        const totalWidth = marquee.scrollWidth / 3;

        const anim = gsap.to(marquee, {
            x: -totalWidth,
            duration: 40,
            repeat: -1,
            ease: "none"
        });

        return () => {
            anim.kill();
        };
    }, []);

    return (
        <section className="py-20 bg-white border-y border-black/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-dark/30 whitespace-nowrap">Наши ключевые партнеры</span>
                    <div className="h-px w-full bg-black/5" />
                </div>
            </div>

            <div className="relative">
                <div ref={marqueeRef} className="flex whitespace-nowrap gap-24 items-center w-max">
                    {[1, 2, 3].map((set) => (
                        <div key={set} className="flex items-center gap-24">
                            {clients.map((client, i) => (
                                <div
                                    key={`${set}-${i}`}
                                    className="flex flex-col items-center gap-4 group cursor-default"
                                >
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border border-black/5 flex items-center justify-center p-6 transition-all duration-500 group-hover:border-brand-green/30 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] group-hover:-translate-y-2 relative overflow-hidden">
                                        <img
                                            src={`https://logo.clearbit.com/${client.domain}`}
                                            alt={client.name}
                                            className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                // Fallback to Google Favicon if Clearbit fails
                                                if (!target.src.includes('google.com')) {
                                                    target.src = `https://www.google.com/s2/favicons?sz=128&domain=${client.domain}`;
                                                } else {
                                                    // Ultimate fallback: Initials
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                                                        parent.innerHTML = `<span class="text-xl font-black text-brand-dark/20">${initials}</span>`;
                                                    }
                                                }
                                            }}
                                        />
                                        {/* Background gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/20 group-hover:text-brand-green transition-colors duration-500">
                                        {client.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Visual fading for seamless loop edges */}
                <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
                <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />
            </div>
        </section>
    );
};

export default ClientsMarquee;
