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
  address: '97 Võ Văn Tần, Xuân Hòa, Hồ Chí Minh 700000, Vietnam',
  mapX: 425,
  mapY: 195,
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=HCMC+Open+University+-+Campus+1,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh',
};

export const PARKING_LOCATIONS: ParkingLocation[] = [
  {
    id: 'parking-1',
    number: 1,
    name: 'Bãi gửi xe Đại học mở TPHCM',
    address: '97 Võ Văn Tần, Xuân Hòa, Hồ Chí Minh 700000, Vietnam',
    distance: 'Ngay tại trường',
    walkingTime: 'Điểm tổ chức lễ',
    note: 'Bãi gửi xe bên trong trường Đại học Mở TP.HCM',
    lat: 10.77785,
    lng: 106.69225,
    mapX: 425,
    mapY: 200,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=B%C3%A3i+g%E1%BB%ADi+xe+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+M%E1%BB%9F+TPHCM,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-2',
    number: 2,
    name: 'Ngân hàng OCB , Võ Văn Tần',
    address: '123 - 127 Võ Văn Tần, Xuân Hòa, Hồ Chí Minh 700000, Vietnam',
    distance: '~150m từ trường',
    walkingTime: '~2 phút đi bộ',
    note: 'Bãi gửi xe Ngân hàng OCB trên trục đường Võ Văn Tần',
    lat: 10.77885,
    lng: 106.69085,
    mapX: 205,
    mapY: 178,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Ng%C3%A2n+h%C3%A0ng+OCB,+123+-+127+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-3',
    number: 3,
    name: 'District 3 Post Office',
    address: '2 Bà Huyện Thanh Quan, Xuân Hòa, Hồ Chí Minh 72400, Vietnam',
    distance: '~260m từ trường',
    walkingTime: '~3 phút đi bộ',
    note: 'Bưu điện Quận 3, góc đường Bà Huyện Thanh Quan & Nguyễn Thị Minh Khai',
    lat: 10.77615,
    lng: 106.68995,
    mapX: 182,
    mapY: 330,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=District+3+Post+Office,+2+B%C3%A0+Huy%E1%BB%87n+Thanh+Quan,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-4',
    number: 4,
    name: 'Công viên Tao Đàn',
    address: 'Công viên Tao Đàn, TP. Hồ Chí Minh',
    distance: '~350m từ trường',
    walkingTime: '~4 phút đi bộ',
    note: 'Bãi giữ xe công viên rộng rãi, thoáng mát',
    lat: 10.77445,
    lng: 106.69175,
    mapX: 385,
    mapY: 410,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=C%C3%B4ng+vi%C3%AAn+Tao+%C4%90%C3%A0n,+B%E1%BA%BFn+Th%C3%A0nh,+Qu%E1%BA%ADn+1,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-5',
    number: 5,
    name: 'HCMC Cultural Palace for Labors',
    address: '55B Nguyễn Thị Minh Khai, Bến Thành, Hồ Chí Minh 700000, Vietnam',
    distance: '~320m từ trường',
    walkingTime: '~4 phút đi bộ',
    note: 'Cung Văn hóa Lao động TP.HCM, trên đường Nguyễn Thị Minh Khai',
    lat: 10.77395,
    lng: 106.69345,
    mapX: 535,
    mapY: 350,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=HCMC+Cultural+Palace+for+Labors,+55B+Nguy%E1%BB%85n+Th%E1%BB%8B+Minh+Khai,+B%E1%BA%BFn+Th%C3%A0nh,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
];
