import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { label: "Сотрудников в холдинге", value: 3000, suffix: "+" },
    { label: "Лет на рынке Казахстана", value: 12, suffix: "" },
    { label: "М² в ежедневном управлении", value: 1000000, suffix: "+" },
    { label: "Доля рынка в сегменте B2B", value: 40, suffix: "%" },
    { label: "Единиц спецтехники", value: 500, suffix: "+" },
    { label: "Филиалов по Казахстану", value: 17, suffix: "" },
    { label: "Корпоративных клиентов", value: 250, suffix: "+" },
    { label: "Retention Rate (Лояльность)", value: 98, suffix: "%" }
];

const StatsGrid = () => {
    const root = useRef<HTMLDivElement>(null);
    const graphRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".stat-reveal", { opacity: 0, scale: 0.9, y: 20 });

            gsap.to(".stat-reveal", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top 95%",
                    once: true
                },
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out"
            });

            // Technical background animation
            const paths = graphRef.current?.querySelectorAll('.bg-graph-line');
            if (paths) {
                gsap.set(paths, { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 0 });
                gsap.to(paths, {
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top 80%",
                        end: "bottom center",
                        scrub: 1
                    },
                    strokeDashoffset: 0,
                    opacity: 0.1,
                    stagger: 0.1,
                    duration: 2
                });
            }

            // Animated numbers
            const items = gsap.utils.toArray(".stat-number");
            items.forEach((item: any) => {
                const target = parseInt(item.getAttribute("data-target") || "0");
                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 95%",
                        once: true
                    },
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: "power1.inOut",
                    onUpdate: function () {
                        const val = parseInt(this.targets()[0].innerText);
                        this.targets()[0].innerText = val.toLocaleString();
                    }
                });
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="py-24 px-6 bg-brand-light relative overflow-hidden">
            {/* Embedded Technical Graph Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg ref={graphRef} viewBox="0 0 1000 400" className="w-full h-full" preserveAspectRatio="none">
                    <pattern id="grid-stats" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#83B643" strokeWidth="0.5" strokeOpacity="0.1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-stats)" />

                    <path className="bg-graph-line" d="M0,350 L200,300 L400,320 L600,200 L800,150 L1000,50" fill="none" stroke="#83B643" strokeWidth="1" strokeDasharray="5,5" />
                    <path className="bg-graph-line" d="M0,380 L300,320 L500,350 L700,180 L900,100 L1000,80" fill="none" stroke="#83B643" strokeWidth="1" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-reveal premium-card p-6 md:p-12 rounded-[40px] md:rounded-[50px] flex flex-col items-center text-center group hover:bg-brand-dark transition-all duration-500 bg-white/80 backdrop-blur-sm">
                        <div className={`${stat.value > 10000 ? 'text-2xl md:text-5xl' : 'text-4xl md:text-6xl'} font-black text-brand-dark group-hover:text-brand-green mb-4 md:mb-6 tracking-tighter transition-colors break-all md:break-normal`}>
                            <span className="stat-number" data-target={stat.value}>0</span>
                            {stat.suffix}
                        </div>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-brand-dark/30 group-hover:text-white/40 leading-tight transition-colors">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsGrid;
