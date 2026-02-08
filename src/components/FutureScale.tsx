import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Zap, Globe, Cpu, Network, BarChart3, Leaf, ShieldCheck, Wifi, Database } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FutureScale = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Orbit Rotation
            gsap.to(".orbit-cw", { rotation: 360, duration: 60, repeat: -1, ease: "none" });
            gsap.to(".orbit-ccw", { rotation: -360, duration: 45, repeat: -1, ease: "none" });

            // Title Reveal
            gsap.from(".vision-text", {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%"
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden min-h-screen flex flex-col items-center justify-center">

            {/* Background Minimal Grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#00C853 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full mb-6 border border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Roadmap 2030</span>
                </div>
                <h2 className="vision-text text-[clamp(4rem,10vw,160px)] font-black leading-[0.8] tracking-tighter uppercase text-brand-dark mb-6">
                    Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-teal-400">Vision</span>
                </h2>
                <p className="vision-text text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                    Integrating AI, Robotics & Sustainability into the DNA of Facility Management.
                </p>
            </div>

            {/* Clean Solar System */}
            <div className="relative w-[340px] h-[340px] md:w-[600px] md:h-[600px] flex items-center justify-center">

                {/* Core */}
                <div className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-white shadow-2xl flex items-center justify-center z-20 border border-gray-100">
                    <div className="text-center">
                        <div className="text-4xl font-black text-brand-dark">2030</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-green">Singularity</div>
                    </div>
                </div>

                {/* Orbit 1 */}
                <div className="orbit-ccw absolute w-[240px] h-[240px] md:w-[400px] md:h-[400px] rounded-full border border-dashed border-gray-200">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-green border border-gray-50 hover:scale-125 transition-transform duration-300 cursor-pointer">
                        <Bot size={20} />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-green border border-gray-50 hover:scale-125 transition-transform duration-300 cursor-pointer">
                        <Leaf size={20} />
                    </div>
                </div>

                {/* Orbit 2 */}
                <div className="orbit-cw absolute w-[340px] h-[340px] md:w-[600px] md:h-[600px] rounded-full border border-gray-100">
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-blue-500 border border-gray-50 hover:scale-125 transition-transform duration-300 cursor-pointer">
                        <Globe size={24} />
                    </div>
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-purple-500 border border-gray-50 hover:scale-125 transition-transform duration-300 cursor-pointer">
                        <Cpu size={24} />
                    </div>
                    <div className="absolute bottom-[14%] right-[14%] w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-orange-500 border border-gray-50 hover:scale-125 transition-transform duration-300 cursor-pointer">
                        <Database size={18} />
                    </div>
                </div>

            </div>

        </section>
    );
};

export default FutureScale;
