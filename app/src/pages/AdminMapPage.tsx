import React, { useEffect, useState, useRef } from 'react';
import { getAllDealsWithCoords } from '../utils/bitrix';
import { Layout } from 'lucide-react';

const AdminMapPage = () => {
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        // Load Leaflet dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            initMap();
        };
        document.head.appendChild(script);

        // Fetch deals
        getAllDealsWithCoords().then(fetched => {
            setDeals(fetched);
            setIsLoading(false);
        });

        // Get user location
        navigator.geolocation.getCurrentPosition(
            (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.error(err)
        );

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(script);
        };
    }, []);

    const initMap = () => {
        // Wait for Leaflet to be ready and target div to exist
        const L = (window as any).L;
        if (!L || !document.getElementById('map')) return;

        if (mapRef.current) return;

        // Default Almaty center
        const map = L.map('map').setView([43.238949, 76.889709], 12);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    };

    useEffect(() => {
        const L = (window as any).L;
        if (!L || !mapRef.current || deals.length === 0) return;

        const bounds = L.latLngBounds([]);

        deals.forEach(deal => {
            if (deal.lat && deal.lng) {
                const marker = L.circleMarker([deal.lat, deal.lng], {
                    radius: 4,
                    fillColor: "#ff4444",
                    color: "#fff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                })
                .addTo(mapRef.current)
                .bindPopup(`<b>${deal.title}</b><br>ID: ${deal.id}<br>Coords: ${deal.lat}, ${deal.lng}`);
                
                bounds.extend([deal.lat, deal.lng]);
            }
        });

        // Добавим вашу локацию в границы, если она есть
        if (location) {
            bounds.extend([location.lat, location.lng]);
            
            L.circle([location.lat, location.lng], {
                radius: 1000, // Сделаем побольше, чтобы было видно на общем плане
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.2
            }).addTo(mapRef.current);
            
            L.marker([location.lat, location.lng])
                .addTo(mapRef.current)
                .bindPopup('Вы здесь');
        }

        if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [deals, location]);

    return (
        <div className="h-screen w-full bg-brand-light flex flex-col pt-20">
            <div className="bg-white p-6 shadow-sm flex justify-between items-center z-10">
                <div>
                    <h1 className="text-2xl font-black uppercase text-brand-dark">Карта Объектов</h1>
                    <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest mt-1">
                        {isLoading ? 'Загрузка данных из Bitrix...' : `Найдено ${deals.length} точек на карте`}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => window.location.href = '/reports/daily'}
                        className="btn-premium px-6 py-3"
                    >
                        Вернуться к опросу
                    </button>
                </div>
            </div>
            <div id="map" className="flex-1 w-full z-0" style={{ height: 'calc(100vh - 100px)' }} />
            
            <style>{`
                .leaflet-container {
                    background: #f1f5f9;
                }
            `}</style>
        </div>
    );
};

export default AdminMapPage;
