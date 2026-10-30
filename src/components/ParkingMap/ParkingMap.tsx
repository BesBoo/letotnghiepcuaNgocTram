import { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Car,
  Footprints,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import {
  PARKING_LOCATIONS,
  type ParkingLocation,
} from '../../data/parkingLocations';
import styles from './ParkingMap.module.css';

export default function ParkingMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Active or hovered location
  const currentSelectedId = hoveredId || activeId;
  const currentSelected = PARKING_LOCATIONS.find((loc) => loc.id === currentSelectedId);

  const handleButtonClick = (loc: ParkingLocation) => {
    setActiveId(loc.id);
    // Open in new tab with encoded Google Maps Search URL
    window.open(loc.googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMarkerClick = (loc: ParkingLocation, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId((prev) => (prev === loc.id ? null : loc.id));
  };

  return (
    <div className={styles.parkingSectionWrapper}>
      {/* 1. MAIN TITLE - SƠ ĐỒ BÃI ĐỖ XE */}
      <div className={styles.titleHeader}>
        <h3 className={styles.mainTitle}>SƠ ĐỒ BÃI ĐỖ XE</h3>
        <p className={styles.mainSubtitle}>
          Địa điểm tổ chức & hướng dẫn gửi xe thuận tiện khi đến tham dự lễ tốt nghiệp
        </p>
      </div>

      {/* 2. TWO-COLUMN LAYOUT */}
      <div className={styles.layoutGrid}>
        {/* LEFT COLUMN: GLASSMORPHIC PARKING LIST */}
        <div className={styles.leftContainer}>
          <div>
            <div className={styles.leftHeader}>
              <div className={styles.badgeRow}>
                <span className={styles.badgeDot} />
                <span className={styles.badgeText}>Bãi gửi xe gần trường</span>
              </div>
              <h4 className={styles.subSectionTitle}>
                NHỮNG ĐỊA ĐIỂM CÓ THỂ GỬI XE
              </h4>
              <p className={styles.leftDescription}>
                Chọn một địa điểm để xem vị trí trên bản đồ và mở chỉ đường trực tiếp qua Google Maps.
              </p>
            </div>

            {/* 3 Interactive Buttons */}
            <div className={styles.buttonList}>
              {PARKING_LOCATIONS.map((loc) => {
                const isSelected = currentSelectedId === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    className={`${styles.parkingButton} ${isSelected ? styles.active : ''}`}
                    onClick={() => handleButtonClick(loc)}
                    onMouseEnter={() => setHoveredId(loc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-label={`Mở Google Maps chỉ đường đến ${loc.name}`}
                  >
                    {/* Pin Icon with Number */}
                    <div className={styles.pinIconWrapper}>
                      <MapPin size={18} strokeWidth={2.4} />
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

                    {/* Action Icon */}
                    <div className={styles.buttonActionIcon}>
                      <ExternalLink size={15} />
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

        {/* RIGHT COLUMN: 3D BROWSER WINDOW MOCKUP */}
        <div className={styles.rightPerspectiveWrapper}>
          <div className={styles.browserWindow}>
            {/* Browser Header Bar */}
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
                <Maximize2 size={13} />
              </div>
            </div>

            {/* Map Canvas with Custom Styled Vector Graphics */}
            <div
              className={styles.mapCanvasContainer}
              onClick={() => setActiveId(null)}
            >
              <svg
                viewBox="0 0 800 520"
                className={styles.mapSvg}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle City Blocks Pattern */}
                  <pattern
                    id="mapCityGrid"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="60" height="60" fill="#F6F4EF" />
                    <rect
                      x="2"
                      y="2"
                      width="56"
                      height="56"
                      rx="4"
                      fill="#FAF8F5"
                      stroke="#EFECE5"
                      strokeWidth="1"
                    />
                  </pattern>

                  {/* Gradient for Tao Dan Park */}
                  <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D5EED9" />
                    <stop offset="100%" stopColor="#C4E7C9" />
                  </linearGradient>

                  {/* Gradient for Event Campus */}
                  <linearGradient id="venueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE4EC" />
                    <stop offset="100%" stopColor="#FBD0DE" />
                  </linearGradient>

                  {/* Drop Shadow for Tooltips and Badges */}
                  <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="5"
                      floodColor="rgba(0,0,0,0.18)"
                    />
                  </filter>
                </defs>

                {/* 1. Map Base / Land Blocks */}
                <rect width="800" height="520" fill="url(#mapCityGrid)" />

                {/* 2. CÔNG VIÊN TAO ĐÀN (Lush green polygon) */}
                <path
                  d="M 270,340 L 590,370 L 550,515 L 240,515 Z"
                  fill="url(#parkGrad)"
                  stroke="#A7D7AE"
                  strokeWidth="2"
                />
                {/* Park internal pedestrian paths */}
                <path
                  d="M 310,360 Q 400,420 460,480 M 460,380 Q 390,440 330,500"
                  stroke="#E8F5EB"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="4 4"
                />
                {/* Park Label */}
                <text
                  x="420"
                  y="450"
                  fill="#1B5E20"
                  fontFamily="system-ui, sans-serif"
                  fontSize="12.5"
                  fontWeight="800"
                  textAnchor="middle"
                  letterSpacing="1.2"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  paintOrder="stroke fill"
                >
                  CÔNG VIÊN TAO ĐÀN 🌳
                </text>

                {/* 3. ARTERIAL ROADS (Thoroughfares) */}
                {/* Đường Nguyễn Thị Minh Khai (East-West parallel road) */}
                <path
                  d="M 0,335 L 800,380"
                  stroke="#D3D9E2"
                  strokeWidth="28"
                  fill="none"
                />
                <path
                  d="M 0,335 L 800,380"
                  stroke="#FFFFFF"
                  strokeWidth="24"
                  fill="none"
                />
                <text
                  x="675"
                  y="368"
                  fill="#475569"
                  fontFamily="system-ui, sans-serif"
                  fontSize="10"
                  fontWeight="700"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  paintOrder="stroke fill"
                  transform="rotate(3.2, 675, 368)"
                >
                  NGUYỄN THỊ MINH KHAI
                </text>

                {/* Đường Cách Mạng Tháng 8 (Diagonal crossing lower left) */}
                <path
                  d="M -20,250 L 260,540"
                  stroke="#D3D9E2"
                  strokeWidth="26"
                  fill="none"
                />
                <path
                  d="M -20,250 L 260,540"
                  stroke="#FFFFFF"
                  strokeWidth="22"
                  fill="none"
                />
                <text
                  x="120"
                  y="390"
                  fill="#475569"
                  fontFamily="system-ui, sans-serif"
                  fontSize="9.5"
                  fontWeight="700"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  paintOrder="stroke fill"
                  transform="rotate(45, 120, 390)"
                >
                  CÁCH MẠNG THÁNG 8
                </text>

                {/* Đường Bà Huyện Thanh Quan (Cross street left) */}
                <path
                  d="M 195,0 L 175,520"
                  stroke="#D3D9E2"
                  strokeWidth="24"
                  fill="none"
                />
                <path
                  d="M 195,0 L 175,520"
                  stroke="#FFFFFF"
                  strokeWidth="20"
                  fill="none"
                />
                <text
                  x="192"
                  y="85"
                  fill="#475569"
                  fontFamily="system-ui, sans-serif"
                  fontSize="9.5"
                  fontWeight="700"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  paintOrder="stroke fill"
                  transform="rotate(92, 192, 85)"
                >
                  BÀ HUYỆN THANH QUAN
                </text>

                {/* Đường Trương Định (Central cross street leading down into Tao Dan) */}
                <path
                  d="M 430,0 L 400,520"
                  stroke="#D3D9E2"
                  strokeWidth="26"
                  fill="none"
                />
                <path
                  d="M 430,0 L 400,520"
                  stroke="#FFFFFF"
                  strokeWidth="22"
                  fill="none"
                />
                <text
                  x="424"
                  y="85"
                  fill="#475569"
                  fontFamily="system-ui, sans-serif"
                  fontSize="9.5"
                  fontWeight="700"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  paintOrder="stroke fill"
                  transform="rotate(93, 424, 85)"
                >
                  TRƯƠNG ĐỊNH
                </text>

                {/* Đường Nam Kỳ Khởi Nghĩa (Cross street right) */}
                <path
                  d="M 695,0 L 670,520"
                  stroke="#D3D9E2"
                  strokeWidth="24"
                  fill="none"
                />
                <path
                  d="M 695,0 L 670,520"
                  stroke="#FFFFFF"
                  strokeWidth="20"
                  fill="none"
                />
                <text
                  x="690"
                  y="85"
                  fill="#475569"
                  fontFamily="system-ui, sans-serif"
                  fontSize="9.5"
                  fontWeight="700"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  paintOrder="stroke fill"
                  transform="rotate(93, 690, 85)"
                >
                  NAM KỲ KHỞI NGHĨA
                </text>

                {/* MAIN AXIS: ĐƯỜNG VÕ VĂN TẦN (Thoroughfare passing through venue) */}
                <path
                  d="M 0,175 L 800,230"
                  stroke="#CBD5E1"
                  strokeWidth="36"
                  fill="none"
                />
                <path
                  d="M 0,175 L 800,230"
                  stroke="#FFFFFF"
                  strokeWidth="30"
                  fill="none"
                />
                {/* Traffic flow arrows */}
                <path
                  d="M 120,183 L 130,184 L 120,188 M 300,195 L 310,196 L 300,200 M 520,211 L 530,212 L 520,216"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Road label */}
                <text
                  x="80"
                  y="166"
                  fill="#1E293B"
                  fontFamily="system-ui, sans-serif"
                  fontSize="12"
                  fontWeight="900"
                  letterSpacing="1.2"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  paintOrder="stroke fill"
                  transform="rotate(3.9, 80, 166)"
                >
                  ĐƯỜNG VÕ VĂN TẦN
                </text>

                {/* 4. WALKING PATHS (Connecting Parking Spots to 97 Võ Văn Tần) */}
                {/* Path 1: 123 VVT -> 97 VVT */}
                <path
                  d="M 215,188 L 405,201"
                  stroke={currentSelectedId === 'parking-1' ? '#E84118' : '#94A3B8'}
                  strokeWidth={currentSelectedId === 'parking-1' ? '4' : '2.5'}
                  strokeDasharray="6 6"
                  fill="none"
                  opacity={currentSelectedId === 'parking-1' ? '1' : '0.4'}
                />

                {/* Path 2: 60 VVT -> 97 VVT */}
                <path
                  d="M 610,217 L 445,204"
                  stroke={currentSelectedId === 'parking-2' ? '#E84118' : '#94A3B8'}
                  strokeWidth={currentSelectedId === 'parking-2' ? '4' : '2.5'}
                  strokeDasharray="6 6"
                  fill="none"
                  opacity={currentSelectedId === 'parking-2' ? '1' : '0.4'}
                />

                {/* Path 3: Tao Dan -> 97 VVT via Trương Định */}
                <path
                  d="M 390,370 L 418,215"
                  stroke={currentSelectedId === 'parking-3' ? '#E84118' : '#94A3B8'}
                  strokeWidth={currentSelectedId === 'parking-3' ? '4' : '2.5'}
                  strokeDasharray="6 6"
                  fill="none"
                  opacity={currentSelectedId === 'parking-3' ? '1' : '0.4'}
                />

                {/* 5. VENUE: ĐẠI HỌC MỞ TP.HCM (97 Võ Văn Tần) */}
                <g id="venueGroup" transform="translate(425, 195)">
                  {/* Building footprint */}
                  <rect
                    x="-65"
                    y="-50"
                    width="130"
                    height="45"
                    rx="8"
                    fill="url(#venueGrad)"
                    stroke="#C96885"
                    strokeWidth="2"
                    filter="url(#badgeShadow)"
                  />
                  {/* Building icon and text */}
                  <text
                    x="0"
                    y="-31"
                    fill="#8B2648"
                    fontFamily="system-ui, sans-serif"
                    fontSize="10.5"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    🎓 ĐH MỞ TP.HCM
                  </text>
                  <text
                    x="0"
                    y="-16"
                    fill="#C96885"
                    fontFamily="system-ui, sans-serif"
                    fontSize="9"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    ★ ĐIỂM TỔ CHỨC LỄ (97 VVT)
                  </text>

                  {/* Pulsing Target Dot */}
                  <circle cx="0" cy="5" r="7" fill="#C96885" />
                  <circle cx="0" cy="5" r="3.5" fill="#FFFFFF" />
                  <circle
                    cx="0"
                    cy="5"
                    r="12"
                    fill="none"
                    stroke="#C96885"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className={styles.markerPulse}
                  />
                </g>

                {/* 6. PARKING MARKERS (1, 2, 3) */}
                {PARKING_LOCATIONS.map((loc) => {
                  const isSelected = currentSelectedId === loc.id;
                  return (
                    <g
                      key={loc.id}
                      className={`${styles.markerGroup} ${isSelected ? styles.selected : ''}`}
                      transform={`translate(${loc.mapX}, ${loc.mapY})`}
                      onClick={(e) => handleMarkerClick(loc, e)}
                      onMouseEnter={() => setHoveredId(loc.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Stable hit-area: large invisible circle that never shifts */}
                      <circle cx="0" cy="-6" r="26" fill="transparent" pointerEvents="all" />

                      {/* Pulse wave ring when selected */}
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r="16"
                          fill="none"
                          stroke="#E84118"
                          strokeWidth="2.5"
                          className={styles.markerPulse}
                        />
                      )}

                      {/* Visual Pin Elements */}
                      <g className={styles.pinVisual}>
                        {/* Drop shadow pin base */}
                        <ellipse
                          cx="0"
                          cy="6"
                          rx="8"
                          ry="3.5"
                          fill="rgba(0,0,0,0.22)"
                        />

                        {/* Map Pin Vector Shape */}
                        <path
                          d="M 0,-26 C -12,-26 -16,-16 -16,-8 C -16,4 0,8 0,8 C 0,8 16,4 16,-8 C 16,-16 12,-26 0,-26 Z"
                          fill={isSelected ? '#D92D20' : '#EA4335'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          filter="url(#badgeShadow)"
                        />

                        {/* Inner White Badge with "P" and number */}
                        <circle cx="0" cy="-11" r="7.5" fill="#FFFFFF" />
                        <text
                          x="0"
                          y="-7.5"
                          fill="#D93025"
                          fontFamily="system-ui, sans-serif"
                          fontSize="9.5"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          P{loc.number}
                        </text>

                        {/* Permanent Mini Name Pill beneath pin */}
                        <g transform="translate(0, 16)">
                          <rect
                            x="-44"
                            y="0"
                            width="88"
                            height="18"
                            rx="4"
                            fill="#FFFFFF"
                            stroke={isSelected ? '#E84118' : '#CBD5E1'}
                            strokeWidth={isSelected ? '1.8' : '1.2'}
                            filter="url(#badgeShadow)"
                          />
                          <text
                            x="0"
                            y="12.5"
                            fill={isSelected ? '#D92D20' : '#1E293B'}
                            fontFamily="system-ui, sans-serif"
                            fontSize="8.2"
                            fontWeight="800"
                            textAnchor="middle"
                          >
                            {loc.number === 1
                              ? 'Báo NLĐ (123)'
                              : loc.number === 2
                              ? 'Hoà Bình (60)'
                              : 'CV Tao Đàn'}
                          </text>
                        </g>
                      </g>
                    </g>
                  );
                })}

                {/* 7. MAP ACCESSORIES: Compass & Scale */}
                {/* Compass in top right */}
                <g transform="translate(755, 35)">
                  <circle
                    cx="0"
                    cy="0"
                    r="15"
                    fill="#FFFFFF"
                    stroke="#D0D5DD"
                    strokeWidth="1"
                    filter="url(#badgeShadow)"
                  />
                  <path d="M 0,-11 L 4,3 L 0,1 L -4,3 Z" fill="#EA4335" />
                  <path d="M 0,11 L 4,3 L 0,1 L -4,3 Z" fill="#94A3B8" />
                  <text
                    x="0"
                    y="-13"
                    fill="#EA4335"
                    fontFamily="system-ui, sans-serif"
                    fontSize="7"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    N
                  </text>
                </g>

                {/* Scale bar in bottom left */}
                <g transform="translate(20, 500)">
                  <rect
                    x="0"
                    y="-12"
                    width="60"
                    height="14"
                    rx="3"
                    fill="rgba(255,255,255,0.9)"
                  />
                  <line
                    x1="5"
                    y1="-4"
                    x2="55"
                    y2="-4"
                    stroke="#475467"
                    strokeWidth="2"
                  />
                  <line
                    x1="5"
                    y1="-8"
                    x2="5"
                    y2="0"
                    stroke="#475467"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="55"
                    y1="-8"
                    x2="55"
                    y2="0"
                    stroke="#475467"
                    strokeWidth="1.5"
                  />
                  <text
                    x="30"
                    y="-1"
                    fill="#475467"
                    fontFamily="system-ui, sans-serif"
                    fontSize="7.5"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    100m
                  </text>
                </g>
              </svg>

              {/* Floating Tooltip if a location is selected/hovered */}
              {currentSelected && (
                <div
                  className={styles.mapTooltipBox}
                  style={{
                    left: `${(currentSelected.mapX / 800) * 100}%`,
                    top: `${(currentSelected.mapY / 520) * 100}%`,
                  }}
                  onMouseEnter={() => setHoveredId(currentSelected.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.tooltipArrow} />
                  <div className={styles.tooltipTitle}>
                    {currentSelected.number}. {currentSelected.name}
                  </div>
                  <div className={styles.tooltipAddress}>
                    {currentSelected.address}
                  </div>
                  <div className={styles.tooltipMeta}>
                    <span>{currentSelected.distance}</span>
                    <span>{currentSelected.walkingTime}</span>
                  </div>
                  <a
                    href={currentSelected.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.tooltipCtaButton}
                  >
                    <ExternalLink size={12} />
                    Mở Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
