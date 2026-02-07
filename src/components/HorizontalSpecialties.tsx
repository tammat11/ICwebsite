import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const specialties = [
    {
        title: "Retail & Malls",
        count: "01",
        desc: "Управление клинингом в крупнейших ТРЦ. Поддержание чистоты в зонах высокого трафика.",
        img: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Healthcare",
        count: "02",
        desc: "Специфическая уборка медицинских центров. Соблюдение всех санитарных норм и дезинфекция.",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Hospitality",
        count: "03",
        desc: "Сервисное обслуживание отелей мирового уровня. Безупречный стандарт 5 звезд.",
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Industry",
        count: "04",
        desc: "Клининг заводов и производственных цехов. Работа со сложным оборудованием.",
        img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
    }
];

const HorizontalSpecialties = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !triggerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(sectionRef.current, {
                x: "-300vw",
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${sectionRef.current?.offsetWidth}`,
                    invalidateOnRefresh: true,
                }
            });
        }, triggerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={triggerRef} id="sectors" className="overflow-hidden bg-brand-dark">
            <div ref={sectionRef} className="flex h-screen w-[400vw] items-center relative">
                {specialties.map((item, i) => (
                    <div key={i} className="h-screen w-screen flex-shrink-0 flex items-center justify-center px-6 md:px-20 relative overflow-hidden group">
                        {/* Background Image Parallax in card */}
                        <div className="absolute inset-0 -z-10 bg-black">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-[2000ms]"
                            />
                        </div>

                        <div className="max-w-7xl w-full grid md:grid-cols-2 items-center gap-20">
                            <div className="text-white">
                                <span className="text-brand-green text-8xl md:text-[200px] font-black opacity-20 block leading-none mb-10 tracking-tighter">
                                    {item.count}
                                </span>
                                <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
                                    {item.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-white/50 max-w-lg leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                                <button className="mt-12 btn-premium !bg-white !text-brand-dark hover:!bg-brand-green hover:!text-white border-none shadow-xl">
                                    Explore Industry
                                </button>
                            </div>

                            <div className="hidden md:block relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 group-hover:border-brand-green/30 transition-colors">
                                <img src={item.img} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalSpecialties;
