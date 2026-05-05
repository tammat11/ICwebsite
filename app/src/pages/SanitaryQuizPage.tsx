import { useState, useEffect, useRef, useMemo } from 'react';
import Footer from '../components/Footer';
import { CheckCircle2, Play, ChevronRight, User } from 'lucide-react';
import gsap from 'gsap';

import { updateSanitaryStats } from '../utils/bitrix';
import SeoHead from '../components/SeoHead';

const curators = [
    "Ильиных Татьяна", "Айткулова А.", "Айтуганова Ю.", "Алдонгаров С.", 
    "Аубакирова А.", "Болатбек А.", "Бут Р.", "Гирик А.", 
    "Жандос Альсейтов", "Жапабаева Б.", "Зобова Е.", "Илиясов Р.", 
    "Исабек Б.", "Исмагамбетов М", "Кабиева А.", "Калиаскар Б.", 
    "Кан Т.", "Кенжебулатов А", "Куатова М.", "Ли А.", 
    "Мусаева Р.", "Назарова М.", "Нысанбеков Е.", "Оспанова Г", 
    "Полоз О.", "Роза Ерасылова", "Рузиева Зоя", "Токенова Сара", 
    "Туймебеков Б.", "Черней Т."
].sort();

const quizData = {
    ru: {
        title: "Уборка стеклянных, зеркальных и хромированных поверхностей",
        subtitle: "Обучающий курс по стандартам очистки стекла, зеркал, витражей и хромированных поверхностей.",
        videosTitle: "Обучающее видео",
        quizTitle: "Тестирование знаний",
        curatorLabel: "Выберите вашего куратора",
        startBtn: "Начать тест",
        nextBtn: "Следующий вопрос",
        prevBtn: "Назад",
        finishBtn: "Завершить тест",
        resultTitle: "Ваш результат",
        passMessage: "Поздравляем! Вы успешно прошли тест. Ваши знания соответствуют стандартам компании.",
        failMessage: "Тест не пройден. Рекомендуем еще раз внимательно посмотреть обучающие видео.",
        questions: [
            {
                text: "Чем протирают стекло?",
                options: ["Салфеткой из микрофибры", "Бумагой", "Тряпкой для пола"],
                correct: 0
            },
            {
                text: "Как двигать стяжку при мойке окна?",
                options: ["S-образно", "Вперед-назад", "Кругами"],
                correct: 0
            },
            {
                text: "Что нельзя использовать на зеркалах?",
                options: ["Абразивные средства", "Микрофибру", "Спрей для стекол"],
                correct: 0
            },
            {
                text: "Как убрать разводы со стекла?",
                options: ["Использовать сухую микрофибру", "Тереть рукой", "Добавить больше воды"],
                correct: 0
            },
            {
                text: "Что используют для хрома?",
                options: ["Специальные полироли", "Щетку для пола", "Хлор"],
                correct: 0
            },
            {
                text: "Где часто встречается хром?",
                options: ["Смесители, поручни", "Полы", "Потолки"],
                correct: 0
            },
            {
                text: "Что нужно после уборки стекла?",
                options: ["Проверить на свет", "Ждать пока высохнет", "Игнорировать"],
                correct: 0
            },
            {
                text: "Как убирать большие витражи?",
                options: ["С помощью телескопической штанги", "Шваброй для пола", "Щеткой"],
                correct: 0
            },
            {
                text: "Чем опасна неправильная химия для стекла?",
                options: ["Может оставить пятна и разводы", "Сокращает время уборки", "Улучшает блеск"],
                correct: 0
            },
            {
                text: "Что делать с поврежденной поверхностью?",
                options: ["Сообщить супервайзеру", "Скрыть", "Игнорировать"],
                correct: 0
            }
        ]
    },
    kz: {
        title: "Шыны, айна және хром беттерін тазалау",
        subtitle: "Шыны, айна, витраж және хром беттерін тазалау стандарттары бойынша оқыту курсы.",
        videosTitle: "Оқыту видеолары",
        quizTitle: "Білімді тексеру",
        curatorLabel: "Кураторыңызды таңдаңыз",
        startBtn: "Тестті бастау",
        nextBtn: "Келесі сұрақ",
        prevBtn: "Артқа",
        finishBtn: "Тестті аяқтау",
        resultTitle: "Сіздің нәтижеңіз",
        passMessage: "Құттықтаймыз! Сіз тестті сәтті тапсырдыңыз. Сіздің біліміңіз компания стандарттарына сәйкес келеді.",
        failMessage: "Тест тапсырылмады. Оқу бейнелерін қайтадан мұқият қарап шығуды ұсынамыз.",
        questions: [
            {
                text: "Шыныны немен сүртеді?",
                options: ["Микрофибра салфеткамен", "Қағазбен", "Еденге арналған шүберекпен"],
                correct: 0
            },
            {
                text: "Стяжка қалай жүргізіледі?",
                options: ["S-тәрізді қимылмен", "Алға-артқа", "Шеңбермен"],
                correct: 0
            },
            {
                text: "Айнаға не қолдануға болмайды?",
                options: ["Абразивті құралдар", "Микрофибра", "Шыны спрейі"],
                correct: 0
            },
            {
                text: "Шыныдағы дақтарды қалай кетіреді?",
                options: ["Құрғақ микрофибра қолдану керек", "Қолмен сүрту", "Көбірек су қосу"],
                correct: 0
            },
            {
                text: "Хром беттеріне не қолданылады?",
                options: ["Арнайы полирольдер", "Еден щеткасы", "Хлор"],
                correct: 0
            },
            {
                text: "Хром қай жерде жиі кездеседі?",
                options: ["Араластырғыштарда, тұтқаларда", "Еденде", "Төбеде"],
                correct: 0
            },
            {
                text: "Шыны жуғаннан кейін не істеу керек?",
                options: ["Жарыққа қарап тексеру керек", "Кебуін күту", "Елемеу"],
                correct: 0
            },
            {
                text: "Үлкен витраждарды қалай тазалайды?",
                options: ["Телескоптық штангамен", "Еден швабрасы", "Щеткамен"],
                correct: 0
            },
            {
                text: "Дұрыс емес химия неге қауіпті?",
                options: ["Дақтар мен іздер қалдыруы мүмкін", "Уақытты үнемдейді", "Жылтырды арттырады"],
                correct: 0
            },
            {
                text: "Зақымдалған бет болса не істеу керек?",
                options: ["Супервайзерге хабарлау керек", "Жасыру", "Елемеу"],
                correct: 0
            }
        ]
    }
};

const videos = [
    { id: "bNYQZB7peg0", title: { ru: "Уборка стеклянных, зеркальных и хромированных поверхностей", kz: "Шыны, айна және хром беттерін тазалау" }, duration: "" }
];

const SanitaryQuizPage = () => {
    const [lang, setLang] = useState<'ru' | 'kz'>('ru');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>(new Array(10).fill(-1));
    const [showResults, setShowResults] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [selectedCurator, setSelectedCurator] = useState("");
    
    // Перемешанные индексы ответов для каждого вопроса
    const shuffledOptionsIndexes = useMemo(() => {
        return quizData.ru.questions.map(q => {
            const indexes = q.options.map((_, i) => i);
            for (let i = indexes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
            }
            return indexes;
        });
    }, []);

    const contentRef = useRef<HTMLDivElement>(null);
    const quizRef = useRef<HTMLDivElement>(null);

    const t = quizData[lang];

    const score = userAnswers.reduce((acc, ans, idx) => {
        return ans === t.questions[idx].correct ? acc + 1 : acc;
    }, 0);

    useEffect(() => {
        gsap.fromTo(".reveal-simple", 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.5, stagger: 0.1, ease: "none" }
        );
    }, [lang, quizStarted, showResults]);

    useEffect(() => {
        if (showResults && selectedCurator) {
            updateSanitaryStats(score, selectedCurator).catch(err => console.error('Failed to sync with Bitrix:', err));
        }
    }, [showResults, score, selectedCurator]);

    const handleAnswer = (shuffledIdx: number) => {
        const originalIdx = shuffledOptionsIndexes[currentQuestion][shuffledIdx];
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = originalIdx;
        setUserAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < t.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    return (
        <div ref={contentRef} className="bg-brand-light">
            <SeoHead
                title="Обучающий курс по уборке стеклянных, зеркальных и хромированных поверхностей | IC Group"
                description="Обучающий курс IC Group по стандартам очистки стекла, зеркал, витражей и хромированных поверхностей."
                path="/training/sanitary"
                robots="noindex,follow"
            />
            <main className="min-h-screen pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative reveal-simple">
                        <div className="relative z-10">
                            <span className="text-brand-green text-[10px] font-bold tracking-[0.3em] uppercase block mb-2">
                                Обучение
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-dark leading-tight">
                                {t.title}
                            </h1>
                            <p className="mt-2 text-brand-dark/50 font-medium max-w-xl">
                                {t.subtitle}
                            </p>
                        </div>

                        <div className="flex bg-white p-1 rounded-full border border-brand-dark/5 shadow-sm">
                            {(['ru', 'kz'] as const).map((l) => (
                                <button 
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === l ? 'bg-brand-dark text-white' : 'text-brand-dark/50 hover:bg-brand-dark/5'}`}
                                >
                                    {l === 'ru' ? 'РУС' : 'ҚАЗ'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!quizStarted ? (
                        <div className="reveal-simple">
                            {/* Videos Section */}
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-brand-green text-white rounded-lg flex items-center justify-center">
                                        <Play size={16} fill="currentColor" />
                                    </div>
                                    <h2 className="text-xl font-bold text-brand-dark">{t.videosTitle}</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {videos.map((video) => (
                                        <div key={video.id} className="bg-white p-4 rounded-2xl shadow-sm border border-brand-dark/5 transition-transform hover:scale-[1.01]">
                                            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3">
                                                <iframe 
                                                    width="100%" height="100%" 
                                                    src={`https://www.youtube.com/embed/${video.id}`} 
                                                    title={video.title[lang]}
                                                    frameBorder="0" allowFullScreen
                                                ></iframe>
                                            </div>
                                            <h3 className="font-bold text-sm text-brand-dark">{video.title[lang]}</h3>
                                            {video.duration && (
                                                <p className="text-[10px] text-brand-dark/40 mt-0.5 uppercase font-bold">{video.duration}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Curator Selection */}
                            <div className="bg-white rounded-3xl p-8 shadow-lg border border-brand-dark/5">
                                <div className="flex items-center gap-3 mb-6 font-bold text-brand-dark">
                                    <User size={18} />
                                    <h2>{t.curatorLabel}</h2>
                                </div>

                                <div className="relative mb-8">
                                    <select 
                                        value={selectedCurator}
                                        onChange={(e) => setSelectedCurator(e.target.value)}
                                        className="w-full p-4 rounded-xl border-2 border-brand-dark/5 bg-brand-dark/[0.02] text-brand-dark font-bold text-sm appearance-none cursor-pointer focus:border-brand-green outline-none transition-all"
                                    >
                                        <option value="" disabled>{lang === 'ru' ? 'Выберите из списка...' : 'Тізімнен таңдаңыз...'}</option>
                                        {curators.map((curator) => (
                                            <option key={curator} value={curator}>
                                                {curator}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-dark/30">
                                        <ChevronRight size={18} className="rotate-90" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setQuizStarted(true)}
                                    disabled={!selectedCurator}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all ${selectedCurator ? 'bg-brand-green text-white hover:bg-brand-green/90 shadow-lg' : 'bg-brand-dark/10 text-brand-dark/20 cursor-not-allowed'}`}
                                >
                                    {t.startBtn}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="reveal-simple">
                            {!showResults ? (
                                <div className="bg-white rounded-3xl p-8 shadow-xl border border-brand-dark/5" ref={quizRef}>
                                    <div className="h-1 bg-brand-dark/5 rounded-full mb-8 overflow-hidden">
                                        <div className="h-full bg-brand-green transition-all duration-300" style={{ width: `${((currentQuestion + 1) / t.questions.length) * 100}%` }} />
                                    </div>
                                    
                                    <div className="mb-8">
                                        <span className="text-brand-green font-bold text-[10px] tracking-widest uppercase block mb-2">
                                            {lang === 'ru' ? 'Вопрос' : 'Сұрақ'} {currentQuestion + 1} / {t.questions.length}
                                        </span>
                                        <h3 className="text-xl font-bold text-brand-dark">
                                            {t.questions[currentQuestion].text}
                                        </h3>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {shuffledOptionsIndexes[currentQuestion].map((originalIdx, shuffledIdx) => (
                                            <button
                                                key={shuffledIdx}
                                                onClick={() => handleAnswer(shuffledIdx)}
                                                className={`w-full text-left p-5 rounded-xl border transition-all font-bold text-[14px] ${
                                                    userAnswers[currentQuestion] === originalIdx 
                                                    ? 'border-brand-green bg-brand-green/5 text-brand-dark' 
                                                    : 'border-brand-dark/5 bg-brand-dark/[0.02] hover:border-brand-dark/10'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                        userAnswers[currentQuestion] === originalIdx ? 'border-brand-green bg-brand-green' : 'border-brand-dark/10'
                                                    }`}>
                                                        {userAnswers[currentQuestion] === originalIdx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    {t.questions[currentQuestion].options[originalIdx]}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button 
                                            onClick={handlePrev}
                                            disabled={currentQuestion === 0}
                                            className={`font-bold uppercase tracking-widest text-[10px] transition-all
                                                ${currentQuestion === 0 ? 'opacity-0 pointer-events-none' : 'text-brand-dark/40 hover:text-brand-dark'}`}
                                        >
                                            {t.prevBtn}
                                        </button>
                                        
                                        <button 
                                            onClick={handleNext}
                                            disabled={userAnswers[currentQuestion] === -1}
                                            className={`px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all
                                                ${userAnswers[currentQuestion] === -1 
                                                    ? 'bg-brand-dark/10 text-brand-dark/20 cursor-not-allowed' 
                                                    : 'bg-brand-green text-white hover:bg-brand-green/90'}`}
                                        >
                                            {currentQuestion === t.questions.length - 1 ? t.finishBtn : t.nextBtn}
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-brand-dark rounded-3xl p-12 text-center shadow-xl">
                                    <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 ${score >= 8 ? 'bg-brand-green text-white' : 'bg-orange-500 text-white'}`}>
                                        <CheckCircle2 size={32} />
                                    </div>
                                    
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                        {t.resultTitle}: {score} / {t.questions.length}
                                    </h3>
                                    
                                    <p className="text-white/60 mb-8 max-sm mx-auto font-medium">
                                        {score >= 8 ? t.passMessage : t.failMessage}
                                    </p>

                                    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                                        Куратор: {selectedCurator}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SanitaryQuizPage;
