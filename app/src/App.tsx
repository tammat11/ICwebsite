import { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import StatsGrid from './components/StatsGrid';
import ServicesSection from './components/ServicesSection';
import ClientsMarquee from './components/ClientsMarquee';
import ProcessSection from './components/ProcessSection';
import PhilosophySection from './components/PhilosophySection';
import CasesSection from './components/CasesSection';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import ContactsPage from './pages/ContactsPage';
import NewsPage from './pages/NewsPage';
import AdminPage from './pages/AdminPage';
import SanitaryQuizPage from './pages/SanitaryQuizPage';
import DailyReportPage from './pages/DailyReportPage';
import AdminMapPage from './pages/AdminMapPage';
import SeoLandingPage from './pages/SeoLandingPage';
import InterviewPage from './pages/InterviewPage';
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';
import AICalculator from './components/AICalculator';
import ScrollProgress from './components/ScrollProgress';
import SeoHead from './components/SeoHead';
import { getSeoLanding } from './data/seoLandings';
import { useState } from 'react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  useEffect(() => {
    console.log('App initialized on', window.location.href);
  }, []);

  const location = useLocation();
  const [isCalcOpen, setCalcOpen] = useState(false);

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      {location.pathname !== '/admin' && <Navbar onCalcOpen={() => setCalcOpen(true)} />}
      <Routes location={location}>
        <Route path="/" element={<Home onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/services" element={<ServicesPage onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/news" element={<NewsPage onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/map" element={<AdminMapPage />} />
        <Route path="/training/sanitary" element={<SanitaryQuizPage />} />
        <Route path="/reports/daily" element={<DailyReportPage />} />
        <Route path="/kliningovaya-kompaniya-almaty" element={<SeoLandingPage landing={getSeoLanding('/kliningovaya-kompaniya-almaty')!} onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/kliningovaya-kompaniya-astana" element={<SeoLandingPage landing={getSeoLanding('/kliningovaya-kompaniya-astana')!} onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/klining-ofisov" element={<SeoLandingPage landing={getSeoLanding('/klining-ofisov')!} onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/generalnaya-uborka" element={<SeoLandingPage landing={getSeoLanding('/generalnaya-uborka')!} onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/poslestroitelnaya-uborka" element={<SeoLandingPage landing={getSeoLanding('/poslestroitelnaya-uborka')!} onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/moyka-vitrazhey" element={<SeoLandingPage landing={getSeoLanding('/moyka-vitrazhey')!} onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/klining-ofisov-almaty" element={<SeoLandingPage landing={getSeoLanding('/klining-ofisov-almaty')!} onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/klining-ofisov-astana" element={<SeoLandingPage landing={getSeoLanding('/klining-ofisov-astana')!} onCalcOpen={() => setCalcOpen(true)} />} />
      </Routes>
      <AICalculator isOpen={isCalcOpen} onClose={() => setCalcOpen(false)} />
      <div className="noise-overlay" />
    </>
  );
}

function Home({ onCalcOpen }: { onCalcOpen: () => void }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Какие услуги предоставляет клининговая компания IC Group?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'IC Group выполняет профессиональный клининг офисов, торговых и коммерческих объектов, генеральную уборку, послестроительную уборку, мойку витражей, химчистку и специализированные работы для бизнеса.',
        },
      },
      {
        '@type': 'Question',
        name: 'В каких городах работает клининговая компания IC Group?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Компания работает по Казахстану и обслуживает объекты бизнеса в Алматы, Астане и других городах страны.',
        },
      },
      {
        '@type': 'Question',
        name: 'Как заказать клининг для офиса или коммерческого объекта?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Оставьте заявку на сайте или свяжитесь с отделом продаж IC Group. Команда уточнит тип объекта, площадь, график работ и подготовит коммерческое предложение.',
        },
      },
    ],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'IC Group',
    url: 'https://ic-group.kz/',
    image: 'https://ic-group.kz/logo_IC_group.png',
    serviceType: [
      'Профессиональный клининг',
      'Клининг офисов',
      'Генеральная уборка',
      'Послестроительная уборка',
      'Мойка витражей',
      'Химчистка',
    ],
    areaServed: ['Алматы', 'Астана', 'Казахстан'],
    telephone: '+7 777 008 73 60',
    email: 'sales@ic-group.kz',
  };

  return (
    <div className="min-h-screen bg-white relative selection:bg-brand-green/20 overflow-x-hidden w-full">
      <SeoHead
        title="Клининговая компания в Казахстане | IC Group"
        description="IC Group — клининговая компания для бизнеса в Казахстане. Профессиональный клининг офисов, генеральная и послестроительная уборка, мойка витражей и химчистка."
        path="/"
        keywords="клининговая компания, клининг казахстан, клининг алматы, клининг астана, клининг офисов, генеральная уборка, послестроительная уборка"
        schema={[localBusinessSchema, faqSchema]}
      />

      {/* Global background elements removed for maximum cleanliness and performance */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-white" />

      <main className="relative z-10 w-full">
        <Hero onCalcOpen={onCalcOpen} />

        <StatsGrid />
        <ClientsMarquee />
        <ServicesSection />

        <ProcessSection />
        <CasesSection />
        <section className="py-16 md:py-24 bg-[#f6f7f3] border-y border-black/5">
          <div className="max-w-7xl mx-auto px-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="section-eyebrow mb-5">
                <span className="h-2 w-2 rounded-full bg-brand-green" />
                SEO-контент
              </span>
              <h2 className="section-header max-w-3xl">
                КЛИНИНГОВАЯ КОМПАНИЯ
                <span className="block text-brand-green"> ДЛЯ БИЗНЕСА В КАЗАХСТАНЕ</span>
              </h2>
              <p className="section-copy mt-6 max-w-3xl">
                IC Group — клининговая компания, которая обслуживает офисы, торговые объекты, банки, промышленные площадки и коммерческую недвижимость. Мы выстраиваем клининг как управляемую систему: аудит объекта, регламенты, запуск команды, контроль качества и понятную отчётность для клиента.
              </p>
              <p className="section-copy mt-4 max-w-3xl">
                Для бизнеса это означает не просто уборку, а стабильный сервис без срывов. Если вам нужна клининговая компания в Алматы, Астане или в других городах Казахстана, IC Group может закрыть ежедневный клининг, генеральную уборку, послестроительную уборку, мойку витражей и другие специализированные работы.
              </p>
            </div>

            <div className="rounded-[32px] bg-white border border-black/6 p-6 md:p-8 shadow-[0_18px_50px_rgba(26,29,30,0.06)]">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-brand-dark">Частые запросы клиентов</h3>
              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="text-base font-bold text-brand-dark">Клининг офисов</h4>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">Ежедневное обслуживание офисных пространств, бизнес-центров и корпоративных помещений.</p>
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-dark">Генеральная уборка</h4>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">Глубокая уборка с проработкой сложных зон, мебели, стекла и инженерных поверхностей.</p>
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-dark">Послестроительная уборка</h4>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">Удаление строительной пыли, следов ремонта и подготовка объекта к запуску.</p>
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-dark">Клининговая компания в Алматы и Астане</h4>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">Отдельный спрос формируют городские и региональные запросы, поэтому мы будем усиливать локальные посадочные страницы под ключевые города.</p>
                </div>
              </div>
              <div className="mt-8 grid gap-3">
                <Link to="/kliningovaya-kompaniya-almaty" className="flex items-center justify-between rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                  <span>Клининговая компания в Алматы</span>
                  <span>01</span>
                </Link>
                <Link to="/kliningovaya-kompaniya-astana" className="flex items-center justify-between rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                  <span>Клининговая компания в Астане</span>
                  <span>02</span>
                </Link>
                <Link to="/klining-ofisov" className="flex items-center justify-between rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                  <span>Клининг офисов</span>
                  <span>03</span>
                </Link>
                <Link to="/generalnaya-uborka" className="flex items-center justify-between rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                  <span>Генеральная уборка</span>
                  <span>04</span>
                </Link>
                <Link to="/poslestroitelnaya-uborka" className="flex items-center justify-between rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                  <span>Послестроительная уборка</span>
                  <span>05</span>
                </Link>
                <Link to="/moyka-vitrazhey" className="flex items-center justify-between rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                  <span>Мойка витражей</span>
                  <span>06</span>
                </Link>
              </div>
            </div>
          </div>
        </section>


        <PhilosophySection />

        <ContactSection onCalcOpen={onCalcOpen} />
      </main>

      <Footer onCalcOpen={onCalcOpen} />

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .animate-marquee-reverse { animation: marquee 30s linear infinite reverse; }
      `}</style>
    </div>
  );
}

export default App;
