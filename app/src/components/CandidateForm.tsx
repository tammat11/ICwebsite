import { useMemo, useState } from 'react';
import { CheckCircle2, FileText, LoaderCircle, Upload } from 'lucide-react';
import { createHrCandidate } from '../utils/bitrix';
import { formatPhone } from '../utils/phone';

interface CandidateFormProps {
    compact?: boolean;
    className?: string;
}

const CandidateForm = ({ compact = false, className = '' }: CandidateFormProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const phoneDigits = useMemo(() => phone.replace(/\D/g, ''), [phone]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || phoneDigits.length < 11 || !resumeFile) {
            setError('Заполните имя, фамилию, телефон и прикрепите резюме.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await createHrCandidate({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone,
                resumeFile,
            });

            setIsSuccess(true);
            setFirstName('');
            setLastName('');
            setPhone('');
            setResumeFile(null);
        } catch (submitError) {
            console.error('Failed to submit HR candidate form:', submitError);
            setError('Не удалось отправить анкету. Попробуйте ещё раз чуть позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerClass = compact
        ? 'rounded-[28px] border border-brand-dark/10 bg-white p-5 md:p-6 shadow-[0_18px_40px_rgba(10,20,18,0.07)]'
        : 'rounded-[32px] border border-brand-dark/10 bg-white p-6 md:p-8 shadow-[0_22px_60px_rgba(10,20,18,0.08)]';

    const fieldClass = compact
        ? 'w-full rounded-2xl border border-brand-dark/10 bg-[#f7f8f4] px-4 py-3 text-sm font-medium text-brand-dark outline-none transition-colors placeholder:text-brand-dark/35 focus:border-brand-green focus:bg-white'
        : 'w-full rounded-2xl border border-brand-dark/10 bg-[#f7f8f4] px-5 py-4 text-sm md:text-base font-medium text-brand-dark outline-none transition-colors placeholder:text-brand-dark/35 focus:border-brand-green focus:bg-white';

    const labelClass = compact
        ? 'mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-brand-dark/55'
        : 'mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/55';

    return (
        <div className={`${containerClass} ${className}`}>
            {isSuccess ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] bg-[#f7f8f4] px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-white shadow-[0_16px_35px_rgba(162,227,43,0.35)]">
                        <CheckCircle2 size={30} />
                    </div>
                    <h3 className="mt-6 text-2xl font-bold tracking-tight">Анкета отправлена</h3>
                    <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-brand-dark/60">
                        Резюме и контакты уже упали в HR-воронку. Если профиль подойдёт, команда свяжется с вами по следующему шагу.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Имя</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={fieldClass}
                                placeholder="Введите имя"
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Фамилия</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={fieldClass}
                                placeholder="Введите фамилию"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Номер телефона</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                            className={fieldClass}
                            placeholder="+7 (777) 000 00 00"
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Резюме</label>
                        <label className="group flex cursor-pointer flex-col gap-3 rounded-[24px] border border-dashed border-brand-dark/15 bg-[#f7f8f4] p-4 transition-colors hover:border-brand-green hover:bg-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-green shadow-sm transition-transform group-hover:scale-105">
                                    {resumeFile ? <FileText size={20} /> : <Upload size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-brand-dark">
                                        {resumeFile ? resumeFile.name : 'Выбрать файл'}
                                    </div>
                                    <div className="mt-1 text-xs text-brand-dark/45">
                                        PDF, DOC, DOCX или другой файл с резюме
                                    </div>
                                </div>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                required
                            />
                        </label>
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-green px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-brand-dark transition-all hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(162,227,43,0.28)] ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                        {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
                        <span>{isSubmitting ? 'Отправляем' : 'Отправить'}</span>
                    </button>
                </form>
            )}
        </div>
    );
};

export default CandidateForm;
