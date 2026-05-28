import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Camera,
  CheckCircle2,
  Compass,
  ImagePlus,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
  Store,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
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

const SEARCH_RADIUS_KM = 0.3;

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

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"'[\]\\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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

const PstPage = () => {
  const [locations, setLocations] = useState<PstLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState('');
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [geoError, setGeoError] = useState('');
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

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
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, [photos]);

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
        setGeoError('Не удалось получить доступ к геолокации. Разрешите доступ к местоположению и повторите попытку.');
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

  const indexedLocations = useMemo(
    () =>
      locations.map((location) => ({
        ...location,
        searchIndex: buildSearchIndex(location),
      })),
    [locations]
  );

  const nearestLocations = useMemo(() => {
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

  const fallbackLocations = useMemo(() => {
    if (!coords) return [];

    return indexedLocations
      .map((location) => ({
        ...location,
        distanceKm: getDistanceKm(coords, location),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 10);
  }, [coords, indexedLocations]);

  const manualResults = useMemo(() => {
    const normalizedTerm = normalizeSearch(deferredSearchTerm);

    if (!normalizedTerm) {
      return fallbackLocations;
    }

    return indexedLocations
      .filter((location) => location.searchIndex.includes(normalizedTerm))
      .map((location) => ({
        ...location,
        distanceKm: coords ? getDistanceKm(coords, location) : Number.POSITIVE_INFINITY,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 30);
  }, [coords, deferredSearchTerm, fallbackLocations, indexedLocations]);

  const selectedLocation =
    indexedLocations.find((location) => location.id === selectedLocationId) ?? null;

  const selectedDistance =
    coords && selectedLocation ? getDistanceKm(coords, selectedLocation) : null;

  const handlePhotosSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setPhotos((current) => [...current, ...nextItems]);
    event.target.value = '';
  };

  const removePhoto = (photoId: string) => {
    setPhotos((current) => {
      const photoToRemove = current.find((photo) => photo.id === photoId);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }

      return current.filter((photo) => photo.id !== photoId);
    });
  };

  const isReady = Boolean(selectedLocation && photos.length > 0);

  return (
    <div className="min-h-screen bg-[#f4f6ef] pb-16 pt-24 md:pt-32">
      <SeoHead
        title="PST точки | IC Group"
        description="Выбор ближайшей PST-точки по геолокации с фиксацией фото и времени."
        path="/pst"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[36px] border border-black/6 bg-white shadow-[0_24px_80px_rgba(17,24,39,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-black/6 bg-[linear-gradient(135deg,#18231a_0%,#243326_55%,#8fc640_180%)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:border-b-0 lg:border-r">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                <Compass size={14} />
                PST маршрут
              </div>
              <h1 className="mt-5 max-w-xl text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl">
                Выберите ближайшую
                <span className="block text-[#d7ff9f]">точку установки</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/78 sm:text-base">
                Страница работает отдельно от Bitrix: определяет точку по геолокации,
                показывает ближайшие адреса в радиусе 300 метров и фиксирует фото с временем
                добавления.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                    Радиус
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">300 м</div>
                </div>
                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                    База
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">
                    {isLoadingLocations ? '...' : locations.length.toLocaleString('ru-RU')}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                    Фото
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">{photos.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#f8faf4] px-6 py-8 sm:px-8 sm:py-10">
              <div className="rounded-[28px] border border-black/6 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                      Геолокация
                    </div>
                    <div className="mt-2 text-xl font-black text-brand-dark">
                      {geoState === 'ready' ? 'Точка определена' : 'Нужен доступ к местоположению'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={requestLocation}
                    className="inline-flex items-center gap-2 rounded-2xl border border-brand-dark/10 bg-[#f7f8f4] px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-brand-dark transition hover:border-brand-green/30 hover:bg-white"
                  >
                    <RefreshCw size={15} />
                    Обновить
                  </button>
                </div>

                <div className="mt-5 rounded-[22px] border border-black/6 bg-[#f7f8f4] p-4">
                  {geoState === 'loading' || geoState === 'idle' ? (
                    <div className="flex items-center gap-3 text-sm font-semibold text-brand-dark/60">
                      <div className="h-5 w-5 rounded-full border-2 border-brand-dark/15 border-t-brand-green animate-spin" />
                      Запрашиваем координаты устройства...
                    </div>
                  ) : null}

                  {geoState === 'ready' && coords ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                        <LocateFixed size={16} className="text-brand-green" />
                        {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                      </div>
                      <div className="text-xs text-brand-dark/50">
                        Точность: {coords.accuracy ? `${Math.round(coords.accuracy)} м` : 'не указана'}
                      </div>
                    </div>
                  ) : null}

                  {(geoState === 'denied' || geoState === 'unsupported') && (
                    <div className="flex items-start gap-3 text-sm font-semibold text-red-600">
                      <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                      <span>{geoError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                    Шаг 1
                  </div>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
                    Ближайшие точки
                  </h2>
                </div>
                <div className="text-sm font-semibold text-brand-dark/50">
                  {coords
                    ? `Показываем адреса рядом с вами`
                    : 'Список появится после определения координат'}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {geoState === 'ready' && nearestLocations.length > 0
                  ? nearestLocations.map((location, index) => {
                      const isSelected = location.id === selectedLocationId;

                      return (
                        <button
                          key={location.id}
                          type="button"
                          onClick={() => setSelectedLocationId(location.id)}
                          className={`rounded-[24px] border p-4 text-left transition-all sm:p-5 ${
                            isSelected
                              ? 'border-brand-green bg-[#f5fbe9] shadow-[0_20px_45px_rgba(143,198,64,0.18)]'
                              : 'border-black/6 bg-[#fbfcf8] hover:border-brand-green/25 hover:bg-white'
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark/55">
                              #{index + 1}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                                location.installPlace === 'Уличный'
                                  ? 'bg-[#e9f3ff] text-[#2b6cb0]'
                                  : 'bg-[#eef6e3] text-[#5a7d20]'
                              }`}
                            >
                              {location.installPlace}
                            </span>
                            <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark/55">
                              {formatDistance(location.distanceKm)}
                            </span>
                          </div>

                          <div className="mt-3 text-lg font-black leading-tight text-brand-dark">
                            {location.hint || location.comment || location.address}
                          </div>
                          <div className="mt-2 flex items-start gap-2 text-sm text-brand-dark/60">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-brand-green" />
                            <span>{location.address}</span>
                          </div>
                        </button>
                      );
                    })
                  : null}

                {geoState === 'ready' && nearestLocations.length === 0 && (
                  <div className="rounded-[24px] border border-dashed border-brand-dark/12 bg-[#fbfcf8] p-5">
                    <div className="text-lg font-black text-brand-dark">
                      В радиусе 300 метров ничего не найдено
                    </div>
                    <p className="mt-2 text-sm leading-6 text-brand-dark/58">
                      Ниже все равно доступен ручной поиск по полной базе и подбор ближайших
                      адресов по расстоянию.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                    Шаг 2
                  </div>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
                    Ручной поиск
                  </h2>
                </div>
                <div className="text-sm font-semibold text-brand-dark/50">
                  По адресу, городу, комментарию или ID
                </div>
              </div>

              <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/25" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Например: Jaqsy, Жарокова, 7162"
                  className="w-full rounded-[24px] border border-brand-dark/10 bg-[#f7f8f4] py-4 pl-12 pr-4 text-sm font-semibold text-brand-dark outline-none transition focus:border-brand-green focus:bg-white"
                />
              </div>

              <div className="mt-5 max-h-[480px] space-y-3 overflow-y-auto pr-1">
                {manualResults.map((location) => {
                  const isSelected = location.id === selectedLocationId;

                  return (
                    <button
                      key={`manual-${location.id}`}
                      type="button"
                      onClick={() => setSelectedLocationId(location.id)}
                      className={`w-full rounded-[24px] border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-brand-green bg-[#f5fbe9]'
                          : 'border-black/6 bg-[#fbfcf8] hover:border-brand-green/25 hover:bg-white'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-dark/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark/55">
                          ID {location.id}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                            location.installPlace === 'Уличный'
                              ? 'bg-[#e9f3ff] text-[#2b6cb0]'
                              : 'bg-[#eef6e3] text-[#5a7d20]'
                          }`}
                        >
                          {location.installPlace}
                        </span>
                        {Number.isFinite(location.distanceKm) ? (
                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark/55">
                            {formatDistance(location.distanceKm)}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 text-base font-black leading-tight text-brand-dark">
                        {location.hint || location.comment || location.address}
                      </div>
                      <div className="mt-2 text-sm text-brand-dark/58">{location.address}</div>
                    </button>
                  );
                })}

                {!isLoadingLocations && manualResults.length === 0 && (
                  <div className="rounded-[24px] border border-dashed border-brand-dark/12 bg-[#fbfcf8] p-5 text-sm font-semibold text-brand-dark/55">
                    Совпадений не найдено. Попробуйте адрес, магазин, комментарий или номер
                    постамата.
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                Шаг 3
              </div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
                Выбранная точка
              </h2>

              {selectedLocation ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-[28px] bg-[linear-gradient(135deg,#1d2a1f_0%,#233826_45%,#8fc640_200%)] p-5 text-white shadow-[0_22px_55px_rgba(31,41,55,0.18)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                        ID {selectedLocation.id}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                        {selectedLocation.installPlace}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                        {selectedLocation.category}
                      </span>
                    </div>

                    <div className="mt-4 text-2xl font-black leading-tight">
                      {selectedLocation.hint || selectedLocation.comment || selectedLocation.address}
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-white/78">
                      <Store size={16} className="mt-1 shrink-0" />
                      <span>{selectedLocation.address}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[24px] bg-[#f7f8f4] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40">
                        Город и филиал
                      </div>
                      <div className="mt-2 text-sm font-semibold text-brand-dark">
                        {selectedLocation.city}, {selectedLocation.branch}
                      </div>
                    </div>
                    <div className="rounded-[24px] bg-[#f7f8f4] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40">
                        До точки
                      </div>
                      <div className="mt-2 text-sm font-semibold text-brand-dark">
                        {selectedDistance !== null ? formatDistance(selectedDistance) : '—'}
                      </div>
                    </div>
                    <div className="rounded-[24px] bg-[#f7f8f4] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40">
                        Покрытие
                      </div>
                      <div className="mt-2 text-sm font-semibold text-brand-dark">
                        {selectedLocation.surfaceType || 'Не указано'}
                      </div>
                    </div>
                    <div className="rounded-[24px] bg-[#f7f8f4] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40">
                        Ячеек
                      </div>
                      <div className="mt-2 text-sm font-semibold text-brand-dark">
                        {selectedLocation.cellsCount || 'Не указано'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-brand-dark/12 bg-[#fbfcf8] p-5 text-sm leading-6 text-brand-dark/55">
                  Сначала выберите ближайшую или вручную найденную точку. Здесь появится карточка
                  выбранного постамата.
                </div>
              )}
            </section>

            <section className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                    Шаг 4
                  </div>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
                    Фотофиксация
                  </h2>
                </div>
                <div className="text-sm font-semibold text-brand-dark/50">
                  Время фиксируется в момент добавления фото
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer flex-col gap-4 rounded-[28px] border border-dashed border-brand-dark/14 bg-[#f7f8f4] p-5 transition hover:border-brand-green/35 hover:bg-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white text-brand-green shadow-sm">
                    <ImagePlus size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
                      Добавить фото
                    </div>
                    <div className="mt-1 text-sm leading-6 text-brand-dark/52">
                      Можно выбрать несколько изображений. На телефоне откроется камера или
                      галерея.
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="hidden"
                  onChange={handlePhotosSelected}
                />
              </label>

              <div className="mt-5 space-y-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-4 rounded-[24px] border border-black/6 bg-[#fbfcf8] p-3"
                  >
                    <img
                      src={photo.previewUrl}
                      alt={photo.file.name}
                      className="h-20 w-20 rounded-[18px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-black text-brand-dark">
                        {photo.file.name}
                      </div>
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
                      onClick={() => removePhoto(photo.id)}
                      className="rounded-2xl border border-red-100 bg-red-50 p-3 text-red-500 transition hover:bg-red-100"
                      aria-label="Удалить фото"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {photos.length === 0 && (
                  <div className="rounded-[24px] border border-dashed border-brand-dark/12 bg-[#fbfcf8] p-5 text-sm leading-6 text-brand-dark/55">
                    Фото пока не добавлены. После загрузки здесь появится список с точным временем
                    фиксации.
                  </div>
                )}
              </div>
            </section>

            <section
              className={`rounded-[32px] border p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7 ${
                isReady
                  ? 'border-brand-green/25 bg-[#f5fbe9]'
                  : 'border-black/6 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] ${
                    isReady ? 'bg-brand-green text-white' : 'bg-brand-dark/6 text-brand-dark/45'
                  }`}
                >
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-dark/45">
                    Статус
                  </div>
                  <div className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
                    {isReady ? 'Карточка готова' : 'Нужно завершить выбор'}
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-brand-dark/58">
                    {isReady
                      ? 'Точка выбрана, фото приложены, время добавления зафиксировано. Можно переходить к следующему этапу.'
                      : 'Для завершения этой части выберите PST-точку и добавьте хотя бы одно фото.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
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
