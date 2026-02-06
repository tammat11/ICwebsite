import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Activity, Box } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: "Eco Technologies",
        desc: "100% биоразлагаемые средства. Мы заботимся о здоровье ваших сотрудников и экологии города.",
        icon: <Search className="text-brand-green" />,
        size: "col-span-1"
    },
    {
        title: "AI Quality Control",
        desc: "Автоматизированная система мониторинга. Отчетность в режиме реального времени через Client Portal.",
        icon: <Activity className="text-brand-green" />,
        size: "col-span-1"
    },
    {
        title: "Scalable Infrastructure",
        desc: "Более 3000 специалистов и собственная логистическая база. Решаем задачи любой сложности в режиме 24/7.",
        icon: <Box className="text-brand-green" />,
        size: "md:col-span-2"
    }
];

const BentoSection = () => {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // High reliability entry animation
            gsap.set(".bento-item", { opacity: 0, y: 30 });

            gsap.to(".bento-item", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top 90%",
                    once: true
                },
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: "power2.out"
            });

            // Mouse-move parallax (simplified)
            const items = gsap.utils.toArray(".bento-item") as HTMLElement[];
            items.forEach((item) => {
                const content = item.querySelector(".bento-content");
                item.addEventListener("mousemove", (e) => {
                    const rect = item.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;

                    gsap.to(content, {
                        x: x * 10,
                        y: y * 10,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });

                item.addEventListener("mouseleave", () => {
                    gsap.to(content, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                });
            });
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={root} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-0">
            {features.map((f, i) => (
                <div key={i} className={`bento-item ${f.size} premium-card rounded-[40px] overflow-hidden group border border-brand-green/10 hover:border-brand-green/30 transition-all`}>
                    <div className="bento-content p-10 h-full flex flex-col justify-between">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-brand-dark/5 group-hover:scale-110 transition-transform duration-500">
                            {f.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black mb-3 tracking-tight text-brand-dark">{f.title}</h3>
                            <p className="text-brand-dark/50 font-medium leading-relaxed text-sm md:text-base">{f.desc}</p>
                        </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
            ))}
        </div>
    );
};

export default BentoSection;
