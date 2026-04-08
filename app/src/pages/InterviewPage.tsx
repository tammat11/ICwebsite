import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CloudUpload, FileText, X } from 'lucide-react';
import { createHrCandidate } from '../utils/bitrix';
import { formatPhone } from '../utils/phone';
import SeoHead from '../components/SeoHead';

const InterviewPage = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!firstName || !lastName || !phone || files.length === 0) {
            alert('Пожалуйста, заполните все обязательные поля и прикрепите резюме');
            return;
        }

        setIsSubmitting(true);
        try {
            // We'll use the first file for createHrCandidate for now
            // But we can update createHrCandidate to handle multiple if needed.
            // For now, let's just make it work with the first file but keep the UI supporting multiple.
            const file = files[0];
            
            await createHrCandidate({
                firstName,
                lastName,
                phone,
                resumeFile: file
            });

            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Submit error:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-6 py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-green animate-progress" />
                <div className="max-w-md w-full bg-white rounded-[48px] p-12 shadow-[0_32px_80px_rgba(0,0,0,0.06)] text-center border border-black/[0.03] relative z-10 transition-all">
                    <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-10 text-brand-green animate-bounce-subtle">
                        <CheckCircle2 size={56} />
                    </div>
                    <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter leading-none">Успешно!</h1>
                    <p className="text-brand-dark/50 font-medium mb-12 text-balance">Ваша анкета уже в HR-отделе. Мы свяжемся с вами в ближайшее время.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-brand-dark text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-green hover:shadow-xl hover:shadow-brand-green/20 transition-all duration-300"
                    >
                        Вернуться на главную
                    </button>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-brand-green/5 rounded-full blur-[100px]" />
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-green/5 rounded-full blur-[100px]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] selection:bg-brand-green/20 font-sans">
            <SeoHead 
                title="Присоединяйтесь к команде | IC Group"
                description="Отправьте резюме для работы в офисе IC Group. Мы ищем талантливых специалистов."
                path="/interview"
            />
            
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-32">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="mb-10 opacity-40 hover:opacity-100 transition-opacity">
                        <img src="/logo_IC_group.png" alt="IC Group" className="h-8 md:h-10 w-auto object-contain grayscale" />
                    </div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-brand-dark/30 hover:text-brand-green transition-all font-black uppercase tracking-[0.3em] text-[10px] mb-12 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Назад
                    </button>

                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Карьера в офисе
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-brand-dark uppercase leading-[0.9] mb-8 max-w-2xl text-balance">
                        Станьте <span className="text-brand-green">частью</span> команды
                    </h1>
                    <p className="text-lg md:text-xl text-brand-dark/40 font-medium leading-relaxed max-w-xl">
                        Мы не просто клининговая компания, мы технологичный лидер рынка. Ищем тех, кто готов менять индустрию вместе с нами.
                    </p>
                </div>

                <div className="relative">
                    {/* Decorative blurs */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="bg-white rounded-[56px] p-8 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-black/[0.03] relative z-10 transition-all">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark/30 ml-2">Имя *</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-8 py-5 rounded-2xl bg-[#f9fafb] border-2 border-transparent focus:border-brand-green focus:bg-white focus:outline-none transition-all font-bold placeholder:text-brand-dark/15 text-brand-dark shadow-inner text-lg"
                                    placeholder="Алексей"
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark/30 ml-2">Фамилия *</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-8 py-5 rounded-2xl bg-[#f9fafb] border-2 border-transparent focus:border-brand-green focus:bg-white focus:outline-none transition-all font-bold placeholder:text-brand-dark/15 text-brand-dark shadow-inner text-lg"
                                    placeholder="Иванов"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark/30 ml-2">Номер телефона *</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    className="w-full px-8 py-5 rounded-2xl bg-[#f9fafb] border-2 border-transparent focus:border-brand-green focus:bg-white focus:outline-none transition-all font-bold placeholder:text-brand-dark/15 text-brand-dark shadow-inner text-lg"
                                    placeholder="+7 (777) 000 00 00"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark/30 ml-2">Ваше резюме *</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept=".pdf,.doc,.docx"
                                        aria-label="Загрузить резюме"
                                        title="Загрузить резюме"
                                    />
                                    <div className="p-12 border-2 border-dashed border-black/5 rounded-[40px] bg-[#fdfdfd] text-center group-hover:border-brand-green group-hover:bg-brand-green/[0.01] transition-all duration-500">
                                        <div className="w-20 h-20 bg-brand-green/5 text-brand-green rounded-[28px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            <CloudUpload size={40} />
                                        </div>
                                        <h3 className="font-black text-xl mb-2 text-brand-dark uppercase tracking-tight">Выберите файл</h3>
                                        <p className="text-brand-dark/30 text-sm font-medium">Перетащите сюда PDF или DOCX до 10 МБ</p>
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-5 bg-black/[0.02] rounded-3xl border border-black/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white text-brand-green rounded-2xl flex items-center justify-center shadow-sm">
                                                        <FileText size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-brand-dark uppercase tracking-tight">{file.name}</p>
                                                        <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="w-10 h-10 rounded-full bg-white text-red-400 flex items-center justify-center shadow-sm hover:text-red-600 hover:shadow-md transition-all"
                                                    aria-label="Удалить файл"
                                                    title="Удалить файл"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-brand-dark text-white py-8 rounded-[28px] font-black uppercase tracking-[0.3em] text-sm hover:bg-brand-green transition-all shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(162,227,43,0.3)] hover:-translate-y-1 active:translate-y-0 group flex items-center justify-center gap-4 ${isSubmitting ? 'opacity-80' : ''}`}
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        ОТПРАВИТЬ АНКЕТУ
                                    </>
                                )}
                            </button>
                            
                            <p className="text-center text-[10px] text-brand-dark/20 font-black uppercase tracking-[0.2em] max-w-xs mx-auto text-balance">
                                Нажимая, вы подтверждаете согласие на обработку персональных данных
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes progress { 0% { width: 0; } 100% { width: 100%; } }
                .animate-progress { animation: progress 3s linear; }
                @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default InterviewPage;
