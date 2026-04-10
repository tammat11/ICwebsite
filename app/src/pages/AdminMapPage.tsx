import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDealsWithCoords, getDailyReports, getBitrixUsers } from '../utils/bitrix';
import { Layout, Users, FileText, CheckCircle2, TrendingUp, RefreshCw, Calendar, X } from 'lucide-react';

const AdminMapPage = () => {
    // Raw fetched data for local filtering
    const [rawAuditReports, setRawAuditReports] = useState<any[]>([]);
    const [rawCallReports, setRawCallReports] = useState<any[]>([]);
    const [allDeals, setAllDeals] = useState<any[]>([]);
    const [usersMap, setUsersMap] = useState<any>({});
    
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<'audits' | 'calls' | 'map'>('audits');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    
    const calculateStatsInternal = (currentDeals: any[] = [], currentReports: any[] = [], targetMode: 'audits' | 'calls', allDealsTotal: any[] = [], uMap: any = {}) => {
        try {
            const reportsByUser = (currentReports || []).reduce((acc: any, r: any) => {
                const uid = String(r.assignedById);
                if (uid && uid !== '0') acc[uid] = (acc[uid] || 0) + 1;
                return acc;
            }, {});

            const dealsByUser = (currentDeals || []).reduce((acc: any, d: any) => {
                const uid = String(d.assignedById);
                if (uid) acc[uid] = (acc[uid] || 0) + 1;
                return acc;
            }, {});

            const allUserIds = Array.from(new Set([...Object.keys(dealsByUser), ...Object.keys(reportsByUser)]));
            const stats = allUserIds.map(uid => {
                const reportsCount = reportsByUser[uid] || 0;
                const totalDealsForUser = (allDealsTotal || []).filter(d => String(d.assignedById) === uid).length;

                let plan = 0;
                if (targetMode === 'audits') {
                    plan = totalDealsForUser < 100 ? 60 : 40;
                } else {
                    plan = totalDealsForUser < 100 ? 20 : 100;
                }

                return {
                    id: uid,
                    name: uMap[uid] || 'Неизвестно',
                    dealsCount: totalDealsForUser,
                    totalDeals: totalDealsForUser,
                    reportsCount,
                    plan,
                    diff: reportsCount - plan
                };
            });

            return stats
                .filter(s => s.name !== 'Неизвестно' && s.totalDeals > 10)
                .sort((a, b) => b.reportsCount - a.reportsCount);
        } catch (e) {
            console.error('Calculation error:', e);
            return [];
        }
    };

    // Filters State
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today);

    // Filtered data calculated in real-time from memory
    const currentData = React.useMemo(() => {
        let filteredDeals = allDeals || [];
        if (selectedUserId) {
            filteredDeals = filteredDeals.filter(d => String(d.assignedById) === selectedUserId);
        }

        const sourceReports = (mode === 'audits') ? rawAuditReports : rawCallReports;
        let filteredReports = (sourceReports || []).filter((r: any) => {
            const rDate = r.createdTime?.split('T')[0];
            if (!rDate) return false;
            if (startDate && rDate < startDate) return false;
            if (endDate && rDate > endDate) return false;
            if (selectedUserId && String(r.assignedById) !== selectedUserId) return false;
            return true;
        });

        const analytics = calculateStatsInternal(allDeals, filteredReports, mode, allDeals, usersMap);
        const displayAnalytics = selectedUserId 
            ? analytics.filter(s => s.id === selectedUserId)
            : analytics;

        return {
            deals: filteredDeals,
            reports: filteredReports,
            analytics: displayAnalytics
        };
    }, [mode, startDate, endDate, rawAuditReports, rawCallReports, allDeals, usersMap, selectedUserId]);

    // Managers list for the filter (those with > 10 objects)
    const activeManagers = React.useMemo(() => {
        const stats = calculateStatsInternal(allDeals, [], 'audits', allDeals, usersMap);
        return stats.map(s => ({ id: s.id, name: s.name }));
    }, [allDeals, usersMap]);

    // Track previously fetched range to avoid redundant API calls
    const [fetchedRange, setFetchedRange] = useState({ start: '', end: '' });

    const fetchData = () => {
        setIsLoading(true);
        
        Promise.all([
            getAllDealsWithCoords(), 
            getDailyReports(1204, 445, startDate, endDate),
            getDailyReports(1364, 431, startDate, endDate),
            getBitrixUsers()
        ]).then(([deals, reportsAudits, reportsCalls, uMap]) => {
            setUsersMap(uMap);
            setAllDeals(deals);
            setRawAuditReports(reportsAudits);
            setRawCallReports(reportsCalls);
            setFetchedRange({ start: startDate, end: endDate });
            setIsLoading(false);
        }).catch((err) => {
            console.error('Fetch Error:', err);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        // Only fetch if date range is outside what we have or empty
        if (!rawAuditReports.length || startDate < fetchedRange.start || endDate > fetchedRange.end) {
            fetchData();
        }
    }, [startDate, endDate]);

    return (
        <div className="min-h-screen w-full bg-[#f6f7f3] flex flex-col pt-0 overflow-x-hidden">
            {/* Header */}
            <div className="bg-white p-6 border-b border-black/5 z-20 shadow-sm sticky top-0 min-h-[100px] flex items-center">
                <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between items-center gap-6 relative">
                    
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-5 lg:w-1/3">
                        <div className="w-12 h-12 bg-brand-green/10 rounded-[20px] flex items-center justify-center">
                            <Layout className="text-brand-green" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase text-brand-dark tracking-tight leading-none">Дешборд</h1>
                            <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest leading-none mt-1.5">
                                {isLoading ? 'Синхронизация...' : `Объектов: ${currentData.deals.length} | Аудитов: ${currentData.reports.length}`}
                            </p>
                        </div>
                    </div>

                    {/* Right: Navigation & Sync & Mode Switcher */}
                    <div className="flex items-center gap-4 lg:w-2/3 lg:justify-end">
                        {/* Mode Switcher */}
                        <div className="flex p-1 bg-brand-dark/5 rounded-[20px] border border-black/5 mr-2">
                            <button 
                                onClick={() => setMode('audits')}
                                className={`px-4 py-2 rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'audits' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/30 hover:text-brand-dark/60'}`}
                            >
                                Аудиты
                            </button>
                            <button 
                                onClick={() => setMode('calls')}
                                className={`px-4 py-2 rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'calls' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/30 hover:text-brand-dark/60'}`}
                            >
                                Обзвоны
                            </button>
                            <button 
                                onClick={() => setMode('map')}
                                className={`px-4 py-2 rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'map' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/30 hover:text-brand-dark/60'}`}
                            >
                                Карта
                            </button>
                        </div>

                        <div className="flex p-1.5 bg-brand-dark/5 rounded-[24px] border border-black/5 backdrop-blur-sm">
                            <div className="px-8 py-3 rounded-[18px] bg-white shadow-premium text-[11px] font-bold uppercase tracking-widest text-brand-dark border border-black/5">
                                Дешборд
                            </div>
                            <Link 
                                to="/reports/daily"
                                className="px-8 py-3 rounded-[18px] text-[11px] font-bold uppercase tracking-widest text-brand-dark/40 hover:text-brand-dark transition-all"
                            >
                                Анкета
                            </Link>
                        </div>

                        <button 
                            onClick={fetchData}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-5 py-3 rounded-[20px] bg-brand-green text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale`}
                        >
                            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                            <span>{isLoading ? '...' : 'Синхр.'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="premium-card p-8 rounded-[32px] border border-black/5 bg-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                                <FileText className="text-brand-green" size={20} />
                            </div>
                            <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-1">Всего {mode === 'audits' ? 'отчетов' : 'обзвонов'}</div>
                            <div className="text-4xl font-black text-brand-dark">{currentData.reports.length}</div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <FileText size={120} />
                        </div>
                    </div>

                    <div className="premium-card p-8 rounded-[32px] border border-black/5 bg-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                                <Users className="text-blue-500" size={20} />
                            </div>
                            <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-1">Команда</div>
                            <div className="text-4xl font-black text-brand-dark">{currentData.analytics.length} чел.</div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Users size={120} />
                        </div>
                    </div>

                    <div className="premium-card p-8 rounded-[32px] border border-black/5 bg-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="text-brand-green" size={20} />
                            </div>
                            <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-1">Покрытие объектов</div>
                            <div className="text-4xl font-black text-brand-green">
                                {Math.round((currentData.reports.length / (currentData.deals.length || 1)) * 100)}%
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <TrendingUp size={120} />
                        </div>
                    </div>
                </div>

                {/* Premium Filters: Date & Account */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                    
                    {/* Account Selector */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-brand-green/20 rounded-[32px] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative flex items-center gap-3 bg-white/80 backdrop-blur-xl p-2 rounded-[32px] border border-black/[0.03] shadow-premium ring-1 ring-black/[0.02]">
                            <div className="flex items-center gap-3 px-6 py-3 bg-brand-light/40 rounded-[26px] border border-black/[0.02] hover:bg-white transition-all">
                                <Users size={16} className="text-blue-500" />
                                <select 
                                    value={selectedUserId || ''} 
                                    onChange={(e) => setSelectedUserId(e.target.value || null)}
                                    className="bg-transparent text-[13px] font-black text-brand-dark outline-none cursor-pointer min-w-[150px]"
                                >
                                    <option value="">Все аккаунты</option>
                                    {activeManagers.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="group relative">
                        {/* Glow effect for background */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-green/20 to-blue-500/20 rounded-[34px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        
                        <div className="relative flex items-center gap-1 bg-white/80 backdrop-blur-xl p-2 rounded-[32px] border border-black/[0.03] shadow-premium ring-1 ring-black/[0.02]">
                            
                            <div className="flex items-center gap-4 px-6 py-3 bg-brand-light/40 rounded-[26px] border border-black/[0.02] hover:bg-white hover:shadow-sm transition-all duration-300">
                                <Calendar size={16} className="text-brand-green" />
                                
                                <div className="flex items-center gap-6">
                                    {/* Start Date */}
                                    <div className="relative flex flex-col min-w-[80px]">
                                        <span className="text-[8px] font-black text-brand-dark/20 uppercase tracking-[0.2em] mb-0.5">Начало</span>
                                        <input 
                                            type="date" 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="text-[13px] font-black text-brand-dark tracking-tight">
                                            {startDate ? startDate.split('-').reverse().join('.') : '—'}
                                        </div>
                                    </div>

                                    <div className="w-[1px] h-6 bg-brand-dark/5" />

                                    {/* End Date */}
                                    <div className="relative flex flex-col min-w-[80px]">
                                        <span className="text-[8px] font-black text-brand-dark/20 uppercase tracking-[0.2em] mb-0.5">Конец</span>
                                        <input 
                                            type="date" 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="text-[13px] font-black text-brand-dark tracking-tight">
                                            {endDate ? endDate.split('-').reverse().join('.') : '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clear Button */}
                            {(startDate || endDate || selectedUserId) && (
                                <button 
                                    onClick={() => {
                                        setStartDate('');
                                        setEndDate('');
                                        setSelectedUserId(null);
                                    }}
                                    className="w-12 h-12 flex items-center justify-center rounded-[24px] bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 active:scale-95"
                                    title="Сбросить фильтры"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content: Table or Map */}
                {mode !== 'map' ? (
                    <div className="premium-card bg-white rounded-[40px] border border-black/5 shadow-premium overflow-hidden">
                        <div className="px-8 py-6 border-b border-black/5 bg-brand-light/20">
                            <h2 className="text-sm font-black uppercase text-brand-dark flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-brand-green rounded-full" />
                                {mode === 'audits' ? 'Рейтинг активности (Аудиты)' : 'Рейтинг активности (Обзвоны)'}
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-light/10">
                                        <th className="px-10 py-5 text-[10px] font-black uppercase text-brand-dark/30 tracking-widest">№</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase text-brand-dark/30 tracking-widest">Ответственный</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase text-brand-dark/30 tracking-widest text-center">{mode === 'audits' ? 'Проведено чеков' : 'Проведено обзвонов'}</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase text-brand-dark/30 tracking-widest text-center">План</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase text-brand-dark/30 tracking-widest text-center">Разница</th>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase text-brand-dark/30 tracking-widest text-right">Статус выполнения</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {currentData.analytics.map((stat, idx) => {
                                        const progress = Math.min((stat.reportsCount / (stat.plan || 1)) * 100, 100);
                                        
                                        return (
                                            <tr key={stat.id} className="hover:bg-brand-light/40 transition-all group">
                                                <td className="px-10 py-6 text-xs font-black text-brand-dark/20">{idx + 1}</td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-[11px] font-black text-brand-green border border-brand-green/10">
                                                            {stat.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-brand-dark group-hover:text-brand-green transition-colors">{stat.name}</div>
                                                            <div className="text-[9px] font-bold text-brand-dark/30 uppercase">{stat.dealsCount} объектов</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <div className="text-lg font-black text-brand-dark">{stat.reportsCount}</div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">{stat.plan}</div>
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <div className={`text-sm font-black ${stat.diff >= 0 ? 'text-brand-green' : 'text-red-500'}`}>
                                                        {stat.diff > 0 ? `+${stat.diff}` : stat.diff}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">
                                                            План выполнен на {Math.round(progress)}%
                                                        </div>
                                                        <div className="w-32 h-1.5 bg-brand-light rounded-full overflow-hidden border border-black/5">
                                                            <div 
                                                                className={`h-full transition-all duration-1000 ${
                                                                    progress >= 100 ? 'bg-brand-green' : progress >= 50 ? 'bg-orange-400' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="premium-card bg-white rounded-[40px] border border-black/5 shadow-premium overflow-hidden h-[600px] relative">
                        <MapComponent 
                            deals={allDeals} 
                            reports={rawAuditReports} 
                            startDate={startDate} 
                            endDate={endDate} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// Separate Map Component to isolate Leaflet logic
const MapComponent = ({ deals, reports, startDate, endDate }: any) => {
    const mapRef = React.useRef<any>(null);
    const mapInstance = React.useRef<any>(null);
    const markersGroup = React.useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current || !window.L) return;

        // Initialize Map if not exists
        if (!mapInstance.current) {
            mapInstance.current = window.L.map(mapRef.current).setView([48.0196, 66.9237], 5); // Kazakhstan center
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapInstance.current);
            markersGroup.current = window.L.layerGroup().addTo(mapInstance.current);
        }

        // Clear existing markers
        markersGroup.current.clearLayers();

        // Object with reports within date range
        const reportMap = (reports || []).reduce((acc: any, r: any) => {
            const rDate = r.createdTime?.split('T')[0];
            if (startDate && rDate < startDate) return acc;
            if (endDate && rDate > endDate) return acc;
            acc[r.companyId] = true;
            return acc;
        }, {});

        // Add markers
        (deals || []).forEach((deal: any) => {
            if (deal.lat && deal.lng) {
                const hasReport = reportMap[deal.companyId];
                const color = hasReport ? '#10b981' : '#ef4444'; // Green or Red

                const marker = window.L.circleMarker([deal.lat, deal.lng], {
                    radius: 6,
                    fillColor: color,
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                });

                marker.bindPopup(`
                    <div style="font-family: 'Montserrat', sans-serif; padding: 10px;">
                        <div style="font-weight: 900; font-size: 14px; margin-bottom: 5px; color: #1a2215;">${deal.title}</div>
                        <div style="font-size: 10px; color: ${color}; font-weight: bold; text-transform: uppercase;">
                            ${hasReport ? 'Аудит проведен' : 'Аудит не найден'}
                        </div>
                        <div style="font-size: 11px; margin-top: 5px; opacity: 0.6;">${deal.city || ''}</div>
                    </div>
                `);

                markersGroup.current.addLayer(marker);
            }
        });

        // Fit bounds if has markers
        if (deals.length > 0) {
            // mapInstance.current.fitBounds(markersGroup.current.getBounds());
        }

        return () => {
            // Optional: cleanup
        };
    }, [deals, reports, startDate, endDate]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 10 }} />;
};

export default AdminMapPage;
