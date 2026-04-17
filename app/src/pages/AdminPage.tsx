import { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Image as ImageIcon,
    Key,
    Loader2,
    LogOut,
    Newspaper,
    Pencil,
    Plus,
    Save,
    Trash2,
    ExternalLink,
    Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

interface NewsArticle {
    id: string;
    title: string;
    date: string;
    category: string;
    desc: string;
    image: string;
    tag: string;
    readTime: string;
    company?: string;
    stat?: string;
    metric?: string;
    imagePositionX?: number;
    imagePositionY?: number;
}

interface VerifyResponse {
    success: boolean;
    sessionToken: string;
}

const SESSION_STORAGE_KEY = 'admin_session';
const BROKEN_GITHUB_UPLOAD_PREFIXES = [
    'https://raw.githubusercontent.com/tammat11/ICwebsite/main/uploads/',
    'https://raw.githubusercontent.com/tammat11/ICwebsite/master/uploads/',
];

const normalizeImageUrl = (image?: string) => {
    if (!image) return '';

    const brokenPrefix = BROKEN_GITHUB_UPLOAD_PREFIXES.find(prefix => image.startsWith(prefix));
    if (brokenPrefix) {
        return image.replace(brokenPrefix, '/uploads/');
    }

    return image;
};

const normalizeImagePositionValue = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 50;
    return Math.min(100, Math.max(0, value));
};

const getImageObjectPosition = (article?: Partial<NewsArticle> | null) =>
    `${normalizeImagePositionValue(article?.imagePositionX)}% ${normalizeImagePositionValue(article?.imagePositionY)}%`;

const AdminLayout = ({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) => (
    <div className="min-h-screen bg-brand-light flex">
        <aside className="w-56 flex-shrink-0 border-r border-black/5 bg-white flex flex-col hidden md:flex">
            <div className="p-6 border-b border-black/5">
                <h1 className="text-sm font-black uppercase tracking-widest text-brand-dark">IC Group</h1>
                <p className="text-[10px] text-brand-dark/40 uppercase tracking-wider mt-1">CMS</p>
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

const isStoredSessionActive = (token: string | null) => {
    if (!token) return false;

    try {
        const [payloadB64] = token.split('.');
        if (!payloadB64) return false;
        const payload = JSON.parse(atob(payloadB64));
        return typeof payload.exp === 'number' && payload.exp > Date.now();
    } catch {
        return false;
    }
};

const AdminPage = () => {
    const [sessionToken, setSessionToken] = useState<string | null>(() => {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY);
        return isStoredSessionActive(stored) ? stored : null;
    });
    const [isAuthed, setIsAuthed] = useState(() => isStoredSessionActive(localStorage.getItem(SESSION_STORAGE_KEY)));
    const [phone, setPhone] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [pendingToken, setPendingToken] = useState('');
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [error, setError] = useState('');

    const logout = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionToken(null);
        setPendingToken('');
        setInputCode('');
        setStep('phone');
        setIsAuthed(false);
        setNews([]);
        setEditingArticle(null);
        setIsNew(false);
        setError('');
    };

    const authorizedFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
        if (!sessionToken) {
            throw new Error('Сессия истекла. Войдите заново.');
        }

        const headers = new Headers(init.headers);
        headers.set('Authorization', `Bearer ${sessionToken}`);

        return fetch(input, {
            ...init,
            headers,
        });
    };

    useEffect(() => {
        if (!sessionToken) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setIsAuthed(false);
            return;
        }

        if (!isStoredSessionActive(sessionToken)) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setSessionToken(null);
            setPendingToken('');
            setInputCode('');
            setStep('phone');
            setIsAuthed(false);
            setNews([]);
            setEditingArticle(null);
            setIsNew(false);
            setError('');
            return;
        }

        localStorage.setItem(SESSION_STORAGE_KEY, sessionToken);
        setIsAuthed(true);
    }, [sessionToken]);

    useEffect(() => {
        if (!sessionToken || !isAuthed) return;

        let cancelled = false;

        const loadNews = async () => {
            setLoading(true);
            setError('');

            try {
                const res = await fetch('/api/news');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || `Ошибка ${res.status}`);
                }

                if (!cancelled) {
                    setNews(Array.isArray(data)
                        ? data.map(item => ({ ...item, image: normalizeImageUrl(item.image) }))
                        : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Не удалось загрузить новости');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadNews();

        return () => {
            cancelled = true;
        };
    }, [sessionToken, isAuthed]);

    const sendTgCode = async () => {
        if (!phone.trim()) {
            alert('Введите телефон');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phone.trim() }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Не удалось отправить код');
            }

            setPendingToken(data.token);
            setStep('code');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось отправить код');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!inputCode.trim() || !pendingToken) {
            alert('Введите код из Telegram');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: inputCode.trim(), token: pendingToken }),
            });
            const data: VerifyResponse & { error?: string } = await res.json();

            if (!res.ok || !data.sessionToken) {
                throw new Error(data.error || 'Не удалось подтвердить вход');
            }

            setSessionToken(data.sessionToken);
            setInputCode('');
            setPendingToken('');
            setStep('phone');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось подтвердить вход');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveArticle = async () => {
        if (!editingArticle?.title) return;

        setSaveLoading(true);
        setError('');

        try {
            const method = isNew ? 'POST' : 'PUT';
            const target = isNew ? '/api/news' : `/api/news?id=${editingArticle.id}`;
            const payload = {
                ...editingArticle,
            };

            const res = await authorizedFetch(target, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (res.status === 401) {
                logout();
                throw new Error('Сессия истекла. Войдите заново.');
            }

            if (!res.ok) {
                throw new Error(data.error || 'Не удалось сохранить новость');
            }

            if (isNew) {
                setNews(prev => [data, ...prev]);
            } else {
                setNews(prev => prev.map(item => item.id === data.id ? data : item));
            }

            setEditingArticle(null);
            setIsNew(false);
            alert('Изменения сохранены. Сайт обновится после нового деплоя.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось сохранить новость');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDeleteArticle = async (id: string) => {
        if (!confirm('Удалить новость?')) return;

        setSaveLoading(true);
        setError('');

        try {
            const res = await authorizedFetch(`/api/news?id=${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.status === 401) {
                logout();
                throw new Error('Сессия истекла. Войдите заново.');
            }

            if (!res.ok) {
                throw new Error(data.error || 'Не удалось удалить новость');
            }

            setNews(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось удалить новость');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadLoading(true);
        setError('');

        try {
            const res = await authorizedFetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': file.type || 'image/jpeg',
                    'X-File-Name': encodeURIComponent(file.name),
                },
                body: file,
            });
            const data = await res.json();

            if (res.status === 401) {
                logout();
                throw new Error('Сессия истекла. Войдите заново.');
            }

            if (!res.ok) {
                throw new Error(data.error || 'Не удалось загрузить изображение');
            }

            setEditingArticle(prev => prev ? { ...prev, image: normalizeImageUrl(data.url) } : null);
            alert('Изображение загружено.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить изображение');
        } finally {
            setUploadLoading(false);
            e.target.value = '';
        }
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center px-6 font-sans">
                <SeoHead
                    title="Admin | IC Group"
                    description="Admin panel"
                    path="/admin"
                    robots="noindex,nofollow"
                />
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-black/5">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                                <Key size={28} className="text-brand-green" />
                            </div>
                            <h1 className="text-2xl font-bold uppercase tracking-tight text-brand-dark">Вход в CMS</h1>
                            <p className="text-sm text-brand-dark/40 mt-2 italic">Телефон + код из Telegram</p>
                            {error && <p className="text-red-500 text-[10px] font-bold uppercase mt-4 bg-red-50 p-2 rounded-lg text-center">{error}</p>}
                        </div>

                        {step === 'phone' ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    void sendTgCode();
                                }}
                                className="space-y-4"
                            >
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Ваш номер телефона"
                                    className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-brand-dark text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-green transition-all disabled:opacity-70"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Получить код'}
                                </button>
                            </form>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    void handleLogin();
                                }}
                                className="space-y-4"
                            >
                                <input
                                    type="text"
                                    value={inputCode}
                                    onChange={e => setInputCode(e.target.value)}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-3xl font-bold tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-brand-green text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-dark transition-all disabled:opacity-70"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Войти'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('phone');
                                        setInputCode('');
                                        setPendingToken('');
                                        setError('');
                                    }}
                                    className="w-full text-[10px] uppercase tracking-widest text-brand-dark/30 hover:text-brand-dark transition-colors"
                                >
                                    ← Другой номер
                                </button>
                            </form>
                        )}
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
                            onClick={() => {
                                setEditingArticle(null);
                                setIsNew(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 text-brand-dark/60 hover:text-brand-dark hover:bg-black/5 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft size={14} /> Назад
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-black/5 space-y-6">
                        {error && <p className="text-red-500 text-xs font-bold bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}

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
                                    <div className="flex flex-wrap gap-2">
                                        {['Проекты', 'Новости', 'Кейсы'].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setEditingArticle({ ...editingArticle, category: cat })}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${editingArticle.category === cat ? 'bg-brand-green text-white shadow-md' : 'bg-brand-light text-brand-dark/40 hover:bg-brand-green/10'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Изображение (URL или загрузка)</label>
                                <div className="relative group">
                                    {editingArticle.image ? (
                                        <img
                                            src={normalizeImageUrl(editingArticle.image)}
                                            alt=""
                                            className="w-full h-[116px] object-cover rounded-xl border border-black/5 mb-2"
                                            style={{ objectPosition: getImageObjectPosition(editingArticle) }}
                                        />
                                    ) : (
                                        <div className="w-full h-[116px] rounded-xl bg-brand-light border-2 border-dashed border-black/5 flex items-center justify-center mb-2">
                                            <ImageIcon className="text-brand-dark/10" size={32} />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={editingArticle.image || ''}
                                            onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })}
                                            placeholder="https://..."
                                            className="flex-1 px-5 py-3.5 bg-brand-light rounded-xl border border-black/5 text-[10px] focus:outline-none focus:ring-2 focus:ring-brand-green/30 font-mono"
                                        />
                                        <label className={`cursor-pointer ${uploadLoading ? 'bg-gray-400' : 'bg-brand-green'} text-white px-4 py-2 rounded-xl flex items-center justify-center hover:bg-brand-dark transition-all shadow-sm`}>
                                            {uploadLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadLoading} />
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-4 rounded-2xl border border-black/5 bg-brand-light/70 p-4 space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Позиция фото</p>
                                            <p className="text-[11px] text-brand-dark/40 mt-1">Подвинь фокус, чтобы карточка не отрезала важную часть кадра.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setEditingArticle({
                                                ...editingArticle,
                                                imagePositionX: 50,
                                                imagePositionY: 50,
                                            })}
                                            className="px-3 py-2 rounded-xl bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest text-brand-dark/50 hover:text-brand-dark hover:border-brand-green/20 transition-colors"
                                        >
                                            Центр
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">
                                                Горизонталь: {normalizeImagePositionValue(editingArticle.imagePositionX)}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={normalizeImagePositionValue(editingArticle.imagePositionX)}
                                                onChange={e => setEditingArticle({
                                                    ...editingArticle,
                                                    imagePositionX: Number(e.target.value),
                                                })}
                                                className="w-full accent-brand-green"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">
                                                Вертикаль: {normalizeImagePositionValue(editingArticle.imagePositionY)}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={normalizeImagePositionValue(editingArticle.imagePositionY)}
                                                onChange={e => setEditingArticle({
                                                    ...editingArticle,
                                                    imagePositionY: Number(e.target.value),
                                                })}
                                                className="w-full accent-brand-green"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {editingArticle.category === 'Кейсы' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-brand-green/[0.03] rounded-3xl border border-brand-green/10">
                                <div className="col-span-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-green mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                                    Данные кейса
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Компания</label>
                                    <input
                                        type="text"
                                        value={editingArticle.company || ''}
                                        onChange={e => setEditingArticle({ ...editingArticle, company: e.target.value })}
                                        placeholder="Напр. Kaspi Bank"
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-black/5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Показатель</label>
                                    <input
                                        type="text"
                                        value={editingArticle.stat || ''}
                                        onChange={e => setEditingArticle({ ...editingArticle, stat: e.target.value })}
                                        placeholder="Напр. 500 клинеров"
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-black/5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Метрика</label>
                                    <input
                                        type="text"
                                        value={editingArticle.metric || ''}
                                        onChange={e => setEditingArticle({ ...editingArticle, metric: e.target.value })}
                                        placeholder="Напр. Экономия"
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-black/5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                            </div>
                        )}

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
                                onClick={() => void handleSaveArticle()}
                                disabled={saveLoading || !editingArticle.title}
                                className="flex-1 flex items-center justify-center gap-3 bg-brand-dark text-white py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-brand-green transition-all disabled:opacity-50 shadow-lg"
                            >
                                {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isNew ? 'Опубликовать' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <>
            <SeoHead
                title="Admin | IC Group"
                description="Admin panel"
                path="/admin"
                robots="noindex,nofollow"
            />
            <AdminLayout onLogout={logout}>
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold uppercase tracking-tight text-brand-dark">Новости</h1>
                            <p className="text-sm text-brand-dark/40 mt-1 italic">Управление контентом через серверный API</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingArticle({
                                    title: '',
                                    desc: '',
                                    date: new Date().toLocaleDateString('ru-RU'),
                                    category: 'Проекты',
                                    tag: 'NEW',
                                    image: '',
                                    readTime: '3 мин',
                                    imagePositionX: 50,
                                    imagePositionY: 50,
                                });
                                setIsNew(true);
                                setError('');
                            }}
                            className="flex items-center gap-2 bg-brand-green text-white px-6 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-brand-dark transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                        >
                            <Plus size={18} /> Добавить
                        </button>
                    </div>

                    {error && !editingArticle && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[24px] text-red-600 font-bold text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-black/5 shadow-sm">
                            <Loader2 size={40} className="animate-spin text-brand-green mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/30 animate-pulse">Синхронизация...</p>
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
                                        <img
                                            src={article.image}
                                            alt=""
                                            className="w-20 h-20 object-cover rounded-2xl flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm"
                                            style={{ objectPosition: getImageObjectPosition(article) }}
                                        />
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
                                            onClick={() => {
                                                setEditingArticle({ ...article });
                                                setIsNew(false);
                                                setError('');
                                            }}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-light hover:bg-brand-green hover:text-white text-brand-dark/40 transition-all"
                                            title="Изменить"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => void handleDeleteArticle(article.id)}
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
        </>
    );
};

export default AdminPage;
