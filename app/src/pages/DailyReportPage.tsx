import React, { useState, useEffect } from 'react';
import { CheckCircle2, Send, MapPin, Search, AlertCircle } from 'lucide-react';
import { createDailyReportItem, getNearestDeal, createRemarkDeal } from '../utils/bitrix';
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
        objectComment: '',
        clientName: ''
    });

    const [files, setFiles] = useState<File[]>([]);

    const [comments, setComments] = useState<Record<string, string>>({});

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 1280;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            resolve(file);
                        }
                    }, 'image/jpeg', 0.7);
                };
            };
        });
    };

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
                        // Если разница расстояний до топ-2 объектов минимальна (менее 150 метров)
                        // Значит мы стоим в ТРЦ или около комплекса - просим выбрать вручную.
                        if (deals.length > 1 && (deals[1].distance - deals[0].distance <= 0.15)) {
                            setSelectedDeal(null);
                            setShowObjectPicker(true);
                        } else {
                            setSelectedDeal(deals[0]);
                        }
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

    const isNegativeResponse = (name: string, value: string) => {
        if (!value) return false;
        if (value === 'Нет клиента' || value === 'Не имеется') return false;

        const negativeValues = ['1', '2', 'Нет', 'Плохо', 'Не быстро', 'Не в нашей форме', 'Без формы', 'В форме, но не по стандарту'];
        if (negativeValues.includes(value)) return true;
        
        // Для предложений по улучшению "Нет" - это теперь положительный ответ (негатив = false)
        // Предложения больше не считаются "отрицательными пунктами" для создания замечания
        return false;
        
        return false;
    };

    const shouldShowComment = (name: string, value: string) => {
        if (name === 'feedbackSpeed' && value && value !== 'Нет клиента') return true;
        if (name === 'improvementSuggestions' && value === 'Да') return true;
        return isNegativeResponse(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Список всех обязательных ключей вопросов
        const requiredQuestions = [
            'feedbackSpeed', 'improvementSuggestions', 'curatorScore', 'suppliesQuality',
            'opuUniform', 'uniformCondition', 'equipmentCondition', 'hardFloorQuality',
            'glassMirrorQuality', 'fittingRoomsQuality', 'cleaningRoomCondition',
            'restroomCondition', 'softFurnitureCondition'
        ];

        const missing = requiredQuestions.find(q => !formData[q]);
        if (missing) {
            alert('Пожалуйста, ответьте на все вопросы перед отправкой.');
            // Прокрутка к первому неотвеченному вопросу
            const questionElement = document.getElementById(`question-${missing}`);
            if (questionElement) {
                questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (!formData.clientName) {
            alert('Пожалуйста, укажите ФИО клиента или выберите "Не имеется".');
            return;
        }

        setIsSubmitting(true);

        try {
            // Определение отрицательных пунктов для замечания
            const negativeItems: string[] = [];
            const questionNames: Record<string, string> = {
                feedbackSpeed: 'Скорость обратной связи',
                improvementSuggestions: 'Предложения по улучшению',
                curatorScore: 'Оценка работы куратора',
                suppliesQuality: 'Качество моющих средств',
                opuUniform: 'ОПУ в форме',
                uniformCondition: 'Состояние формы',
                equipmentCondition: 'Состояние инвентаря',
                hardFloorQuality: 'Уборка полов',
                glassMirrorQuality: 'Стекла и зеркала',
                fittingRoomsQuality: 'Примерочные и свет',
                cleaningRoomCondition: 'Помещение клининга',
                restroomCondition: 'Санузлы',
                softFurnitureCondition: 'Мягкая мебель'
            };

            Object.entries(formData).forEach(([k, v]) => {
                if (k === 'objectComment') return;
                
                // Используем ту же функцию проверки на негатив
                if (isNegativeResponse(k, String(v))) {
                    const commentText = comments[k] ? ` (Коммент: ${comments[k]})` : '';
                    negativeItems.push(`${questionNames[k] || k}: ${v}${commentText}`);
                }
            });

            // Сжатие фотографий перед отправкой
            const compressedFiles = await Promise.all(files.map(file => compressImage(file)));

            let remarkLink = '';
            let payloadString = (selectedDeal ? `Объект: ${selectedDeal.title}\nID Сделки: ${selectedDeal.id}\n` : '') + 
                (location ? `Координаты: https://www.google.com/maps?q=${location.lat},${location.lng}\n\n` : '\n');

            // Если есть негатив - создаем Сделку в 81 воронке
            if (negativeItems.length > 0 && selectedDeal) {
                const remarkRes = await createRemarkDeal({
                    objectTitle: selectedDeal.title,
                    date: new Date().toLocaleDateString(),
                    companyId: selectedDeal.companyId,
                    contactId: selectedDeal.contactId,
                    assignedById: selectedDeal.assignedById,
                    city: (selectedDeal as any).city,
                    address: (selectedDeal as any).address,
                    ipName: (selectedDeal as any).ipName,
                    ipResp: (selectedDeal as any).ipResp,
                    comments: `ОТРИЦАТЕЛЬНЫЕ ПУНКТЫ АУДИТА:\n${negativeItems.join('\n')}\n\nОбщий комментарий: ${formData.objectComment}`,
                    files: compressedFiles // Передаем сжатые фото и в замечание
                });

                if (remarkRes.result) {
                    remarkLink = `https://tootopbrass.bitrix24.kz/crm/deal/details/${remarkRes.result}/`;
                    payloadString += `⚠️ СОЗДАНО ЗАМЕЧАНИЕ: ${remarkLink}\n\n`;
                }
            }

            payloadString += `КТО ПРОШЕЛ ОПРОС: ${formData.clientName || 'Не указано'}\n` +
                `=========================\n` +
                Object.entries(formData).map(([k, v]) => {
                    if (k === 'objectComment' || k === 'clientName') return '';
                    const comment = comments[k] ? ` (Коммент: ${comments[k]})` : '';
                    const prettyName = questionNames[k] || k;
                    return `${prettyName}: ${v}${comment}`;
                }).filter(Boolean).join('\n') +
                `\n=========================\nКомментарий по объекту: ${formData.objectComment}`;

            const extraFields: Record<string, string | number | boolean> = {
                'ufCrm105_1753336038': selectedDeal?.id || '0', 
                'ufCrm105_1753784383': selectedDeal?.id || '',
                'ufCrm105_1754020000': payloadString, // Полный отчет со ссылкой
                'ufCrm105_1775555176639': formData.objectComment || '', // Общий комментарий
                'ufCrm105_1775559640734': remarkLink ? remarkLink : '', // Ссылка на замечание
                // Ответы
                'ufCrm105_1775554883671': formData.feedbackSpeed || '',
                'ufCrm105_1775554901558': formData.improvementSuggestions || '',
                'ufCrm105_1775554915288': formData.curatorScore || '',
                'ufCrm105_1775554988638': formData.suppliesQuality || '',
                'ufCrm105_1775555006334': formData.opuUniform || '',
                'ufCrm105_1775555020142': formData.uniformCondition || '',
                'ufCrm105_1775555032624': formData.equipmentCondition || '',
                'ufCrm105_1775555051766': formData.hardFloorQuality || '',
                'ufCrm105_1775555067446': formData.glassMirrorQuality || '',
                'ufCrm105_1775555081846': formData.fittingRoomsQuality || '',
                'ufCrm105_1775555094446': formData.cleaningRoomCondition || '',
                'ufCrm105_1775555108910': formData.restroomCondition || '',
                'ufCrm105_1775555127934': formData.softFurnitureCondition || '',
                // Комментарии
                'ufCrm105_1775555255839': comments.feedbackSpeed || '',
                'ufCrm105_1775555309784': comments.improvementSuggestions || '',
                'ufCrm105_1775555340580': comments.curatorScore || '',
                'ufCrm105_1775555402123': comments.suppliesQuality || '',
                'ufCrm105_1775555445843': comments.opuUniform || '',
                'ufCrm105_1775555483492': comments.uniformCondition || '',
                'ufCrm105_1775555723142': comments.equipmentCondition || '',
                'ufCrm105_1775555765608': comments.hardFloorQuality || '',
                'ufCrm105_1775555811584': comments.glassMirrorQuality || '',
                'ufCrm105_1775555862464': comments.fittingRoomsQuality || '',
                'ufCrm105_1775555936016': comments.cleaningRoomCondition || '',
                'ufCrm105_1775555989448': comments.restroomCondition || '',
                'ufCrm105_1775556035238': comments.softFurnitureCondition || '',
                // Координаты
                'ufCrm105_1775650060': location?.lat || '',
                'ufCrm105_1775650055': location?.lng || '',
            };

            await createDailyReportItem({
                title: `АУДИТ ОБЪЕКТА: ${selectedDeal?.title || 'Без названия'} (${new Date().toLocaleDateString()})`,
                extraFields: extraFields,
                assignedById: selectedDeal?.assignedById,
                contactId: selectedDeal?.contactId,
                companyId: selectedDeal?.companyId,
                comments: payloadString,
                files: compressedFiles,
                ...({ clientName: formData.clientName } as any)
            });

            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Submission error:', err);
            setError('Ошибка при отправке отчета. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderRadioQuestion = ({ title, name, options }: { title: string, name: string, options: string[] }) => {
        const isNegative = isNegativeResponse(name, formData[name]);
        const showComment = shouldShowComment(name, formData[name]);

        return (
            <div id={`question-${name}`} className={`premium-card p-8 rounded-[32px] border transition-all duration-500 mb-5 ${isNegative ? 'border-red-500/20 bg-red-50/10' : 'border-black/5 hover:border-black/10'}`}>
            <label className="block text-sm font-bold text-brand-dark mb-4">{title}</label>
            <div className="flex flex-row flex-wrap w-full gap-1.5 mb-4">
                {options.map(opt => {
                    const isSelected = formData[name] === opt;
                    const isNegative = isNegativeResponse(name, opt);
                    
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
                            className={`grow min-w-[30%] py-3.5 px-2 rounded-2xl text-center font-bold text-[10px] leading-tight sm:text-xs uppercase tracking-widest transition-all border ${btnClass}`}
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
};

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
                                    <div className="flex-1 min-w-0 pr-2 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                                            <MapPin size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Ваш объект</div>
                                            <div className="text-[12px] sm:text-sm leading-snug font-bold break-words">{selectedDeal.title}</div>
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
                            </div>
                        )}
                                
                        {/* Список выбора */}
                        {showObjectPicker && (
                            <div className="w-full">
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
                                            <span>{searchTerm ? 'Весь список' : `${nearestDeals.length} точек`}</span>
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
                                                : nearestDeals // distance <= 0.7 уже отфильтровано в utils/bitrix.ts
                                            ).map(deal => (
                                                <button
                                                    key={deal.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDeal(deal);
                                                        setShowObjectPicker(false);
                                                        setSearchTerm('');
                                                    }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between mb-1 ${selectedDeal?.id === deal.id ? 'bg-brand-green/10 text-brand-green' : 'hover:bg-brand-accent/30 text-brand-dark/60'}`}
                                                >
                                                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                                                        <span className="text-[12px] leading-snug break-words">{deal.title}</span>
                                                        <span className={`text-[8px] uppercase mt-1 tracking-tighter ${deal.distance < 0.05 ? 'text-brand-green/60' : 'text-brand-dark/20'}`}>
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

                {selectedDeal ? (
                    <>
                        <div className="premium-card p-8 rounded-[32px] border border-black/5 mb-5">
                            <label className="block text-sm font-bold text-brand-dark mb-4">Данные клиента / Кто прошел опросник *</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    value={formData.clientName}
                                    onChange={(e) => updateField('clientName', e.target.value)}
                                    placeholder="ФИО и должность клиента"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-brand-light border border-black/5 focus:ring-2 focus:ring-brand-green/30 focus:bg-white focus:outline-none transition-all font-bold"
                                />
                                <button
                                    type="button"
                                    onClick={() => updateField('clientName', 'Не имеется')}
                                    className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all border ${
                                        formData.clientName === 'Не имеется'
                                        ? 'bg-brand-dark text-white border-brand-dark'
                                        : 'bg-brand-light text-brand-dark/40 border-black/5 hover:bg-brand-accent/30'
                                    }`}
                                >
                                    Не имеется
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-2 mt-2">
                    {renderRadioQuestion({ title: "На сколько быстро вы получаете обратную связь от куратора?", name: "feedbackSpeed", options: ['Быстро', 'Не быстро', 'Нет клиента'] })}
                    {renderRadioQuestion({ title: "Есть ли у вас предложения по улучшению нашего сервиса?", name: "improvementSuggestions", options: ['Да', 'Нет'] })}
                    {renderRadioQuestion({ title: "Оцените работу вашего куратора", name: "curatorScore", options: ['3', '2', '1', 'Нет клиента'] })}
                    {renderRadioQuestion({ title: "Все ли вас устраивает в сроках и качестве предоставляемого моющих средств и РМ?", name: "suppliesQuality", options: ['Да', 'Нет', 'Нет клиента'] })}
                    {renderRadioQuestion({ title: "ОПУ на объекте находятся в форме?", name: "opuUniform", options: ['Да', 'Нет'] })}
                    {renderRadioQuestion({ title: "Состояние формы?", name: "uniformCondition", options: ['Хорошее', 'Без формы', 'В форме, но не по стандарту'] })}
                    {renderRadioQuestion({ title: "Состояние инвентаря, оборудования, техники?", name: "equipmentCondition", options: ['3', '2', '1'] })}
                    {renderRadioQuestion({ title: "Качество уборки твердых покрытий?", name: "hardFloorQuality", options: ['3', '2', '1'] })}
                    {renderRadioQuestion({ title: "Качество протирки стеклянных и зеркальных поверхностей?", name: "glassMirrorQuality", options: ['3', '2', '1'] })}
                    {renderRadioQuestion({ title: "Примерочные, осветительные приборы?", name: "fittingRoomsQuality", options: ['3', '2', '1', 'Не имеется'] })}
                    {renderRadioQuestion({ title: "Состояние помещения клининга?", name: "cleaningRoomCondition", options: ['3', '2', '1'] })}
                    {renderRadioQuestion({ title: "Состояние санузлов?", name: "restroomCondition", options: ['3', '2', '1', 'Не имеется'] })}
                    {renderRadioQuestion({ title: "Состояние мягкой мебели и ковровых покрытий?", name: "softFurnitureCondition", options: ['3', '2', '1', 'Не имеется'] })}

                    <div className="premium-card p-8 rounded-[32px] border border-black/5 mb-5">
                        <label className="block text-sm font-bold text-brand-dark mb-4">Фото с объекта</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                }
                            }}
                            className="w-full px-6 py-4 rounded-2xl bg-brand-light border border-black/5 focus:outline-none transition-all font-medium mb-4"
                            aria-label="Прикрепить фотографии"
                        />
                        {files.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {files.map((file, i) => (
                                    <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden group">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                                        <button 
                                            type="button" 
                                            onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                </>
                ) : (
                    location && !isFindingObject && (
                        <div className="mt-8 p-6 md:p-10 text-center bg-brand-dark/5 rounded-[32px] border border-brand-dark/10 animate-fade-in-up">
                            <MapPin className="mx-auto text-brand-dark/40 mb-4" size={32} />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-2">ПОЖАЛУЙСТА, ВЫБЕРИТЕ ОБЪЕКТ</h3>
                            <p className="text-xs text-brand-dark/60 font-medium max-w-xs mx-auto">Мы нашли несколько объектов по вашим координатам. Выберите из списка выше тот, который вы сейчас проверяете.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default DailyReportPage;
