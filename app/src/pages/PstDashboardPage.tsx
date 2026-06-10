import { type ReactNode, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  History,
  LoaderCircle,
  RefreshCw,
  Search,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

type DashboardSummary = {
  factOnDate: number;
  weeklyFactCount: number;
};

type DashboardRow = {
  postomatId: string;
  city: string;
  branch: string;
  address: string;
  category: string;
  planned: boolean;
  completed: boolean;
  planComment: string;
  factCount: number;
  factDate: string;
  factTime: string;
  folderLinkText: string;
  status: string;
};

type RecentHistoryItem = {
  postomatId: string;
  city: string;
  branch: string;
  address: string;
  category: string;
  date: string;
  time: string;
  folderLinkText: string;
};

type HistoryTableRow = RecentHistoryItem;

type HistoryTarget = {
  postomatId: string;
  city: string;
  branch: string;
  address: string;
  category: string;
};

type OverviewResponse = {
  ok: boolean;
  version: string;
  error?: string;
  filters: {
    date: string;
    branch: string;
    query: string;
    page: number;
    pageSize: number;
  };
  summary: DashboardSummary;
  branches: string[];
  rows: DashboardRow[];
  recentHistory: RecentHistoryItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

type ObjectHistoryResponse = {
  ok: boolean;
  version: string;
  error?: string;
  postomatId: string;
  items: RecentHistoryItem[];
};

const DASHBOARD_WEB_APP_URL =
  (import.meta.env.VITE_PST_DASHBOARD_WEB_APP_URL as string | undefined) || '';
const PAGE_SIZE = 25;
const WEEKLY_PLAN_VALUES = [1300, 1500, 1700, 2000, 2200, 2200, 0];

const DEMO_BRANCHES = ['Южная Столица', 'Шымкент', 'Уральск'];

const createDemoOverview = (
  selectedDate: string,
  selectedBranch: string,
  searchQuery: string,
  currentPage: number
): OverviewResponse => {
  const baseRows: DashboardRow[] = [
    {
      postomatId: '2314',
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'ул. Жарокова, д. 205',
      category: 'Категория C***',
      planned: true,
      completed: true,
      planComment: 'Приоритетная точка на утро',
      factCount: 6,
      factDate: selectedDate,
      factTime: '09:40',
      folderLinkText: 'Папка с фото',
      status: 'Выполнено',
    },
    {
      postomatId: '7162',
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'ул. Кармысова, д. 84/2к1',
      category: 'Категория B***',
      planned: true,
      completed: false,
      planComment: '',
      factCount: 0,
      factDate: '',
      factTime: '',
      folderLinkText: '',
      status: 'Запланировано',
    },
    {
      postomatId: '8928',
      city: 'Уральск',
      branch: 'Уральск',
      address: 'ул. Брусиловского, д. 48/1',
      category: 'Уличный***',
      planned: true,
      completed: false,
      planComment: '',
      factCount: 0,
      factDate: '',
      factTime: '',
      folderLinkText: '',
      status: 'Просрочено',
    },
    {
      postomatId: '7689',
      city: 'Арысь',
      branch: 'Шымкент',
      address: 'ул. Ергобек, д. 126',
      category: 'Категория B***',
      planned: false,
      completed: true,
      planComment: '',
      factCount: 4,
      factDate: selectedDate,
      factTime: '13:18',
      folderLinkText: 'Папка с фото',
      status: 'Выполнено вне плана',
    },
    {
      postomatId: '5374',
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'пр. Абылай Хана, д. 153',
      category: 'Уличный***',
      planned: true,
      completed: true,
      planComment: '',
      factCount: 8,
      factDate: selectedDate,
      factTime: '15:22',
      folderLinkText: 'Папка с фото',
      status: 'Выполнено',
    },
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filtered = baseRows.filter((row) => {
    if (selectedBranch && row.branch !== selectedBranch) return false;
    if (!normalizedQuery) return true;
    return [
      row.postomatId,
      row.city,
      row.branch,
      row.address,
      row.category,
      row.planComment,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const total = filtered.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const factOnDate = filtered.filter((row) => row.completed).length;
  const weeklyFactCount = filtered.filter((row) => row.completed).length;

  return {
    ok: true,
    version: 'demo-preview',
    filters: {
      date: selectedDate,
      branch: selectedBranch,
      query: searchQuery,
      page: safePage,
      pageSize: PAGE_SIZE,
    },
    summary: {
      factOnDate,
      weeklyFactCount,
    },
    branches: DEMO_BRANCHES,
    rows,
    recentHistory: [
      {
        postomatId: '5374',
        city: 'Алматы',
        branch: 'Южная Столица',
        address: 'пр. Абылай Хана, д. 153',
        category: 'Уличный***',
        date: selectedDate,
        time: '15:22',
        folderLinkText: 'Папка с фото',
      },
      {
        postomatId: '2314',
        city: 'Алматы',
        branch: 'Южная Столица',
        address: 'ул. Жарокова, д. 205',
        category: 'Категория C***',
        date: selectedDate,
        time: '09:40',
        folderLinkText: 'Папка с фото',
      },
    ],
    pagination: {
      page: safePage,
      pageSize: PAGE_SIZE,
      total,
      totalPages,
    },
  };
};

const createDemoHistory = (postomatId: string): ObjectHistoryResponse => ({
  ok: true,
  version: 'demo-preview',
  postomatId,
  items: [
    {
      postomatId,
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'Демо-адрес',
      category: 'Категория B***',
      date: todayIso(),
      time: '15:22',
      folderLinkText: 'Папка с фото',
    },
    {
      postomatId,
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'Демо-адрес',
      category: 'Категория B***',
      date: todayIso(),
      time: '10:14',
      folderLinkText: 'Папка с фото',
    },
  ],
});

const createDemoHistoryTableRows = (selectedDate: string, selectedBranch: string, searchQuery: string) => {
  const baseRows: HistoryTableRow[] = [
    {
      postomatId: '2314',
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'ул. Жарокова, д. 205',
      category: 'Категория C***',
      date: selectedDate,
      time: '09:40',
      folderLinkText: 'Папка с фото',
    },
    {
      postomatId: '5374',
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'пр. Абылай Хана, д. 153',
      category: 'Уличный***',
      date: selectedDate,
      time: '15:22',
      folderLinkText: 'Папка с фото',
    },
    {
      postomatId: '7689',
      city: 'Арысь',
      branch: 'Шымкент',
      address: 'ул. Ергобек, д. 126',
      category: 'Категория B***',
      date: selectedDate,
      time: '13:18',
      folderLinkText: 'Папка с фото',
    },
    {
      postomatId: '1140',
      city: 'Алматы',
      branch: 'Южная Столица',
      address: 'мкр. Жулдыз-1, д. 5/3',
      category: 'Категория B+***',
      date: selectedDate,
      time: '08:28',
      folderLinkText: 'Папка с фото',
    },
    {
      postomatId: '8928',
      city: 'Уральск',
      branch: 'Уральск',
      address: 'ул. Брусиловского, д. 48/1',
      category: 'Уличный***',
      date: selectedDate,
      time: '08:14',
      folderLinkText: 'Папка с фото',
    },
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  return baseRows.filter((row) => {
    if (selectedBranch && row.branch !== selectedBranch) return false;
    if (!normalizedQuery) return true;

    return [row.postomatId, row.city, row.branch, row.address, row.category, row.time]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery);
  });
};

const todayIso = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatIsoDate = (value: string) => {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year}`;
};

const getWeekDays = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const baseDate = new Date(year, (month || 1) - 1, day || 1);
  const currentDay = baseDate.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);

    return {
      iso: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(
        current.getDate()
      ).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(current),
      day: String(current.getDate()).padStart(2, '0'),
      month: String(current.getMonth() + 1).padStart(2, '0'),
    };
  });
};

const getWeekPlanSlots = (isoDate: string) => {
  const baseWeekDays = getWeekDays(isoDate);
  const currentWeekStart = baseWeekDays[0];
  const [year, month, day] = currentWeekStart.iso.split('-').map(Number);
  const monday = new Date(year, (month || 1) - 1, day || 1);

  return Array.from({ length: 7 }, (_, index) => {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() + index * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startIso = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(weekStart.getDate()).padStart(2, '0')}`;

    return {
      id: index + 1,
      startIso,
      startLabel: `${String(weekStart.getDate()).padStart(2, '0')}.${String(
        weekStart.getMonth() + 1
      ).padStart(2, '0')}`,
      endLabel: `${String(weekEnd.getDate()).padStart(2, '0')}.${String(
        weekEnd.getMonth() + 1
      ).padStart(2, '0')}`,
      value: WEEKLY_PLAN_VALUES[index] ?? 0,
      isCurrent: index === 0,
    };
  });
};

const statusTone: Record<string, string> = {
  Выполнено: 'bg-brand-green/14 text-brand-dark border-brand-green/30',
  Запланировано: 'bg-[#f7f8f4] text-brand-dark/70 border-black/8',
  Просрочено: 'bg-[#fff2f1] text-[#d35d59] border-[#f2c7c5]',
  'Выполнено вне плана': 'bg-[#eef4ff] text-[#4e6ea8] border-[#cdddff]',
  'Без статуса': 'bg-[#f7f8f4] text-brand-dark/55 border-black/8',
};

const buildJsonpUrl = (baseUrl: string, params: Record<string, string | number>) => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

const jsonpRequest = <T,>(url: string, params: Record<string, string | number>) =>
  new Promise<T>((resolve, reject) => {
    const callbackName = `pstDashboardCallback_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
    const script = document.createElement('script');
    const fullUrl = buildJsonpUrl(url, {
      ...params,
      callback: callbackName,
    });

    const cleanup = () => {
      delete (window as Window & Record<string, unknown>)[callbackName];
      script.remove();
    };

    (window as Window & Record<string, unknown>)[callbackName] = (payload: T) => {
      cleanup();
      resolve(payload);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Не удалось получить данные от dashboard API.'));
    };

    script.src = fullUrl;
    document.body.appendChild(script);
  });

const DashboardCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) => (
  <div className="rounded-[28px] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
          {label}
        </div>
        <div className={`mt-3 text-[clamp(1.8rem,3.3vw,2.6rem)] font-black leading-none ${accent ?? 'text-brand-dark'}`}>
          {value}
        </div>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f7f8f4] text-brand-green shadow-sm">
        {icon}
      </div>
    </div>
  </div>
);

const PstDashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [selectedBranch, setSelectedBranch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [historyData, setHistoryData] = useState<ObjectHistoryResponse | null>(null);
  const [historyTarget, setHistoryTarget] = useState<HistoryTarget | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [overviewError, setOverviewError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const deferredQuery = useDeferredValue(searchTerm.trim());
  const isDemoMode = !DASHBOARD_WEB_APP_URL;

  const canLoadDashboard = isDemoMode || Boolean(DASHBOARD_WEB_APP_URL);

  const loadOverview = async (nextPage = page, nextBranch = selectedBranch, nextDate = selectedDate) => {
    if (isDemoMode) {
      setOverview(createDemoOverview(nextDate, nextBranch, deferredQuery, nextPage));
      setOverviewError('');
      return;
    }

    if (!DASHBOARD_WEB_APP_URL) return;

    setIsLoadingOverview(true);
    setOverviewError('');

    try {
      const payload = await jsonpRequest<OverviewResponse>(DASHBOARD_WEB_APP_URL, {
        action: 'overview',
        date: nextDate,
        branch: nextBranch,
        query: deferredQuery,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });

      if (!payload.ok) {
        throw new Error(payload.error || 'Dashboard API вернул ошибку.');
      }

      setOverview(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось загрузить данные dashboard.';
      setOverview(null);
      setOverviewError(message);
    } finally {
      setIsLoadingOverview(false);
    }
  };

  useEffect(() => {
    if (!canLoadDashboard) return;
    loadOverview(page, selectedBranch, selectedDate);
  }, [canLoadDashboard, page, selectedBranch, selectedDate, deferredQuery]);


  const openHistory = async (row: HistoryTarget) => {
    if (isDemoMode) {
      setHistoryTarget(row);
      setHistoryError('');
      setHistoryData(createDemoHistory(row.postomatId));
      return;
    }

    if (!DASHBOARD_WEB_APP_URL) return;

    setHistoryTarget(row);
    setHistoryData(null);
    setHistoryError('');
    setIsLoadingHistory(true);

    try {
      const payload = await jsonpRequest<ObjectHistoryResponse>(DASHBOARD_WEB_APP_URL, {
        action: 'object_history',
        postomatId: row.postomatId,
      });

      if (!payload.ok) {
        throw new Error(payload.error || 'Не удалось загрузить историю точки.');
      }

      setHistoryData(payload);
    } catch (error) {
      setHistoryError(
        error instanceof Error ? error.message : 'Не удалось загрузить историю точки.'
      );
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const rows = overview?.rows ?? [];
  const pagination = overview?.pagination;
  const summary = overview?.summary;
  const branches = overview?.branches ?? [];
  const tableHistoryRows = useMemo(
    () =>
      isDemoMode
        ? createDemoHistoryTableRows(selectedDate, selectedBranch, deferredQuery)
        : overview?.recentHistory ?? [],
    [deferredQuery, isDemoMode, overview?.recentHistory, selectedBranch, selectedDate]
  );
  const weeklyPlan = useMemo(() => getWeekPlanSlots(selectedDate), [selectedDate]);
  const weeklyTotal = weeklyPlan.reduce((sum, item) => sum + item.value, 0);
  const weeklyPeak = Math.max(...weeklyPlan.map((item) => item.value), 1);

  const summaryCards = useMemo(
    () => [
      {
        label: '\u0424\u0430\u043a\u0442 \u043d\u0430 \u0434\u0430\u0442\u0443',
        value: summary?.factOnDate ?? '\u2014',
        icon: <CheckCircle2 size={22} />,
      },
      {
        label: '\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u043f\u043b\u0430\u043d\u0430',
        value: `${Math.min(Math.round((((summary?.weeklyFactCount ?? 0) / Math.max(weeklyPlan[0]?.value ?? 0, 1)) * 100)), 999)}%`,
        icon: <Target size={22} />,
        accent: 'text-brand-green',
      },
      {
        label: '\u041e\u0442\u0441\u0442\u0430\u0432\u0430\u043d\u0438\u0435',
        value: Math.max((weeklyPlan[0]?.value ?? 0) - (summary?.weeklyFactCount ?? 0), 0),
        icon: <AlertCircle size={22} />,
        accent:
          Math.max((weeklyPlan[0]?.value ?? 0) - (summary?.weeklyFactCount ?? 0), 0) > 0
            ? 'text-[#d35d59]'
            : 'text-brand-dark',
      },
    ],
    [summary, weeklyPlan]
  );

  return (
    <div className="min-h-screen bg-brand-light pb-16 pt-24 md:pt-32">
      <SeoHead
        title="PST Dashboard | IC Group"
        description="Отдельное пространство для руководства по Kaspi Postomat: план, факт и история уборок."
        path="/pst-dashboard"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-6 xl:px-8 2xl:px-10">
        <div className="mb-10 flex items-center gap-4">
          <Link to="/" className="inline-flex">
            <img
              src="/logo_IC_group.png"
              alt="IC Group"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>

        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <section>
            <div className="rounded-[34px] border border-black/6 bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:px-8">
              <h1 className="max-w-4xl font-black uppercase leading-[0.88] tracking-tighter text-brand-dark text-[clamp(2.2rem,5vw,4.8rem)]">
                Dashboard
                <br />
                <span className="text-brand-green">Kaspi Postomat</span>
              </h1>

            </div>

            {canLoadDashboard && (
              <>
                <div className="mt-6 rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="text-2xl font-black uppercase tracking-tight text-brand-dark sm:text-3xl">
                        Планы по неделям
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-brand-green/20 bg-brand-green/10 px-5 py-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                        Сумма недели
                      </div>
                      <div className="mt-2 text-3xl font-black leading-none text-brand-green">
                        {weeklyTotal.toLocaleString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
                    {weeklyPlan.map((item) => (
                      <div
                        key={item.startIso}
                        className={`relative flex min-h-[230px] flex-col overflow-hidden rounded-[26px] border p-4 text-left transition ${
                          item.isCurrent
                            ? 'border-brand-green bg-[#f5fbe9] shadow-[0_18px_35px_rgba(143,198,64,0.18)]'
                            : 'border-black/6 bg-[#fbfcf8]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/38">
                              Неделя {item.id}
                            </div>
                            <div className="mt-2 text-lg font-black text-brand-dark">
                              {item.startLabel} - {item.endLabel}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="text-[clamp(1.5rem,2vw,2rem)] font-black leading-none text-brand-dark">
                            {item.value.toLocaleString('ru-RU')}
                          </div>
                          <div className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-dark/38">
                            план на неделю
                          </div>
                        </div>

                        <div className="mt-auto pt-8">
                          <div className="h-2 rounded-full bg-brand-dark/6">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                item.isCurrent ? 'bg-brand-green' : 'bg-brand-green/85'
                              }`}
                              style={{
                                width: `${Math.max((item.value / weeklyPeak) * 100, item.value > 0 ? 12 : 0)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {summaryCards.map((card) => (
                    <DashboardCard
                      key={card.label}
                      icon={card.icon}
                      label={card.label}
                      value={card.value}
                      accent={card.accent}
                    />
                  ))}
                </div>

                <div className="mt-6 rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
                  <div className="grid gap-4 2xl:grid-cols-[220px_240px_minmax(0,1fr)_auto]">
                    <label className="block">
                      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
                        Дата
                      </div>
                      <div className="relative">
                        <CalendarDays
                          size={16}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30"
                        />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(event) => {
                            setSelectedDate(event.target.value);
                            setPage(1);
                          }}
                          className="w-full rounded-2xl border border-brand-dark/10 bg-[#f7f8f4] py-4 pl-11 pr-4 text-sm font-semibold text-brand-dark outline-none transition focus:border-brand-green focus:bg-white"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
                        Филиал
                      </div>
                      <select
                        value={selectedBranch}
                        onChange={(event) => {
                          setSelectedBranch(event.target.value);
                          setPage(1);
                        }}
                        className="w-full rounded-2xl border border-brand-dark/10 bg-[#f7f8f4] px-4 py-4 text-sm font-semibold text-brand-dark outline-none transition focus:border-brand-green focus:bg-white"
                      >
                        <option value="">Все филиалы</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
                        Поиск точки
                      </div>
                      <div className="relative">
                        <Search
                          size={16}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/28"
                        />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setPage(1);
                          }}
                          placeholder="ID, адрес, город, категория"
                          className="w-full rounded-2xl border border-brand-dark/10 bg-[#f7f8f4] py-4 pl-11 pr-4 text-sm font-semibold text-brand-dark outline-none transition focus:border-brand-green focus:bg-white"
                        />
                      </div>
                    </label>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => loadOverview(page, selectedBranch, selectedDate)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-black/8 bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark transition hover:border-brand-green/30 hover:text-brand-green xl:w-auto"
                      >
                        <RefreshCw size={16} className={isLoadingOverview ? 'animate-spin' : ''} />
                        Обновить
                      </button>
                    </div>
                  </div>

                  {overviewError && (
                    <div className="mt-4 rounded-[22px] border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">
                      {overviewError}
                    </div>
                  )}

                  <div className="mt-5 overflow-hidden rounded-[28px] border border-black/6">
                    <div>
                      <table className="w-full border-collapse table-fixed">
                        <colgroup>
                          <col className="w-[120px]" />
                          <col className="w-[180px]" />
                          <col />
                          <col className="w-[160px]" />
                          <col className="w-[160px]" />
                          <col className="w-[150px]" />
                        </colgroup>
                        <thead className="bg-[#f7f8f4]">
                          <tr className="text-left">
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              POSTOMAT_ID
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Локация
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Адрес
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Категория точки
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Дата и время
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Фото
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/6 bg-white">
                          {isLoadingOverview && !overview && (
                            <tr>
                              <td colSpan={8} className="px-4 py-10 text-center text-sm font-semibold text-brand-dark/55">
                                <span className="inline-flex items-center gap-2">
                                  <LoaderCircle size={18} className="animate-spin text-brand-green" />
                                  Загружаем данные из таблицы...
                                </span>
                              </td>
                            </tr>
                          )}

                          {!isLoadingOverview && tableHistoryRows.length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-4 py-10 text-center text-sm font-semibold text-brand-dark/55">
                                По текущим фильтрам ничего не найдено.
                              </td>
                            </tr>
                          )}

                          {tableHistoryRows.map((row, index) => {
                            const isSelected = historyTarget?.postomatId === row.postomatId;

                            return (
                            <tr
                              key={`${row.postomatId}-${row.date}-${row.time}-${index}`}
                              className={`align-top cursor-pointer transition ${
                                isSelected ? 'bg-brand-green/5' : 'hover:bg-[#fbfcf8]'
                              }`}
                              onClick={() => openHistory(row)}
                            >
                              <td className="px-4 py-4 text-sm font-black text-brand-dark">
                                {row.postomatId}
                              </td>
                              <td className="px-4 py-4">
                                <div className="space-y-2">
                                  <div className="text-sm font-semibold text-brand-dark/72">{row.city}</div>
                                  <span className="inline-flex rounded-full bg-brand-green/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                                    {row.branch}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm font-black leading-6 text-brand-dark break-words">
                                {row.address}
                              </td>
                              <td className="px-4 py-4 text-sm font-semibold text-brand-dark/62">
                                {row.category}
                              </td>
                              <td className="px-4 py-4 text-sm font-semibold text-brand-dark/62">
                                <div>{formatIsoDate(row.date)}</div>
                                <div className="mt-1 text-brand-dark/45">{row.time || '—'}</div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-flex w-full justify-center whitespace-nowrap rounded-full border border-black/8 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark">
                                  {row.folderLinkText || 'Папка с фото'}
                                </span>
                              </td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
                    Последняя активность
                  </div>
                  <div className="mt-2 text-sm font-semibold text-brand-dark/55">
                    {selectedDate ? `На дату ${formatIsoDate(selectedDate)}` : 'По текущим данным'}
                  </div>
                </div>
                {isLoadingOverview && <LoaderCircle size={18} className="animate-spin text-brand-green" />}
              </div>

              <div className="mt-4 space-y-3">
                {(overview?.recentHistory ?? []).length === 0 && (
                  <div className="rounded-[22px] border border-dashed border-black/8 bg-[#fbfcf8] px-4 py-4 text-sm font-semibold text-brand-dark/48">
                    Пока нет недавних записей для этой даты.
                  </div>
                )}

                {(overview?.recentHistory ?? []).map((item, index) => (
                  <div
                    key={`${item.postomatId}-${item.date}-${item.time}-${index}`}
                    className="rounded-[22px] border border-black/6 bg-[#fbfcf8] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand-dark/55">
                        ID {item.postomatId}
                      </span>
                      <span className="rounded-full bg-brand-green/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                        {item.branch || 'Без филиала'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-black leading-6 text-brand-dark">
                      {item.address}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-brand-dark/55">
                      {formatIsoDate(item.date)} • {item.time || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
                История точки
              </div>

              {!historyTarget && (
                <div className="mt-4 rounded-[22px] border border-dashed border-black/8 bg-[#fbfcf8] px-4 py-4 text-sm font-semibold leading-6 text-brand-dark/48">
                  Откройте историю по нужному объекту из списка, и здесь появятся последние уборки.
                </div>
              )}

              {historyTarget && (
                <div className="mt-4">
                  <div className="rounded-[24px] bg-brand-dark p-5 text-white">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                      ID {historyTarget.postomatId}
                    </div>
                    <div className="mt-3 text-base font-black leading-6">
                      {historyTarget.address}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white/62">
                      {historyTarget.city} • {historyTarget.branch}
                    </div>
                  </div>

                  {historyError && (
                    <div className="mt-4 rounded-[22px] border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">
                      {historyError}
                    </div>
                  )}

                  {isLoadingHistory && (
                    <div className="mt-4 rounded-[22px] border border-black/6 bg-[#fbfcf8] px-4 py-4 text-sm font-semibold text-brand-dark/55">
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle size={16} className="animate-spin text-brand-green" />
                        Загружаем историю...
                      </span>
                    </div>
                  )}

                  {!isLoadingHistory && historyData && (
                    <div className="mt-4 space-y-3">
                      {historyData.items.length === 0 && (
                        <div className="rounded-[22px] border border-dashed border-black/8 bg-[#fbfcf8] px-4 py-4 text-sm font-semibold text-brand-dark/48">
                          По этой точке в истории пока нет записей.
                        </div>
                      )}

                      {historyData.items.map((item, index) => (
                        <div
                          key={`${item.postomatId}-${item.date}-${item.time}-${index}`}
                          className="rounded-[22px] border border-black/6 bg-white px-4 py-4 shadow-sm"
                        >
                          <div className="text-sm font-black text-brand-dark">
                            {formatIsoDate(item.date)} • {item.time || '—'}
                          </div>
                          <div className="mt-2 text-sm font-semibold leading-6 text-brand-dark/58">
                            {item.folderLinkText || 'Папка с фото'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PstDashboardPage;
