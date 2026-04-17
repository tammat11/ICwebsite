import { useState } from 'react';
import Footer from '../components/Footer';
import { Mail, Globe, Building2 } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { createBitrixLead } from '../utils/bitrix';
import { formatPhone } from '../utils/phone';
import SeoHead from '../components/SeoHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { buildBreadcrumbSchema, SITE_URL } from '../utils/seo';

const ContactsPage = () => {
    const [rootRef, inView] = useInView();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [phone, setPhone] = useState('');

    const departments = [
        { title: "Отдел продаж", email: "sales@ic-group.kz", phone: "+7 777 008 73 60", icon: Building2 },
        { title: "HR Департамент", email: "hr@ic-group.kz", phone: "+7 771 780 2366", icon: Globe },
        { title: "Тендерный отдел", email: "tenders@ic-group.kz", phone: "+7 707 808 3003", icon: Mail },
    ];
    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'Контакты', path: '/contacts' },
    ]);

    const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Контакты IC Group',
        url: `${SITE_URL}/contacts`,
        mainEntity: {
            '@id': `${SITE_URL}#organization`,
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone || phone.length < 10) {
            alert('Пожалуйста, заполните Имя, Email и корректный Телефон (минимум 10 цифр)');
            return;
        }

        setIsSubmitting(true);
        try {
            await createBitrixLead({
                title: `Обратная связь: ${name}`,
                name: name,
                email: email,
                phone: phone,
                comments: message,
            });

            alert('Сообщение успешно отправлено!');
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
        <div ref={rootRef} className={`min-h-screen bg-[#F5F5F7] text-brand-dark selection:bg-brand-green/30 ${inView ? 'in-view' : ''}`}>
            <SeoHead
                title="Контакты клининговой компании | IC Group"
                description="Контакты клининговой компании IC Group. Отдел продаж, HR и тендерный отдел. Закажите профессиональный клининг для бизнеса в Казахстане."
                path="/contacts"
                keywords="контакты клининговой компании, заказать клининг, клининг для бизнеса, ic group контакты"
                schema={[contactSchema, breadcrumbSchema]}
            />

            <main className="pt-24 sm:pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumbs items={[{ label: 'Контакты' }]} />
                </div>

                {/* Header */}
                <div className="max-w-7xl mx-auto mb-16 md:mb-20 relative text-left reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <span className="text-brand-green font-bold tracking-[0.4em] uppercase text-xs md:text-sm block mb-6">
                        Контакты
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
                        СВЯЖИТЕСЬ <br />
                        <span className="text-brand-green">С НАМИ</span>
                    </h1>
                </div>

                {/* Departments & Form */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-16 mb-20">

                    {/* Departments List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl sm:text-4xl font-bold mb-10 reveal-on-scroll" style={{ animationDelay: '0.1s' }}>ДЕПАРТАМЕНТЫ</h2>
                        {departments.map((dep, i) => (
                            <div key={i} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-3xl bg-white border border-white/50 shadow-md shadow-black/5 hover:border-brand-green/30 transition-colors reveal-on-scroll" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green shrink-0">
                                    <dep.icon size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-base sm:text-lg truncate">{dep.title}</h4>
                                    <p className="text-brand-dark font-mono text-xs sm:text-sm">{dep.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Form */}
                    <div className="bg-brand-dark text-white p-6 sm:p-10 md:p-14 rounded-[30px] sm:rounded-[40px] relative overflow-hidden shadow-2xl reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h2 className="text-[clamp(1.75rem,5vw,36px)] font-bold mb-2 uppercase">Напишите нам</h2>
                            <p className="text-white/50 mb-8">Мы ответим в течение 15 минут.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ваше Имя" 
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors" 
                                />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email" 
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors" 
                                />
                                <input 
                                    type="tel" 
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    placeholder="+7 (XXX) XXX XX XX*" 
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors" 
                                />
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Сообщение" 
                                    rows={4} 
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-white/30 focus:outline-none focus:border-brand-green transition-colors resize-none" 
                                />
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-brand-green text-white font-bold uppercase tracking-widest py-5 rounded-2xl hover:bg-white hover:text-brand-dark transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    );
};

export default ContactsPage;
