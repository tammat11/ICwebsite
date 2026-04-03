import { ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import type { SeoLanding } from '../data/seoLandings';

type SeoLandingPageProps = {
  landing: SeoLanding;
  onCalcOpen?: () => void;
};

const SeoLandingPage = ({ landing, onCalcOpen }: SeoLandingPageProps) => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landing.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: landing.title,
    description: landing.metaDescription,
    areaServed: 'KZ',
    provider: {
      '@type': 'Organization',
      name: 'IC Group',
      url: 'https://ic-group.kz',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://ic-group.kz/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Услуги',
        item: 'https://ic-group.kz/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: landing.title,
        item: `https://ic-group.kz${landing.path}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20">
      <SeoHead
        title={landing.metaTitle}
        description={landing.metaDescription}
        path={landing.path}
        keywords={landing.keywords}
        schema={[faqSchema, serviceSchema, breadcrumbSchema]}
      />

      <main className="pt-28 md:pt-36 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <span className="section-eyebrow mb-5">
                <span className="h-2 w-2 rounded-full bg-brand-green" />
                {landing.eyebrow}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.92] text-brand-dark uppercase">
                {landing.title}
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-brand-dark/55 font-medium leading-relaxed max-w-3xl">
                {landing.subtitle}
              </p>
              <p className="mt-8 text-base md:text-lg leading-relaxed text-brand-dark/65 max-w-3xl">
                {landing.intro}
              </p>
            </div>

            <div className="rounded-[32px] bg-white border border-black/6 p-6 md:p-8 shadow-[0_18px_50px_rgba(26,29,30,0.06)]">
              <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-brand-dark/35">Что вы получаете</div>
              <div className="mt-6 space-y-4">
                {landing.checklist.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green/12 text-brand-green">
                      <Check size={16} />
                    </div>
                    <p className="text-base leading-relaxed text-brand-dark/70">{item}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={onCalcOpen}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-brand-dark px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brand-green"
              >
                Получить консультацию
                <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] bg-white border border-black/6 p-8 md:p-10 shadow-[0_18px_50px_rgba(26,29,30,0.05)]">
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-brand-dark">
                Почему эта страница важна для клиента и для Google
              </h2>
              <div className="mt-6 space-y-5">
                {landing.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base md:text-lg leading-relaxed text-brand-dark/65">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-[#f6f7f3] border border-black/6 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-brand-dark">
                Полезные переходы
              </h2>
              <div className="mt-6 space-y-3">
                {landing.relatedLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between rounded-[22px] bg-white px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-16 rounded-[32px] bg-brand-dark p-8 md:p-10 text-white shadow-[0_24px_70px_rgba(26,29,30,0.16)]">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
              Частые вопросы
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {landing.faqs.map((faq) => (
                <div key={faq.question} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-bold leading-snug">{faq.question}</h3>
                  <p className="mt-3 text-sm md:text-base leading-relaxed text-white/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer onCalcOpen={onCalcOpen} />
    </div>
  );
};

export default SeoLandingPage;
