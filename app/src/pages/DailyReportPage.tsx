import React, { useState, useEffect } from 'react';
import { CheckCircle2, Send, MapPin, AlertCircle, ChevronDown, Lock, RefreshCcw } from 'lucide-react';
import { createDailyReportItem, getNearestDeal } from '../utils/bitrix';

const QUESTIONS = [
    { key: 'feedbackSpeed', label: 'Скорость обратной связи куратора', options: ['Быстро', 'Не быстро'] },
    { key: 'improvementSuggestions', label: 'Вас полностью устраивает качество нашего сервиса?', options: ['Да', 'Нет'] },
    { key: 'curatorScore', label: 'Оцените работу вашего куратора', options: ['3', '2', '1'] },
    { key: 'suppliesQuality', label: 'Сроки и качество моющих средств и РМ', options: ['Да', 'Нет'] },
    { key: 'opuUniform', label: 'ОПУ на объекте находятся в форме?', options: ['Да', 'Нет'] },
    { key: 'uniformCondition', label: 'Состояние формы?', options: ['Хорошее', 'Не в нашей форме', 'Плохо'] },
    { key: 'equipmentCondition', label: 'Состояние инвентаря, оборудования, техники?', options: ['3', '2', '1'] },
    { key: 'hardFloorQuality', label: 'Качество уборки твердых покрытий?', options: ['3', '2', '1'] },
    { key: 'glassMirrorQuality', label: 'Качество протирки стеклянных и зеркальных поверхностей?', options: ['3', '2', '1'] },
    { key: 'fittingRoomsQuality', label: 'Примерочные, осветительные приборы?', options: ['3', '2', '1'] },
    { key: 'cleaningRoomCondition', label: 'Состояние помещения клининга?', options: ['3', '2', '1'] },
    { key: 'restroomCondition', label: 'Состояние санузлов?', options: ['3', '2', '1'] },
    { key: 'softFurnitureCondition', label: 'Состояние мягкой мебели и ковровых покрытий?', options: ['3', '2', '1'] }
];

const DailyReportPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Record<string, any>>({
        feedbackSpeed: '', improvementSuggestions: '', curatorScore: '', suppliesQuality: '',
        opuUniform: '', uniformCondition: '', equipmentCondition: '', hardFloorQuality: '',
        glassMirrorQuality: '', fittingRoomsQuality: '', cleaningRoomCondition: '',
        restroomCondition: '', softFurnitureCondition: '', objectComment: ''
    });

    const [comments, setComments] = useState<Record<string, string>>({});
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [nearestDeals, setNearestDeals] = useState<{ id: string, title: string, distance: number, assignedById?: string, contactId?: string, companyId?: string }[]>([]);
    const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
    const [showObjectPicker, setShowObjectPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [geoStatus, setGeoStatus] = useState<'determining' | 'found' | 'error' | 'denied'>('determining');

    // Anti-cheat: distance limit in km
    const DISTANCE_LIMIT = 0.3; // 300 meters

    const refreshGps = () => {
        setGeoStatus('determining');
        setError(null);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setLocation(coords);
                    const deals = await getNearestDeal(coords.lat, coords.lng);
                    if (deals) {
                        const nearby = deals.filter(d => d.distance <= DISTANCE_LIMIT);
                        setNearestDeals(nearby);
                        if (nearby.length > 0) {
                            setSelectedDeal(nearby[0]);
                            setGeoStatus('found');
                        } else {
                            setGeoStatus('error');
                            setSelectedDeal(null);
                        }
                    }
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setGeoStatus(err.code === 1 ? 'denied' : 'error');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else { setGeoStatus('error'); }
    };

    useEffect(() => {
        refreshGps();
    }, []);

    const handleManualLocation = async (latStr: string, lngStr: string) => {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (isNaN(lat) || isNaN(lng)) return;
        const coords = { lat, lng };
        setLocation(coords);
        const deals = await getNearestDeal(coords.lat, coords.lng);
        if (deals) {
            const nearby = deals.filter(d => d.distance <= DISTANCE_LIMIT);
            setNearestDeals(nearby);
            if (nearby.length > 0) {
                setSelectedDeal(nearby[0]);
                setGeoStatus('found');
            } else {
                setSelectedDeal(null);
                setGeoStatus('error');
            }
        }
    };

    const updateField = (name: string, value: string) => setFormData(prev => ({ ...prev, [name]: value }));
    const updateComment = (name: string, value: string) => setComments(prev => ({ ...prev, [name]: value }));
    const shouldShowComment = (name: string, value: string) => {
        if (!value) return false;
        if (['1', '2'].includes(value)) return true;
        if (value === 'Нет' || value === 'Не быстро') return true;
        if (value === 'Плохо' || value === 'Не в нашей форме') return true;
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeal) { setError('Объект не выбран. Пожалуйста, разрешите GPS.'); return; }
        if (selectedDeal.distance > DISTANCE_LIMIT) { setError('Вы находитесь слишком далеко (>300м)'); return; }
        
        setError(null);
        setIsSubmitting(true);

        try {
            const extraFields: Record<string, string | number | boolean> = {
                'ufCrm105_1753336038': selectedDeal?.title || 'Объект не определен',
                'ufCrm105_1753784383': selectedDeal?.id || '',
                'ufCrm105_1753787218160': formData.opuUniform,
                'ufCrm105_1753787226010': formData.uniformCondition + (comments.uniformCondition ? ` (${comments.uniformCondition})` : ''),
                'ufCrm105_1753787157294': formData.suppliesQuality,
                'ufCrm105_1753787168378': comments.suppliesQuality || '',
                'ufCrm105_1753787196844': formData.improvementSuggestions
            };
            
            const reportSummary = QUESTIONS.map(q => {
                const val = formData[q.key];
                const comm = comments[q.key] ? ` (ДЕТАЛИ: ${comments[q.key]})` : '';
                return `${q.label}: ${val || 'Н/Д'}${comm}`;
            }).join('\n');

            await createDailyReportItem({
                title: `АУДИТ ОБЪЕКТА: ${selectedDeal?.title || 'Без названия'} (${new Date().toLocaleDateString()})`,
                extraFields: extraFields,
                assignedById: selectedDeal?.assignedById,
                contactId: selectedDeal?.contactId,
                companyId: selectedDeal?.companyId,
                comments: (selectedDeal ? `Объект: ${selectedDeal.title}\nID Сделки: ${selectedDeal.id}\nДистанция: ${(selectedDeal.distance*1000).toFixed(0)}м\n` : '') + 
                    (location ? `Координаты: https://www.google.com/maps?q=${location.lat},${location.lng}\n` : '') +
                    `Комментарий: ${formData.objectComment}\n\n--- ДЕТАЛЬНЫЙ АУДИТ ---\n${reportSummary}`
            });
            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) { setError('Ошибка при отправке.'); }
        finally { setIsSubmitting(false); }
    };

    const RadioQuestionUI = ({ q }: { q: typeof QUESTIONS[0] }) => {
        const isPositive = (val: string) => ['3', 'Да', 'Быстро', 'Хорошее'].includes(val);
        const isNegative = (val: string) => ['1', '2', 'Нет', 'Не быстро', 'Не в нашей форме', 'Плохо'].includes(val);

        return (
            <div className="premium-card p-8 rounded-[32px] animate-fade-in-up shadow-premium">
                <label className="block text-sm font-bold text-brand-dark mb-5 ml-1 leading-relaxed">{q.label}</label>
                <div className="flex w-full gap-2 mb-4">
                    {q.options.map(opt => {
                        const isSelected = formData[q.key] === opt;
                        let colorClass = 'bg-brand-accent/30 text-brand-dark/40 border-transparent hover:bg-brand-accent/50';
                        if (isSelected) {
                            if (isPositive(opt)) colorClass = 'bg-green-500 text-white border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]';
                            else if (isNegative(opt)) colorClass = 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
                            else colorClass = 'bg-brand-green text-white border-brand-green shadow-button';
                        }
                        return (
                            <button key={opt} type="button" onClick={() => updateField(q.key, opt)}
                                className={`flex-1 py-4 px-2 rounded-2xl font-bold text-[10px] uppercase tracking-tighter transition-all duration-300 border ${colorClass} ${isSelected ? 'scale-[1.05]' : 'scale-100'}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
                {shouldShowComment(q.key, formData[q.key]) && (
                    <div className="animate-scale-in mt-4">
                        <textarea value={comments[q.key] || ''} onChange={(e) => updateComment(q.key, e.target.value)}
                            placeholder="Укажите подробности..."
                            className="w-full px-5 py-4 rounded-2xl bg-brand-light border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-green/30 h-28 resize-none shadow-inner"
                        />
                    </div>
                )}
            </div>
        );
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-6 pt-32">
                <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-premium text-center">
                    <CheckCircle2 className="text-brand-green mx-auto mb-6" size={48} />
                    <h1 className="text-2xl font-black text-brand-dark mb-4 uppercase">ОТЧЕТ ПРИНЯТ</h1>
                    <button onClick={() => window.location.reload()} className="btn-premium w-full mt-4">Ок</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="section-tag mx-auto">Аудит БД</div>
                    <h1 className="section-header block uppercase">ПРОВЕРКА <br /><span className="text-brand-green">КАЧЕСТВА</span></h1>
                    <div className="mt-8 flex flex-col items-center gap-4 w-full">
                        <div className="relative w-full max-w-sm">
                            <button 
                                onClick={() => geoStatus === 'found' && setShowObjectPicker(!showObjectPicker)}
                                className={`w-full px-6 py-4 bg-brand-dark text-white rounded-3xl flex items-center justify-between shadow-xl transition-all ${nearestDeals.length > 1 ? 'hover:scale-[1.02] active:scale-95' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${geoStatus === 'found' ? 'bg-brand-green/20' : 'bg-white/10'}`}>
                                        {geoStatus === 'found' ? <MapPin className="text-brand-green" size={20} /> : <Lock className="text-white/40" size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase font-bold opacity-30 tracking-widest leading-none mb-1">
                                            {geoStatus === 'found' ? 'Объект подтвержден' : 'Геолокация'}
                                        </div>
                                        <div className="text-sm font-bold truncate max-w-[180px]">
                                            {selectedDeal ? selectedDeal.title : (geoStatus === 'determining' ? 'Ожидание GPS...' : 'Доступ ограничен')}
                                        </div>
                                    </div>
                                </div>
                                {geoStatus === 'found' && nearestDeals.length > 1 && (
                                    <ChevronDown size={18} className={`${showObjectPicker ? 'rotate-180' : ''} transition-transform opacity-40`} />
                                )}
                            </button>

                            {(geoStatus === 'determining' || geoStatus === 'denied') && (
                                <div className="mt-4 p-6 bg-white rounded-[32px] border border-black/5 flex flex-col items-center gap-4 text-center shadow-xl animate-fade-in">
                                    <div className="flex items-center gap-3 text-brand-dark/40">
                                        {geoStatus === 'determining' ? (
                                            <RefreshCcw className="animate-spin text-brand-green" size={20} />
                                        ) : <Lock className="text-red-500" size={20} />}
                                        <div className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                            {geoStatus === 'determining' ? 'Запрашиваем доступ к GPS...' : 'Доступ к GPS заблокирован'}
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={refreshGps}
                                        className="w-full btn-premium py-4 text-[10px]"
                                    >
                                        ВКЛЮЧИТЬ GPS И НАЙТИ ОБЪЕКТ
                                    </button>
                                    {geoStatus === 'denied' && (
                                        <p className="text-[9px] font-bold opacity-30 px-4 leading-relaxed">
                                            Нажмите на иконку «Замка» вверху и разрешите <br/> доступ к местоположению
                                        </p>
                                    )}
                                </div>
                            )}

                            {geoStatus === 'error' && !selectedDeal && (
                                <div className="mt-4 p-6 bg-red-50 rounded-[32px] border border-red-100 flex flex-col items-center gap-4 text-red-600 shadow-sm animate-fade-in">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle size={24} />
                                        <div className="text-[12px] font-black uppercase tracking-tight">Ничего не найдено рядом</div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={refreshGps}
                                        className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        Проверить еще раз
                                    </button>
                                </div>
                            )}

                            {showObjectPicker && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[32px] p-4 shadow-2xl border border-black/5 z-50 animate-scale-in origin-top">
                                    <div className="text-[9px] uppercase font-bold opacity-30 mb-3 px-2 flex justify-between">
                                        <span>Ближайшие (до 300м)</span>
                                        <span>Найдено: {nearestDeals.length}</span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto scrollbar-hide py-1">
                                        {nearestDeals.map(d => (
                                            <button 
                                                key={d.id} 
                                                className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all mb-2 flex justify-between items-center ${selectedDeal?.id === d.id ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-light/50 hover:bg-brand-green/5'}`} 
                                                onClick={() => { setSelectedDeal(d); setShowObjectPicker(false); }}
                                            >
                                                <span className="truncate pr-4">{d.title}</span>
                                                <span className={`whitespace-nowrap px-3 py-1 rounded-full text-[9px] uppercase tracking-wider ${d.distance < 0.05 ? 'bg-brand-green text-white' : 'bg-brand-dark/5 text-brand-dark/40'}`}>
                                                    {d.distance < 0.01 ? 'Прямо здесь' : `${(d.distance * 1000).toFixed(0)}м`}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-brand-accent/5 rounded-2xl border border-dashed border-brand-dark/5 w-full max-w-[200px] opacity-10 hover:opacity-100 transition-opacity">
                             <div className="flex gap-2">
                                <input type="text" placeholder="LAT" className="w-1/2 px-3 py-1.5 bg-white/50 rounded-xl text-[9px] font-bold focus:outline-none" onChange={(e) => handleManualLocation(e.target.value, String(location?.lng || ''))} defaultValue={location?.lat || ''} />
                                <input type="text" placeholder="LNG" className="w-1/2 px-3 py-1.5 bg-white/50 rounded-xl text-[9px] font-bold focus:outline-none" onChange={(e) => handleManualLocation(String(location?.lat || ''), e.target.value)} defaultValue={location?.lng || ''} />
                             </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {QUESTIONS.map(q => <RadioQuestionUI key={q.key} q={q} />)}
                    <div className="premium-card p-8 rounded-[32px]">
                        <label className="block text-sm font-bold text-brand-dark mb-4">Комментарий по объекту</label>
                        <textarea value={formData.objectComment} onChange={(e) => updateField('objectComment', e.target.value)} placeholder="Добавьте общий комментарий..." className="w-full px-6 py-4 rounded-2xl bg-brand-light border border-black/5 focus:ring-2 focus:ring-brand-green/30 focus:bg-white focus:outline-none transition-all font-medium h-32 resize-none" />
                    </div>
                    {error && (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4 text-red-600 animate-slide-in-right">
                            <AlertCircle size={24} />
                            <p className="font-bold text-sm tracking-tight">{error}</p>
                        </div>
                    )}
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !selectedDeal} 
                        className="w-full btn-premium py-6 flex items-center justify-center gap-3 disabled:opacity-30"
                    >
                        {isSubmitting ? 'ОТПРАВЛЯЕМ...' : 'ОТПРАВИТЬ ОТЧЕТ'}
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DailyReportPage;
