import { useState, useEffect } from 'react';
import { LogIn, Plus, Pencil, Trash2, Save, Image as ImageIcon, Send, Loader2, ArrowLeft, Newspaper, ExternalLink, LogOut, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

const REPO_OWNER = 'tammat11';
const REPO_NAME = 'ICwebsite';
const FILE_PATH = 'app/src/data/news.json';

const TG_BOT_TOKEN = '8459731566:AAGbkYk43Fyg7kxcqMuDxbBXgC1LHfSL9bU';
const TG_CHAT_ID = '-5105161509';

const ALLOWED_PHONES = ['77070522006', '77026666113'];

interface NewsArticle {
    id: string;
    title: string;
    date: string;
    category: string;
    desc: string;
    image: string;
    tag: string;
    readTime: string;
}

const AdminLayout = ({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) => (
    <div className="min-h-screen bg-brand-light flex">
        <aside className="w-56 flex-shrink-0 border-r border-black/5 bg-white flex flex-col hidden md:flex">
            <div className="p-6 border-b border-black/5">
                <h1 className="text-sm font-black uppercase tracking-widest text-brand-dark">IC Group</h1>
                <p className="text-[10px] text-brand-dark/40 uppercase tracking-wider mt-1">CMS (GitHub Based)</p>
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-green/10 text-brand-green font-bold text-xs uppercase tracking-wider">
                    <Newspaper size={16} />
                    Новости
                </div>
            </nav>
            <div className="p-3 border-t border-black/5 space-y-0.5">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-dark/50 hover:text-brand-dark hover:bg-black/5 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                    <ExternalLink size={14} />
                    На сайт
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-dark/50 hover:text-red-500 hover:bg-red-50 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                    <LogOut size={14} />
                    Выйти
                </button>
            </div>
        </aside>
        <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
            {children}
        </main>
    </div>
);

const AdminPage = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('gh_token'));
    const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('admin_authenticated'));
    const [phone, setPhone] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [inputToken, setInputToken] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [fileSha, setFileSha] = useState('');
    const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchFromGitHub = async () => {
        if (!token || !isAuthed) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!res.ok) throw new Error('Не удалось загрузить данные. Проверьте токен.');
            const data = await res.json();
            setFileSha(data.sha);
            const content = JSON.parse(decodeURIComponent(escape(atob(data.content))));
            setNews(Array.isArray(content) ? content : []);
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('401')) {
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchFromGitHub();
    }, [token]);

    const handleLogin = () => {
        if (inputCode === generatedCode && generatedCode !== '') {
            localStorage.setItem('admin_authenticated', 'true');
            setIsAuthed(true);
        } else {
            alert('Неверный код');
        }
    };

    const sendTgCode = async () => {
        if (!phone) return alert('Введите телефон');
        const cleanPhone = phone.replace(/\D/g, '');
        if (!ALLOWED_PHONES.includes(cleanPhone)) {
            return alert('Доступ запрещен для этого номера');
        }
        
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        
        try {
            const message = `🔐 *Код входа в админку*\n\nПользователь: \`${phone}\`\nКод: \`${code}\``;
            await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TG_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            setStep('code');
        } catch (err) {
            alert('Ошибка отправки в Telegram');
        }
    };

    const logout = () => {
        localStorage.removeItem('gh_token');
        localStorage.removeItem('admin_authenticated');
        setToken(null);
        setIsAuthed(false);
        setNews([]);
    };

    const saveToGitHub = async (updatedNews: NewsArticle[]) => {
        setSaveLoading(true);
        try {
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(updatedNews, null, 2))));
            const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `CMS: Update news.json ${new Date().toISOString()}`,
                    content: content,
                    sha: fileSha
                })
            });
            if (!res.ok) throw new Error('Ошибка при сохранении на GitHub');
            const data = await res.json();
            setFileSha(data.content.sha);
            setNews(updatedNews);
            setEditingArticle(null);
            setIsNew(false);
            alert('Изменения сохранены! Сайт обновится через пару минут.');
        } catch (err: any) {
            alert(err.message);
        }
        setSaveLoading(false);
    };

    const handleSaveArticle = () => {
        if (!editingArticle?.title) return;
        let updatedNews;
        if (isNew) {
            const newArticle = {
                ...editingArticle,
                id: Date.now().toString(),
            } as NewsArticle;
            updatedNews = [newArticle, ...news];
        } else {
            updatedNews = news.map(n => n.id === editingArticle.id ? (editingArticle as NewsArticle) : n);
        }
        saveToGitHub(updatedNews);
    };

    const handleDeleteArticle = (id: string) => {
        if (!confirm('Удалить новость?')) return;
        const updatedNews = news.filter(n => n.id !== id);
        saveToGitHub(updatedNews);
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center px-6 font-sans">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-black/5">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                                <Key size={28} className="text-brand-green" />
                            </div>
                            <h1 className="text-2xl font-bold uppercase tracking-tight text-brand-dark">Вход в CMS</h1>
                            <p className="text-sm text-brand-dark/40 mt-2 italic">Подтверждение через Telegram</p>
                        </div>
                        
                        {step === 'phone' ? (
                            <div className="space-y-4">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Ваш номер телефона"
                                    className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                                <button
                                    onClick={sendTgCode}
                                    className="w-full flex items-center justify-center gap-3 bg-brand-dark text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-green transition-all"
                                >
                                    Получить код
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={inputCode}
                                    onChange={e => setInputCode(e.target.value)}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-3xl font-bold tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                                <button
                                    onClick={handleLogin}
                                    className="w-full flex items-center justify-center gap-3 bg-brand-green text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-dark transition-all"
                                >
                                    Войти
                                </button>
                                <button onClick={() => setStep('phone')} className="w-full text-[10px] uppercase tracking-widest text-brand-dark/30 hover:text-brand-dark transition-colors">
                                    ← Другой номер
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center px-6 font-sans">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-black/5">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                                <Key size={28} className="text-brand-green" />
                            </div>
                            <h1 className="text-2xl font-bold uppercase tracking-tight text-brand-dark">GitHub Token</h1>
                            <p className="text-sm text-brand-dark/40 mt-2 italic">Введите токен репозитория</p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="password"
                                value={inputToken}
                                onChange={e => setInputToken(e.target.value)}
                                placeholder="ghp_xxxxxxxxxxxx"
                                className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                            />
                            <button
                                onClick={() => {
                                    if (inputToken.trim()) {
                                        localStorage.setItem('gh_token', inputToken.trim());
                                        setToken(inputToken.trim());
                                        setInputToken('');
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-3 bg-brand-dark text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-green transition-all"
                            >
                                Сохранить токен
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (editingArticle) {
        return (
            <AdminLayout onLogout={logout}>
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-brand-dark">
                                {isNew ? 'Новая новость' : 'Редактирование'}
                            </h2>
                            <p className="text-xs text-brand-dark/40 mt-1 uppercase tracking-widest">Заполните все поля</p>
                        </div>
                        <button
                            onClick={() => { setEditingArticle(null); setIsNew(false); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 text-brand-dark/60 hover:text-brand-dark hover:bg-black/5 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft size={14} /> Назад
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-black/5 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Заголовок</label>
                                    <input
                                        type="text"
                                        value={editingArticle.title || ''}
                                        onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                                        placeholder="Название проекта..."
                                        className="w-full px-5 py-3.5 bg-brand-light rounded-xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Категория</label>
                                    <input
                                        type="text"
                                        value={editingArticle.category || ''}
                                        onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}
                                        placeholder="Напр. Проекты"
                                        className="w-full px-5 py-3.5 bg-brand-light rounded-xl border border-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Изображение (URL)</label>
                                <div className="relative group">
                                    {editingArticle.image ? (
                                        <img src={editingArticle.image} alt="" className="w-full h-[116px] object-cover rounded-xl border border-black/5 mb-2" />
                                    ) : (
                                        <div className="w-full h-[116px] rounded-xl bg-brand-light border-2 border-dashed border-black/5 flex items-center justify-center mb-2">
                                            <ImageIcon className="text-brand-dark/10" size={32} />
                                        </div>
                                    )}
                                    <input
                                        type="url"
                                        value={editingArticle.image || ''}
                                        onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-5 py-3.5 bg-brand-light rounded-xl border border-black/5 text-[10px] focus:outline-none focus:ring-2 focus:ring-brand-green/30 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Тег</label>
                                <input
                                    type="text"
                                    value={editingArticle.tag || ''}
                                    onChange={e => setEditingArticle({ ...editingArticle, tag: e.target.value })}
                                    placeholder="NEW"
                                    className="w-full px-5 py-3.5 bg-brand-light rounded-xl border border-black/5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Дата</label>
                                <input
                                    type="text"
                                    value={editingArticle.date || ''}
                                    onChange={e => setEditingArticle({ ...editingArticle, date: e.target.value })}
                                    placeholder="15.03.2026"
                                    className="w-full px-5 py-3.5 bg-brand-light rounded-xl border border-black/5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Чтение</label>
                                <input
                                    type="text"
                                    value={editingArticle.readTime || ''}
                                    onChange={e => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                                    placeholder="3 мин"
                                    className="w-full px-5 py-3.5 bg-brand-light rounded-xl border border-black/5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Описание</label>
                            <textarea
                                value={editingArticle.desc || ''}
                                onChange={e => setEditingArticle({ ...editingArticle, desc: e.target.value })}
                                placeholder="Краткое описание новости..."
                                rows={4}
                                className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-green/30 resize-none"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleSaveArticle}
                                disabled={saveLoading || !editingArticle.title}
                                className="flex-1 flex items-center justify-center gap-3 bg-brand-dark text-white py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-brand-green transition-all disabled:opacity-50 shadow-lg"
                            >
                                {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isNew ? 'Опубликовать на GitHub' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout onLogout={logout}>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight text-brand-dark">Новости</h1>
                        <p className="text-sm text-brand-dark/40 mt-1 italic">Управление контентом через GitHub API</p>
                    </div>
                    <button
                        onClick={() => { setEditingArticle({ title: '', desc: '', date: new Date().toLocaleDateString('ru-RU'), category: 'Проекты', tag: 'NEW', image: '', readTime: '3 мин' }); setIsNew(true); }}
                        className="flex items-center gap-2 bg-brand-green text-white px-6 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-brand-dark transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                    >
                        <Plus size={18} /> Добавить
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-black/5 shadow-sm">
                        <Loader2 size={40} className="animate-spin text-brand-green mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/30 animate-pulse">Синхронизация с GitHub...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 bg-red-50 border border-red-100 rounded-[32px] text-center">
                        <p className="text-red-600 font-bold mb-4">{error}</p>
                        <button onClick={fetchFromGitHub} className="text-xs font-bold uppercase tracking-widest text-brand-dark hover:text-brand-green transition-colors underline">Попробовать снова</button>
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-black/5 shadow-sm">
                        <div className="w-20 h-20 rounded-3xl bg-brand-light flex items-center justify-center mx-auto mb-6">
                            <Newspaper size={36} className="text-brand-dark/10" />
                        </div>
                        <p className="text-xl font-bold text-brand-dark/70 uppercase tracking-tight">Новостей пока нет</p>
                        <p className="text-sm text-brand-dark/30 mt-2 mb-8">Нажмите кнопку «Добавить», чтобы создать первую запись</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {news.map(article => (
                            <div key={article.id} className="bg-white rounded-3xl border border-black/5 p-6 flex items-center gap-6 hover:shadow-xl hover:border-brand-green/20 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                {article.image ? (
                                    <img src={article.image} alt="" className="w-20 h-20 object-cover rounded-2xl flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm" />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-brand-light flex items-center justify-center flex-shrink-0">
                                        <ImageIcon size={24} className="text-brand-dark/10" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-1 bg-brand-green/10 text-brand-green text-[9px] font-black uppercase tracking-wider rounded-lg">{article.tag}</span>
                                        <span className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">{article.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-dark truncate pr-20">{article.title}</h3>
                                    <p className="text-xs text-brand-dark/40 truncate mt-1 leading-relaxed">{article.desc}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setEditingArticle({ ...article }); setIsNew(false); }}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-light hover:bg-brand-green hover:text-white text-brand-dark/40 transition-all"
                                        title="Изменить"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteArticle(article.id)}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-500 hover:text-white text-red-400 transition-all"
                                        title="Удалить"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPage;
