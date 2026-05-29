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
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = () => {
    if (!isReady) return;
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
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
                      {visibleLocations.map((location, index) => {
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
                                {location.hint || location.comment || location.address}
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
                        Совпадений не найдено. Попробуйте адрес, магазин, комментарий или номер постамата.
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
              <label className="flex cursor-pointer flex-col gap-5 rounded-[28px] border-2 border-dashed border-brand-green/28 bg-[#f7f8f4] p-5 transition hover:border-brand-green/45 hover:bg-white sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white text-brand-green shadow-sm">
                    <Camera size={22} />
                  </div>
                  <div className="text-base font-black uppercase tracking-[0.14em] text-brand-dark">
                    Загрузить фото уборки
                  </div>
                </div>

                <div className="inline-flex min-h-14 items-center justify-center rounded-[22px] bg-brand-green px-5 text-center text-sm font-black uppercase tracking-[0.16em] text-brand-dark shadow-[0_18px_35px_rgba(143,198,64,0.24)]">
                  Добавить фото
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

              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isReady}
                  className={`w-full rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-[0.2em] transition-all ${
                    isReady
                      ? 'bg-brand-green text-brand-dark hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(143,198,64,0.28)]'
                      : 'bg-brand-dark/8 text-brand-dark/35 cursor-not-allowed'
                  }`}
                >
                  Отправить
                </button>
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
