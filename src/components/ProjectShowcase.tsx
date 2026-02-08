import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';

const ProjectShowcase = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");

        cards.forEach((card) => {
            const inner = card.querySelector(".project-inner");
            const image = card.querySelector("img");

            card.addEventListener("mousemove", (e: any) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xPercent = (x / rect.width - 0.5) * 20;
                const yPercent = (y / rect.height - 0.5) * 20;

                gsap.to(inner, {
                    x: xPercent,
                    y: yPercent,
                    duration: 0.6,
                    ease: "power2.out"
                });

                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.6
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(inner, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });
                gsap.to(image, {
                    scale: 1,
                    duration: 0.6
                });
            });
        });
    }, []);

    const projects = [
        { name: "SAMSUNG", area: "12,000 m²", type: "HQ", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" },
        { name: "AIR ASTANA", area: "8,500 m²", type: "Hangars", img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=2070&auto=format&fit=crop" },
        { name: "BI GROUP", area: "45,000 m²", type: "Residential", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop" },
        { name: "CASPI BANK", area: "5,000 m²", type: "Fintech Hub", img: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1974&auto=format&fit=crop" }
    ];

    return (
        <section ref={sectionRef} className="py-24 md:py-48 px-6 bg-brand-dark overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 flex flex-col items-center md:items-start">
                    <span className="text-brand-green text-[11px] font-black tracking-[0.4em] uppercase block mb-6">Portfolio</span>
                    <h2 className="text-[clamp(2.5rem,8vw,100px)] font-black tracking-tighter text-white leading-[0.85] uppercase text-center md:text-left">
                        ОБЪЕКТЫ <br /> <span className="text-brand-green italic">МАСШТАБА</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {projects.map((project, i) => (
                        <div key={i} className="project-card relative aspect-[16/10] md:aspect-[16/9] rounded-[40px] md:rounded-[60px] overflow-hidden cursor-none group">
                            <div className="project-inner w-full h-full relative">
                                <img
                                    src={project.img}
                                    alt={project.name}
                                    className="w-full h-full object-cover transition-transform duration-700 brightness-[0.6] group-hover:brightness-[0.8]"
                                />

                                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex items-end justify-between">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-brand-green text-[10px] font-black uppercase tracking-widest">{project.type}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{project.area}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">{project.name}</h3>
                                    </div>

                                    <div className="w-16 h-16 rounded-full bg-white text-brand-dark flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                                        <ArrowUpRight size={32} />
                                    </div>
                                </div>
                            </div>

                            {/* Overlay border on hover */}
                            <div className="absolute inset-0 border-2 border-brand-green/0 group-hover:border-brand-green/30 rounded-[40px] md:rounded-[60px] transition-colors pointer-events-none" />
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button className="group text-white/40 hover:text-white transition-colors flex items-center gap-4 mx-auto font-black uppercase tracking-[0.4em] text-[10px]">
                        Все завершенные проекты
                        <div className="w-12 h-px bg-white/10 group-hover:bg-brand-green group-hover:w-20 transition-all" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProjectShowcase;
