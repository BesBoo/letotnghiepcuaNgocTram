import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PARKING_LOCATIONS,
  VENUE_LOCATION,
  type ParkingLocation,
} from '../../data/parkingLocations';
import styles from './RealGoogleMap.module.css';

interface RealGoogleMapProps {
  activeId: string | null;
  hoveredId: string | null;
  onSelectLocation: (loc: ParkingLocation) => void;
  onResetView?: () => void;
}

// Walking routes along actual city street networks to 97 Võ Văn Tần
const WALKING_ROUTES: Record<string, [number, number][]> = {
  // P1: Inside school campus
  'parking-1': [
    [10.77625, 106.6903],
    [10.776199, 106.690247],
  ],
  // P2: Cao ốc 123 (OCB) along Võ Văn Tần sidewalk to 97
  'parking-2': [
    [10.77785, 106.68855],
    [10.7771, 106.6893],
    [10.77645, 106.68995],
    [10.776199, 106.690247],
  ],
  // P3: District 3 Post Office (2 Bà Huyện Thanh Quan) -> up BHTQ -> along Võ Văn Tần to 97
  'parking-3': [
    [10.77495, 106.68965],
    [10.7758, 106.6889],
    [10.7772, 106.6876],
    [10.77785, 106.68855],
    [10.7771, 106.6893],
    [10.776199, 106.690247],
  ],
  // P4: Công viên Tao Đàn (North gate) -> Trương Định -> Võ Văn Tần -> 97
  'parking-4': [
    [10.77449, 106.69265],
    [10.7751, 106.6921],
    [10.7756, 106.6916],
    [10.776199, 106.690247],
  ],
  // P5: Cung VH Lao động (55B NTMK) -> Nguyễn Thị Minh Khai -> Trương Định -> Võ Văn Tần -> 97
  'parking-5': [
    [10.77635, 106.69313],
    [10.7758, 106.6926],
    [10.7751, 106.6921],
    [10.7756, 106.6916],
    [10.776199, 106.690247],
  ],
};

export default function RealGoogleMap({
  activeId,
  hoveredId,
  onSelectLocation,
}: RealGoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const activeRouteLayerRef = useRef<L.Polyline | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initial Center: between 97 Võ Văn Tần and Tao Đàn
  const defaultCenter: [number, number] = [10.7761, 106.6908];
  const defaultZoom = 16.5;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 15,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // 1. Google Maps Roadmap Tile Layer (Actual Google Maps Tiles with Vietnamese Street Names)
    const googleRoadmapLayer = L.tileLayer(
      'https://mt{s}.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}',
      {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
      }
    );

    // 2. OpenStreetMap Fallback Layer in case Google tile servers are restricted
    const osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
      }
    );

    googleRoadmapLayer.on('tileerror', () => {
      if (!map.hasLayer(osmLayer)) {
        osmLayer.addTo(map);
      }
    });

    googleRoadmapLayer.addTo(map);

    // Attribution
    L.control
      .attribution({
        position: 'bottomright',
        prefix: 'Google Maps Data',
      })
      .addTo(map);

    mapInstanceRef.current = map;

    // 3. Add Venue Marker (ĐH Mở TP.HCM - 97 Võ Văn Tần)
    const venueIcon = L.divIcon({
      className: styles.venueIconWrapper,
      html: `
        <div class="${styles.venuePin}">
          <div class="${styles.venueBadge}">
            <span class="${styles.venueIcon}">🎓</span>
            <div class="${styles.venueTexts}">
              <span class="${styles.venueTitle}">ĐH MỞ TP.HCM</span>
              <span class="${styles.venueSub}">Điểm tổ chức lễ (97 VVT)</span>
            </div>
          </div>
          <div class="${styles.venuePinPointer}"></div>
          <div class="${styles.venueTargetPulse}"></div>
        </div>
      `,
      iconSize: [160, 52],
      iconAnchor: [80, 48],
      popupAnchor: [0, -50],
    });

    const venueMarker = L.marker([VENUE_LOCATION.latitude, VENUE_LOCATION.longitude], {
      icon: venueIcon,
      zIndexOffset: 300,
    }).addTo(map);

    venueMarker.bindPopup(`
      <div class="${styles.popupCard}">
        <div class="${styles.popupHeader}">
          <span class="${styles.popupVenueTag}">🎓 ĐIỂM TỔ CHỨC LỄ TỐT NGHIỆP</span>
          <h4 class="${styles.popupTitle}">${VENUE_LOCATION.name}</h4>
        </div>
        <p class="${styles.popupAddress}">${VENUE_LOCATION.address}</p>
        <a href="${VENUE_LOCATION.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="${styles.popupCta}">
          <span>Mở Google Maps</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    `);

    // 4. Add 5 Parking Markers
    PARKING_LOCATIONS.forEach((loc) => {
      const isInitialActive = loc.id === activeId;
      const markerIcon = createParkingIcon(loc, isInitialActive, false);

      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: markerIcon,
        zIndexOffset: isInitialActive ? 500 : 200,
      }).addTo(map);

      // Popup Content
      marker.bindPopup(`
        <div class="${styles.popupCard}">
          <div class="${styles.popupHeader}">
            <span class="${styles.popupPill}">Bãi đỗ xe #${loc.number}</span>
            <span class="${styles.popupDistance}">🚶 ${loc.distance} • ${loc.walkingTime}</span>
          </div>
          <h4 class="${styles.popupTitle}">${loc.name}</h4>
          <p class="${styles.popupAddress}">${loc.address}</p>
          ${loc.note ? `<p class="${styles.popupNote}">${loc.note}</p>` : ''}
          <a href="${loc.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="${styles.popupCta}">
            <span>Chỉ đường trên Google Maps</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      `, {
        offset: [0, -22],
        maxWidth: 260,
      });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersRef.current.set(loc.id, marker);
    });

    // Invalidate map size after parent DOM transitions settle
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
    setTimeout(() => {
      map.invalidateSize();
    }, 600);

    // Watch for container resizes
    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    setMapReady(true);

    const markers = markersRef.current;

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markers.clear();
      activeRouteLayerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to construct custom HTML markers
  function createParkingIcon(
    loc: ParkingLocation,
    isSelected: boolean,
    isHovered: boolean
  ) {
    const activeClass = isSelected ? styles.markerActive : '';
    const hoverClass = isHovered ? styles.markerHovered : '';

    return L.divIcon({
      className: styles.markerIconWrapper,
      html: `
        <div class="${styles.parkingMarker} ${activeClass} ${hoverClass}">
          <div class="${styles.markerPulseRing}"></div>
          <div class="${styles.markerCircle}">
            <span class="${styles.markerPLabel}">P</span>
            <span class="${styles.markerNumber}">${loc.number}</span>
          </div>
          <div class="${styles.markerPoint}"></div>
          <div class="${styles.markerLabelPill}">
            ${
              loc.number === 1
                ? 'ĐH Mở (97)'
                : loc.number === 2
                ? 'OCB (123)'
                : loc.number === 3
                ? 'Bưu điện Q.3'
                : loc.number === 4
                ? 'CV Tao Đàn'
                : 'Cung VH LĐ'
            }
          </div>
        </div>
      `,
      iconSize: [44, 48],
      iconAnchor: [22, 38],
      popupAnchor: [0, -32],
    });
  }

  // Update marker styles and walking route when activeId or hoveredId changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    PARKING_LOCATIONS.forEach((loc) => {
      const marker = markersRef.current.get(loc.id);
      if (!marker) return;

      const isSelected = loc.id === activeId;
      const isHovered = loc.id === hoveredId;

      marker.setIcon(createParkingIcon(loc, isSelected, isHovered));
      marker.setZIndexOffset(isSelected ? 600 : isHovered ? 500 : 200);

      if (isSelected && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    });

    // Remove existing walking route polyline
    if (activeRouteLayerRef.current) {
      map.removeLayer(activeRouteLayerRef.current);
      activeRouteLayerRef.current = null;
    }

    // Draw active walking route along actual city streets
    if (activeId && WALKING_ROUTES[activeId]) {
      const coords = WALKING_ROUTES[activeId];
      const routeLine = L.polyline(coords, {
        color: '#EA4335',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      activeRouteLayerRef.current = routeLine;
    }
  }, [activeId, hoveredId, mapReady]);

  // Pan map when activeId changes
  useEffect(() => {
    if (!mapReady || !activeId || !mapInstanceRef.current) return;

    const targetLoc = PARKING_LOCATIONS.find((l) => l.id === activeId);
    if (targetLoc) {
      mapInstanceRef.current.flyTo(
        [targetLoc.latitude, targetLoc.longitude],
        17.2,
        {
          duration: 1.0,
          easeLinearity: 0.25,
        }
      );
    }
  }, [activeId, mapReady]);

  // Map Controls: Zoom In, Zoom Out, Reset Center
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    mapInstanceRef.current?.flyTo(defaultCenter, defaultZoom, { duration: 0.8 });
  };

  return (
    <div className={styles.mapOuterWrapper}>
      {/* Real Map Canvas Container */}
      <div ref={mapContainerRef} className={styles.mapContainer} />

      {/* Floating Custom Map Controls */}
      <div className={styles.floatingControls}>
        <button
          type="button"
          onClick={handleZoomIn}
          className={styles.controlBtn}
          title="Phóng to"
          aria-label="Phóng to bản đồ"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className={styles.controlBtn}
          title="Thu nhỏ"
          aria-label="Thu nhỏ bản đồ"
        >
          −
        </button>
        <button
          type="button"
          onClick={handleReset}
          className={`${styles.controlBtn} ${styles.resetBtn}`}
          title="Căn giữa toàn bộ các điểm"
          aria-label="Căn giữa bản đồ"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* Map Live Legend Badge */}
      <div className={styles.mapLegendBadge}>
        <span className={styles.legendDotPulse}></span>
        <span>Google Maps Live</span>
      </div>
    </div>
  );
}
