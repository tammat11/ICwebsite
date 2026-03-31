import { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';
import { CheckCircle2, Play, ChevronRight, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

import { updateSanitaryStats } from '../utils/bitrix';

const quizData = {
    ru: {
        title: "Уборка санитарных зон",
        subtitle: "Обучающий курс и тест по стандартам уборки санузлов",
        videosTitle: "Обучающие видео",
        quizTitle: "Тест для самопроверки",
        nextBtn: "Следующий вопрос",
        prevBtn: "Назад",
        finishBtn: "Завершить тест",
        restartBtn: "Начать заново",
        curatorTitle: "Кто ваш куратор?",
        curatorPlaceholder: "Введите имя куратора",
        startQuizBtn: "Начать тест",
        resultTitle: "Ваш результат",
        resultMessage: "Вы ответили правильно на {score} из {total} вопросов",
        passMessage: "Отлично! Вы хорошо усвоили материал.",
        failMessage: "Рекомендуем еще раз посмотреть видео и пройти тест.",
        questions: [
            { id: 1, text: "Что обязательно при уборке санузлов?", options: ["Перчатки и очки", "Маска для сна", "Без защиты"], correct: "Перчатки и очки" },
            { id: 2, text: "Чем обрабатывается унитаз?", options: ["Дезинфицирующим средством", "Водой", "Пылесосом"], correct: "Дезинфицирующим средством" },
            { id: 3, text: "В какой последовательности убирают санузел?", options: ["Сверху вниз", "Снизу вверх", "Как удобно"], correct: "Сверху вниз" },
            { id: 4, text: "Что использовать для зеркала в санузле?", options: ["Средство для стекол", "Средство для полов", "Вода"], correct: "Средство для стекол" },
            { id: 5, text: "Как часто убирают санузлы?", options: ["Ежедневно и чаще при интенсивном использовании", "Раз в месяц", "Раз в неделю"], correct: "Ежедневно и чаще при интенсивном использовании" },
            { id: 6, text: "Что нельзя допускать в санузлах?", options: ["Наличие запахов и следов загрязнений", "Сухой пол", "Включенный свет"], correct: "Наличие запахов и следов загрязнений" },
            { id: 7, text: "Какая тряпка используется в санузлах?", options: ["Красная", "Жёлтая", "Синяя"], correct: "Красная" },
            { id: 8, text: "Что включают в уборку санузлов?", options: ["Дезинфекция поверхностей", "Замена мебели", "Ремонт"], correct: "Дезинфекция поверхностей" },
            { id: 9, text: "Что делать при засоре?", options: ["Сообщить ответственному", "Игнорировать", "Использовать тряпку"], correct: "Сообщить ответственному" },
            { id: 10, text: "Где хранится инвентарь для санузлов?", options: ["Отдельно от остального", "В общей тележке", "В офисе"], correct: "Отдельно от остального" }
        ]
    },
    kz: {
        title: "Санитарлық аймақтарды тазалау",
        subtitle: "Санузелдерді тазалау стандарттары бойынша оқу курсы және тест",
        videosTitle: "Оқу бейнелері",
        quizTitle: "Өзін-өзі тексеру тесті",
        nextBtn: "Келесі сұрақ",
        prevBtn: "Артқа",
        finishBtn: "Тестілеуді аяқтау",
        restartBtn: "Қайта бастау",
        curatorTitle: "Кураторыңыз кім?",
        curatorPlaceholder: "Куратордың атын енгізіңіз",
        startQuizBtn: "Тестті бастау",
        correctText: "Дұрыс!",
        incorrectText: "Қате. Дұрыс жауап: ",
        resultTitle: "Сіздің нәтижеңіз",
        resultMessage: "Сіз {total} сұрақтың {score}-сына дұрыс жауап бердіңіз",
        passMessage: "Өте жақсы! Материалды жақсы меңгердіңіз.",
        failMessage: "Бейнелерді қайтадан көріп, тест тапсыруды ұсынамыз.",
        questions: [
            { id: 1, text: "Санузелді тазалағанда не міндетті?", options: ["Қолғап және көзілдірік кию", "Ұйқы маскасы", "Қорғаныссыз жұмыс"], correct: "Қолғап және көзілдірік кию" },
            { id: 2, text: "Унитаз қандай құралмен өңделеді?", options: ["Дезинфекциялық құралмен", "Сумен", "Пылесоспен"], correct: "Дезинфекциялық құралмен" },
            { id: 3, text: "Санузел қандай ретпен тазартылады?", options: ["Жоғарыдан төменге қарай", "Төменнен жоғары", "Қалағандай"], correct: "Жоғарыдан төменге қарай" },
            { id: 4, text: "Айнаға не қолданылады?", options: ["Шыны жууға арналған құрал", "Еден жуу құралы", "Су"], correct: "Шыны жууға арналған құрал" },
            { id: 5, text: "Санузелдер қаншалықты жиі тазаланады?", options: ["Күн сайын және қажет болғанда жиірек", "Айына 1 рет", "Аптасына 1 рет"], correct: "Күн сайын және қажет болғанда жиірек" },
            { id: 6, text: "Санузелде неге жол беруге болмайды?", options: ["Иіс пен ластанудың болуына", "Құрғақ еден", "Жарықтың жануына"], correct: "Иіс пен ластанудың болуына" },
            { id: 7, text: "Санузел үшін қандай шүберек қолданылады?", options: ["Қызыл шүберек", "Сары", "Көк"], correct: "Қызыл шүберек" },
            { id: 8, text: "Санузелді тазалау нені қамтиды?", options: [" Беттерді дезинфекциялау", "Жиһаз ауыстыру", "Жөндеу"], correct: "Беттерді дезинфекциялау" },
            { id: 9, text: "Тұтқындағы бітеліс болса не істеу керек?", options: ["Жауапты адамға хабарлау керек", "Елемеу", "Шүберекпен тазалау"], correct: "Жауапты адамға хабарлау керек" },
            { id: 10, text: "Санузелге арналған инвентарь қайда сақталады?", options: [" Басқа инвентарьдан бөлек, арнайы жерде", "Жалпы арбада", "Офисте"], correct: "Басқа инвентарьдан бөлек, арнайы жерде" }
        ]
    }
};

const videos = [
    {
        id: "ftCljFFcNSs",
        title: { ru: "18. Базовая уборка санузлов", kz: "18. Санузелдерді базалық тазалау" },
        duration: "03:45"
    },
    {
        id: "snPMaypCl8k",
        title: { ru: "19. Поддерживающая уборка санузлов", kz: "19. Санузелдерді қолдау тазалығы" },
        duration: "04:15"
    }
];

const SanitaryQuizPage = () => {
    const [lang, setLang] = useState<'ru' | 'kz'>('ru');
    const [curator, setCurator] = useState('');
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>(new Array(10).fill(-1));
    const [showResults, setShowResults] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
    
    const contentRef = useRef<HTMLDivElement>(null);
    const quizRef = useRef<HTMLDivElement>(null);

    const t = quizData[lang];

    const startQuiz = () => {
        if (!curator.trim()) return;
        
        const shuffled = t.questions.map(q => {
            const options = [...q.options];
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            return { ...q, shuffledOptions: options };
        });
        
        setShuffledQuestions(shuffled);
        setIsQuizStarted(true);
        gsap.fromTo(quizRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
    };

    const score = userAnswers.reduce((acc, ans, idx) => {
        if (ans === -1 || !shuffledQuestions[idx]) return acc;
        const selectedText = shuffledQuestions[idx].shuffledOptions[ans];
        return selectedText === shuffledQuestions[idx].correct ? acc + 1 : acc;
    }, 0);

    useEffect(() => {
        gsap.fromTo(".reveal-on-scroll", 
            { y: 40, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
        );
    }, [lang]);

    useEffect(() => {
        if (showResults) {
            updateSanitaryStats(score, curator).catch(err => console.error('Failed to sync with Bitrix:', err));
        }
    }, [showResults, score, curator]);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < t.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            gsap.fromTo(quizRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 });
        } else {
            setShowResults(true);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
            gsap.fromTo(quizRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 });
        }
    };

    return (
        <div ref={contentRef} className="bg-brand-light">
            <main className="min-h-screen pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />
                        
                        <div className="relative z-10">
                            <span className="text-brand-green text-[10px] font-bold tracking-[0.3em] uppercase block mb-4 reveal-on-scroll">
                                Обучение сотрудников
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-brand-dark leading-none reveal-on-scroll">
                                {t.title}
                            </h1>
                            <p className="mt-4 text-brand-dark/50 font-medium max-w-xl reveal-on-scroll">
                                {t.subtitle}
                            </p>
                        </div>

                        <div className="flex bg-white p-1 rounded-full border border-brand-dark/5 shadow-sm relative z-10 reveal-on-scroll">
                            <button 
                                onClick={() => setLang('ru')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'ru' ? 'bg-brand-dark text-white' : 'text-brand-dark/50 hover:bg-brand-dark/5'}`}
                            >
                                РУС
                            </button>
                            <button 
                                onClick={() => setLang('kz')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'kz' ? 'bg-brand-dark text-white' : 'text-brand-dark/50 hover:bg-brand-dark/5'}`}
                            >
                                ҚАЗ
                            </button>
                        </div>
                    </div>

                    <div className="mb-20">
                        <div className="flex items-center gap-3 mb-8 reveal-on-scroll">
                            <div className="w-10 h-10 bg-brand-green text-white rounded-xl flex items-center justify-center">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-brand-dark">{t.videosTitle}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-on-scroll">
                            {videos.map((video) => (
                                <div key={video.id} className="group">
                                    <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border border-brand-dark/5 mb-4 group-hover:scale-[1.02] transition-transform duration-500">
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={`https://www.youtube.com/embed/${video.id}`} 
                                            title={video.title[lang]}
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <h3 className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{video.title[lang]}</h3>
                                    <p className="text-xs text-brand-dark/40 mt-1 uppercase font-bold tracking-wider">{video.duration}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reveal-on-scroll">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-brand-dark text-white rounded-xl flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-brand-dark">{t.quizTitle}</h2>
                        </div>

                        {!isQuizStarted ? (
                            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-brand-dark/5 text-center reveal-on-scroll">
                                <h3 className="text-2xl font-bold text-brand-dark mb-6">{t.curatorTitle}</h3>
                                <div className="max-w-md mx-auto space-y-6">
                                    <input 
                                        type="text" 
                                        value={curator}
                                        onChange={(e) => setCurator(e.target.value)}
                                        placeholder={t.curatorPlaceholder}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-brand-dark/5 bg-brand-dark/[0.02] focus:border-brand-green outline-none transition-all font-medium text-center"
                                    />
                                    <button 
                                        onClick={startQuiz}
                                        disabled={!curator.trim()}
                                        className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
                                            curator.trim() ? 'bg-brand-green text-white hover:shadow-xl hover:-translate-y-1' : 'bg-brand-dark/10 text-brand-dark/30 cursor-not-allowed'
                                        }`}
                                    >
                                        {t.startQuizBtn}
                                    </button>
                                </div>
                            </div>
                        ) : !showResults ? (
                            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-brand-dark/5 relative overflow-hidden" ref={quizRef}>
                                <div className="absolute top-0 left-0 h-1.5 bg-brand-green transition-all duration-500" style={{ width: `${((currentQuestion + 1) / t.questions.length) * 100}%` }} />
                                
                                <div className="mb-10">
                                    <span className="text-brand-green font-bold text-sm tracking-widest uppercase block mb-4">
                                        Вопрос {currentQuestion + 1} из {t.questions.length}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-brand-dark leading-tight">
                                        {shuffledQuestions[currentQuestion]?.text}
                                    </h3>
                                </div>

                                <div className="space-y-4 mb-10">
                                    {shuffledQuestions[currentQuestion]?.shuffledOptions.map((option: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                                userAnswers[currentQuestion] === idx 
                                                ? 'border-brand-green bg-brand-green/5 text-brand-dark ring-4 ring-brand-green/10' 
                                                : 'border-brand-dark/5 bg-brand-dark/[0.02] hover:border-brand-dark/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    userAnswers[currentQuestion] === idx ? 'border-brand-green bg-brand-green' : 'border-brand-dark/10'
                                                }`}>
                                                    {userAnswers[currentQuestion] === idx && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                                {option}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <button 
                                        onClick={handlePrev}
                                        disabled={currentQuestion === 0}
                                        className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all
                                            ${currentQuestion === 0 ? 'opacity-0 pointer-events-none' : 'bg-brand-dark/5 text-brand-dark hover:bg-brand-dark/10'}`}
                                    >
                                        {t.prevBtn}
                                    </button>
                                    
                                    <button 
                                        onClick={handleNext}
                                        disabled={userAnswers[currentQuestion] === -1}
                                        className={`px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all
                                            ${userAnswers[currentQuestion] === -1 
                                                ? 'bg-brand-dark/20 text-brand-dark/30 cursor-not-allowed' 
                                                : 'bg-brand-green text-white hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'}`}
                                    >
                                        {currentQuestion === t.questions.length - 1 ? t.finishBtn : t.nextBtn}
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-brand-dark rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-8 ${score >= 8 ? 'bg-brand-green text-white' : 'bg-orange-500 text-white'}`}>
                                        {score >= 8 ? <CheckCircle2 size={48} /> : <RotateCcw size={48} />}
                                    </div>
                                    
                                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                        {t.resultTitle}: {score}/{t.questions.length}
                                    </h3>
                                    
                                    <p className="text-xl text-white/60 mb-12 max-w-lg mx-auto font-medium">
                                        {score >= 8 ? t.passMessage : t.failMessage}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SanitaryQuizPage;
