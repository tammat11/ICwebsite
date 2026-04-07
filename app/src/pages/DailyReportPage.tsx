import React, { useState, useEffect } from 'react';
import { CheckCircle2, Send, MapPin, Search, AlertCircle } from 'lucide-react';
import { createDailyReportItem, getNearestDeal } from '../utils/bitrix';
import objectsCache from '../data/objects_cache.json';

const DailyReportPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState<Record<string, any>>({
        feedbackSpeed: '', 
        improvementSuggestions: '', 
        curatorScore: '', 
        suppliesQuality: '', 
        opuUniform: '', 
        uniformCondition: '', 
        equipmentCondition: '',
        hardFloorQuality: '',
        glassMirrorQuality: '',
        fittingRoomsQuality: '',
        cleaningRoomCondition: '',
        restroomCondition: '',
        softFurnitureCondition: '',
        objectComment: ''
    });

    const [comments, setComments] = useState<Record<string, string>>({});

    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [nearestDeals, setNearestDeals] = useState<{ id: string, title: string, distance: number }[]>([]);
    const [selectedDeal, setSelectedDeal] = useState<{ id: string, title: string, distance: number } | null>(null);
    const [isFindingObject, setIsFindingObject] = useState(false);
    const [showObjectPicker, setShowObjectPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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



    const updateField = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateComment = (name: string, value: string) => {
        setComments(prev => ({ ...prev, [name]: value }));
    };

    const shouldShowComment = (name: string, value: string) => {
        if (!value) return false;
        
        // Специальная логика для предложений: "Нет" - это хорошо (зеленый), "Да" - требует комментария (красный)
        if (name === 'improvementSuggestions') {
            return value === 'Да';
        }

        if (['1', '2'].includes(value)) return true;
        if (value === 'Нет' || value === 'Не быстро') return true;
        if (value === 'Плохо' || value === 'Не в нашей форме') return true;
        
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const extraFields: Record<string, string | number | boolean> = {
                'ufCrm105_1753336038': selectedDeal?.title || 'Объект не определен',
                'ufCrm105_1753784383': selectedDeal?.id || '',
            };

            await createDailyReportItem({
                title: `АУДИТ ОБЪЕКТА: ${selectedDeal?.title || 'Без названия'} (${new Date().toLocaleDateString()})`,
                extraFields: extraFields,
                assignedById: selectedDeal?.assignedById,
                contactId: selectedDeal?.contactId,
                companyId: selectedDeal?.companyId,
                comments: (selectedDeal ? `Объект: ${selectedDeal.title}\nID Сделки: ${selectedDeal.id}\n` : '') + 
                    (location ? `Координаты: https://www.google.com/maps?q=${location.lat},${location.lng}\n\n` : '\n') +
                    `=========================\n` +
                    Object.entries(formData).map(([k, v]) => {
                        if (k === 'objectComment') return '';
                        const comment = comments[k] ? ` (Коммент: ${comments[k]})` : '';
                        return `${k}: ${v}${comment}`;
                    }).filter(Boolean).join('\n') +
                    `\n=========================\nКомментарий по объекту: ${formData.objectComment}`
            });

            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError('Произошла ошибка при отправке отчета.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const RadioQuestion = ({ title, name, options }: { title: string, name: string, options: string[] }) => (
        <div className="premium-card p-6 md:p-8 rounded-[32px] animate-fade-in-up mb-6 border border-black/5">
            <label className="block text-sm font-bold text-brand-dark mb-4">{title}</label>
            <div className="flex flex-col sm:flex-row w-full gap-2 mb-4">
                {options.map(opt => {
                    const isSelected = formData[name] === opt;
                    const isNegative = shouldShowComment(name, opt);
                    
                    let btnClass = 'bg-brand-accent/30 text-brand-dark/40 border-transparent hover:bg-brand-dark/5';
                    if (isSelected) {
                        btnClass = isNegative 
                            ? 'bg-red-500 text-white border-red-500 shadow-[0_8px_16px_rgba(239,68,68,0.25)]' 
                            : 'bg-brand-green text-white border-brand-green shadow-button';
                    }

                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => updateField(name, opt)}
                            className={`flex-1 py-4 px-4 rounded-2xl text-center font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all border ${btnClass}`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
            {shouldShowComment(name, formData[name]) && (
                <div className="animate-scale-in">
                    <textarea
                        value={comments[name] || ''}
                        onChange={(e) => updateComment(name, e.target.value)}
                        placeholder="Укажите подробности..."
                        className="w-full px-5 py-4 mt-2 rounded-2xl bg-brand-light border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-green/30 h-20 resize-none"
                    />
                </div>
            )}
        </div>
    );

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-6 pt-32">
                <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-premium text-center">
                    <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="text-brand-green" size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-brand-dark mb-4 uppercase">ОТЧЕТ ПРИНЯТ</h1>
                    <button onClick={() => window.location.reload()} className="btn-premium w-full mt-4">Ок</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <div className="section-tag text-center mx-auto">Аудит</div>
                    <h1 className="section-header text-center block uppercase">ПРОВЕРКА <br /><span className="text-brand-green">КАЧЕСТВА</span></h1>
                    
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
                                        {/* Поиск */}
                                        <div className="p-2 border-b border-brand-dark/5 mb-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/20" size={14} />
                                                <input 
                                                    type="text"
                                                    placeholder="Поиск объекта (напр. Мега, Банк...)"
                                                    className="w-full pl-9 pr-4 py-2.5 bg-brand-accent/30 rounded-xl text-xs font-bold focus:outline-none focus:bg-brand-accent/50 transition-all"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-[10px] uppercase font-bold text-brand-dark/40 px-3 py-2 border-b border-brand-dark/5 mb-1 flex justify-between">
                                            <span>{searchTerm ? 'Результаты поиска:' : 'Ближайшие объекты:'}</span>
                                            <span>{searchTerm ? 'Весь список' : `${nearestDeals.filter(d => d.distance <= 0.3).length} точек`}</span>
                                        </div>
                                        <div className="max-h-[320px] overflow-y-auto scrollbar-hide py-1">
                                            {(searchTerm 
                                                ? (objectsCache as any[])
                                                    .filter(obj => obj.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                                    .map(obj => {
                                                        // Рассчитываем дистанцию на лету для сортировки
                                                        let dist = 999;
                                                        if (location) {
                                                            const R = 6371;
                                                            const dLat = (obj.lat - location.lat) * Math.PI / 180;
                                                            const dLon = (obj.lng - location.lng) * Math.PI / 180;
                                                            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                                                Math.cos(location.lat * Math.PI / 180) * Math.cos(obj.lat * Math.PI / 180) *
                                                                Math.sin(dLon/2) * Math.sin(dLon/2);
                                                            dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                                                        }
                                                        return { ...obj, distance: dist };
                                                    })
                                                    .sort((a, b) => a.distance - b.distance)
                                                    .slice(0, 15)
                                                : nearestDeals.filter(deal => deal.distance <= 0.3 || deal === selectedDeal)
                                            ).map(deal => (
                                                <button
                                                    key={deal.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDeal(deal);
                                                        setShowObjectPicker(false);
                                                        setSearchTerm('');
                                                    }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between mb-1 ${selectedDeal.id === deal.id ? 'bg-brand-green/10 text-brand-green' : 'hover:bg-brand-accent/30 text-brand-dark/60'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="truncate pr-4 max-w-[180px]">{deal.title}</span>
                                                        <span className={`text-[8px] uppercase tracking-tighter ${deal.distance < 0.05 ? 'text-brand-green/60' : 'text-brand-dark/20'}`}>
                                                            {deal.distance < 0.05 ? 'Прямо здесь' : (deal.distance > 5 ? 'Далеко' : 'Рядом')}
                                                        </span>
                                                    </div>
                                                    {deal.distance !== undefined && (
                                                        <span className={`text-[9px] font-medium ${deal.distance < 0.05 ? 'text-brand-green' : 'opacity-40'}`}>
                                                            {deal.distance < 1 ? `${(deal.distance * 1000).toFixed(0)}м` : `${deal.distance.toFixed(1)}км`}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                            {searchTerm && (objectsCache as any[]).filter(obj => obj.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                                <div className="px-4 py-8 text-center text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">
                                                    Объект не найден
                                                </div>
                                            )}
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

                <form onSubmit={handleSubmit} className="space-y-2 mt-8">
                    <RadioQuestion title="На сколько быстро вы получаете обратную связь от куратора?" name="feedbackSpeed" options={['Быстро', 'Не быстро']} />
                    <RadioQuestion title="Есть ли у вас предложения по улучшению нашего сервиса?" name="improvementSuggestions" options={['Да', 'Нет']} />
                    <RadioQuestion title="Оцените работу вашего куратора" name="curatorScore" options={['3', '2', '1']} />
                    <RadioQuestion title="Все ли вас устраивает в сроках и качестве предоставляемого моющих средств и РМ?" name="suppliesQuality" options={['Да', 'Нет']} />
                    <RadioQuestion title="ОПУ на объекте находятся в форме?" name="opuUniform" options={['Да', 'Нет']} />
                    <RadioQuestion title="Состояние формы?" name="uniformCondition" options={['Хорошее', 'Не в нашей форме', 'Плохо']} />
                    <RadioQuestion title="Состояние инвентаря, оборудования, техники?" name="equipmentCondition" options={['3', '2', '1']} />
                    <RadioQuestion title="Качество уборки твердых покрытий?" name="hardFloorQuality" options={['3', '2', '1']} />
                    <RadioQuestion title="Качество протирки стеклянных и зеркальных поверхностей?" name="glassMirrorQuality" options={['3', '2', '1']} />
                    <RadioQuestion title="Примерочные, осветительные приборы?" name="fittingRoomsQuality" options={['3', '2', '1']} />
                    <RadioQuestion title="Состояние помещения клининга?" name="cleaningRoomCondition" options={['3', '2', '1']} />
                    <RadioQuestion title="Состояние санузлов?" name="restroomCondition" options={['3', '2', '1']} />
                    <RadioQuestion title="Состояние мягкой мебели и ковровых покрытий?" name="softFurnitureCondition" options={['3', '2', '1']} />

                    <div className="premium-card p-8 rounded-[32px] border border-black/5">
                        <label className="block text-sm font-bold text-brand-dark mb-4">Комментарий по объекту</label>
                        <textarea
                            value={formData.objectComment}
                            onChange={(e) => updateField('objectComment', e.target.value)}
                            placeholder="Добавьте общий комментарий..."
                            className="w-full px-6 py-4 rounded-2xl bg-brand-light border border-black/5 focus:ring-2 focus:ring-brand-green/30 focus:bg-white focus:outline-none transition-all font-medium h-32 resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex gap-4 text-red-600 animate-slide-in-right">
                            <AlertCircle className="shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full btn-premium py-6 flex items-center justify-center gap-3">
                        {isSubmitting ? 'ОТПРАВЛЯЕМ...' : 'ОТПРАВИТЬ ОТЧЕТ'}
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DailyReportPage;
