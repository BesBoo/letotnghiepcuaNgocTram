export interface ParkingLocation {
  id: string;
  number: number;
  name: string;
  address: string;
  distance: string;
  walkingTime: string;
  note?: string;
  lat: number;
  lng: number;
  // Position coordinates inside the SVG map canvas (viewBox 0 0 800 520)
  mapX: number;
  mapY: number;
  googleMapsUrl: string;
}

export interface VenueLocation {
  name: string;
  shortName: string;
  address: string;
  time?: string;
  mapX: number;
  mapY: number;
  googleMapsUrl: string;
}

export const VENUE_LOCATION: VenueLocation = {
  name: 'Trường Đại học Mở TP.HCM - Cơ sở 1',
  shortName: 'ĐH Mở TP.HCM (97 Võ Văn Tần)',
  address: '97 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
  mapX: 430,
  mapY: 200,
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=HCMC+Open+University+-+Campus+1,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh',
};

export const PARKING_LOCATIONS: ParkingLocation[] = [
  {
    id: 'parking-1',
    number: 1,
    name: 'Tòa nhà Báo Người Lao Động',
    address: 'Số 123 Võ Văn Tần, TP. Hồ Chí Minh',
    distance: '~150m từ trường',
    walkingTime: '~2 phút đi bộ',
    note: 'Bãi gửi xe trong tòa nhà có mái che, an toàn',
    lat: 10.77885,
    lng: 106.69085,
    mapX: 205,
    mapY: 178,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=T%C3%B2a+nh%C3%A0+B%C3%A1o+Ng%C6%B0%E1%BB%9Di+Lao+%C4%90%E1%BB%99ng,+123+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Ph%C6%B0%E1%BB%9Dng+6,+Qu%E1%BA%ADn+3,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-2',
    number: 2,
    name: 'Du Lịch Hoà Bình',
    address: 'Số 60 Võ Văn Tần, TP. Hồ Chí Minh',
    distance: '~250m từ trường',
    walkingTime: '~3 phút đi bộ',
    note: 'Bãi giữ xe rộng rãi, thuận tiện trên trục Võ Văn Tần',
    lat: 10.77665,
    lng: 106.69385,
    mapX: 620,
    mapY: 220,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Du+L%E1%BB%8Bch+H%C3%B2a+B%C3%ACnh,+60+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Ph%C6%B0%E1%BB%9Dng+6,+Qu%E1%BA%ADn+3,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-3',
    number: 3,
    name: 'Công viên Tao Đàn',
    address: 'Công viên Tao Đàn, TP. Hồ Chí Minh',
    distance: '~350m từ trường',
    walkingTime: '~4 phút đi bộ',
    note: 'Bãi giữ xe công viên thoáng mát, nhiều chỗ',
    lat: 10.77445,
    lng: 106.69175,
    mapX: 390,
    mapY: 375,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=C%C3%B4ng+vi%C3%AAn+Tao+%C4%90%C3%A0n,+B%E1%BA%BFn+Th%C3%A0nh,+Qu%E1%BA%ADn+1,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
];
