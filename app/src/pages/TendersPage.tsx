import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { createOfficeViewer } from 'office-viewer';
import '../../node_modules/office-viewer/dist/office.css';
import SeoHead from '../components/SeoHead';
import {
  getTenderApplication,
  getTenderApplications,
  updateTenderStage,
  type TenderApplication,
  type TenderField,
  type TenderFieldValue,
} from '../utils/bitrix';

const pageShell =
  'mx-auto w-full max-w-7xl px-2.5 pb-6 pt-20 sm:px-5 sm:pb-14 sm:pt-24 lg:px-8';

const cardClass =
  'rounded-[18px] border border-black/6 bg-white p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:rounded-[26px] sm:p-5';

const badgeClass =
  'inline-flex items-center rounded-full bg-brand-green/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-green sm:px-3 sm:py-1 sm:text-[11px]';

const formatDate = (value?: string | number | null) => {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatMoney = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return '—';

  const normalized =
    typeof value === 'number'
      ? value
      : Number(String(value).replace(/\s+/g, '').replace(',', '.'));

  if (!Number.isFinite(normalized)) return String(value);

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(normalized);
};

const getFileExtension = (value: string) => {
  const cleanValue = value.split('?')[0].toLowerCase();
  const lastDotIndex = cleanValue.lastIndexOf('.');

  if (lastDotIndex === -1) return '';
  return cleanValue.slice(lastDotIndex + 1);
};

const getFileTypeBadge = (name?: string, url?: string, mime?: string) => {
  if (mime) {
    if (mime.startsWith('image/')) return 'IMG';
    if (mime === 'application/pdf') return 'PDF';
    if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/rtf'].includes(mime)) return 'DOC';
    if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(mime)) return 'XLS';
    if (['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(mime)) return 'PPT';
    if (['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(mime)) return 'ZIP';
    if (mime === 'text/plain') return 'TXT';
  }

  const extension = (getFileExtension(name || '') || getFileExtension(url || '')).toLowerCase();
  if (['xlsx', 'xls', 'csv'].includes(extension)) return 'XLS';
  if (['doc', 'docx', 'rtf'].includes(extension)) return 'DOC';
  if (['pdf'].includes(extension)) return 'PDF';
  if (['ppt', 'pptx'].includes(extension)) return 'PPT';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension)) return 'IMG';
  if (['zip', 'rar', '7z'].includes(extension)) return 'ZIP';
  if (['txt'].includes(extension)) return 'TXT';
  return 'FILE';
};

const isPreviewableFile = (value: string) => {
  const extension = getFileExtension(value);
  return ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension);
};

const isImageMime = (value?: string) => Boolean(value && value.startsWith('image/'));
const isPdfMime = (value?: string) => value === 'application/pdf';
const OFFICE_MIME_TYPES = new Set([
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/tab-separated-values',
  'application/rtf',
]);
const isOfficeMime = (value?: string) => Boolean(value && OFFICE_MIME_TYPES.has(value));
const isOfficePreviewable = (name?: string, url?: string, mime?: string) => {
  if (mime && isOfficeMime(mime)) return true;
  const extension = (getFileExtension(name || '') || getFileExtension(url || '')).toLowerCase();
  return ['doc', 'docx', 'rtf', 'xls', 'xlsx', 'csv', 'tsv'].includes(extension);
};

const DATE_FIELD_KEYS = new Set([
  'createdTime',
  'updatedTime',
  'movedTime',
  'ufCrm177_1771917352221',
  'ufCrm177_1771917404692',
  'ufCrm177_1771919098033',
  'ufCrm177_1771919122183',
]);

const MONEY_FIELD_KEYS = new Set([
  'ufCrm177_1771918963486',
  'ufCrm177_1771918990965',
]);

const TENDER_STAGE_LABELS: Record<string, string> = {
  'DT1372_435:CLIENT': 'Скидка от ЛВ',
  'DT1372_435:NEW': 'Анкета',
  'DT1372_435:UC_FGJQ7M': 'Сбор документов',
  'DT1372_435:UC_91HY52': 'Ждём результатов',
  'DT1372_435:UC_KL7A0R': 'Выигрыш',
  'DT1372_435:UC_GSE342': 'Заключение договора',
  'DT1372_435:UC_3UACIL': 'Проигрыш',
  'DT1372_435:SUCCESS': 'Успех',
  'DT1372_435:FAIL': 'Провал',
};

const FRIENDLY_FIELD_LABELS: Record<string, string> = {
  ufCrm177_1771917018289: 'Портал',
  ufCrm177_1771917047522: '№ тендера',
  ufCrm177_1771917249406: 'Заказчик',
  ufCrm177_1771917306044: 'Предмет закупки',
  ufCrm177_1771917325836: 'Доп. условия',
  ufCrm177_1771917352221: 'Обсуждение до',
  ufCrm177_1771917404692: 'Подача до',
  ufCrm177_1771918963486: 'Сумма',
  ufCrm177_1771918990965: 'В месяц',
  ufCrm177_1771919098033: 'Старт услуг',
  ufCrm177_1771919122183: 'Конец услуг',
  ufCrm177_1771919156204: 'Локация',
  ufCrm177_1771919180690: 'Техспека',
  ufCrm177_1771919201639: 'Примечание',
  ufCrm177_1771919276245: 'Решение',
  ufCrm177_1773311202331: 'Объём работ',
  ufCrm177_1773311265963: 'Сложность',
  ufCrm177_1773311436361: 'Скидка %',
  ufCrm177_1773382125293: 'Документы',
  ufCrm177_1773382341973: 'Договор B2G',
  ufCrm177_1773383415952: 'Причина отказа',
  ufCrm177_1773398517150: 'Дата старта',
};

const FIELD_VARIANTS: Record<string, 'highlight' | 'prose' | 'default'> = {
  ufCrm177_1771917249406: 'highlight',
  ufCrm177_1771917306044: 'highlight',
  ufCrm177_1771917404692: 'highlight',
  ufCrm177_1771918963486: 'highlight',
  ufCrm177_1771918990965: 'highlight',
  ufCrm177_1771917325836: 'prose',
  ufCrm177_1771919180690: 'prose',
  ufCrm177_1771919201639: 'prose',
  ufCrm177_1773311202331: 'prose',
};

const DETAIL_SECTION_CONFIG = [
  {
    title: 'Основное',
    keys: [
      'ufCrm177_1771917018289',
      'ufCrm177_1771917047522',
      'ufCrm177_1771917249406',
      'ufCrm177_1771917306044',
      'ufCrm177_1771919156204',
      'ufCrm177_1771919276245',
    ],
  },
  {
    title: 'Сроки и сумма',
    keys: [
      'ufCrm177_1771917352221',
      'ufCrm177_1771917404692',
      'ufCrm177_1771919098033',
      'ufCrm177_1771919122183',
      'ufCrm177_1771918963486',
      'ufCrm177_1771918990965',
      'ufCrm177_1773311436361',
    ],
  },
  {
    title: 'Описание',
    keys: [
      'ufCrm177_1771917325836',
      'ufCrm177_1771919180690',
      'ufCrm177_1771919201639',
      'ufCrm177_1773311202331',
      'ufCrm177_1773311265963',
      'ufCrm177_1773398517150',
    ],
  },
  {
    title: 'Документы',
    keys: [
      'ufCrm177_1773382125293',
      'ufCrm177_1773382341973',
      'ufCrm177_1773383415952',
    ],
  },
  {
    title: 'Системное',
    keys: [],
  },
] as const;

const toInputDate = (value?: string | number | null) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

const matchesDateRange = (value: string | undefined, from: string, to: string) => {
  const normalized = toInputDate(value);
  if (!normalized) return false;
  if (from && normalized < from) return false;
  if (to && normalized > to) return false;
  return true;
};

const getNumericAmount = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const normalized = Number(String(value).replace(/\s+/g, '').replace(',', '.'));
  return Number.isFinite(normalized) ? normalized : 0;
};

const getAgeInDays = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
};

const normalizeScalarValue = (field: TenderField) => {
  if (field.value === null || field.value === undefined || field.value === '') return '—';
  if (typeof field.value === 'boolean') return field.value ? 'Да' : 'Нет';
  if (typeof field.value === 'number') {
    if (MONEY_FIELD_KEYS.has(field.key)) return formatMoney(field.value);
    return String(field.value);
  }
  if (typeof field.value !== 'string') return field.value;

  if (DATE_FIELD_KEYS.has(field.key)) return formatDate(field.value);
  if (field.key === 'stageId') return TENDER_STAGE_LABELS[field.value] || field.value;
  if (MONEY_FIELD_KEYS.has(field.key)) return formatMoney(field.value);

  return field.value;
};

const isMeaningfulFieldValue = (field: TenderField) => {
  const value = field.value;

  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value !== 'string') return true;

  const normalized = value.trim().toLowerCase();

  if (!normalized) return false;
  if (['0', '0.0', '0.00', '0 kzt', '0 ₸', '0 %'].includes(normalized)) return false;

  return true;
};

const renderFieldValue = (
  value: TenderFieldValue,
  options?: { onOpenFile?: (file: { name: string; url: string; entityTypeId?: string; itemId?: string; fieldName?: string; fileId?: string }) => void },
) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-brand-dark/40">—</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-brand-dark/40">—</span>;

    return (
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {value.map((item, index) => {
          if (item && typeof item === 'object' && 'url' in item) {
            const fileUrl = item.urlMachine || item.url || '';
            const fileName = item.name || `Файл ${index + 1}`;
            const fileMime = (item as { type?: string }).type;
            const fileTypeBadge = getFileTypeBadge(fileName, fileUrl, fileMime);

            return (
              <button
                type="button"
                key={`${item.id || item.url || index}`}
                onClick={() => {
                  if (options?.onOpenFile) {
                    const rawUrl = item.url || '';
                    let entityTypeId: string | undefined;
                    let itemId: string | undefined;
                    let fieldName: string | undefined;
                    let fileIdParam: string | undefined;
                    try {
                      const parsed = new URL(rawUrl);
                      entityTypeId = parsed.searchParams.get('entityTypeId') ?? undefined;
                      itemId = parsed.searchParams.get('id') ?? undefined;
                      fieldName = parsed.searchParams.get('fieldName') ?? undefined;
                      fileIdParam = parsed.searchParams.get('fileId') ?? undefined;
                    } catch {}
                    options.onOpenFile({ name: fileName, url: fileUrl, entityTypeId, itemId, fieldName, fileId: fileIdParam });
                    return;
                  }

                  if (fileUrl) {
                    window.open(fileUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-brand-green/5 px-2.5 py-1 text-xs font-medium text-brand-green transition hover:bg-brand-green hover:text-white sm:px-3 sm:text-sm"
              >
                <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-brand-green">
                  {fileTypeBadge}
                </span>
                {fileName}
              </button>
            );
          }

          if (typeof item === 'string' && /^https?:\/\//i.test(item)) {
            return (
              <a
                key={`${item}-${index}`}
                href={item}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-brand-green/20 bg-brand-green/5 px-2.5 py-1 text-xs font-medium text-brand-green underline decoration-brand-green/35 underline-offset-2 transition hover:bg-brand-green hover:text-white sm:px-3 sm:text-sm"
              >
                {item}
              </a>
            );
          }

          return (
            <span
              key={`${String(item)}-${index}`}
              className="rounded-full border border-black/8 bg-[#f6f7f3] px-2.5 py-1 text-xs text-brand-dark/75 sm:px-3 sm:text-sm"
            >
              {String(item)}
            </span>
          );
        })}
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return value ? 'Да' : 'Нет';
  }

  const stringValue = String(value);

  if (/^https?:\/\//i.test(stringValue)) {
    return (
      <a
        href={stringValue}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-brand-green underline decoration-brand-green/35 underline-offset-4"
      >
        {stringValue}
      </a>
    );
  }

  return <span className="whitespace-pre-wrap break-words">{stringValue}</span>;
};

const TenderFieldRow = ({
  field,
  onOpenFile,
}: {
  field: TenderField;
  onOpenFile?: (file: { name: string; url: string; entityTypeId?: string; itemId?: string; fieldName?: string; fileId?: string }) => void;
}) => {
  const variant = FIELD_VARIANTS[field.key] || 'default';
  const valueNode = renderFieldValue(normalizeScalarValue(field), { onOpenFile });

  if (variant === 'highlight') {
    return (
      <div className="rounded-[14px] border border-brand-green/10 bg-brand-green/5 p-2.5 sm:rounded-[18px] sm:p-3">
        <div className="text-[8px] font-medium uppercase tracking-[0.18em] text-brand-dark/35 sm:text-[11px]">
          {field.label}
        </div>
        <div className="mt-1.5 text-[13px] font-bold leading-snug text-brand-dark sm:text-[16px]">
          {valueNode}
        </div>
      </div>
    );
  }

  if (variant === 'prose') {
    return (
      <div className="rounded-[14px] border border-black/6 bg-[#f8f8f5] p-2.5 sm:rounded-[18px] sm:p-3">
        <div className="text-[8px] font-medium uppercase tracking-[0.18em] text-brand-dark/35 sm:text-[11px]">
          {field.label}
        </div>
        <div className="mt-1.5 text-[12px] leading-relaxed text-brand-dark/90 sm:text-[14px]">
          {valueNode}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-1.5 rounded-[12px] border border-black/6 bg-[#f8f8f5] p-2 sm:gap-2 sm:rounded-[20px] sm:p-4 md:grid-cols-[170px_minmax(0,1fr)] md:gap-4">
      <div className="pr-2 text-[8px] font-medium uppercase tracking-[0.18em] text-brand-dark/35 sm:text-[11px]">
        {FRIENDLY_FIELD_LABELS[field.key] || field.label}
      </div>
      <div className="text-[12px] font-medium leading-snug text-brand-dark/90 sm:text-[14px]">{valueNode}</div>
    </div>
  );
};

const DetailSection = ({
  title,
  fields,
  onOpenFile,
}: {
  title: string;
  fields: TenderField[];
  onOpenFile?: (file: { name: string; url: string; entityTypeId?: string; itemId?: string; fieldName?: string; fileId?: string }) => void;
}) => {
  if (fields.length === 0) return null;

  return (
    <div className="space-y-1.5 sm:space-y-3">
      <h3 className="px-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-dark/75 sm:text-sm">
        {title}
      </h3>
      <div className="space-y-1.5 sm:space-y-3">
        {fields.map((field) => (
          <TenderFieldRow key={field.key} field={field} onOpenFile={onOpenFile} />
        ))}
      </div>
    </div>
  );
};

const TendersList = () => {
  const [items, setItems] = useState<TenderApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deadlineFrom, setDeadlineFrom] = useState('');
  const [deadlineTo, setDeadlineTo] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTenderApplications();
        if (!cancelled) {
          setItems(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Не удалось загрузить тендеры');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => (
    items.filter((item) => {
      const deadlineOk =
        (!deadlineFrom && !deadlineTo) ||
        matchesDateRange(item.deadline, deadlineFrom, deadlineTo);
      const createdOk =
        (!createdFrom && !createdTo) ||
        matchesDateRange(item.createdTime, createdFrom, createdTo);

      return deadlineOk && createdOk;
    })
  ), [createdFrom, createdTo, deadlineFrom, deadlineTo, items]);

  const resetFilters = () => {
    setDeadlineFrom('');
    setDeadlineTo('');
    setCreatedFrom('');
    setCreatedTo('');
  };

  const summary = useMemo(() => {
    const totalCount = filteredItems.length;
    const totalAmount = filteredItems.reduce((sum, item) => sum + getNumericAmount(item.amount), 0);

    const stalestItem = [...filteredItems]
      .map((item) => {
        const referenceDate = item.updatedTime || item.createdTime;
        return {
          item,
          days: getAgeInDays(referenceDate),
        };
      })
      .filter((entry): entry is { item: TenderApplication; days: number } => entry.days !== null)
      .sort((left, right) => right.days - left.days)[0];

    return {
      totalCount,
      totalAmount,
      stalestItem,
    };
  }, [filteredItems]);

  return (
    <div className="min-h-screen bg-[#f6f7f3] text-brand-dark">
      <SeoHead
        title="Тендеры IC Group"
        description="Список тендеров из второй стадии воронки Bitrix."
        path="/tenders"
        robots="noindex,nofollow"
      />

      <main className={pageShell}>
        <section className="mb-3 sm:mb-8">
          <h1 className="mt-2 text-[1.45rem] font-black uppercase leading-[0.92] tracking-tight text-brand-dark sm:mt-4 sm:text-4xl md:text-5xl">
            Тендеры
            <span className="block text-brand-green"> «Скидка от ЛВ»</span>
          </h1>
        </section>

        <section className="mb-3 grid gap-2 sm:mb-5 sm:grid-cols-3">
          <div className={`${cardClass} min-h-[72px]`}>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-dark/45">На утверждении</div>
            <div className="mt-1 text-2xl font-black leading-none text-brand-dark sm:text-3xl">
              {summary.totalCount}
            </div>
            <div className="mt-1 text-[10px] text-brand-dark/50">тендеров в этой стадии</div>
          </div>

          <div className={`${cardClass} min-h-[72px]`}>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-dark/45">Сумма тендеров</div>
            <div className="mt-1 text-sm font-black leading-tight text-brand-dark sm:text-xl">
              {formatMoney(summary.totalAmount)}
            </div>
            <div className="mt-1 text-[10px] text-brand-dark/50">по текущей выборке</div>
          </div>

          <div className={`${cardClass} min-h-[72px]`}>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-dark/45">Долго висит</div>
            {summary.stalestItem ? (
              <>
                <div className="mt-1 text-lg font-black leading-none text-brand-dark sm:text-2xl">
                  {summary.stalestItem.days} дн
                </div>
                <div className="mt-1 line-clamp-2 text-[10px] leading-snug text-brand-dark/60">
                  #{summary.stalestItem.item.id} · {summary.stalestItem.item.customer || summary.stalestItem.item.title}
                </div>
              </>
            ) : (
              <div className="mt-2 text-[10px] text-brand-dark/50">Нет данных</div>
            )}
          </div>
        </section>

        <section className={`${cardClass} mb-3 sm:mb-5`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] sm:text-sm">Фильтры по датам</h2>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-dark/70 transition hover:border-brand-green hover:text-brand-green"
            >
              Сброс
            </button>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-[12px] bg-[#f8f8f5] p-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-dark/45">Дедлайн</div>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={deadlineFrom}
                  onChange={(event) => setDeadlineFrom(event.target.value)}
                  className="min-w-0 rounded-[10px] border border-black/8 bg-white px-2 py-1.5 text-[11px] outline-none transition focus:border-brand-green"
                />
                <input
                  type="date"
                  value={deadlineTo}
                  onChange={(event) => setDeadlineTo(event.target.value)}
                  className="min-w-0 rounded-[10px] border border-black/8 bg-white px-2 py-1.5 text-[11px] outline-none transition focus:border-brand-green"
                />
              </div>
            </div>

            <div className="rounded-[12px] bg-[#f8f8f5] p-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-dark/45">Создано</div>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={createdFrom}
                  onChange={(event) => setCreatedFrom(event.target.value)}
                  className="min-w-0 rounded-[10px] border border-black/8 bg-white px-2 py-1.5 text-[11px] outline-none transition focus:border-brand-green"
                />
                <input
                  type="date"
                  value={createdTo}
                  onChange={(event) => setCreatedTo(event.target.value)}
                  className="min-w-0 rounded-[10px] border border-black/8 bg-white px-2 py-1.5 text-[11px] outline-none transition focus:border-brand-green"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-brand-dark/50">
            Найдено: {filteredItems.length}
          </div>
        </section>

        {isLoading && (
          <div className="grid gap-2 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={`${cardClass} animate-pulse`}>
                <div className="h-3 w-20 rounded-full bg-black/8" />
                <div className="mt-3 h-6 rounded-xl bg-black/8" />
                <div className="mt-2 h-3 rounded-xl bg-black/8" />
                <div className="mt-1.5 h-3 w-2/3 rounded-xl bg-black/8" />
                <div className="mt-3 h-8 rounded-2xl bg-black/8" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className={`${cardClass} border-red-200 bg-red-50 text-red-700`}>
            Не смог загрузить тендеры: {error}
          </div>
        )}

        {!isLoading && !error && (
          filteredItems.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2">
              {filteredItems.map((item) => (
                <article key={item.id} className={`${cardClass} flex min-h-[232px] h-full flex-col sm:min-h-[250px]`}>
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="rounded-full bg-[#f6f7f3] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-dark/55 sm:px-3 sm:py-1 sm:text-xs">
                      #{item.id}
                    </span>
                    <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[9px] font-semibold text-brand-green sm:px-3 sm:py-1 sm:text-xs">
                      {formatDate(item.deadline)}
                    </span>
                  </div>

                  <h2 className="mt-2 line-clamp-3 pb-0.5 text-[13px] font-bold leading-[1.22] text-brand-dark sm:mt-4 sm:text-xl sm:leading-[1.18]">
                    {item.customer || item.title}
                  </h2>

                  <div className="mt-2 flex-1 space-y-1 text-[11px] leading-[1.2] text-brand-dark/65 sm:mt-4 sm:space-y-2 sm:text-sm">
                    <p className="line-clamp-2"><span className="font-semibold text-brand-dark">Предмет:</span> {item.purchaseName || '—'}</p>
                    <p className="line-clamp-1"><span className="font-semibold text-brand-dark">№:</span> {item.announcementNumber || '—'}</p>
                    <p className="line-clamp-1"><span className="font-semibold text-brand-dark">Место:</span> {item.location || '—'}</p>
                    <p className="line-clamp-1"><span className="font-semibold text-brand-dark">Сумма:</span> {formatMoney(item.amount)}</p>
                  </div>

                  <div className="mt-3 flex gap-1.5 sm:mt-6 sm:gap-3">
                    <Link
                      to={`/tenders/${item.id}`}
                      className="flex-1 rounded-[12px] bg-brand-green px-2.5 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:translate-y-[-1px] hover:bg-brand-dark sm:rounded-[18px] sm:px-4 sm:py-3 sm:text-sm sm:tracking-[0.16em]"
                    >
                      Откр.
                    </Link>
                    <a
                      href={item.bitrixUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[12px] border border-black/10 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-dark transition hover:border-brand-green hover:text-brand-green sm:rounded-[18px] sm:px-4 sm:py-3 sm:text-sm sm:tracking-[0.16em]"
                    >
                      BX
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={`${cardClass} text-center text-[11px] text-brand-dark/55 sm:text-sm`}>
              По выбранным датам ничего не найдено.
            </div>
          )
        )}
      </main>
    </div>
  );
};

const TenderDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<TenderApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string; entityTypeId?: string; itemId?: string; fieldName?: string; fileId?: string } | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewArrayBuffer, setPreviewArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [previewMimeType, setPreviewMimeType] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [actionDiscount, setActionDiscount] = useState('');
  const [actionDeclineReason, setActionDeclineReason] = useState<number | ''>('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDone, setActionDone] = useState<'participate' | 'decline' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [officePreviewReady, setOfficePreviewReady] = useState(false);
  const officePreviewRootRef = useRef<HTMLDivElement | null>(null);
  const officeViewerRef = useRef<Awaited<ReturnType<typeof createOfficeViewer>> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setError('ID тендера не указан');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getTenderApplication(id);
        if (!cancelled) {
          setItem(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Не удалось загрузить тендер');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const title = useMemo(
    () => (item ? item.purchaseName || item.title : `Тендер #${id}`),
    [id, item],
  );

  const groupedFields = useMemo(() => {
    if (!item) return [];

    const fieldsByKey = new Map(item.fields.map((field) => [field.key, field]));

    return DETAIL_SECTION_CONFIG.map((section) => ({
      title: section.title,
      fields: section.keys
        .map((key) => fieldsByKey.get(key))
        .filter((field): field is TenderField => Boolean(field) && isMeaningfulFieldValue(field)),
    })).filter((section) => section.fields.length > 0);
  }, [item]);

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      if (!previewFile) {
        officeViewerRef.current?.destroy();
        officeViewerRef.current = null;
        setPreviewBlobUrl((currentUrl) => {
          if (currentUrl) URL.revokeObjectURL(currentUrl);
          return null;
        });
        setPreviewArrayBuffer(null);
        setPreviewMimeType(null);
        setPreviewLoading(false);
        setPreviewError(null);
        setOfficePreviewReady(false);
        return;
      }

      setPreviewLoading(true);
      setPreviewError(null);
      setOfficePreviewReady(false);

      try {
        const response = (import.meta.env.DEV || !previewFile.fileId)
          ? await fetch(previewFile.url)
          : await fetch('/api/file-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                entityTypeId: previewFile.entityTypeId,
                itemId: previewFile.itemId,
                fieldName: previewFile.fieldName,
                fileId: previewFile.fileId,
              }),
            });

        if (!response.ok) {
          throw new Error(`Файл не открылся (${response.status})`);
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const mimeType = blob.type || null;
        const objectUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setPreviewBlobUrl((currentUrl) => {
          if (currentUrl) URL.revokeObjectURL(currentUrl);
          return objectUrl;
        });
        setPreviewArrayBuffer(arrayBuffer);
        setPreviewMimeType(mimeType);
      } catch (previewFetchError) {
        if (!cancelled) {
          setPreviewError(previewFetchError instanceof Error ? previewFetchError.message : 'Не удалось открыть файл');
          setPreviewBlobUrl((currentUrl) => {
            if (currentUrl) URL.revokeObjectURL(currentUrl);
            return null;
          });
          setPreviewArrayBuffer(null);
          setPreviewMimeType(null);
          setOfficePreviewReady(false);
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [previewFile]);

  useEffect(() => () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
  }, [previewBlobUrl]);

  useEffect(() => {
    let cancelled = false;

    const renderOfficePreview = async () => {
      officeViewerRef.current?.destroy();
      officeViewerRef.current = null;
      setOfficePreviewReady(false);

      if (
        !previewFile ||
        !previewArrayBuffer ||
        !officePreviewRootRef.current ||
        !isOfficePreviewable(previewFile.name, previewFile.url, previewMimeType ?? undefined)
      ) {
        if (officePreviewRootRef.current) {
          officePreviewRootRef.current.innerHTML = '';
        }
        return;
      }

      try {
        const root = officePreviewRootRef.current;
        root.innerHTML = '';

        const viewer = await createOfficeViewer(previewArrayBuffer.slice(0), {}, previewFile.name);

        if (cancelled) {
          viewer.destroy();
          return;
        }

        officeViewerRef.current = viewer;
        await viewer.render(root, {});

        if (!cancelled) {
          setOfficePreviewReady(true);
        }
      } catch (officeError) {
        if (!cancelled) {
          setPreviewError(
            officeError instanceof Error ? officeError.message : 'Не удалось показать office-файл',
          );
          setOfficePreviewReady(false);
        }
      }
    };

    renderOfficePreview();

    return () => {
      cancelled = true;
      officeViewerRef.current?.destroy();
      officeViewerRef.current = null;
      if (officePreviewRootRef.current) {
        officePreviewRootRef.current.innerHTML = '';
      }
    };
  }, [previewArrayBuffer, previewFile]);

  return (
    <div className="min-h-screen bg-[#f6f7f3] text-brand-dark">
      <SeoHead
        title={`${title} | Тендер IC Group`}
        description="Карточка тендера из Bitrix."
        path={`/tenders/${id || ''}`}
        robots="noindex,nofollow"
      />

      <main className={pageShell}>
        <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-2">
          <Link
            to="/tenders"
            className="rounded-full border border-black/10 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-brand-dark transition hover:border-brand-green hover:text-brand-green sm:px-4 sm:py-2 sm:text-sm"
          >
            ← Все
          </Link>
          {item && (
            <a
              href={item.bitrixUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-green/20 bg-brand-green/10 px-2.5 py-1.5 text-[10px] font-semibold text-brand-green transition hover:bg-brand-green hover:text-white sm:px-4 sm:py-2 sm:text-sm"
            >
              Bitrix
            </a>
          )}
        </div>

        {isLoading && (
          <div className={`${cardClass} animate-pulse`}>
            <div className="h-3 w-20 rounded-full bg-black/8" />
            <div className="mt-3 h-7 rounded-2xl bg-black/8" />
            <div className="mt-4 space-y-2 sm:mt-8 sm:space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-14 rounded-[14px] bg-black/8 sm:h-20 sm:rounded-[22px]" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className={`${cardClass} border-red-200 bg-red-50 text-red-700`}>
            Не смог загрузить карточку: {error}
          </div>
        )}

        {!isLoading && item && (
          <section className="space-y-2 sm:space-y-4">
            <div className={cardClass}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className={badgeClass}>Тендер #{item.id}</span>
                  <h1 className="mt-2 line-clamp-3 text-[14px] font-black uppercase leading-[1.02] tracking-tight sm:mt-3 sm:text-2xl md:text-3xl">
                    {item.customer || title}
                  </h1>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-4 sm:gap-3 xl:grid-cols-4">
                <div className="rounded-[12px] bg-[#f8f8f5] p-2 text-center sm:rounded-[18px] sm:p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-dark/45 sm:text-xs sm:tracking-[0.18em]">Заказчик</div>
                  <div className="mt-1 line-clamp-2 text-[10px] leading-snug sm:mt-1.5 sm:text-sm">{item.customer || '—'}</div>
                </div>
                <div className="rounded-[12px] bg-[#f8f8f5] p-2 text-center sm:rounded-[18px] sm:p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-dark/45 sm:text-xs sm:tracking-[0.18em]">Дедлайн</div>
                  <div className="mt-1 text-[10px] leading-snug sm:mt-1.5 sm:text-sm">{formatDate(item.deadline)}</div>
                </div>
                <div className="rounded-[12px] bg-[#f8f8f5] p-2 text-center sm:rounded-[18px] sm:p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-dark/45 sm:text-xs sm:tracking-[0.18em]">Сумма</div>
                  <div className="mt-1 text-[10px] leading-snug sm:mt-1.5 sm:text-sm">{formatMoney(item.amount)}</div>
                </div>
                <div className="rounded-[12px] bg-[#f8f8f5] p-2 text-center sm:rounded-[18px] sm:p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-dark/45 sm:text-xs sm:tracking-[0.18em]">Создано</div>
                  <div className="mt-1 text-[10px] leading-snug sm:mt-1.5 sm:text-sm">{formatDate(item.createdTime)}</div>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-sm font-bold uppercase tracking-tight sm:text-xl">Все данные</h2>
              <div className="mt-3 space-y-3 sm:mt-5 sm:space-y-5">
                {groupedFields.map((section) => (
                  <DetailSection
                    key={section.title}
                    title={section.title}
                    fields={section.fields}
                    onOpenFile={setPreviewFile}
                  />
                ))}
              </div>
            </div>

            {!actionDone && (
              <div className={cardClass}>
                <h2 className="text-sm font-bold uppercase tracking-tight sm:text-xl">Решение</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
                  {/* Участвовать */}
                  <div className="flex flex-col gap-2 rounded-[16px] border border-brand-green/15 bg-brand-green/5 p-3 sm:rounded-[20px] sm:p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green sm:text-xs">Участвовать</div>
                    <div>
                      <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-dark/35 sm:text-[10px]">Скидка %</div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={actionDiscount}
                        onChange={(e) => setActionDiscount(e.target.value)}
                        placeholder="0"
                        className="mt-1 w-full rounded-[10px] border border-black/8 bg-white px-2.5 py-2 text-sm font-bold outline-none transition focus:border-brand-green"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={async () => {
                        setActionLoading(true);
                        setActionError(null);
                        try {
                          await updateTenderStage(item.id, 'DT1372_435:UC_FGJQ7M', {
                            ufCrm177_1771919276245: 141839,
                            ...(actionDiscount ? { ufCrm177_1773311436361: Number(actionDiscount) } : {}),
                          });
                          setActionDone('participate');
                        } catch (err) {
                          setActionError(err instanceof Error ? err.message : 'Ошибка');
                        } finally {
                          setActionLoading(false);
                        }
                      }}
                      className="mt-auto rounded-[12px] bg-brand-green py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-dark disabled:opacity-40 sm:text-xs"
                    >
                      {actionLoading ? '...' : 'Подтвердить'}
                    </button>
                  </div>

                  {/* Не участвовать */}
                  <div className="flex flex-col gap-2 rounded-[16px] border border-red-100 bg-red-50/60 p-3 sm:rounded-[20px] sm:p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-500 sm:text-xs">Не участвовать</div>
                    <div>
                      <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-dark/35 sm:text-[10px]">Причина отказа</div>
                      <select
                        value={actionDeclineReason}
                        onChange={(e) => setActionDeclineReason(e.target.value ? Number(e.target.value) : '')}
                        className="mt-1 w-full rounded-[10px] border border-black/8 bg-white px-2.5 py-2 text-xs outline-none transition focus:border-red-300"
                      >
                        <option value="">— выберите —</option>
                        <option value="151147">По причине документов</option>
                        <option value="151149">По цене</option>
                        <option value="151151">Не заключение договора</option>
                        <option value="151153">Не согласовано ЛВ</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={async () => {
                        setActionLoading(true);
                        setActionError(null);
                        try {
                          await updateTenderStage(item.id, 'DT1372_435:FAIL', {
                            ufCrm177_1771919276245: 141841,
                            ...(actionDeclineReason !== '' ? { ufCrm177_1773383415952: actionDeclineReason } : {}),
                          });
                          setActionDone('decline');
                        } catch (err) {
                          setActionError(err instanceof Error ? err.message : 'Ошибка');
                        } finally {
                          setActionLoading(false);
                        }
                      }}
                      className="mt-auto rounded-[12px] border border-red-200 bg-white py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-red-500 transition hover:bg-red-100 disabled:opacity-40 sm:text-xs"
                    >
                      {actionLoading ? '...' : 'Подтвердить'}
                    </button>
                  </div>
                </div>

                {actionError && (
                  <p className="mt-2 text-center text-xs text-red-500">{actionError}</p>
                )}
              </div>
            )}

            {actionDone && (
              <div className={`${cardClass} text-center`}>
                {actionDone === 'participate' ? (
                  <>
                    <div className="text-2xl">✅</div>
                    <div className="mt-2 text-sm font-bold text-brand-dark">Переведено на «Сбор документов»</div>
                    {actionDiscount && (
                      <div className="mt-1 text-xs text-brand-dark/55">Скидка: {actionDiscount}%</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-2xl">❌</div>
                    <div className="mt-2 text-sm font-bold text-brand-dark">Переведено на «Проигрыш»</div>
                  </>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {previewFile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 sm:p-6"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-black/8 px-3 py-2.5 sm:px-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-brand-dark">{previewFile.name}</div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-brand-dark/40">Предпросмотр файла</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewBlobUrl || previewFile.url}
                  download={previewFile.name}
                  className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-dark transition hover:border-brand-green hover:text-brand-green"
                >
                  Скачать
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="rounded-full bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                >
                  Закрыть
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 bg-white">
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="flex flex-col items-center gap-3 text-brand-dark/55">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green/20 border-t-brand-green" />
                    <div className="text-xs font-medium uppercase tracking-[0.14em]">Загружаю файл</div>
                  </div>
                </div>
              )}

              {!previewLoading && previewError && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                  <div className="text-sm font-semibold text-brand-dark">Не удалось показать файл</div>
                  <div className="max-w-md text-xs leading-relaxed text-brand-dark/55">{previewError}</div>
                </div>
              )}

              {!previewLoading && !previewError && previewBlobUrl && isImageMime(previewMimeType) && (
                <div className="flex flex-1 items-center justify-center overflow-auto bg-[#f3f4ef] p-3">
                  <img
                    src={previewBlobUrl}
                    alt={previewFile.name}
                    className="max-h-full w-auto rounded-[14px] object-contain shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
                  />
                </div>
              )}

              {!previewLoading && !previewError && previewBlobUrl && isPdfMime(previewMimeType) && (
                <iframe
                  src={previewBlobUrl}
                  title={previewFile.name}
                  className="h-full min-h-0 flex-1 bg-white"
                />
              )}

              {!previewLoading &&
                !previewError &&
                previewFile &&
                isOfficePreviewable(previewFile.name, previewFile.url, previewMimeType ?? undefined) && (
                  <div className="min-h-0 flex-1 overflow-auto bg-[#f3f4ef] p-3">
                    <div
                      ref={officePreviewRootRef}
                      className={`min-h-full rounded-[14px] bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${officePreviewReady ? '' : 'hidden'}`}
                    />
                    {!officePreviewReady && (
                      <div className="flex h-full min-h-[240px] items-center justify-center">
                        <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand-dark/45">
                          Рендерю документ
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {!previewLoading &&
                !previewError &&
                (!previewBlobUrl ||
                  (!isImageMime(previewMimeType) &&
                    !isPdfMime(previewMimeType) &&
                    !isOfficePreviewable(previewFile?.name, previewFile?.url, previewMimeType ?? undefined))) && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                  <div className="text-sm font-semibold text-brand-dark">Превью недоступно</div>
                  <div className="max-w-md text-xs leading-relaxed text-brand-dark/55">
                    Для этого типа файла браузер не может показать встроенный просмотр. Открой его в новой вкладке.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SHA-256 of your PIN — change by running: crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_PIN')).then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
const PIN_HASH = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'; // PIN: 123
const UNLOCK_TOKEN = 'icline-unlock-xK9m'; // секретный токен для разблокировки

const LS_AUTH = 'tenders_auth';
const LS_ATTEMPTS = 'tenders_attempts';
const LS_LOCKED = 'tenders_locked';
const MAX_ATTEMPTS = 3;

const sha256hex = async (text: string) => {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
};

const PinGate = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authed, setAuthed] = useState(() => localStorage.getItem(LS_AUTH) === '1');
  const [locked, setLocked] = useState(() => localStorage.getItem(LS_LOCKED) === '1');
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(() => Number(localStorage.getItem(LS_ATTEMPTS) || 0));
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const token = searchParams.get('unlock');
    if (token === UNLOCK_TOKEN) {
      localStorage.removeItem(LS_LOCKED);
      localStorage.removeItem(LS_ATTEMPTS);
      localStorage.removeItem(LS_AUTH);
      setLocked(false);
      setAttempts(0);
      setAuthed(false);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async () => {
    if (checking || pin.length < 1) return;
    setChecking(true);

    const hash = await sha256hex(pin);
    if (hash === PIN_HASH) {
      localStorage.setItem(LS_AUTH, '1');
      localStorage.removeItem(LS_ATTEMPTS);
      setAuthed(true);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      localStorage.setItem(LS_ATTEMPTS, String(next));
      setPin('');
      setShake(true);
      setTimeout(() => setShake(false), 600);

      if (next >= MAX_ATTEMPTS) {
        localStorage.setItem(LS_LOCKED, '1');
        setLocked(true);
      }
    }

    setChecking(false);
  };

  if (authed) return <>{children}</>;

  if (locked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f6f7f3] px-6 text-center">
        <div className="text-4xl">🔒</div>
        <h1 className="text-xl font-black uppercase tracking-tight text-brand-dark">Доступ заблокирован</h1>
        <p className="max-w-xs text-sm leading-relaxed text-brand-dark/55">
          Превышено количество попыток. Обратитесь к администратору.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f6f7f3] px-6">
      <div className="w-full max-w-xs">
        <div className="mb-6 text-center">
          <div className="text-3xl">🔐</div>
          <h1 className="mt-2 text-lg font-black uppercase tracking-tight text-brand-dark">Тендеры IC Group</h1>
          <p className="mt-1 text-xs text-brand-dark/45">Введите PIN-код для доступа</p>
        </div>

        <div
          className={`rounded-[22px] border border-black/6 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.07)] ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}
          style={shake ? { animation: 'shake 0.5s ease' } : {}}
        >
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••"
            autoFocus
            className="w-full rounded-[14px] border border-black/8 bg-[#f8f8f5] px-4 py-3 text-center text-2xl font-black tracking-[0.3em] text-brand-dark outline-none transition focus:border-brand-green"
          />

          {attempts > 0 && (
            <p className="mt-2 text-center text-[11px] text-red-500">
              Неверный PIN. Осталось попыток: {MAX_ATTEMPTS - attempts}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={checking || pin.length < 1}
            className="mt-3 w-full rounded-[14px] bg-brand-green py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-dark disabled:opacity-40"
          >
            Войти
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};

const TendersPage = () => {
  const { id } = useParams();
  return (
    <PinGate>
      {id ? <TenderDetail /> : <TendersList />}
    </PinGate>
  );
};

export default TendersPage;
