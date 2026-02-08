import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Send } from 'lucide-react';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string; // 'Office' or 'Production'
}

const ApplicationModal = ({ isOpen, onClose, category }: ApplicationModalProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            gsap.set(overlayRef.current, { display: 'flex' });
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
            gsap.fromTo(modalRef.current,
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
            );
        } else {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    gsap.set(overlayRef.current, { display: 'none' });
                }
            });
        }
    }, [isOpen]);


    return (
        <div ref={overlayRef} className="fixed inset-0 z-[100] bg-brand-dark/60 backdrop-blur-md hidden items-center justify-center p-4">
            <div ref={modalRef} className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-lg relative shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors">
                    <X size={24} className="text-brand-dark" />
                </button>

                <h3 className="text-3xl font-black tracking-tight text-brand-dark mb-2">
                    {category === 'Office' ? 'Отправить резюме' : 'Анкета кандидата'}
                </h3>
                <p className="text-brand-dark/40 font-medium mb-8">
                    {category === 'Office'
                        ? 'Присоединяйтесь к команде профессионалов офиса.'
                        : 'Заполните данные для работы на производстве.'}
                </p>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Спасибо! Ваша заявка отправлена.'); onClose(); }}>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/30 mb-2">ФИО</label>
                        <input type="text" className="w-full bg-brand-light border-none rounded-xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-green/20 outline-none" placeholder="Иван Иванов" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/30 mb-2">Телефон</label>
                        <input type="tel" className="w-full bg-brand-light border-none rounded-xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-green/20 outline-none" placeholder="+7 (700) 000-00-00" />
                    </div>

                    {category === 'Office' && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/30 mb-2">Ссылка на резюме / LinkedIn</label>
                            <input type="text" className="w-full bg-brand-light border-none rounded-xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-green/20 outline-none" placeholder="hh.kz/..." />
                        </div>
                    )}

                    <button type="submit" className="btn-premium w-full flex items-center justify-center gap-3 mt-4">
                        Отправить <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
