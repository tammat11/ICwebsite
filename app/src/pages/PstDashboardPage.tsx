import { type ReactNode, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
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

type BranchReportDay = {
  label: string;
  plan: number;
  fact: number;
};

type BranchReportRow = {
  branch: string;
  days: BranchReportDay[];
};

type WeeklyBranchReport = {
  id: string;
  title: string;
  period: string;
  weeklyPlan: number;
  weeklyFact: number;
  weeklyCompletion: number;
  days: string[];
  totals: BranchReportDay[];
  dailyCompletion: number[];
  branches: BranchReportRow[];
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
  folderLinkUrl?: string;
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
  folderLinkUrl?: string;
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
  (import.meta.env.VITE_PST_DASHBOARD_WEB_APP_URL as string | undefined) ||
  'https://script.google.com/macros/s/AKfycbzEsZKczASxXauJXfIc5rK4bcUIwcUt8Zq6ssDmZD6lGc7oqGJEiCDUMGlw-Bq0OsTidw/exec';
const PAGE_SIZE = 25;
const WEEKLY_PLAN_VALUES = [1300, 1500, 1700, 2000, 2200, 2200, 0];
const BRANCH_REPORTS: WeeklyBranchReport[] = [
  {
    id: 'report-week-1',
    title: 'Отчетная неделя',
    period: '01.06.2026 - 07.06.2026',
    weeklyPlan: 987,
    weeklyFact: 725,
    weeklyCompletion: 73.45,
    days: ['01.06', '02.06', '03.06', '04.06', '05.06', '06.06', '07.06'],
    totals: [
      { label: '01.06', plan: 120, fact: 66 },
      { label: '02.06', plan: 120, fact: 73 },
      { label: '03.06', plan: 150, fact: 83 },
      { label: '04.06', plan: 137, fact: 117 },
      { label: '05.06', plan: 140, fact: 113 },
      { label: '06.06', plan: 164, fact: 131 },
      { label: '07.06', plan: 156, fact: 142 },
    ],
    dailyCompletion: [55, 60.83, 55.33, 85.4, 80.71, 79.88, 91.03],
    branches: [
      {
        branch: 'Южная столица',
        days: [
          { label: '01.06', plan: 89, fact: 43 },
          { label: '02.06', plan: 80, fact: 40 },
          { label: '03.06', plan: 95, fact: 49 },
          { label: '04.06', plan: 99, fact: 81 },
          { label: '05.06', plan: 95, fact: 71 },
          { label: '06.06', plan: 93, fact: 78 },
          { label: '07.06', plan: 92, fact: 89 },
        ],
      },
      {
        branch: 'Шымкент',
        days: [
          { label: '01.06', plan: 20, fact: 12 },
          { label: '02.06', plan: 25, fact: 21 },
          { label: '03.06', plan: 40, fact: 25 },
          { label: '04.06', plan: 22, fact: 22 },
          { label: '05.06', plan: 30, fact: 29 },
          { label: '06.06', plan: 44, fact: 27 },
          { label: '07.06', plan: 43, fact: 34 },
        ],
      },
      {
        branch: 'Туркестан',
        days: [
          { label: '01.06', plan: 11, fact: 11 },
          { label: '02.06', plan: 15, fact: 12 },
          { label: '03.06', plan: 15, fact: 9 },
          { label: '04.06', plan: 16, fact: 14 },
          { label: '05.06', plan: 15, fact: 13 },
          { label: '06.06', plan: 15, fact: 14 },
          { label: '07.06', plan: 12, fact: 10 },
        ],
      },
      {
        branch: 'Кентау',
        days: [
          { label: '01.06', plan: 0, fact: 0 },
          { label: '02.06', plan: 0, fact: 0 },
          { label: '03.06', plan: 0, fact: 0 },
          { label: '04.06', plan: 0, fact: 0 },
          { label: '05.06', plan: 0, fact: 0 },
          { label: '06.06', plan: 12, fact: 12 },
          { label: '07.06', plan: 9, fact: 9 },
        ],
      },
    ],
  },
  {
    id: 'report-week-2',
    title: 'План на текущую неделю',
    period: '08.06.2026 - 14.06.2026',
    weeklyPlan: 1458,
    weeklyFact: 106,
    weeklyCompletion: 7.27,
    days: ['08.06', '09.06', '10.06', '11.06', '12.06', '13.06', '14.06'],
    totals: [
      { label: '08.06', plan: 153, fact: 106 },
      { label: '09.06', plan: 174, fact: 0 },
      { label: '10.06', plan: 189, fact: 0 },
      { label: '11.06', plan: 182, fact: 0 },
      { label: '12.06', plan: 198, fact: 0 },
      { label: '13.06', plan: 220, fact: 0 },
      { label: '14.06', plan: 342, fact: 0 },
    ],
    dailyCompletion: [69.28, 0, 0, 0, 0, 0, 0],
    branches: [
      {
        branch: 'Южная столица',
        days: [
          { label: '08.06', plan: 101, fact: 62 },
          { label: '09.06', plan: 100, fact: 0 },
          { label: '10.06', plan: 100, fact: 0 },
          { label: '11.06', plan: 100, fact: 0 },
          { label: '12.06', plan: 100, fact: 0 },
          { label: '13.06', plan: 100, fact: 0 },
          { label: '14.06', plan: 225, fact: 0 },
        ],
      },
      {
        branch: 'Шымкент',
        days: [
          { label: '08.06', plan: 17, fact: 14 },
          { label: '09.06', plan: 19, fact: 0 },
          { label: '10.06', plan: 30, fact: 0 },
          { label: '11.06', plan: 24, fact: 0 },
          { label: '12.06', plan: 33, fact: 0 },
          { label: '13.06', plan: 38, fact: 0 },
          { label: '14.06', plan: 30, fact: 0 },
        ],
      },
      {
        branch: 'Уральск',
        days: [
          { label: '08.06', plan: 11, fact: 9 },
          { label: '09.06', plan: 13, fact: 0 },
          { label: '10.06', plan: 15, fact: 0 },
          { label: '11.06', plan: 13, fact: 0 },
          { label: '12.06', plan: 16, fact: 0 },
          { label: '13.06', plan: 29, fact: 0 },
          { label: '14.06', plan: 35, fact: 0 },
        ],
      },
      {
        branch: 'Актау',
        days: [
          { label: '08.06', plan: 0, fact: 0 },
          { label: '09.06', plan: 9, fact: 0 },
          { label: '10.06', plan: 10, fact: 0 },
          { label: '11.06', plan: 10, fact: 0 },
          { label: '12.06', plan: 12, fact: 0 },
          { label: '13.06', plan: 16, fact: 0 },
          { label: '14.06', plan: 16, fact: 0 },
        ],
      },
      {
        branch: 'Тараз',
        days: [
          { label: '08.06', plan: 0, fact: 0 },
          { label: '09.06', plan: 11, fact: 0 },
          { label: '10.06', plan: 11, fact: 0 },
          { label: '11.06', plan: 15, fact: 0 },
          { label: '12.06', plan: 16, fact: 0 },
          { label: '13.06', plan: 16, fact: 0 },
          { label: '14.06', plan: 15, fact: 0 },
        ],
      },
      {
        branch: 'Кызылорда',
        days: [
          { label: '08.06', plan: 24, fact: 21 },
          { label: '09.06', plan: 22, fact: 0 },
          { label: '10.06', plan: 23, fact: 0 },
          { label: '11.06', plan: 20, fact: 0 },
          { label: '12.06', plan: 21, fact: 0 },
          { label: '13.06', plan: 21, fact: 0 },
          { label: '14.06', plan: 21, fact: 0 },
        ],
      },
    ],
  },
];

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

  const factOnDate = baseRows.filter((row) => row.completed).reduce((sum, row) => sum + Math.max(row.factCount || 0, 1), 0);
  const weeklyFactCount = factOnDate;

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
  const [activeBranchReportId, setActiveBranchReportId] = useState(BRANCH_REPORTS[0]?.id ?? '');
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
  const activeBranchReport =
    BRANCH_REPORTS.find((report) => report.id === activeBranchReportId) ?? BRANCH_REPORTS[0];

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
  const currentWeekPlanValue = weeklyPlan[0]?.value ?? 0;
  const factOnDateValue = summary?.factOnDate ?? 0;
  const weeklyCompletionPercent = Math.max(
    0,
    Math.min(
      Math.round(((factOnDateValue / Math.max(currentWeekPlanValue, 1)) * 100)),
      100
    )
  );
  const weeklyLag = Math.max(currentWeekPlanValue - factOnDateValue, 0);

  const summaryCards = useMemo(
    () => [
      {
        label: '\u0424\u0430\u043a\u0442 \u043d\u0430 \u0434\u0430\u0442\u0443',
        value: summary?.factOnDate ?? '\u2014',
        icon: <CheckCircle2 size={22} />,
      },
      {
        label: '\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u043f\u043b\u0430\u043d\u0430',
        value: `${weeklyCompletionPercent}%`,
        icon: <Target size={22} />,
        accent: 'text-brand-green',
      },
      {
        label: '\u041e\u0442\u0441\u0442\u0430\u0432\u0430\u043d\u0438\u0435',
        value: weeklyLag,
        icon: <AlertCircle size={22} />,
        accent: weeklyLag > 0 ? 'text-[#d35d59]' : 'text-brand-dark',
      },
    ],
    [summary, weeklyCompletionPercent, weeklyLag, factOnDateValue]
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
                                width: `${
                                  Math.max(
                                    Math.min(
                                      Math.round(((factOnDateValue / Math.max(item.value, 1)) * 100)),
                                      100
                                    ),
                                    item.value > 0 ? 8 : 0
                                  )
                                }%`,
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

                {activeBranchReport && (
                  <div className="mt-6 rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
                          Отчет по филиалам
                        </div>
                        <div className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark sm:text-3xl">
                          План / факт по дням
                        </div>
                        <div className="mt-2 text-sm font-semibold text-brand-dark/58">
                          Интерфейс повторяет логику Excel-отчета: филиалы, ежедневный план и факт, итоги и выполнение недели.
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {BRANCH_REPORTS.map((report) => {
                          const isActive = report.id === activeBranchReport.id;
                          return (
                            <button
                              key={report.id}
                              type="button"
                              onClick={() => setActiveBranchReportId(report.id)}
                              className={`rounded-full border px-4 py-3 text-left transition ${
                                isActive
                                  ? 'border-brand-green bg-brand-green/10 text-brand-dark shadow-[0_8px_24px_rgba(143,198,64,0.18)]'
                                  : 'border-black/8 bg-[#fbfcf8] text-brand-dark/62 hover:border-brand-green/30'
                              }`}
                            >
                              <div className="text-[10px] font-black uppercase tracking-[0.22em]">
                                {report.title}
                              </div>
                              <div className="mt-1 text-sm font-black">{report.period}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                      <div className="rounded-[26px] border border-black/6 bg-[#fbfcf8] p-5">
                        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/38">
                          План недели
                        </div>
                        <div className="mt-3 text-[clamp(2rem,3vw,3rem)] font-black leading-none text-brand-dark">
                          {activeBranchReport.weeklyPlan.toLocaleString('ru-RU')}
                        </div>
                      </div>

                      <div className="rounded-[26px] border border-black/6 bg-[#fbfcf8] p-5">
                        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/38">
                          Факт недели
                        </div>
                        <div className="mt-3 text-[clamp(2rem,3vw,3rem)] font-black leading-none text-brand-dark">
                          {activeBranchReport.weeklyFact.toLocaleString('ru-RU')}
                        </div>
                      </div>

                      <div className="rounded-[26px] border border-brand-green/18 bg-brand-green/10 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Выполнение недели
                            </div>
                            <div className="mt-3 text-[clamp(2rem,3vw,3rem)] font-black leading-none text-brand-green">
                              {formatPercent(activeBranchReport.weeklyCompletion)}
                            </div>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-brand-green shadow-sm">
                            <BarChart3 size={22} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[28px] border border-black/6">
                      <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full border-collapse">
                          <thead className="bg-[#f7f8f4]">
                            <tr>
                              <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                                Филиал
                              </th>
                              {activeBranchReport.days.map((day) => (
                                <th
                                  key={day}
                                  className="px-3 py-4 text-left text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42"
                                >
                                  <div>{day}</div>
                                  <div className="mt-2 flex gap-2 text-[9px] text-brand-dark/32">
                                    <span>план</span>
                                    <span>факт</span>
                                  </div>
                                </th>
                              ))}
                              <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                                Итого
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-black/6 bg-white">
                            {activeBranchReport.branches.map((branchRow) => {
                              const branchPlan = branchRow.days.reduce((sum, day) => sum + day.plan, 0);
                              const branchFact = branchRow.days.reduce((sum, day) => sum + day.fact, 0);
                              const branchCompletion = branchPlan > 0 ? (branchFact / branchPlan) * 100 : 0;

                              return (
                                <tr key={branchRow.branch} className="align-top">
                                  <td className="px-4 py-4">
                                    <div className="text-sm font-black text-brand-dark">{branchRow.branch}</div>
                                  </td>

                                  {branchRow.days.map((day) => {
                                    const dayCompletion = day.plan > 0 ? Math.min((day.fact / day.plan) * 100, 100) : 0;

                                    return (
                                      <td key={`${branchRow.branch}-${day.label}`} className="px-3 py-4">
                                        <div className="rounded-[20px] border border-black/6 bg-[#fbfcf8] p-3">
                                          <div className="flex items-baseline justify-between gap-3">
                                            <span className="text-xs font-black text-brand-dark">{day.plan}</span>
                                            <span className="text-xs font-semibold text-brand-dark/58">{day.fact}</span>
                                          </div>
                                          <div className="mt-3 h-1.5 rounded-full bg-brand-dark/6">
                                            <div
                                              className="h-1.5 rounded-full bg-brand-green transition-all"
                                              style={{ width: `${Math.max(Math.round(dayCompletion), day.plan > 0 ? 6 : 0)}%` }}
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    );
                                  })}

                                  <td className="px-4 py-4">
                                    <div className="rounded-[22px] border border-brand-green/20 bg-brand-green/10 p-4">
                                      <div className="text-xs font-black uppercase tracking-[0.18em] text-brand-dark/45">
                                        {branchFact} / {branchPlan}
                                      </div>
                                      <div className="mt-2 text-lg font-black text-brand-dark">
                                        {formatPercent(branchCompletion)}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>

                          <tfoot className="border-t border-black/6 bg-[#f7f8f4]">
                            <tr>
                              <td className="px-4 py-4 text-sm font-black text-brand-dark">Итого по дням</td>
                              {activeBranchReport.totals.map((day) => (
                                <td key={`total-${day.label}`} className="px-3 py-4">
                                  <div className="rounded-[20px] border border-black/6 bg-white p-3">
                                    <div className="flex items-baseline justify-between gap-3">
                                      <span className="text-xs font-black text-brand-dark">{day.plan}</span>
                                      <span className="text-xs font-semibold text-brand-dark/58">{day.fact}</span>
                                    </div>
                                  </div>
                                </td>
                              ))}
                              <td className="px-4 py-4">
                                <div className="text-lg font-black text-brand-dark">
                                  {activeBranchReport.weeklyFact} / {activeBranchReport.weeklyPlan}
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td className="px-4 py-4 text-sm font-black text-brand-dark">Выполнение дня</td>
                              {activeBranchReport.dailyCompletion.map((value, index) => (
                                <td key={`completion-${activeBranchReport.days[index]}`} className="px-3 py-4">
                                  <div className="rounded-[20px] border border-black/6 bg-white p-3">
                                    <div className="text-sm font-black text-brand-dark">{formatPercent(value)}</div>
                                  </div>
                                </td>
                              ))}
                              <td className="px-4 py-4">
                                <div className="text-lg font-black text-brand-green">
                                  {formatPercent(activeBranchReport.weeklyCompletion)}
                                </div>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

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
                                {row.folderLinkUrl ? (
                                  <a
                                    href={row.folderLinkUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(event) => event.stopPropagation()}
                                    className="inline-flex w-full justify-center whitespace-nowrap rounded-full border border-black/8 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark transition hover:border-brand-green/30 hover:text-brand-green"
                                  >
                                    {row.folderLinkText || '\u041f\u0430\u043f\u043a\u0430 \u0441 \u0444\u043e\u0442\u043e'}
                                  </a>
                                ) : (
                                  <span className="inline-flex w-full justify-center whitespace-nowrap rounded-full border border-black/8 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark/45">
                                    {row.folderLinkText || '\u041f\u0430\u043f\u043a\u0430 \u0441 \u0444\u043e\u0442\u043e'}
                                  </span>
                                )}
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
                            {item.folderLinkUrl ? (
                              <a
                                href={item.folderLinkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-green underline decoration-brand-green/35 underline-offset-4 transition hover:text-brand-dark"
                              >
                                {item.folderLinkText || '\u041f\u0430\u043f\u043a\u0430 \u0441 \u0444\u043e\u0442\u043e'}
                              </a>
                            ) : (
                              item.folderLinkText || '\u041f\u0430\u043f\u043a\u0430 \u0441 \u0444\u043e\u0442\u043e'
                            )}
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
