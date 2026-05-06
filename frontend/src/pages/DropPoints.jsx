import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ScrollReveal } from '../components/ScrollReveal';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

function DropPoints() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [mapCenter, setMapCenter] = useState([-6.2201, 106.8126]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyLocations = [
    { id: 1, name: 'E-Cycle Hub Jakarta', address: 'Jl. Sudirman No. 45, Jakarta Pusat', defaultDistance: '2.5 km', status: 'Open Now', lat: -6.2201, lng: 106.8126 },
    { id: 2, name: 'EcoDrop Bandung', address: 'Jl. Dago No. 112, Bandung', defaultDistance: '145 km', status: 'Closed', lat: -6.8893, lng: 107.6105 },
    { id: 3, name: 'TechRecycle Surabaya', address: 'Jl. Pemuda No. 10, Surabaya', defaultDistance: '760 km', status: 'Open Now', lat: -7.2656, lng: 112.7470 },
  ];

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/droppoints`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0 && data[0].lat) {
          setLocations(data);
        } else {
          setLocations(dummyLocations);
        }
        setLoading(false);
      })
      .catch(() => {
        setLocations(dummyLocations);
        setLoading(false);
      });
  }, []);

  const handleDirections = (address) => {
    const base = 'https://www.google.com/maps/dir/?api=1';
    const origin = userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : '';
    window.open(`${base}${origin}&destination=${encodeURIComponent(address)}`, '_blank');
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const locationsWithDistance = locations
    .map((loc) => {
      if (userLocation && loc.lat && loc.lng) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, loc.lat, loc.lng);
        return { ...loc, distance: `${dist.toFixed(1)} km`, rawDist: dist };
      }
      return { ...loc, distance: loc.defaultDistance || 'N/A', rawDist: Infinity };
    })
    .sort((a, b) => a.rawDist - b.rawDist);

  const filtered = locationsWithDistance.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const requestUserLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Browser kamu tidak mendukung pelacakan lokasi.');
      return;
    }
    setTracking(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setMapCenter([coords.latitude, coords.longitude]);
        setTracking(false);
      },
      () => {
        setTracking(false);
        alert('Gagal melacak lokasi. Pastikan izin GPS/Lokasi di browser sudah diaktifkan.');
      },
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem 6rem' }}>
      {/* Header */}
      <ScrollReveal animation="slideUp">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="tag-badge">Location</span>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem' }}>Find a Drop Point</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            Locate the nearest official e-waste drop points. We have partnered with hundreds of locations
            across the country to make recycling easy for you.
          </p>
        </div>
      </ScrollReveal>

      {/* Main layout: sidebar + map — stacks on mobile */}
      <div className="droppoints-layout">
        {/* Sidebar / List */}
        <ScrollReveal animation="slideLeft" delay={80}>
          <div className="card droppoints-sidebar">
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Cari kota atau nama lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  borderRadius: '12px',
                  border: '1.5px solid #e8e4d8',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = '#e8e4d8')}
              />
            </div>

            {/* GPS button */}
            <button
              onClick={requestUserLocation}
              disabled={tracking}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1.25rem',
                backgroundColor: userLocation ? 'var(--bg-color-alt)' : 'var(--primary)',
                color: userLocation ? 'var(--primary)' : 'white',
                border: userLocation ? '2px solid var(--primary)' : 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: tracking ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'var(--transition)',
                fontFamily: 'inherit',
              }}
            >
              <LocateFixed size={16} />
              {tracking ? 'Melacak...' : userLocation ? 'GPS Aktif ✓' : 'Gunakan Lokasi Saat Ini'}
            </button>

            {/* Location list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                  Memuat drop points...
                </p>
              ) : filtered.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                  Tidak ada drop point ditemukan.
                </p>
              ) : (
                filtered.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => { if (loc.lat && loc.lng) setMapCenter([loc.lat, loc.lng]); }}
                    className="hover-highlight"
                    style={{
                      padding: '0.875rem 1rem',
                      border: '1.5px solid #e8e4d8',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem', gap: '0.5rem' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>{loc.name}</h4>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          background: 'rgba(46,211,113,0.1)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 999,
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Buka
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{loc.address}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Jam Buka: {loc.operatingHours || '08:00 – 17:00'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: userLocation ? 'var(--primary)' : 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        <Navigation size={13} />
                        {loc.distance}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDirections(loc.address); }}
                        className="pill-btn"
                        style={{ padding: '0.35rem 0.9rem', fontSize: '0.75rem' }}
                      >
                        Directions
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Map */}
        <ScrollReveal animation="slideRight" delay={120}>
          <div className="droppoints-map-wrapper">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locationsWithDistance.map((loc) =>
                loc.lat && loc.lng ? (
                  <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                    <Popup>
                      <strong>{loc.name}</strong>
                      <br />
                      {loc.address}
                      <br />
                      <button
                        onClick={() => handleDirections(loc.address)}
                        className="pill-btn"
                        style={{ padding: '0.2rem 0.5rem', marginTop: '0.5rem', fontSize: '0.7rem' }}
                      >
                        Get Directions
                      </button>
                    </Popup>
                  </Marker>
                ) : null,
              )}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>
                    <strong>Lokasi Kamu</strong>
                    <br />
                    Akurasi GPS
                  </Popup>
                </Marker>
              )}
              <MapUpdater center={mapCenter} />
            </MapContainer>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default DropPoints;
