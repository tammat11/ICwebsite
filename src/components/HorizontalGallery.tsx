import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slides = [
    {
        id: "01",
        title: "Marriott Hotel",
        category: "Hospitality Gold",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
    },
    {
        id: "02",
        title: "Nur-Sultan Tower",
        category: "Class A Office",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
    },
    {
        id: "03",
        title: "Air Astana Hangar",
        category: "Industrial Tech",
        image: "https://images.unsplash.com/photo-1517056636735-a6e5b95a04eb?auto=format&fit=crop&q=80&w=2000"
    }
];

const HorizontalGallery = () => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const pin = gsap.context(() => {
            const sections = gsap.utils.toArray(".gallery-item");

            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (sections.length - 1),
                    end: () => "+=" + (sectionRef.current?.offsetWidth || window.innerWidth * sections.length),
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });
        }, triggerRef);

        return () => pin.revert();
    }, []);

    return (
        <section ref={triggerRef} className="gallery-container overflow-hidden bg-brand-dark">
            <div ref={sectionRef} className="flex flex-nowrap h-screen" style={{ width: `${slides.length * 100}%` }}>
                {slides.map((slide, i) => (
                    <div key={i} className="gallery-item w-screen h-screen relative flex items-center justify-center overflow-hidden flex-shrink-0">
                        {/* Background Image with Parallax Scale effect */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover opacity-60 scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>

                        <div className="relative z-10 text-center text-white p-6 max-w-4xl mix-blend-diff opacity-90 drop-shadow-2xl">
                            <div className="overflow-hidden mb-6">
                                <span className="text-brand-green font-black tracking-[0.4em] uppercase text-sm md:text-base block mb-2">
                                    {slide.category}
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-[100px] font-black tracking-tighter leading-none mb-4 mix-blend-overlay">
                                {slide.title}
                            </h2>
                            <div className="w-20 h-1 bg-brand-green mx-auto my-8 opacity-80" />
                            <div className="absolute bottom-12 left-12 md:left-20 text-[20vw] font-black text-white/10 leading-none pointer-events-none select-none">
                                {slide.id}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HorizontalGallery;
