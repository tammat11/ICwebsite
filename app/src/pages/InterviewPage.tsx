import { ArrowUpRight, Briefcase, FileText, PhoneCall } from 'lucide-react';
import CandidateForm from '../components/CandidateForm';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { useInView } from '../hooks/useInView';

const InterviewPage = () => {
    const [rootRef, inView] = useInView();

    const steps = [
        {
            icon: FileText,
            title: 'Заполните анкету',
            description: 'Укажите имя, фамилию, телефон и прикрепите резюме. Всё сразу падает в HR-процесс без ручной возни.',
        },
        {
            icon: Briefcase,
            title: 'Команда изучит отклик',
            description: 'HR получает анкету в рабочую воронку и быстро видит ключевые данные по кандидату.',
        },
        {
            icon: PhoneCall,
            title: 'Свяжемся по следующему шагу',
            description: 'Если профиль подходит, команда согласует созвон, интервью или дальнейший этап отбора.',
        },
    ];

    return (
        <div ref={rootRef} className={`min-h-screen bg-[#f5f5f1] text-brand-dark selection:bg-brand-green/20 ${inView ? 'in-view' : ''}`}>
            <SeoHead
                title="Опросник кандидата | IC Group"
                description="Заполните анкету кандидата IC Group, прикрепите резюме и отправьте заявку в HR-отдел компании."
                path="/interview"
                keywords="анкета кандидата, отправить резюме, работа в офисе, hr ic group, интервью ic group"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Опросник кандидата IC Group',
                    url: 'https://ic-group.kz/interview',
                }}
            />

            <main className="pt-24 sm:pt-32 pb-20 px-6 overflow-hidden">
                <section className="max-w-7xl mx-auto relative">
                    <div className="absolute -top-12 right-0 w-72 h-72 rounded-full bg-brand-green/15 blur-[100px] pointer-events-none" />

                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-3 rounded-full border border-brand-dark/10 bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-green reveal-on-scroll">
                                HR форма
                            </span>

                            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.92] reveal-on-scroll" style={{ animationDelay: '0.08s' }}>
                                АНКЕТА
                                <span className="block text-brand-green">КАНДИДАТА</span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-base md:text-xl leading-relaxed text-brand-dark/60 font-medium reveal-on-scroll" style={{ animationDelay: '0.16s' }}>
                                Если хотите присоединиться к IC Group, заполните форму ниже. Она отправит ваши данные и резюме прямо в HR-воронку, без лишнего цирка и ручного копипаста.
                            </p>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3 reveal-on-scroll" style={{ animationDelay: '0.24s' }}>
                                <div className="rounded-[28px] bg-brand-dark text-white p-6 shadow-[0_18px_40px_rgba(24,24,24,0.12)]">
                                    <div className="text-[10px] uppercase tracking-[0.28em] text-brand-green font-black">Поля</div>
                                    <div className="mt-4 text-3xl font-bold">4</div>
                                    <p className="mt-2 text-sm text-white/65">Имя, фамилия, телефон и файл с резюме.</p>
                                </div>
                                <div className="rounded-[28px] bg-white p-6 border border-brand-dark/10 shadow-[0_18px_40px_rgba(24,24,24,0.06)]">
                                    <div className="text-[10px] uppercase tracking-[0.28em] text-brand-green font-black">Воронка</div>
                                    <div className="mt-4 text-3xl font-bold">HR</div>
                                    <p className="mt-2 text-sm text-brand-dark/60">Отклик падает в нужный smart-процесс Bitrix.</p>
                                </div>
                                <div className="rounded-[28px] bg-white p-6 border border-brand-dark/10 shadow-[0_18px_40px_rgba(24,24,24,0.06)]">
                                    <div className="text-[10px] uppercase tracking-[0.28em] text-brand-green font-black">Старт</div>
                                    <div className="mt-4 text-3xl font-bold">NEW</div>
                                    <p className="mt-2 text-sm text-brand-dark/60">Заявка попадает на стартовую стадию обработки.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 rounded-[36px] border border-brand-dark/10 bg-white p-6 md:p-8 shadow-[0_22px_60px_rgba(15,23,24,0.08)] reveal-on-scroll" style={{ animationDelay: '0.22s' }}>
                            <div className="flex items-center justify-between gap-4 border-b border-brand-dark/8 pb-5">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.25em] text-brand-green font-black">Как это работает</div>
                                    <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">Коротко и по делу</h2>
                                </div>
                                <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-white">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {steps.map((step, index) => (
                                    <div key={step.title} className="flex gap-4 rounded-[24px] bg-[#f7f8f4] p-4 md:p-5">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-green shadow-sm">
                                            <step.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-[0.25em] text-brand-dark/35 font-black">Шаг {index + 1}</div>
                                            <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto mt-14 md:mt-20">
                    <div className="rounded-[40px] bg-brand-dark p-3 md:p-4 shadow-[0_26px_80px_rgba(0,0,0,0.18)] reveal-on-scroll">
                        <div className="grid gap-8 rounded-[32px] border border-white/10 bg-white p-5 md:grid-cols-[0.9fr_1.1fr] md:p-8">
                            <div className="rounded-[28px] bg-[#f7f8f4] p-6 md:p-8">
                                <div className="text-[10px] uppercase tracking-[0.24em] text-brand-green font-black">Перед отправкой</div>
                                <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tight text-brand-dark">
                                    Подготовьте резюме и нормальный номер для связи
                                </h2>
                                <p className="mt-4 text-sm md:text-base leading-relaxed text-brand-dark/60">
                                    Мы специально убрали встроенную битриксовую коробку и сделали свою форму, чтобы страница выглядела как часть сайта, а не как прилепленный инородный кусок.
                                </p>

                                <div className="mt-8 space-y-3">
                                    {[
                                        'Имя и фамилия уходят в отдельные поля HR-процесса.',
                                        'Телефон сохраняется в карточке кандидата для быстрого контакта.',
                                        'Файл резюме прикрепляется прямо в поле Bitrix.',
                                    ].map((item) => (
                                        <div key={item} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-brand-dark/70 shadow-sm">
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <CandidateForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default InterviewPage;
