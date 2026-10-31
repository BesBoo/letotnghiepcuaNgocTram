import { useState, useCallback } from 'react';
import {
  MapPin,
  ExternalLink,
  Car,
  Footprints,
  ShieldCheck,
  Maximize2,
  Navigation,
} from 'lucide-react';
import {
  PARKING_LOCATIONS,
  VENUE_LOCATION,
  type ParkingLocation,
} from '../../data/parkingLocations';
import RealGoogleMap from './RealGoogleMap';
import styles from './ParkingMap.module.css';

export default function ParkingMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Active or hovered location
  const currentSelectedId = hoveredId || activeId;
  const currentSelected = PARKING_LOCATIONS.find((loc) => loc.id === currentSelectedId);

  const handleButtonClick = (loc: ParkingLocation) => {
    // If clicking already active spot, toggle or pan
    setActiveId(loc.id);
  };

  const handleSelectFromMap = useCallback((loc: ParkingLocation) => {
    setActiveId(loc.id);
  }, []);

  const handleOpenGoogleMaps = () => {
    if (currentSelected) {
      window.open(currentSelected.googleMapsUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(VENUE_LOCATION.googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.parkingSectionWrapper}>
      {/* 1. MAIN TITLE - SƠ ĐỒ BÃI ĐỖ XE */}
      <div className={styles.titleHeader}>
        <h3 className={styles.mainTitle}>SƠ ĐỒ BÃI ĐỖ XE</h3>
      </div>

      {/* 2. TWO-COLUMN LAYOUT */}
      <div className={styles.layoutGrid}>
        {/* LEFT COLUMN: GLASSMORPHIC PARKING LIST */}
        <div className={styles.leftContainer}>
          <div>
            <div className={styles.leftHeader}>
              <div className={styles.badgeRow}>
                <span className={styles.badgeDot} />
                <span className={styles.badgeText}>Dữ liệu Google Maps xác minh</span>
              </div>
              <h4 className={styles.subSectionTitle}>
                NHỮNG ĐỊA ĐIỂM CÓ THỂ GỬI XE
              </h4>
              <p className={styles.leftDescription}>
                Chọn một địa điểm để định vị chính xác trên bản đồ và mở chỉ đường Google Maps.
              </p>
            </div>

            {/* 5 Interactive Buttons */}
            <div className={styles.buttonList}>
              {PARKING_LOCATIONS.map((loc) => {
                const isSelected = activeId === loc.id;
                const isHovered = hoveredId === loc.id;

                return (
                  <button
                    key={loc.id}
                    type="button"
                    className={`${styles.parkingButton} ${isSelected ? styles.active : ''} ${isHovered ? styles.hovered : ''}`}
                    onClick={() => handleButtonClick(loc)}
                    onMouseEnter={() => setHoveredId(loc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-label={`Định vị và mở Google Maps cho ${loc.name}`}
                  >
                    {/* Pin Icon with Number */}
                    <div className={styles.pinIconWrapper}>
                      <MapPin size={17} strokeWidth={2.4} />
                      <span className={styles.pinBadgeNumber}>{loc.number}</span>
                    </div>

                    {/* Text Details */}
                    <div className={styles.buttonTextContent}>
                      <div className={styles.locationName}>{loc.name}</div>
                      <div className={styles.locationAddress}>{loc.address}</div>
                      <div className={styles.locationMetaRow}>
                        <span className={styles.distancePill}>
                          <Footprints size={12} />
                          {loc.distance}
                        </span>
                        <span>•</span>
                        <span>{loc.walkingTime}</span>
                      </div>
                    </div>

                    {/* Action Icon: Direct Google Maps Launch */}
                    <div
                      className={styles.buttonActionIcon}
                      title="Mở trong Google Maps"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(loc.googleMapsUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <ExternalLink size={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Footer Note */}
          <div className={styles.leftFooterNote}>
            <Car size={16} color="#8B2648" />
            <span>
              Khu vực trung tâm Quận 3 — bạn nên ưu tiên gửi xe sớm để thuận tiện di chuyển nhé!
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D FLOATING MAP CARD – PERSPECTIVE TILT */}
        <div className={styles.rightPerspectiveWrapper}>
          <div className={styles.browserWindow}>
            {/* Top Browser Window Header */}
            <div className={styles.browserHeader}>
              <div className={styles.trafficDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>

              <div className={styles.browserUrlBar}>
                <ShieldCheck size={13} color="#10B981" />
                <span className={styles.urlText}>
                  maps.google.com/so-do-bai-do-xe-q3
                </span>
              </div>

              <div className={styles.browserControls}>
                <button
                  type="button"
                  className={styles.browserControlBtn}
                  onClick={handleOpenGoogleMaps}
                  title="Mở vị trí đang xem trên Google Maps"
                  aria-label="Mở Google Maps"
                >
                  <Navigation size={13} />
                  <span className={styles.controlLabel}>Mở Maps</span>
                </button>
                <button
                  type="button"
                  className={styles.browserControlBtn}
                  onClick={handleOpenGoogleMaps}
                  title="Xem toàn màn hình"
                  aria-label="Xem toàn màn hình Google Maps"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            </div>

            {/* Real Interactive Map Inside 3D Card */}
            <div className={styles.mapFrameArea}>
              <RealGoogleMap
                activeId={activeId}
                hoveredId={hoveredId}
                onSelectLocation={handleSelectFromMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
