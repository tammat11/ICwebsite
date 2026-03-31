import { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';
import { CheckCircle2, Play, ChevronRight, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

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
        correctText: "Правильно!",
        incorrectText: "Неверно. Правильный ответ: ",
        resultTitle: "Ваш результат",
        resultMessage: "Вы ответили правильно на {score} из {total} вопросов",
        passMessage: "Отлично! Вы хорошо усвоили материал.",
        failMessage: "Рекомендуем еще раз посмотреть видео и пройти тест.",
        questions: [
            {
                id: 1,
                text: "Что обязательно при уборке санузлов?",
                options: ["a) Перчатки и очки", "b) Маска для сна", "c) Без защиты"],
                correct: 0
            },
            {
                id: 2,
                text: "Чем обрабатывается унитаз?",
                options: ["a) Дезинфицирующим средством", "b) Водой", "c) Пылесосом"],
                correct: 0
            },
            {
                id: 3,
                text: "В какой последовательности убирают санузел?",
                options: ["a) Сверху вниз", "b) Снизу вверх", "c) Как удобно"],
                correct: 0
            },
            {
                id: 4,
                text: "Что использовать для зеркала в санузле?",
                options: ["a) Средство для стекол", "b) Средство для полов", "c) Вода"],
                correct: 0
            },
            {
                id: 5,
                text: "Как часто убирают санузлы?",
                options: ["a) Ежедневно и чаще при интенсивном использовании", "b) Раз в месяц", "c) Раз в неделю"],
                correct: 0
            },
            {
                id: 6,
                text: "Что нельзя допускать в санузлах?",
                options: ["a) Наличие запахов и следов загрязнений", "b) Сухой пол", "c) Включенный свет"],
                correct: 0
            },
            {
                id: 7,
                text: "Какая тряпка используется в санузлах?",
                options: ["a) Красная", "b) Жёлтая", "c) Синяя"],
                correct: 0
            },
            {
                id: 8,
                text: "Что включают в уборку санузлов?",
                options: ["a) Дезинфекция поверхностей", "b) Замена мебели", "c) Ремонт"],
                correct: 0
            },
            {
                id: 9,
                text: "Что делать при засоре?",
                options: ["a) Сообщить ответственному", "b) Игнорировать", "c) Использовать тряпку"],
                correct: 0
            },
            {
                id: 10,
                text: "Где хранится инвентарь для санузлов?",
                options: ["a) Отдельно от остального", "b) В общей тележке", "c) В офисе"],
                correct: 0
            }
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
        correctText: "Дұрыс!",
        incorrectText: "Қате. Дұрыс жауап: ",
        resultTitle: "Сіздің нәтижеңіз",
        resultMessage: "Сіз {total} сұрақтың {score}-сына дұрыс жауап бердіңіз",
        passMessage: "Өте жақсы! Материалды жақсы меңгердіңіз.",
        failMessage: "Бейнелерді қайтадан көріп, тест тапсыруды ұсынамыз.",
        questions: [
            {
                id: 1,
                text: "Санузелді тазалағанда не міндетті?",
                options: ["a) Қолғап және көзілдірік кию", "b) Ұйқы маскасы", "c) Қорғаныссыз жұмыс"],
                correct: 0
            },
            {
                id: 2,
                text: "Унитаз қандай құралмен өңделеді?",
                options: ["a) Дезинфекциялық құралмен", "b) Сумен", "c) Пылесоспен"],
                correct: 0
            },
            {
                id: 3,
                text: "Санузел қандай ретпен тазартылады?",
                options: ["a) Жоғарыдан төменге қарай", "b) Төменнен жоғары", "c) Қалағандай"],
                correct: 0
            },
            {
                id: 4,
                text: "Айнаға не қолданылады?",
                options: ["a) Шыны жууға арналған құрал", "b) Еден жуу құралы", "c) Су"],
                correct: 0
            },
            {
                id: 5,
                text: "Санузелдер қаншалықты жиі тазаланады?",
                options: ["a) Күн сайын және қажет болғанда жиірек", "b) Айына 1 рет", "c) Аптасына 1 рет"],
                correct: 0
            },
            {
                id: 6,
                text: "Санузелде неге жол беруге болмайды?",
                options: ["a) Иіс пен ластанудың болуына", "b) Құрғақ еден", "c) Жарықтың жануына"],
                correct: 0
            },
            {
                id: 7,
                text: "Санузел үшін қандай шүберек қолданылады?",
                options: ["a) Қызыл шүберек", "b) Сары", "c) Көк"],
                correct: 0
            },
            {
                id: 8,
                text: "Санузелді тазалау нені қамтиды?",
                options: ["a) Беттерді дезинфекциялау", "b) Жиһаз ауыстыру", "c) Жөндеу"],
                correct: 0
            },
            {
                id: 9,
                text: "Тұтқындағы бітеліс болса не істеу керек?",
                options: ["a) Жауапты адамға хабарлау керек", "b) Елемеу", "c) Шүберекпен тазалау"],
                correct: 0
            },
            {
                id: 10,
                text: "Санузелге арналған инвентарь қайда сақталады?",
                options: ["a) Басқа инвентарьдан бөлек, арнайы жерде", "b) Жалпы арбада", "c) Офисте"],
                correct: 0
            }
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
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>(new Array(10).fill(-1));
    const [showResults, setShowResults] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const quizRef = useRef<HTMLDivElement>(null);

    const t = quizData[lang];

    useEffect(() => {
        gsap.fromTo(".reveal-on-scroll", 
            { y: 40, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
        );
    }, [lang]);

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

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setUserAnswers(new Array(10).fill(-1));
        setShowResults(false);
    };

    const score = userAnswers.reduce((acc, ans, idx) => {
        return ans === t.questions[idx].correct ? acc + 1 : acc;
    }, 0);

    return (
        <div ref={contentRef} className="bg-brand-light">
            <main className="min-h-screen pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
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

                    {/* Videos Section */}
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

                    {/* Quiz Section */}
                    <div className="reveal-on-scroll">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-brand-dark text-white rounded-xl flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-brand-dark">{t.quizTitle}</h2>
                        </div>

                        {!showResults ? (
                            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-brand-dark/5 relative overflow-hidden" ref={quizRef}>
                                {/* Progress bar */}
                                <div className="absolute top-0 left-0 h-1.5 bg-brand-green transition-all duration-500" style={{ width: `${((currentQuestion + 1) / t.questions.length) * 100}%` }} />
                                
                                <div className="mb-10">
                                    <span className="text-brand-green font-bold text-sm tracking-widest uppercase block mb-4">
                                        Вопрос {currentQuestion + 1} из {t.questions.length}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-brand-dark leading-tight">
                                        {t.questions[currentQuestion].text}
                                    </h3>
                                </div>

                                <div className="space-y-4 mb-10">
                                    {t.questions[currentQuestion].options.map((option, idx) => (
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

                                    <button 
                                        onClick={restartQuiz}
                                        className="px-12 py-5 bg-white text-brand-dark rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-green hover:text-white transition-all shadow-xl hover:-translate-y-1 inline-flex items-center gap-3"
                                    >
                                        <RotateCcw size={18} />
                                        {t.restartBtn}
                                    </button>
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
