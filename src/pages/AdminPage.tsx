import { useState, useEffect } from 'react';
import { LogIn, Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon, Send, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

interface NewsArticle {
    id: string;
    title: string;
    date: string;
    category: string;
    desc: string;
    image: string;
    tag: string;
    readTime: string;
    createdAt?: string;
    updatedAt?: string;
}

const AdminPage = () => {
    const [session, setSession] = useState<string | null>(localStorage.getItem('admin_session'));
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [pendingToken, setPendingToken] = useState('');
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    // Fetch news
    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/news`);
            const data = await res.json();
            setNews(Array.isArray(data) ? data : []);
        } catch {
            setNews([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (session) fetchNews();
    }, [session]);

    // Auth: send code
    const sendCode = async () => {
        setAuthLoading(true);
        setAuthError('');
        try {
            const res = await fetch(`${API_BASE}/auth/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phone.replace(/\D/g, '') }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setPendingToken(data.token);
            setStep('code');
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : 'Ошибка');
        }
        setAuthLoading(false);
    };

    // Auth: verify code
    const verifyCode = async () => {
        setAuthLoading(true);
        setAuthError('');
        try {
            const res = await fetch(`${API_BASE}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, token: pendingToken }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            localStorage.setItem('admin_session', data.sessionToken);
            setSession(data.sessionToken);
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : 'Ошибка');
        }
        setAuthLoading(false);
    };

    const logout = () => {
        localStorage.removeItem('admin_session');
        setSession(null);
        setStep('phone');
        setCode('');
        setPendingToken('');
    };

    // Upload image
    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const res = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session}`,
                    'Content-Type': file.type,
                },
                body: file,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setEditingArticle(prev => prev ? { ...prev, image: data.url } : null);
        } catch (err) {
            alert('Ошибка загрузки изображения');
            console.error(err);
        }
        setUploading(false);
    };

    // Save article
    const saveArticle = async () => {
        if (!editingArticle?.title) return;
        setSaveLoading(true);
        try {
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? `${API_BASE}/news` : `${API_BASE}/news?id=${editingArticle.id}`;
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`,
                },
                body: JSON.stringify(editingArticle),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            await fetchNews();
            setEditingArticle(null);
            setIsNew(false);
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Ошибка сохранения');
        }
        setSaveLoading(false);
    };

    // Delete article
    const deleteArticle = async (id: string) => {
        if (!confirm('Удалить новость?')) return;
        try {
            await fetch(`${API_BASE}/news?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session}` },
            });
            await fetchNews();
        } catch {
            alert('Ошибка удаления');
        }
    };

    // ======= AUTH SCREEN =======
    if (!session) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-dark/40 hover:text-brand-green transition-colors mb-8">
                        <ArrowLeft size={16} /> На сайт
                    </Link>

                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-black/5">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                                <LogIn size={28} className="text-brand-green" />
                            </div>
                            <h1 className="text-2xl font-bold uppercase tracking-tight">Админ-панель</h1>
                            <p className="text-sm text-brand-dark/40 mt-2">IC Group — Управление новостями</p>
                        </div>

                        {step === 'phone' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Номер телефона</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="+7 707 052 2006"
                                        className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                                <button
                                    onClick={sendCode}
                                    disabled={authLoading || !phone}
                                    className="w-full flex items-center justify-center gap-3 bg-brand-dark text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-green transition-all disabled:opacity-50"
                                >
                                    {authLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    Получить код в Telegram
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-brand-dark/50 text-center">
                                    Код отправлен в Telegram-группу
                                </p>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Код подтверждения</label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-3xl font-bold tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                                <button
                                    onClick={verifyCode}
                                    disabled={authLoading || code.length !== 6}
                                    className="w-full flex items-center justify-center gap-3 bg-brand-green text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-dark transition-all disabled:opacity-50"
                                >
                                    {authLoading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                                    Войти
                                </button>
                                <button onClick={() => { setStep('phone'); setAuthError(''); }} className="w-full text-sm text-brand-dark/30 hover:text-brand-dark transition-colors">
                                    ← Другой номер
                                </button>
                            </div>
                        )}

                        {authError && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium text-center">
                                {authError}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ======= EDITOR MODAL =======
    if (editingArticle) {
        return (
            <div className="min-h-screen bg-brand-light px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-tight">
                            {isNew ? '✨ Новая новость' : '✏️ Редактирование'}
                        </h2>
                        <button onClick={() => { setEditingArticle(null); setIsNew(false); }} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-black/5 space-y-6">
                        {/* Image */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Изображение</label>
                            {editingArticle.image && (
                                <img src={editingArticle.image} alt="" className="w-full h-48 object-cover rounded-2xl mb-3" />
                            )}
                            <div className="flex gap-3">
                                <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-brand-light rounded-2xl border border-dashed border-black/10 cursor-pointer hover:border-brand-green/40 transition-colors">
                                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    <span className="text-xs font-bold uppercase tracking-wider">{uploading ? 'Загрузка...' : 'Загрузить файл'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        placeholder="или вставьте URL"
                                        value={editingArticle.image || ''}
                                        onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })}
                                        className="w-full px-4 py-3 bg-brand-light rounded-2xl border border-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Заголовок</label>
                            <input
                                type="text"
                                value={editingArticle.title || ''}
                                onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                                placeholder="Заголовок новости"
                                className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                            />
                        </div>

                        {/* Category + Tag + Date */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Категория</label>
                                <input
                                    type="text"
                                    value={editingArticle.category || ''}
                                    onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value })}
                                    placeholder="Технологии"
                                    className="w-full px-4 py-3 bg-brand-light rounded-2xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Тег</label>
                                <input
                                    type="text"
                                    value={editingArticle.tag || ''}
                                    onChange={e => setEditingArticle({ ...editingArticle, tag: e.target.value })}
                                    placeholder="Новое"
                                    className="w-full px-4 py-3 bg-brand-light rounded-2xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Дата</label>
                                <input
                                    type="text"
                                    value={editingArticle.date || ''}
                                    onChange={e => setEditingArticle({ ...editingArticle, date: e.target.value })}
                                    placeholder="15 Марта 2026"
                                    className="w-full px-4 py-3 bg-brand-light rounded-2xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                                />
                            </div>
                        </div>

                        {/* Read time */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Время чтения</label>
                            <input
                                type="text"
                                value={editingArticle.readTime || ''}
                                onChange={e => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                                placeholder="5 мин"
                                className="w-full px-4 py-3 bg-brand-light rounded-2xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 block mb-2">Описание</label>
                            <textarea
                                value={editingArticle.desc || ''}
                                onChange={e => setEditingArticle({ ...editingArticle, desc: e.target.value })}
                                placeholder="Полное описание новости..."
                                rows={5}
                                className="w-full px-5 py-4 bg-brand-light rounded-2xl border border-black/5 text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-green/30 resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={saveArticle}
                                disabled={saveLoading || !editingArticle.title}
                                className="flex-1 flex items-center justify-center gap-3 bg-brand-green text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-brand-dark transition-all disabled:opacity-50"
                            >
                                {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isNew ? 'Опубликовать' : 'Сохранить'}
                            </button>
                            <button
                                onClick={() => { setEditingArticle(null); setIsNew(false); }}
                                className="px-8 py-4 bg-brand-light rounded-2xl font-bold uppercase text-sm tracking-widest text-brand-dark/40 hover:text-brand-dark transition-colors border border-black/5"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ======= NEWS LIST =======
    return (
        <div className="min-h-screen bg-brand-light px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-dark/40 hover:text-brand-green transition-colors mb-2">
                            <ArrowLeft size={16} /> На сайт
                        </Link>
                        <h1 className="text-3xl font-bold uppercase tracking-tight">Новости</h1>
                        <p className="text-sm text-brand-dark/40 mt-1">Управление новостями сайта</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setEditingArticle({ title: '', desc: '', date: '', category: '', tag: '', image: '', readTime: '3 мин' }); setIsNew(true); }}
                            className="flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-brand-dark transition-all shadow-lg"
                        >
                            <Plus size={16} /> Добавить
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-3 bg-white rounded-2xl font-bold uppercase text-xs tracking-widest text-brand-dark/40 hover:text-red-500 transition-colors border border-black/5"
                        >
                            Выйти
                        </button>
                    </div>
                </div>

                {/* News List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-brand-green" />
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-black/5">
                        <ImageIcon size={48} className="mx-auto text-brand-dark/10 mb-4" />
                        <p className="text-lg font-bold text-brand-dark/30">Новостей пока нет</p>
                        <p className="text-sm text-brand-dark/20 mt-2">Нажмите «Добавить» чтобы создать первую</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map(article => (
                            <div key={article.id} className="bg-white rounded-[24px] border border-black/5 p-5 flex items-center gap-6 hover:shadow-lg hover:border-brand-green/20 transition-all group">
                                {article.image ? (
                                    <img src={article.image} alt="" className="w-20 h-20 object-cover rounded-2xl flex-shrink-0" />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-brand-light flex items-center justify-center flex-shrink-0">
                                        <ImageIcon size={24} className="text-brand-dark/10" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {article.tag && <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green text-[9px] font-bold uppercase tracking-wider rounded-full">{article.tag}</span>}
                                        <span className="text-[10px] text-brand-dark/30">{article.date}</span>
                                    </div>
                                    <h3 className="font-bold text-brand-dark truncate">{article.title}</h3>
                                    <p className="text-xs text-brand-dark/40 truncate mt-1">{article.desc}</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingArticle({ ...article }); setIsNew(false); }}
                                        className="p-3 rounded-xl hover:bg-brand-green/10 transition-colors text-brand-dark/40 hover:text-brand-green"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteArticle(article.id)}
                                        className="p-3 rounded-xl hover:bg-red-50 transition-colors text-brand-dark/40 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
