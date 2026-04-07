import React, { useState, useEffect } from 'react';
import { CheckCircle2, Send, MapPin, Search, AlertCircle } from 'lucide-react';
import { createDailyReportItem, getNearestDeal } from '../utils/bitrix';
import objectsCache from '../data/objects_cache.json';

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
    const [isGpsLoading, setIsGpsLoading] = useState(true);

    useEffect(() => {
        if ("geolocation" in navigator) {
            setIsGpsLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setLocation(coords);
                    const deals = await getNearestDeal(coords.lat, coords.lng);
                    if (deals && deals.length > 0) {
                        const nearby = deals.filter(d => d.distance <= 0.3);
                        setNearestDeals(nearby);
                        if (nearby.length > 0) {
                            setSelectedDeal(nearby[0]);
                        }
                    }
                    setIsGpsLoading(false);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setError("Пожалуйста, разрешите доступ к геопозиции.");
                    setIsGpsLoading(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setIsGpsLoading(false);
        }
    }, []);

    const updateField = (name: string, value: string) => setFormData(prev => ({ ...prev, [name]: value }));
    const updateComment = (name: string, value: string) => setComments(prev => ({ ...prev, [name]: value }));
    
    const shouldShowComment = (name: string, value: string) => {
        if (!value) return false;
        return ['1', '2', 'Нет', 'Не быстро', 'Не в нашей форме', 'Плохо'].includes(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeal) { setError('Объект не найден. Подойдите ближе к объекту.'); return; }
        setError(null);
        setIsSubmitting(true);

        try {
            const extraFields: Record<string, string | number | boolean> = {
                'ufCrm105_1753336038': selectedDeal.title,
                'ufCrm105_1753784383': selectedDeal.id,
                'ufCrm105_1753787218160': formData.opuUniform,
                'ufCrm105_1753787226010': formData.uniformCondition + (comments.uniformCondition ? ` (${comments.uniformCondition})` : ''),
                'ufCrm105_1753787157294': formData.suppliesQuality,
                'ufCrm105_1753787168378': comments.suppliesQuality || '',
                'ufCrm105_1753787196844': formData.improvementSuggestions
            };
            
            const auditBody = QUESTIONS.map(q => `${q.label}: ${formData[q.key] || 'Н/Д'}${comments[q.key] ? ` (${comments[q.key]})` : ''}`).join('\n');

            await createDailyReportItem({
                title: `АУДИТ: ${selectedDeal.title} (${new Date().toLocaleDateString()})`,
                extraFields: extraFields,
                assignedById: selectedDeal.assignedById,
                contactId: selectedDeal.contactId,
                companyId: selectedDeal.companyId,
                comments: `Дистанция: ${(selectedDeal.distance * 1000).toFixed(0)}м\nКоординаты: ${location?.lat},${location?.lng}\nКомментарий: ${formData.objectComment}\n\n--- ДЕТАЛИ ---\n${auditBody}`
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
            <div className="premium-card p-8 rounded-[32px] shadow-premium mb-6">
                <label className="block text-sm font-bold text-brand-dark mb-5 leading-relaxed">{q.label}</label>
                <div className="flex w-full gap-2 mb-4">
                    {q.options.map(opt => {
                        const isSelected = formData[q.key] === opt;
                        let colorClass = 'bg-brand-accent/30 text-brand-dark/40';
                        if (isSelected) {
                            if (isPositive(opt)) colorClass = 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]';
                            else if (isNegative(opt)) colorClass = 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]';
                            else colorClass = 'bg-brand-green text-white';
                        }
                        return (
                            <button key={opt} type="button" onClick={() => updateField(q.key, opt)}
                                className={`flex-1 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-tighter transition-all border-none ${colorClass}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
                {shouldShowComment(q.key, formData[q.key]) && (
                    <textarea value={comments[q.key] || ''} onChange={(e) => updateComment(q.key, e.target.value)}
                        placeholder="Подробности..."
                        className="w-full px-5 py-4 rounded-2xl bg-brand-light border-none text-xs font-medium focus:ring-2 focus:ring-brand-green/30 h-28 resize-none shadow-inner"
                    />
                )}
            </div>
        );
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-premium text-center">
                    <CheckCircle2 className="text-brand-green mx-auto mb-6" size={48} />
                    <h1 className="text-2xl font-black text-brand-dark mb-4">ОТЧЕТ ПРИНЯТ</h1>
                    <button onClick={() => window.location.reload()} className="btn-premium w-full mt-4 py-4">Ок</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <div className="section-tag mx-auto mb-3">Аудит</div>
                    <h1 className="text-4xl font-black block uppercase tracking-tighter leading-tight mb-8">ПРОВЕРКА <br /><span className="text-brand-green">КАЧЕСТВА</span></h1>
                    
                    <div className="flex flex-col items-center gap-4 w-full">
                        <button 
                            onClick={() => nearestDeals.length > 1 && setShowObjectPicker(!showObjectPicker)}
                            className="w-full max-w-sm px-6 py-5 bg-brand-dark text-white rounded-[32px] flex items-center justify-between shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <MapPin className={selectedDeal ? "text-brand-green" : "text-white/20"} size={24} />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-bold opacity-30 mb-1">Ваша локация</div>
                                    <div className="text-sm font-bold truncate max-w-[170px]">
                                        {selectedDeal 
                                            ? selectedDeal.title 
                                            : (isGpsLoading ? "Определение объекта..." : "Объект не найден рядом")}
                                    </div>
                                    {!selectedDeal && !isGpsLoading && (
                                        <div className="text-[8px] text-red-500 font-bold uppercase mt-1">
                                            Подойдите ближе (300м)
                                        </div>
                                    )}
                                </div>
                            </div>
                            {nearestDeals.length > 1 && <ChevronDown size={20} className="opacity-40" />}
                        </button>

                        {showObjectPicker && (
                            <div className="w-full max-w-sm mt-3 bg-white rounded-[40px] p-5 shadow-2xl border border-black/5 z-50">
                                <div className="text-[9px] uppercase font-bold opacity-30 mb-4 px-2">Ближайшие (300м)</div>
                                <div className="max-h-60 overflow-y-auto scrollbar-hide">
                                    {nearestDeals.map(d => (
                                        <button key={d.id} className={`w-full text-left p-5 rounded-[28px] text-xs font-bold mb-2 flex justify-between items-center ${selectedDeal?.id === d.id ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-light'}`} onClick={() => { setSelectedDeal(d); setShowObjectPicker(false); }}>
                                            <span className="truncate pr-4">{d.title}</span>
                                            <span className="text-[9px] opacity-40">{(d.distance * 1000).toFixed(0)}м</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {QUESTIONS.map(q => <RadioQuestionUI key={q.key} q={q} />)}
                    <div className="premium-card p-8 rounded-[32px] shadow-premium">
                        <label className="block text-sm font-bold text-brand-dark mb-4">Комментарий по объекту</label>
                        <textarea value={formData.objectComment} onChange={(e) => updateField('objectComment', e.target.value)} placeholder="Общий отзыв..." className="w-full px-6 py-5 rounded-3xl bg-brand-light border-none focus:ring-2 focus:ring-brand-green/30 h-36 resize-none" />
                    </div>
                    {error && (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-center gap-4 text-red-600">
                            <AlertCircle size={24} />
                            <p className="font-bold text-xs">{error}</p>
                        </div>
                    )}
                    <button type="submit" disabled={isSubmitting || !selectedDeal} className="w-full btn-premium py-6 flex items-center justify-center gap-3 disabled:opacity-30">
                        {isSubmitting ? 'ОТПРАВЛЯЕМ...' : 'ОТПРАВИТЬ ОТЧЕТ'}
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DailyReportPage;
