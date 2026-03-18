import { useState } from 'react';
import { X } from 'lucide-react';
import { createBitrixLead } from '../utils/bitrix';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    position?: string;
    category?: string;
}

const ApplicationModal = ({ isOpen, onClose, position, category }: ApplicationModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || phone.length < 10) {
            alert('Пожалуйста, заполните Имя и корректный Телефон (минимум 10 цифр)');
            return;
        }

        setIsSubmitting(true);
        try {
            await createBitrixLead({
                title: `Отклик: ${category || 'Общий'} - ${position || 'Без позиции'}`,
                name: name,
                email: email,
                phone: phone,
                comments: `Категория: ${category}\nПозиция: ${position}\n\nСообщение: ${message}`,
            });

            alert('Заявка успешно отправлена!');
            onClose();
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
        } catch (error) {
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Имя *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                            placeholder="Ваше имя"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Телефон *</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^\d+]/g, '');
                                if (val.length <= 12) setPhone(val);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none font-bold"
                            placeholder="+77XXXXXXXXX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Сопроводительное письмо</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none h-32"
                            placeholder="Расскажите о себе..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-green/90 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
