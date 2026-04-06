import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, Send, AlertCircle, MapPin } from 'lucide-react';
import { createDailyReportItem, getNearestDeal } from '../utils/bitrix';
import { formatPhone } from '../utils/phone';

const DailyReportPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [opuCount, setOpuCount] = useState<string>('');
    const [opuComment, setOpuComment] = useState('');

    const [umsStock, setUmsStock] = useState<string>(''); 
    const [umsComment, setUmsComment] = useState('');

    const [overdueTasks, setOverdueTasks] = useState<string>(''); 
    const [tasksComment, setTasksComment] = useState('');

    const [uniformCompliance, setUniformCompliance] = useState<string>(''); 
    const [uniformComment, setUniformComment] = useState('');

    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [nearestDeals, setNearestDeals] = useState<{ id: string, title: string, distance: number }[]>([]);
    const [selectedDeal, setSelectedDeal] = useState<{ id: string, title: string, distance: number } | null>(null);
    const [isFindingObject, setIsFindingObject] = useState(false);
    const [showObjectPicker, setShowObjectPicker] = useState(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setLocation(coords);
                    
                    setIsFindingObject(true);
                    const deals = await getNearestDeal(coords.lat, coords.lng);
                    if (deals && deals.length > 0) {
                        setNearestDeals(deals);
                        setSelectedDeal(deals[0]); // По умолчанию берем самый близкий
                    }
                    setIsFindingObject(false);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setLocationError("Доступ к геолокации ограничен. Пожалуйста, разрешите доступ для отправки отчета.");
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setLocationError("Геолокация не поддерживается вашим устройством.");
        }
    }, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        setIsSubmitting(true);

        try {
            const extraFields: Record<string, string | number | boolean> = {
                'ufCrm105_1753787132712': opuCount,
                'ufCrm105_1753787143895': opuComment,
                'ufCrm105_1753787157294': umsStock,
                'ufCrm105_1753787168378': umsComment,
                'ufCrm105_1753787218160': uniformCompliance,
                'ufCrm105_1753787226010': uniformComment,
                'ufCrm105_1753787196844': overdueTasks,
                'ufCrm105_1753787207961': tasksComment,
                'ufCrm105_1753336038': selectedDeal?.title || 'Объект не определен',
                'ufCrm105_1753784383': selectedDeal?.id || ''
            };

            await createDailyReportItem({
                title: `ОТЧЕТ ПО ЧЕК-ЛИСТУ: ${selectedDeal?.title || 'Без объекта'} (${new Date().toLocaleDateString()})`,
                extraFields: extraFields,
                assignedById: selectedDeal?.assignedById,
                contactId: selectedDeal?.contactId,
                companyId: selectedDeal?.companyId,
                comments: (selectedDeal ? `Объект: ${selectedDeal.title}\nID Сделки: ${selectedDeal.id}\n` : '') + 
                    (location ? `Координаты: https://www.google.com/maps?q=${location.lat},${location.lng}\n` : '')
            });

            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            setError('Произошла ошибка при отправке отчета.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-6 pt-32">
                <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-premium text-center animate-scale-in">
                    <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="text-brand-green" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-brand-dark mb-4">ОТЧЕТ ПРИНЯТ</h1>
                    <p className="text-brand-dark/60 leading-relaxed mb-8">
                        Ваши данные успешно переданы в систему управления.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-premium w-full"
                    >
                        ОТПРАВИТЬ ЕЩЕ ОДИН
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <div className="section-tag text-center mx-auto">Отчетность</div>
                    <h1 className="section-header text-center block uppercase">ЕЖЕДНЕВНЫЙ <br /><span className="text-brand-green">ЧЕК-ЛИСТ</span></h1>
                    
                    <div className="mt-8 space-y-3 flex flex-col items-center w-full max-w-sm mx-auto">
                        {/* Выбранный объект */}
                        {selectedDeal && (
                            <div className="w-full">
                                <div className="px-5 py-3 bg-brand-dark text-white rounded-2xl flex items-center justify-between shadow-premium animate-scale-in">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Ваш объект</div>
                                            <div className="text-sm font-bold truncate max-w-[180px]">{selectedDeal.title}</div>
                                        </div>
                                    </div>
                                    
                                    {nearestDeals.length > 1 && (
                                        <button 
                                            type="button"
                                            onClick={() => setShowObjectPicker(!showObjectPicker)}
                                            className="text-[10px] font-bold uppercase py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                                        >
                                            Изменить
                                        </button>
                                    )}
                                </div>
                                
                                {/* Список выбора */}
                                {showObjectPicker && (
                                    <div className="mt-2 bg-white border border-brand-dark/5 rounded-2xl p-2 shadow-premium animate-fade-in-up z-20 overflow-hidden">
                                        <div className="text-[10px] uppercase font-bold text-brand-dark/40 px-3 py-2 border-b border-brand-dark/5 mb-1 flex justify-between">
                                            <span>Выберите объект:</span>
                                            <span>{nearestDeals.filter(d => d.distance <= 0.3).length} точек</span>
                                        </div>
                                        <div className="max-h-[320px] overflow-y-auto scrollbar-hide py-1">
                                            {nearestDeals
                                                .filter(deal => deal.distance <= 0.3 || deal === selectedDeal) // Фильтр 300 метров
                                                .map(deal => (
                                                <button
                                                    key={deal.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDeal(deal);
                                                        setShowObjectPicker(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between mb-1 ${selectedDeal.id === deal.id ? 'bg-brand-green/10 text-brand-green' : 'hover:bg-brand-accent/30 text-brand-dark/60'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="truncate pr-4 max-w-[180px]">{deal.title}</span>
                                                        <span className={`text-[8px] uppercase tracking-tighter ${deal.distance < 0.05 ? 'text-brand-green/60' : 'text-brand-dark/20'}`}>
                                                            {deal.distance < 0.05 ? 'Прямо здесь' : 'Рядом'}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[9px] font-medium ${(deal.distance * 1000) < 50 ? 'text-brand-green' : 'opacity-40'}`}>
                                                        {(deal.distance * 1000).toFixed(0)}м
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {isFindingObject && (
                            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 animate-pulse">Определяем объект...</div>
                        )}

                        {/* Location Status Badge */}
                        {location ? (
                            <div className="px-5 py-2 bg-brand-green/10 border border-brand-green/20 rounded-full flex items-center gap-2.5">
                                <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green">GPS зафиксирован: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                            </div>
                        ) : locationError ? (
                            <div className="px-5 py-2 bg-red-50 border border-red-100 rounded-full flex items-center gap-2.5 animate-pulse">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">{locationError}</span>
                            </div>
                        ) : (
                            <div className="px-5 py-2 bg-brand-dark/5 border border-brand-dark/10 rounded-full flex items-center gap-2.5">
                                <div className="w-4 h-4 border-2 border-brand-dark/10 border-t-brand-dark/40 rounded-full animate-spin" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/40">Поиск GPS...</span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* ОПУ */}
                    <div className="premium-card p-8 rounded-[32px]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-dark text-white flex items-center justify-center text-sm">01</span>
                            Показатели ОПУ
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-2 ml-1">Количество ОПУ</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={opuCount}
                                    onChange={(e) => setOpuCount(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-brand-accent/30 border border-transparent focus:border-brand-green/30 focus:bg-white focus:outline-none transition-all font-medium"
                                    placeholder="0"
                                />
                            </div>
                            
                            {/* Показываем комментарий всегда или по условию, имитируя логику Bitrix */}
                            <div className="animate-fade-in-up">
                                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-2 ml-1">Комментарий</label>
                                <textarea
                                    value={opuComment}
                                    onChange={(e) => setOpuComment(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-brand-accent/30 border border-transparent focus:border-brand-green/30 focus:bg-white focus:outline-none transition-all font-medium h-24 resize-none"
                                    placeholder="Укажите на каких объектах нет ОПУ"
                                />
                            </div>
                        </div>
                    </div>

                    {/* УМС */}
                    <div className="premium-card p-8 rounded-[32px]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-dark text-white flex items-center justify-center text-sm">02</span>
                            УМС и расходники
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-3 ml-1">УМС и расходники в наличии</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setUmsStock('Да')}
                                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${umsStock === 'Да' ? 'bg-brand-green text-white border-brand-green shadow-button' : 'bg-brand-accent/30 border-transparent text-brand-dark/60 hover:bg-brand-accent/50'}`}
                                    >
                                        Да
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUmsStock('Нет')}
                                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${umsStock === 'Нет' ? 'bg-brand-green text-white border-brand-green shadow-button' : 'bg-brand-accent/30 border-transparent text-brand-dark/60 hover:bg-brand-accent/50'}`}
                                    >
                                        Нет
                                    </button>
                                </div>
                            </div>
                            
                            {umsStock !== '' && (
                                <div className="animate-fade-in-up">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-2 ml-1">Комментарий УМС</label>
                                    <textarea
                                        value={umsComment}
                                        onChange={(e) => setUmsComment(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-brand-accent/30 border border-transparent focus:border-brand-green/30 focus:bg-white focus:outline-none transition-all font-medium h-24 resize-none"
                                        placeholder="Добавьте комментарий по расходникам"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Задачи */}
                    <div className="premium-card p-8 rounded-[32px]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-dark text-white flex items-center justify-center text-sm">03</span>
                            Задачи
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-3 ml-1">Просроченные задачи</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setOverdueTasks('Да')}
                                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${overdueTasks === 'Да' ? 'bg-brand-green text-white border-brand-green shadow-button' : 'bg-brand-accent/30 border-transparent text-brand-dark/60 hover:bg-brand-accent/50'}`}
                                    >
                                        Да
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOverdueTasks('Нет')}
                                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${overdueTasks === 'Нет' ? 'bg-brand-green text-white border-brand-green shadow-button' : 'bg-brand-accent/30 border-transparent text-brand-dark/60 hover:bg-brand-accent/50'}`}
                                    >
                                        Нет
                                    </button>
                                </div>
                            </div>
                            
                            {overdueTasks !== '' && (
                                <div className="animate-fade-in-up">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-2 ml-1">Комментарий по задачам</label>
                                    <textarea
                                        value={tasksComment}
                                        onChange={(e) => setTasksComment(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-brand-accent/30 border border-transparent focus:border-brand-green/30 focus:bg-white focus:outline-none transition-all font-medium h-24 resize-none"
                                        placeholder="Укажите причины просрочки"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Форма */}
                    <div className="premium-card p-8 rounded-[32px]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-dark text-white flex items-center justify-center text-sm">04</span>
                            Дисциплина
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-3 ml-1">Соблюдение формы</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setUniformCompliance('Да')}
                                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${uniformCompliance === 'Да' ? 'bg-brand-green text-white border-brand-green shadow-button' : 'bg-brand-accent/30 border-transparent text-brand-dark/60 hover:bg-brand-accent/50'}`}
                                    >
                                        Да
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUniformCompliance('Нет')}
                                        className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${uniformCompliance === 'Нет' ? 'bg-brand-green text-white border-brand-green shadow-button' : 'bg-brand-accent/30 border-transparent text-brand-dark/60 hover:bg-brand-accent/50'}`}
                                    >
                                        Нет
                                    </button>
                                </div>
                            </div>
                            
                            {uniformCompliance !== '' && (
                                <div className="animate-fade-in-up">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-2 ml-1">Комментарий по форме</label>
                                    <textarea
                                        value={uniformComment}
                                        onChange={(e) => setUniformComment(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-brand-accent/30 border border-transparent focus:border-brand-green/30 focus:bg-white focus:outline-none transition-all font-medium h-24 resize-none"
                                        placeholder="Добавьте подробности"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex gap-4 text-red-600 animate-slide-in-right">
                            <AlertCircle className="shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full btn-premium py-6 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ОТПРАВЛЯЕМ...
                            </>
                        ) : (
                            <>
                                <span>ОТПРАВИТЬ ОТЧЕТ</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DailyReportPage;
