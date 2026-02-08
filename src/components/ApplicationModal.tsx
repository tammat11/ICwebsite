import { X } from 'lucide-react';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    position?: string;
    category?: string;
}

const ApplicationModal = ({ isOpen, onClose, position }: ApplicationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-4xl font-black mb-2">Откликнуться</h2>
                {position && (
                    <p className="text-brand-green font-bold mb-6">{position}</p>
                )}

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Имя</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                            placeholder="Ваше имя"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Телефон</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                            placeholder="+7 (___) ___-__-__"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Резюме (опционально)</label>
                        <input
                            type="file"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Сопроводительное письмо</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none h-32"
                            placeholder="Расскажите о себе..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-green/90 transition-colors"
                    >
                        Отправить заявку
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
