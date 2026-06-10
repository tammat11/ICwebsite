import { type ReactNode, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  History,
  KeyRound,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Target,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

type DashboardSummary = {
  plannedCount: number;
  completedCount: number;
  overdueCount: number;
  completionRate: number;
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

type PlanMutationResponse = {
  ok: boolean;
  version: string;
  error?: string;
  action?: string;
};

const DASHBOARD_WEB_APP_URL =
  (import.meta.env.VITE_PST_DASHBOARD_WEB_APP_URL as string | undefined) || '';
const ACCESS_CODE_STORAGE_KEY = 'pst-dashboard-access-code';
const PAGE_SIZE = 25;

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
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [selectedBranch, setSelectedBranch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [historyData, setHistoryData] = useState<ObjectHistoryResponse | null>(null);
  const [historyTarget, setHistoryTarget] = useState<DashboardRow | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [mutationTargetId, setMutationTargetId] = useState('');
  const [authError, setAuthError] = useState('');
  const [overviewError, setOverviewError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const deferredQuery = useDeferredValue(searchTerm.trim());

  useEffect(() => {
    const storedCode = window.sessionStorage.getItem(ACCESS_CODE_STORAGE_KEY) || '';
    if (storedCode) {
      setAccessCode(storedCode);
      setAccessCodeInput(storedCode);
    }
  }, []);

  const canLoadDashboard = Boolean(accessCode && DASHBOARD_WEB_APP_URL);

  const loadOverview = async (nextPage = page, nextBranch = selectedBranch, nextDate = selectedDate) => {
    if (!DASHBOARD_WEB_APP_URL || !accessCode) return;

    setIsLoadingOverview(true);
    setOverviewError('');

    try {
      const payload = await jsonpRequest<OverviewResponse>(DASHBOARD_WEB_APP_URL, {
        token: accessCode,
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

  const handleAccessSubmit = async () => {
    const normalizedCode = accessCodeInput.trim();
    if (!normalizedCode) {
      setAuthError('Введите код доступа.');
      return;
    }

    if (!DASHBOARD_WEB_APP_URL) {
      setAuthError('Не настроен адрес dashboard web app.');
      return;
    }

    setAuthError('');
    setAccessCode(normalizedCode);
    window.sessionStorage.setItem(ACCESS_CODE_STORAGE_KEY, normalizedCode);
    setPage(1);
  };

  const handleLogout = () => {
    setAccessCode('');
    setAccessCodeInput('');
    setOverview(null);
    setHistoryData(null);
    setHistoryTarget(null);
    window.sessionStorage.removeItem(ACCESS_CODE_STORAGE_KEY);
  };

  const handlePlanMutation = async (row: DashboardRow, shouldPlan: boolean) => {
    if (!DASHBOARD_WEB_APP_URL || !accessCode) return;

    setMutationTargetId(row.postomatId);
    setOverviewError('');

    try {
      const payload = await jsonpRequest<PlanMutationResponse>(DASHBOARD_WEB_APP_URL, {
        token: accessCode,
        action: shouldPlan ? 'upsert_plan' : 'remove_plan',
        postomatId: row.postomatId,
        date: selectedDate,
      });

      if (!payload.ok) {
        throw new Error(payload.error || 'Не удалось обновить план.');
      }

      await loadOverview(page, selectedBranch, selectedDate);
    } catch (error) {
      setOverviewError(
        error instanceof Error ? error.message : 'Не удалось обновить план по точке.'
      );
    } finally {
      setMutationTargetId('');
    }
  };

  const openHistory = async (row: DashboardRow) => {
    if (!DASHBOARD_WEB_APP_URL || !accessCode) return;

    setHistoryTarget(row);
    setHistoryData(null);
    setHistoryError('');
    setIsLoadingHistory(true);

    try {
      const payload = await jsonpRequest<ObjectHistoryResponse>(DASHBOARD_WEB_APP_URL, {
        token: accessCode,
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

  const summaryCards = useMemo(
    () => [
      {
        label: 'План на дату',
        value: summary?.plannedCount ?? '—',
        icon: <ClipboardList size={22} />,
      },
      {
        label: 'Факт с фото',
        value: summary?.completedCount ?? '—',
        icon: <CheckCircle2 size={22} />,
      },
      {
        label: 'Выполнение',
        value: summary ? `${summary.completionRate}%` : '—',
        icon: <Target size={22} />,
        accent: 'text-brand-green',
      },
      {
        label: 'Просрочено',
        value: summary?.overdueCount ?? '—',
        icon: <AlertCircle size={22} />,
        accent: summary && summary.overdueCount > 0 ? 'text-[#d35d59]' : 'text-brand-dark',
      },
    ],
    [summary]
  );

  return (
    <div className="min-h-screen bg-brand-light pb-16 pt-24 md:pt-32">
      <SeoHead
        title="PST Dashboard | IC Group"
        description="Отдельное пространство для руководства по Kaspi Postomat: план, факт и история уборок."
        path="/pst-dashboard"
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex">
            <img
              src="/logo_IC_group.png"
              alt="IC Group"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>

          {accessCode && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark transition hover:border-brand-green/30 hover:text-brand-green"
            >
              <KeyRound size={16} />
              Сменить код
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <div className="rounded-[34px] border border-black/6 bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:px-8">
              <div className="section-tag">PST dashboard</div>
              <h1 className="max-w-4xl font-black uppercase leading-[0.88] tracking-tighter text-brand-dark text-[clamp(2.2rem,5vw,4.8rem)]">
                Руководство
                <br />
                <span className="text-brand-green">Kaspi Postomat</span>
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-brand-dark/62 sm:text-base">
                Здесь мы тянем план и факт из Google Sheets, показываем текущую загрузку по
                точкам и даем отдельный управленческий контур без вмешательства в рабочий маршрут
                <span className="font-bold text-brand-dark"> /pst</span>.
              </p>

              {!DASHBOARD_WEB_APP_URL && (
                <div className="mt-6 rounded-[24px] border border-[#f2d8b1] bg-[#fff9ee] px-5 py-4 text-sm font-semibold leading-6 text-[#8a6420]">
                  Для запуска нужно прописать адрес dashboard web app в переменную
                  <span className="font-black text-brand-dark"> VITE_PST_DASHBOARD_WEB_APP_URL</span>.
                </div>
              )}

              {!accessCode && (
                <div className="mt-8 max-w-xl rounded-[28px] border border-black/6 bg-[#f7f8f4] p-5 shadow-premium">
                  <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-brand-dark">
                    <ShieldCheck size={18} className="text-brand-green" />
                    Доступ руководства
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="password"
                      value={accessCodeInput}
                      onChange={(event) => setAccessCodeInput(event.target.value)}
                      placeholder="Введите код доступа"
                      className="min-w-0 flex-1 rounded-2xl border border-brand-dark/10 bg-white px-4 py-4 text-sm font-semibold text-brand-dark outline-none transition focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={handleAccessSubmit}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-green px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-brand-dark transition hover:scale-[1.01] hover:shadow-[0_18px_35px_rgba(143,198,64,0.24)]"
                    >
                      <ShieldCheck size={16} />
                      Открыть
                    </button>
                  </div>
                  {authError && (
                    <div className="mt-3 text-sm font-semibold text-[#d35d59]">{authError}</div>
                  )}
                </div>
              )}
            </div>

            {accessCode && (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                  <div className="grid gap-4 xl:grid-cols-[220px_220px_minmax(0,1fr)_auto]">
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
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead className="bg-[#f7f8f4]">
                          <tr className="text-left">
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Объект
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Статус
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Факт
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-brand-dark/42">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/6 bg-white">
                          {isLoadingOverview && !overview && (
                            <tr>
                              <td colSpan={4} className="px-4 py-10 text-center text-sm font-semibold text-brand-dark/55">
                                <span className="inline-flex items-center gap-2">
                                  <LoaderCircle size={18} className="animate-spin text-brand-green" />
                                  Загружаем данные из таблицы...
                                </span>
                              </td>
                            </tr>
                          )}

                          {!isLoadingOverview && rows.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-10 text-center text-sm font-semibold text-brand-dark/55">
                                По текущим фильтрам ничего не найдено.
                              </td>
                            </tr>
                          )}

                          {rows.map((row) => (
                            <tr key={`${row.postomatId}-${row.address}`} className="align-top">
                              <td className="px-4 py-4">
                                <div className="min-w-[240px]">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand-dark/55">
                                      ID {row.postomatId}
                                    </span>
                                    <span className="rounded-full bg-brand-green/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                                      {row.branch || 'Без филиала'}
                                    </span>
                                  </div>
                                  <div className="mt-3 text-sm font-black leading-6 text-brand-dark sm:text-base">
                                    {row.address}
                                  </div>
                                  <div className="mt-2 text-sm text-brand-dark/55">
                                    {row.city} • {row.category || 'Категория не указана'}
                                  </div>
                                  {row.planComment && (
                                    <div className="mt-2 text-xs font-semibold leading-5 text-brand-dark/48">
                                      Комментарий к плану: {row.planComment}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                                    statusTone[row.status] || statusTone['Без статуса']
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm font-semibold text-brand-dark/62">
                                {row.completed ? (
                                  <div>
                                    <div>{formatIsoDate(row.factDate)}</div>
                                    <div className="mt-1 text-brand-dark/45">{row.factTime || '—'}</div>
                                    <div className="mt-1 text-brand-dark/45">
                                      Фото: {row.factCount || 0}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-brand-dark/38">Нет факта</span>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex min-w-[220px] flex-col gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePlanMutation(row, !row.planned)}
                                    disabled={mutationTargetId === row.postomatId}
                                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition ${
                                      row.planned
                                        ? 'border border-red-100 bg-red-50 text-[#d35d59] hover:bg-red-100'
                                        : 'bg-brand-green text-brand-dark hover:shadow-[0_16px_32px_rgba(143,198,64,0.24)]'
                                    } ${mutationTargetId === row.postomatId ? 'cursor-wait opacity-70' : ''}`}
                                  >
                                    {mutationTargetId === row.postomatId ? (
                                      <LoaderCircle size={15} className="animate-spin" />
                                    ) : row.planned ? (
                                      <XCircle size={15} />
                                    ) : (
                                      <CalendarDays size={15} />
                                    )}
                                    {row.planned ? 'Убрать из плана' : 'Добавить в план'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openHistory(row)}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/8 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark transition hover:border-brand-green/30 hover:text-brand-green"
                                  >
                                    <History size={15} />
                                    История точки
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-brand-dark/55">
                        Показано {rows.length} из {pagination.total}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPage((current) => Math.max(current - 1, 1))}
                          disabled={pagination.page <= 1}
                          className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark transition disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft size={14} />
                          Назад
                        </button>
                        <div className="rounded-full bg-[#f7f8f4] px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/55">
                          {pagination.page} / {pagination.totalPages}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPage((current) => Math.min(current + 1, pagination.totalPages))
                          }
                          disabled={pagination.page >= pagination.totalPages}
                          className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark transition disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Далее
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark/38">
                MVP логика
              </div>
              <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-brand-dark/62">
                <p>
                  План и факт тянутся из Google Sheets. Сайт здесь выступает как отдельный
                  интерфейс поверх таблицы, а не как новая база данных.
                </p>
                <p>
                  Для нагрузки мы держим пагинацию, фильтры по дате и филиалу, а историю точки
                  подгружаем отдельно по клику.
                </p>
                <p>
                  На этом MVP руководитель уже может смотреть факт и сразу формировать план на
                  выбранную дату.
                </p>
              </div>
            </section>

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
