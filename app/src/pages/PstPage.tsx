import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  ChevronRight,
  CheckCircle2,
  LocateFixed,
  MapPin,
  Search,
  Store,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

type PstLocation = {
  id: string;
  city: string;
  branch: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  routeText: string;
  surfaceType: string;
  installPlace: string;
  cellsCount: string | number;
  comment: string;
  hint: string;
};

type GeoState = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported';

type GeoCoords = {
  lat: number;
  lng: number;
  accuracy?: number;
};

type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string;
  addedAt: string;
};

type PhotoSection = 'before' | 'after';

type StoredDraftPhoto = {
  id: string;
  name: string;
  type: string;
  size: number;
  addedAt: string;
  lastModified: number;
  dataUrl: string;
};

type StoredDraft = {
  id: string;
  selectedLocationId: string;
  photos?: StoredDraftPhoto[];
  beforePhotos: StoredDraftPhoto[];
  afterPhotos: StoredDraftPhoto[];
  updatedAt: string;
};

type CompressedPhoto = {
  fileName: string;
  mimeType: string;
  dataUrl: string;
  sizeBytes: number;
  originalSizeBytes: number;
  width: number;
  height: number;
  photoIndex?: number;
};

type PhotoStamp = {
  submittedAt: string;
  address: string;
  city: string;
};

type CompressedPhotosBySection = Record<PhotoSection, CompressedPhoto[]>;

type IndexedLocation = PstLocation & {
  searchIndex: string;
};

type LocationWithDistance = IndexedLocation & {
  distanceKm: number;
};

declare global {
  interface Window {
    L?: any;
  }
}

const SEARCH_RADIUS_KM = 0.3;
const PST_PAYLOAD_VERSION = 2;
const DRIVE_PHOTO_SIZE_LIMIT_BYTES = 180 * 1024;
const PST_UPLOAD_CHUNK_TARGET_BYTES = 900 * 1024;
const PST_DRAFT_DB_NAME = 'pst-cleaning-draft-db';
const PST_DRAFT_STORE_NAME = 'drafts';
const PST_DRAFT_KEY = 'pst-cleaning-form';

const formatDistance = (distanceKm: number) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} м`;
  }

  return `${distanceKm.toFixed(2)} км`;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const buildSubmissionDebugId = (locationId: string) => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `pst-${Date.now()}-${locationId}-${randomPart}`;
};

const estimatePayloadSizeBytes = (payload: unknown) => new Blob([JSON.stringify(payload)]).size;

const chunkCompressedPhotos = (photos: CompressedPhoto[]) => {
  const chunks: CompressedPhoto[][] = [];
  let currentChunk: CompressedPhoto[] = [];

  photos.forEach((photo) => {
    const nextChunk = [...currentChunk, photo];
    const nextChunkSize = estimatePayloadSizeBytes({ photos: nextChunk });

    if (currentChunk.length > 0 && nextChunkSize > PST_UPLOAD_CHUNK_TARGET_BYTES) {
      chunks.push(currentChunk);
      currentChunk = [photo];
      return;
    }

    currentChunk = nextChunk;
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
};

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"'[\]\\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const capitalizeFirstLetter = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return trimmedValue;

  return trimmedValue.charAt(0).toLocaleUpperCase('ru-RU') + trimmedValue.slice(1);
};

const readFileAsDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const dataUrlToFile = async (dataUrl: string, fileName: string, mimeType: string, lastModified: number) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  return new File([blob], fileName, {
    type: mimeType || blob.type,
    lastModified,
  });
};

const openDraftDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(PST_DRAFT_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PST_DRAFT_STORE_NAME)) {
        database.createObjectStore(PST_DRAFT_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open draft database'));
  });

const loadDraft = async (): Promise<StoredDraft | null> => {
  const database = await openDraftDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PST_DRAFT_STORE_NAME, 'readonly');
    const store = transaction.objectStore(PST_DRAFT_STORE_NAME);
    const request = store.get(PST_DRAFT_KEY);

    request.onsuccess = () => {
      database.close();
      resolve((request.result as StoredDraft | undefined) ?? null);
    };
    request.onerror = () => {
      database.close();
      reject(request.error ?? new Error('Failed to load draft'));
    };
  });
};

const saveDraft = async (draft: StoredDraft) => {
  const database = await openDraftDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(PST_DRAFT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(PST_DRAFT_STORE_NAME);
    store.put(draft);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error('Failed to save draft'));
    };
  });
};

const clearDraft = async () => {
  const database = await openDraftDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(PST_DRAFT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(PST_DRAFT_STORE_NAME);
    store.delete(PST_DRAFT_KEY);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error('Failed to clear draft'));
    };
  });
};

const draftPhotoToPhotoItem = async (draftPhoto: StoredDraftPhoto): Promise<PhotoItem> => {
  const file = await dataUrlToFile(
    draftPhoto.dataUrl,
    draftPhoto.name,
    draftPhoto.type,
    draftPhoto.lastModified
  );

  return {
    id: draftPhoto.id,
    file,
    previewUrl: draftPhoto.dataUrl,
    addedAt: draftPhoto.addedAt,
  };
};

const photoItemToDraftPhoto = async (photo: PhotoItem): Promise<StoredDraftPhoto> => ({
  id: photo.id,
  name: photo.file.name,
  type: photo.file.type,
  size: photo.file.size,
  addedAt: photo.addedAt,
  lastModified: photo.file.lastModified,
  dataUrl: await readFileAsDataUrl(photo.file),
});

const loadImage = (dataUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load selected image'));
    image.src = dataUrl;
  });

const canvasToJpegBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to compress image'));
          return;
        }

        resolve(blob);
      },
      'image/jpeg',
      quality
    );
  });

const drawFittedStampLine = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number
) => {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  if (context.measureText(trimmedText).width <= maxWidth) {
    context.fillText(trimmedText, x, y);
    return;
  }

  let fittedText = trimmedText;
  while (fittedText.length > 4 && context.measureText(`${fittedText}...`).width > maxWidth) {
    fittedText = fittedText.slice(0, -1);
  }

  context.fillText(`${fittedText}...`, x, y);
};

const drawPhotoStamp = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stamp: PhotoStamp
) => {
  const padding = Math.max(18, Math.round(canvas.width * 0.035));
  const lineHeight = Math.max(28, Math.round(canvas.width * 0.038));
  const titleFontSize = Math.max(24, Math.round(canvas.width * 0.036));
  const addressFontSize = Math.max(20, Math.round(canvas.width * 0.03));
  const maxTextWidth = canvas.width - padding * 2;
  const stampHeight = padding * 2 + lineHeight * 3;
  const stampTop = canvas.height - stampHeight;

  const gradient = context.createLinearGradient(0, stampTop, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.24, 'rgba(0, 0, 0, 0.64)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
  context.fillStyle = gradient;
  context.fillRect(0, stampTop, canvas.width, stampHeight);

  context.textBaseline = 'top';
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 8;
  context.fillStyle = '#ffffff';
  context.font = `800 ${titleFontSize}px Arial, sans-serif`;
  context.fillText(formatDateTime(stamp.submittedAt), padding, stampTop + padding);

  context.font = `600 ${addressFontSize}px Arial, sans-serif`;
  drawFittedStampLine(
    context,
    stamp.address,
    padding,
    stampTop + padding + lineHeight,
    maxTextWidth
  );
  drawFittedStampLine(
    context,
    stamp.city,
    padding,
    stampTop + padding + lineHeight * 2,
    maxTextWidth
  );
  context.shadowBlur = 0;
};

const compressPhotoForSheets = async (
  file: File,
  stamp: PhotoStamp
): Promise<CompressedPhoto> => {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available for image compression');
  }

  const attempts = [
    { maxSide: 1400, quality: 0.86 },
    { maxSide: 1280, quality: 0.82 },
    { maxSide: 1100, quality: 0.78 },
    { maxSide: 960, quality: 0.72 },
    { maxSide: 820, quality: 0.68 },
    { maxSide: 720, quality: 0.64 },
    { maxSide: 640, quality: 0.58 },
    { maxSide: 560, quality: 0.54 },
  ];

  let bestPhoto: CompressedPhoto | null = null;

  for (const attempt of attempts) {
    const scale = Math.min(1, attempt.maxSide / Math.max(image.width, image.height));
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawPhotoStamp(context, canvas, stamp);

    const blob = await canvasToJpegBlob(canvas, attempt.quality);
    const dataUrl = await readFileAsDataUrl(blob);
    const compressedPhoto = {
      fileName: file.name.replace(/\.[^.]+$/, '') + '.jpg',
      mimeType: 'image/jpeg',
      dataUrl,
      sizeBytes: blob.size,
      originalSizeBytes: file.size,
      width: canvas.width,
      height: canvas.height,
    };

    bestPhoto = compressedPhoto;

    if (blob.size <= DRIVE_PHOTO_SIZE_LIMIT_BYTES) {
      return compressedPhoto;
    }
  }

  return bestPhoto!;
};

const formatFileDateTime = (value: string) => {
  const date = new Date(value);
  const part = (segment: number) => String(segment).padStart(2, '0');

  return [
    date.getFullYear(),
    part(date.getMonth() + 1),
    part(date.getDate()),
  ].join('-') + `_${part(date.getHours())}-${part(date.getMinutes())}-${part(date.getSeconds())}`;
};

const sanitizeFileNamePart = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[^\w\d-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 48);

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceKm = (from: GeoCoords, to: Pick<PstLocation, 'lat' | 'lng'>) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildSearchIndex = (location: PstLocation) =>
  normalizeSearch(
    [
      location.id,
      location.city,
      location.branch,
      location.address,
      location.category,
      location.installPlace,
      location.comment,
      location.hint,
    ].join(' ')
  );

const chipClass =
  'rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]';

const PHOTO_SECTION_LABELS: Record<PhotoSection, string> = {
  before: 'До',
  after: 'После',
};

const PHOTO_SECTION_DESCRIPTIONS: Record<PhotoSection, string> = {
  before: 'Снимки состояния до уборки',
  after: 'Снимки состояния после уборки',
};

type PstMiniMapProps = {
  coords: GeoCoords;
  locations: LocationWithDistance[];
  selectedLocationId: string;
  onSelectLocation: (locationId: string) => void;
};

const getVisualMarkerCoords = (
  location: LocationWithDistance,
  locationIndex: number,
  locations: LocationWithDistance[]
) => {
  const duplicateIndex = locations
    .slice(0, locationIndex)
    .filter((item) => item.lat === location.lat && item.lng === location.lng).length;
  const duplicateCount = locations.filter(
    (item) => item.lat === location.lat && item.lng === location.lng
  ).length;

  if (duplicateCount <= 1) {
    return [location.lat, location.lng];
  }

  const angle = (duplicateIndex / duplicateCount) * Math.PI * 2;
  const offset = 0.000035;

  return [
    location.lat + Math.sin(angle) * offset,
    location.lng + Math.cos(angle) * offset,
  ];
};

const PstMiniMap = ({
  coords,
  locations,
  selectedLocationId,
  onSelectLocation,
}: PstMiniMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markersGroup = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    const L = window.L;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        tap: true,
      }).setView([coords.lat, coords.lng], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap',
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
      markersGroup.current = L.layerGroup().addTo(mapInstance.current);
    }

    setTimeout(() => {
      mapInstance.current?.invalidateSize();
    }, 100);

    markersGroup.current?.clearLayers();

    L.circle([coords.lat, coords.lng], {
      radius: Math.min(coords.accuracy ?? 35, 90),
      color: '#8fc640',
      weight: 1,
      fillColor: '#8fc640',
      fillOpacity: 0.08,
      opacity: 0.45,
    }).addTo(markersGroup.current);

    L.circleMarker([coords.lat, coords.lng], {
      radius: 7,
      color: '#ffffff',
      weight: 3,
      fillColor: '#8fc640',
      fillOpacity: 1,
    })
      .bindTooltip('Вы здесь', { direction: 'top', offset: [0, -8] })
      .addTo(markersGroup.current);

    locations.forEach((location, index) => {
      const isSelected = location.id === selectedLocationId;
      const markerCoords = getVisualMarkerCoords(location, index, locations);
      const marker = L.circleMarker(markerCoords, {
        radius: isSelected ? 11 : 8,
        color: isSelected ? '#8fc640' : '#ffffff',
        weight: isSelected ? 4 : 3,
        fillColor: location.installPlace === 'Уличный' ? '#2b6cb0' : '#1a2215',
        fillOpacity: 0.95,
      });

      marker.on('click', () => {
        onSelectLocation(location.id);
      });

      marker
        .bindTooltip(
          `<strong>${escapeHtml(location.hint || location.comment || location.address)}</strong><br>${formatDistance(location.distanceKm)}`,
          { direction: 'top', offset: [0, -10] }
        )
        .addTo(markersGroup.current);
    });

    const boundsItems = [
      [coords.lat, coords.lng],
      ...locations.map((location, index) => getVisualMarkerCoords(location, index, locations)),
    ];

    if (boundsItems.length > 1) {
      mapInstance.current.fitBounds(L.latLngBounds(boundsItems), {
        padding: [28, 28],
        maxZoom: 18,
      });
    } else {
      mapInstance.current.setView([coords.lat, coords.lng], 17);
    }
  }, [coords, locations, onSelectLocation, selectedLocationId]);

  return (
    <div className="mt-5 overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div ref={mapRef} className="h-[260px] w-full bg-[#eef3e8] sm:h-[320px]" />
    </div>
  );
};

type PhotoUploadSectionProps = {
  section: PhotoSection;
  photos: PhotoItem[];
  onSelect: (event: React.ChangeEvent<HTMLInputElement>, section: PhotoSection) => void;
  onRemove: (photoId: string, section: PhotoSection) => void;
};

const PhotoUploadSection = ({
  section,
  photos,
  onSelect,
  onRemove,
}: PhotoUploadSectionProps) => (
  <div className="rounded-[28px] border border-black/6 bg-[#fbfcf8] p-4 sm:p-5">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
          {PHOTO_SECTION_LABELS[section]}
        </div>
        <div className="mt-2 text-base font-black text-brand-dark">
          {section === 'before' ? 'Фото до уборки' : 'Фото после уборки'}
        </div>
        <div className="mt-1 text-sm font-semibold text-brand-dark/55">
          {PHOTO_SECTION_DESCRIPTIONS[section]}
        </div>
      </div>
      <div className="rounded-full bg-white px-3 py-1 text-xs font-black text-brand-dark/45 shadow-sm">
        {photos.length} шт.
      </div>
    </div>

    <label className="flex cursor-pointer flex-col gap-5 rounded-[24px] border-2 border-dashed border-brand-green/28 bg-white p-5 transition hover:border-brand-green/45 hover:bg-[#fdfffa]">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#f7f8f4] text-brand-green shadow-sm">
          <Camera size={22} />
        </div>
        <div className="text-base font-black uppercase tracking-[0.12em] text-brand-dark">
          {section === 'before' ? 'Загрузить фото до уборки' : 'Загрузить фото после уборки'}
        </div>
      </div>

      <div className="inline-flex min-h-14 items-center justify-center rounded-[22px] bg-brand-green px-5 text-center text-sm font-black uppercase tracking-[0.16em] text-brand-dark shadow-[0_18px_35px_rgba(143,198,64,0.24)]">
        {section === 'before' ? 'Добавить фото до' : 'Добавить фото после'}
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(event) => onSelect(event, section)}
      />
    </label>

    {photos.length > 0 && (
      <div className="mt-4 space-y-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="flex items-center gap-4 rounded-[24px] border border-black/6 bg-white p-3"
          >
            <img
              src={photo.previewUrl}
              alt={photo.file.name}
              className="h-20 w-20 rounded-[18px] object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black text-brand-dark">{photo.file.name}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-brand-dark/55">
                <Camera size={13} />
                <span>{formatDateTime(photo.addedAt)}</span>
              </div>
              <div className="mt-1 text-xs text-brand-dark/45">
                {(photo.file.size / (1024 * 1024)).toFixed(2)} МБ
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(photo.id, section)}
              className="rounded-2xl border border-red-100 bg-red-50 p-3 text-red-500 transition hover:bg-red-100"
              aria-label="Удалить фото"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const PstPage = () => {
  const [locations, setLocations] = useState<PstLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState('');
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [geoError, setGeoError] = useState('');
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [beforePhotos, setBeforePhotos] = useState<PhotoItem[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<PhotoItem[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionDebugId, setSubmissionDebugId] = useState('');
  const [isRestoringDraft, setIsRestoringDraft] = useState(true);
  const [draftNotice, setDraftNotice] = useState('');
  const isSubmittingRef = useRef(false);
  const hasHydratedDraftRef = useRef(false);
  const draftSaveTimeoutRef = useRef<number | null>(null);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    let isMounted = true;

    const loadLocations = async () => {
      setIsLoadingLocations(true);
      setLocationsError('');

      try {
        const response = await fetch('/pst-locations.json');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as PstLocation[];
        if (isMounted) {
          setLocations(payload);
        }
      } catch (error) {
        console.error('Failed to load PST locations:', error);
        if (isMounted) {
          setLocationsError('Не удалось загрузить базу адресов. Обновите страницу и попробуйте еще раз.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingLocations(false);
        }
      }
    };

    loadLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      [...beforePhotos, ...afterPhotos].forEach((photo) => {
        if (photo.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, [afterPhotos, beforePhotos]);

  useEffect(() => {
    let isMounted = true;

    const restoreDraft = async () => {
      try {
        const draft = await loadDraft();

        if (!isMounted || !draft) {
          return;
        }

        const restoredBeforePhotos = await Promise.all(
          (draft.beforePhotos ?? draft.photos ?? []).map(draftPhotoToPhotoItem)
        );
        const restoredAfterPhotos = await Promise.all(
          (draft.afterPhotos ?? []).map(draftPhotoToPhotoItem)
        );

        if (!isMounted) {
          [...restoredBeforePhotos, ...restoredAfterPhotos].forEach((photo) => {
            if (photo.previewUrl.startsWith('blob:')) {
              URL.revokeObjectURL(photo.previewUrl);
            }
          });
          return;
        }

        setSelectedLocationId(draft.selectedLocationId);
        setBeforePhotos(restoredBeforePhotos);
        setAfterPhotos(restoredAfterPhotos);

        if (
          draft.selectedLocationId ||
          restoredBeforePhotos.length > 0 ||
          restoredAfterPhotos.length > 0
        ) {
          setDraftNotice('Черновик восстановлен. Можно продолжать и собрать фото до и после в одну отправку.');
        }
      } catch (error) {
        console.error('Failed to restore PST draft:', error);
      } finally {
        if (isMounted) {
          hasHydratedDraftRef.current = true;
          setIsRestoringDraft(false);
        }
      }
    };

    restoreDraft();

    return () => {
      isMounted = false;
      if (draftSaveTimeoutRef.current !== null) {
        window.clearTimeout(draftSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedDraftRef.current) {
      return;
    }

    if (draftSaveTimeoutRef.current !== null) {
      window.clearTimeout(draftSaveTimeoutRef.current);
    }

    draftSaveTimeoutRef.current = window.setTimeout(() => {
      const persistDraft = async () => {
        try {
          if (!selectedLocationId && beforePhotos.length === 0 && afterPhotos.length === 0) {
            await clearDraft();
            return;
          }

          const storedBeforePhotos = await Promise.all(beforePhotos.map(photoItemToDraftPhoto));
          const storedAfterPhotos = await Promise.all(afterPhotos.map(photoItemToDraftPhoto));
          await saveDraft({
            id: PST_DRAFT_KEY,
            selectedLocationId,
            beforePhotos: storedBeforePhotos,
            afterPhotos: storedAfterPhotos,
            updatedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to persist PST draft:', error);
        }
      };

      void persistDraft();
    }, 250);

    return () => {
      if (draftSaveTimeoutRef.current !== null) {
        window.clearTimeout(draftSaveTimeoutRef.current);
      }
    };
  }, [afterPhotos, beforePhotos, selectedLocationId]);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoState('unsupported');
      setGeoError('На этом устройстве геолокация недоступна.');
      return;
    }

    setGeoState('loading');
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setGeoState('ready');
      },
      (error) => {
        console.error('PST geolocation error:', error);
        setGeoState('denied');
        setGeoError('Доступ к геолокации ограничен. Пожалуйста, разрешите доступ для продолжения.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const indexedLocations: IndexedLocation[] = useMemo(
    () =>
      locations.map((location) => ({
        ...location,
        searchIndex: buildSearchIndex(location),
      })),
    [locations]
  );

  const nearestLocations: LocationWithDistance[] = useMemo(() => {
    if (!coords) return [];

    return indexedLocations
      .map((location) => ({
        ...location,
        distanceKm: getDistanceKm(coords, location),
      }))
      .filter((location) => location.distanceKm <= SEARCH_RADIUS_KM)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 12);
  }, [coords, indexedLocations]);

  const manualResults: LocationWithDistance[] = useMemo(() => {
    const normalizedTerm = normalizeSearch(deferredSearchTerm);

    if (!normalizedTerm) {
      return nearestLocations;
    }

    return indexedLocations
      .filter((location) => location.searchIndex.includes(normalizedTerm))
      .map((location) => ({
        ...location,
        distanceKm: coords ? getDistanceKm(coords, location) : Number.POSITIVE_INFINITY,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 30);
  }, [coords, deferredSearchTerm, indexedLocations, nearestLocations]);

  const visibleLocations = searchTerm ? manualResults : nearestLocations;

  const selectedLocation =
    indexedLocations.find((location) => location.id === selectedLocationId) ?? null;

  const selectedDistance =
    coords && selectedLocation ? getDistanceKm(coords, selectedLocation) : null;

  const handlePhotosSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
    section: PhotoSection
  ) => {
    const nextFiles = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/')
    );

    if (nextFiles.length === 0) return;

    const createdAt = new Date().toISOString();
    const nextItems = nextFiles.map((file, index) => ({
      id: `${createdAt}-${index}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
      addedAt: createdAt,
    }));

    if (section === 'before') {
      setBeforePhotos((current) => [...current, ...nextItems]);
    } else {
      setAfterPhotos((current) => [...current, ...nextItems]);
    }
    event.target.value = '';
  };

  const removePhoto = (photoId: string, section: PhotoSection) => {
    const updatePhotos = section === 'before' ? setBeforePhotos : setAfterPhotos;

    updatePhotos((current) => {
      const photoToRemove = current.find((photo) => photo.id === photoId);
      if (photoToRemove?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }

      return current.filter((photo) => photo.id !== photoId);
    });
  };

  const hasBeforePhotos = beforePhotos.length > 0;
  const hasAfterPhotos = afterPhotos.length > 0;
  const hasAnyPhotos = hasBeforePhotos || hasAfterPhotos;
  const isReady = Boolean(selectedLocation && hasBeforePhotos && hasAfterPhotos);

  const handleSubmit = async () => {
    if (!isReady || isSubmittingRef.current) return;

    if (!selectedLocation) {
      setSubmitError('\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043b\u043e\u043a\u0430\u0446\u0438\u044e.');
      return;
    }

    if (!hasBeforePhotos || !hasAfterPhotos) {
      setSubmitError(
        '\u0414\u043b\u044f \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438 \u043d\u0443\u0436\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0445\u043e\u0442\u044f \u0431\u044b \u043e\u0434\u043d\u043e \u0444\u043e\u0442\u043e \u0432 \u0440\u0430\u0437\u0434\u0435\u043b\u044b \u00ab\u0414\u043e\u00bb \u0438 \u00ab\u041f\u043e\u0441\u043b\u0435\u00bb.'
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const submittedAt = new Date().toISOString();
      const debugId = buildSubmissionDebugId(selectedLocation.id);
      const stamp = {
        submittedAt,
        address: selectedLocation.address,
        city: selectedLocation.city,
      };
      const compressedBeforePhotos = await Promise.all(
        beforePhotos.map((photo, index) =>
          compressPhotoForSheets(photo.file, stamp).then((compressedPhoto) => ({
            ...compressedPhoto,
            photoIndex: index + 1,
          }))
        )
      );
      const compressedAfterPhotos = await Promise.all(
        afterPhotos.map((photo, index) =>
          compressPhotoForSheets(photo.file, stamp).then((compressedPhoto) => ({
            ...compressedPhoto,
            photoIndex: index + 1,
          }))
        )
      );
      const compressedPhotos = [...compressedBeforePhotos, ...compressedAfterPhotos];
      const oversizedPhoto = compressedPhotos.find(
        (photo) => photo.sizeBytes > DRIVE_PHOTO_SIZE_LIMIT_BYTES
      );

      if (oversizedPhoto) {
        throw new Error(
          `\u0424\u043e\u0442\u043e ${oversizedPhoto.fileName} \u043d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u0436\u0430\u0442\u044c \u0434\u043e \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u043c\u0435\u0440\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438.`
        );
      }

      const basePayload = {
        payloadVersion: PST_PAYLOAD_VERSION,
        submissionDebugId: debugId,
        clientBuildId: String(import.meta.env.VITE_APP_BUILD_ID || '').trim() || 'dev-build',
        submittedAt,
        location: {
          id: selectedLocation.id,
          title: capitalizeFirstLetter(
            selectedLocation.hint || selectedLocation.comment || selectedLocation.address
          ),
          city: selectedLocation.city,
          branch: selectedLocation.branch,
          address: selectedLocation.address,
          category: selectedLocation.category,
          installPlace: selectedLocation.installPlace,
          surfaceType: selectedLocation.surfaceType,
          cellsCount: selectedLocation.cellsCount,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          distanceMeters:
            selectedDistance !== null ? Math.round(selectedDistance * 1000) : null,
        },
        userLocation: coords
          ? {
              lat: coords.lat,
              lng: coords.lng,
              accuracy: coords.accuracy ?? null,
            }
          : null,
      };

      const initResponse = await fetch('/api/pst-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...basePayload,
          action: 'init',
          beforeCount: compressedBeforePhotos.length,
          afterCount: compressedAfterPhotos.length,
        }),
      });

      const initResult = (await initResponse.json().catch(() => null)) as
        | {
            ok?: boolean;
            error?: string;
            debugId?: string;
          }
        | null;

      if (!initResponse.ok || !initResult?.ok) {
        const reason =
          (typeof initResult?.error === 'string' && initResult.error.trim()) ||
          `HTTP ${initResponse.status}`;
        throw new Error(reason);
      }

      const uploadPhotoChunks = async (section: PhotoSection, photos: CompressedPhoto[]) => {
        const chunks = chunkCompressedPhotos(photos);

        for (const chunk of chunks) {
          const chunkResponse = await fetch('/api/pst-submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...basePayload,
              action: 'upload-chunk',
              section,
              photos: chunk,
            }),
          });

          const chunkResult = (await chunkResponse.json().catch(() => null)) as
            | {
                ok?: boolean;
                error?: string;
              }
            | null;

          if (!chunkResponse.ok || !chunkResult?.ok) {
            const reason =
              (typeof chunkResult?.error === 'string' && chunkResult.error.trim()) ||
              `HTTP ${chunkResponse.status}`;
            throw new Error(reason);
          }
        }
      };

      await uploadPhotoChunks('before', compressedBeforePhotos);
      await uploadPhotoChunks('after', compressedAfterPhotos);

      const finalizeResponse = await fetch('/api/pst-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...basePayload,
          action: 'finalize',
        }),
      });

      const result = (await finalizeResponse.json().catch(() => null)) as
        | {
            ok?: boolean;
            saved?: boolean;
            error?: string;
            debugId?: string;
            historyRow?: number;
            objectRow?: number;
          }
        | null;

      if (!finalizeResponse.ok || !result?.ok || result.saved !== true) {
        const reason =
          (typeof result?.error === 'string' && result.error.trim()) ||
          (result?.ok && result.saved !== true
            ? 'Google Sheets \u043d\u0435 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043b \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u043f\u0438\u0441\u0438. \u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u0437\u0430\u043a\u0440\u044b\u0442\u0430, \u043f\u043e\u043a\u0430 \u0437\u0430\u043f\u0438\u0441\u044c \u043d\u0435 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f.'
            : `HTTP ${finalizeResponse.status}`);
        const debugSuffix =
          typeof result?.debugId === 'string' && result.debugId.trim()
            ? ` Debug ID: ${result.debugId}`
            : '';

        throw new Error(`${reason}${debugSuffix}`);
      }

      setSubmissionDebugId(String(result.debugId || debugId).trim());
      await clearDraft();
      [...beforePhotos, ...afterPhotos].forEach((photo) => {
        if (photo.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
      setBeforePhotos([]);
      setAfterPhotos([]);
      setSelectedLocationId('');
      setSearchTerm('');
      setDraftNotice('');
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to submit PST cleaning report:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043e\u0442\u0447\u0435\u0442 \u0432 Google Sheets.'
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6 pt-32">
        <SeoHead
          title="PST точки | IC Group"
          description="Выбор ближайшей PST-точки по геолокации с фиксацией фото и времени."
          path="/pst"
        />
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-premium text-center">
          <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-brand-green" size={40} />
          </div>
          <h1 className="text-2xl font-black text-brand-dark mb-4 uppercase">Готово</h1>
          <p className="text-sm leading-6 text-brand-dark/60">
            Локация выбрана, фото зафиксированы. Можно переходить к следующему этапу.
          </p>
          {submissionDebugId && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark/35">
              Debug ID: {submissionDebugId}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setSubmissionDebugId('');
            }}
            className="btn-premium w-full mt-6"
          >
            Вернуться
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-16 pt-24 md:pt-32">
      <SeoHead
        title="PST точки | IC Group"
        description="Выбор ближайшей PST-точки по геолокации с фиксацией фото и времени."
        path="/pst"
      />

      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12">
          <div className="mb-10 flex justify-start">
            <Link to="/" className="inline-flex">
              <img
                src="/logo_IC_group.png"
                alt="IC Group"
                className="h-14 w-auto object-contain sm:h-16"
              />
            </Link>
          </div>

          <h1 className="mx-auto max-w-[620px] text-center font-black uppercase leading-[0.9] tracking-0 text-brand-dark text-[clamp(2.1rem,5.8vw,4.1rem)]">
            Уборка
            <br />
            <span className="text-brand-green">Kaspi Postomat</span>
          </h1>

          <div className="mx-auto mt-8 max-w-[690px]">
            {(geoState === 'denied' || geoState === 'unsupported') && (
              <div className="rounded-[36px] border border-[#f5d7d6] bg-[#fff5f5] px-6 py-5 shadow-[0_18px_40px_rgba(242,107,104,0.08)] sm:px-8">
                <div className="flex items-start gap-4">
                  <span className="mt-[10px] h-3 w-1.5 shrink-0 rounded-full bg-[#f26b68]" />
                  <span className="text-left text-[clamp(1rem,1.8vw,1.45rem)] font-black uppercase leading-[1.45] tracking-[0.01em] text-[#f26b68]">
                    {geoError}
                  </span>
                </div>
              </div>
            )}

            {geoState === 'ready' && coords && (
              <div className="rounded-[28px] border border-brand-green/20 bg-brand-green/10 px-6 py-5">
                <div className="flex items-center gap-2 text-base font-black uppercase tracking-[0.02em] text-brand-green">
                  <LocateFixed size={18} />
                  Геолокация определена
                </div>
                <div className="mt-2 text-sm font-semibold leading-6 text-brand-dark/60">
                  GPS: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  {coords.accuracy ? `, точность ${Math.round(coords.accuracy)} м` : ''}
                </div>
              </div>
            )}

            {(geoState === 'loading' || geoState === 'idle') && (
              <div className="rounded-[28px] border border-black/5 bg-white px-6 py-5 text-base font-bold leading-7 text-brand-dark/60 shadow-premium">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-dark/15 border-t-brand-green" />
                  Запрашиваем координаты устройства...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-transparent px-0 py-0 shadow-none">
            <div className="mx-auto max-w-[690px]">
              {geoState === 'ready' && (
                <>
                  {visibleLocations.length > 0 && coords && (
                    <PstMiniMap
                      coords={coords}
                      locations={visibleLocations}
                      selectedLocationId={selectedLocationId}
                      onSelectLocation={setSelectedLocationId}
                    />
                  )}

                  <div className="relative mt-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/25" size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Например: Jaqsy, Жарокова, 7162"
                      className="w-full rounded-[26px] border border-brand-dark/10 bg-white py-5 pl-12 pr-4 text-base font-semibold text-brand-dark outline-none transition shadow-premium focus:border-brand-green focus:bg-white"
                    />
                  </div>

                  <div className="mt-6">
                    {visibleLocations.length > 0 && (
                      <div className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                        Выберите объект
                      </div>
                    )}

                    <div className="overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                      <div className="max-h-[560px] divide-y divide-black/6 overflow-y-auto">
                      {visibleLocations.map((location) => {
                        const isSelected = location.id === selectedLocationId;

                        return (
                          <button
                            key={`location-${location.id}`}
                            type="button"
                            onClick={() => setSelectedLocationId(location.id)}
                            className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 text-left transition-all ${
                              isSelected
                                ? 'bg-[#f5fbe9] shadow-[inset_4px_0_0_#8fc640]'
                                : 'bg-white hover:bg-[#fbfcf8]'
                            }`}
                          >
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                                isSelected
                                  ? 'border-brand-green bg-brand-green'
                                  : 'border-brand-dark/16 bg-white group-hover:border-brand-green/45'
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected && <CheckCircle2 size={16} className="text-brand-dark" />}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`${chipClass} bg-brand-dark/5 text-brand-dark/55`}>
                                  ID {location.id}
                                </span>
                                <span
                                  className={`${chipClass} ${
                                    location.installPlace === 'Уличный'
                                      ? 'bg-[#e9f3ff] text-[#2b6cb0]'
                                      : 'bg-[#eef6e3] text-[#5a7d20]'
                                  }`}
                                >
                                  {location.installPlace}
                                </span>
                              </div>

                              <div className="mt-2 text-base font-black leading-tight text-brand-dark">
                                {capitalizeFirstLetter(location.hint || location.comment || location.address)}
                              </div>
                              <div className="mt-2 flex items-start gap-2 text-sm text-brand-dark/55">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-green" />
                                <span>{location.address}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {Number.isFinite(location.distanceKm) && (
                                <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-xs font-black text-brand-dark/55">
                                  {formatDistance(location.distanceKm)}
                                </span>
                              )}
                              <ChevronRight
                                size={18}
                                className={`transition ${
                                  isSelected
                                    ? 'text-brand-green'
                                    : 'text-brand-dark/22 group-hover:text-brand-dark/45'
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}

                    {!isLoadingLocations && searchTerm && manualResults.length === 0 && (
                      <div className="rounded-[24px] border border-dashed border-brand-dark/12 bg-white p-5 text-sm font-semibold text-brand-dark/55">
                        Совпадений не найдено. Попробуйте адрес, магазин, комментарий или номер постомата.
                      </div>
                    )}

                    {!isLoadingLocations && !searchTerm && nearestLocations.length === 0 && (
                      <div className="rounded-[24px] border border-dashed border-brand-dark/12 bg-white p-5 text-sm font-semibold text-brand-dark/55">
                        В радиусе 300 метров ничего не найдено. Используйте поиск выше, чтобы выбрать нужную точку вручную.
                      </div>
                    )}
                    </div>
                    </div>
                  </div>
                </>
              )}

              {selectedLocation && (
                <div className="mt-8 space-y-4 border-t border-black/6 pt-8">
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                    Выбранная локация
                  </div>
                <div className="rounded-[28px] bg-brand-dark p-5 text-white shadow-premium">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`${chipClass} border border-white/15 bg-white/10 text-white/80`}>
                      {selectedLocation.installPlace}
                    </span>
                    <span className={`${chipClass} border border-white/15 bg-white/10 text-white/80`}>
                      {selectedLocation.category}
                    </span>
                    <span className={`${chipClass} border border-white/15 bg-white/10 text-white/80`}>
                      {selectedLocation.surfaceType || 'Покрытие не указано'}
                    </span>
                    {selectedDistance !== null && (
                      <span className={`${chipClass} border border-white/15 bg-white/10 text-white/80`}>
                        {formatDistance(selectedDistance)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 text-2xl font-black leading-tight">
                    {capitalizeFirstLetter(selectedLocation.hint || selectedLocation.comment || selectedLocation.address)}
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-white/78">
                    <Store size={16} className="mt-1 shrink-0" />
                    <span>{selectedLocation.address}</span>
                  </div>
                </div>
              </div>
              )}
            </div>
          </section>

              {selectedLocation && (
            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
              {draftNotice && (
                <div className="mb-5 rounded-[24px] border border-brand-green/20 bg-brand-green/10 px-5 py-4 text-sm font-semibold leading-6 text-brand-dark/72">
                  {draftNotice}
                </div>
              )}

              <div className="space-y-5">
                <PhotoUploadSection
                  section="before"
                  photos={beforePhotos}
                  onSelect={handlePhotosSelected}
                  onRemove={removePhoto}
                />

                <PhotoUploadSection
                  section="after"
                  photos={afterPhotos}
                  onSelect={handlePhotosSelected}
                  onRemove={removePhoto}
                />
              </div>

              {submitError && (
                <div className="mt-5 rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                  {submitError}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isReady || isSubmitting}
                  className={`w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-[0.2em] transition-all ${
                    isReady && !isSubmitting
                      ? 'bg-brand-green text-brand-dark hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(143,198,64,0.28)]'
                      : 'bg-brand-dark/8 text-brand-dark/35 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Отправляем...' : 'Отправить'}
                </button>
                {!isReady && (
                  <div className="mt-3 text-sm font-semibold leading-6 text-brand-dark/48">
                    {selectedLocation
                      ? !hasBeforePhotos && !hasAfterPhotos
                        ? '\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0444\u043e\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0438 \u0432 \u0440\u0430\u0437\u0434\u0435\u043b\u044b \u00ab\u0414\u043e\u00bb \u0438 \u00ab\u041f\u043e\u0441\u043b\u0435\u00bb, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0443\u0431\u043e\u0440\u043a\u0443 \u043e\u0434\u043d\u043e\u0439 \u0446\u0435\u043b\u044c\u043d\u043e\u0439 \u0437\u0430\u043f\u0438\u0441\u044c\u044e.'
                        : !hasBeforePhotos
                          ? '\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0445\u043e\u0442\u044f \u0431\u044b \u043e\u0434\u043d\u043e \u0444\u043e\u0442\u043e \u0432 \u0440\u0430\u0437\u0434\u0435\u043b \u00ab\u0414\u043e\u00bb.'
                          : '\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0445\u043e\u0442\u044f \u0431\u044b \u043e\u0434\u043d\u043e \u0444\u043e\u0442\u043e \u0432 \u0440\u0430\u0437\u0434\u0435\u043b \u00ab\u041f\u043e\u0441\u043b\u0435\u00bb.'
                      : '\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043b\u043e\u043a\u0430\u0446\u0438\u044e \u0438 \u0434\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0444\u043e\u0442\u043e \u0434\u043e \u0438 \u043f\u043e\u0441\u043b\u0435 \u0443\u0431\u043e\u0440\u043a\u0438.'}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {locationsError && (
          <div className="mt-6 rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {locationsError}
          </div>
        )}
      </div>
    </div>
  );
};

export default PstPage;
