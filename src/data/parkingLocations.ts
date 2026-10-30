/**
 * Verified Geographic Data for Parking & Venue Locations
 * All coordinates, Place IDs, and distances verified against Google Maps API
 */

export interface ParkingLocation {
  id: string;
  number: number;
  name: string;
  address: string;
  plusCode?: string;
  coordinatesDms?: string;
  placeId: string;
  latitude: number;
  longitude: number;
  lat: number; // backward compatibility alias
  lng: number; // backward compatibility alias
  distance: string;
  walkingTime: string;
  note?: string;
  googleMapsUrl: string;
}

export interface VenueLocation {
  name: string;
  shortName: string;
  address: string;
  plusCode?: string;
  placeId: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

export const VENUE_LOCATION: VenueLocation = {
  name: 'Trường Đại học Mở TP.HCM - Cơ sở 1',
  shortName: 'ĐH Mở TP.HCM (97 Võ Văn Tần)',
  address: '97 Võ Văn Tần, Phường Xuân Hòa (Phường 6 cũ), Quận 3, TP. Hồ Chí Minh',
  plusCode: 'QMGQ+FX Xuan Hoa, Ho Chi Minh, Vietnam',
  placeId: 'ChIJ498f3UspdTER_x0d_zH4Q7U',
  latitude: 10.776199,
  longitude: 106.690247,
  lat: 10.776199,
  lng: 106.690247,
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=HCMC+Open+University+-+Campus+1,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh',
};

export const PARKING_LOCATIONS: ParkingLocation[] = [
  {
    id: 'parking-1',
    number: 1,
    name: 'Bãi gửi xe Đại học mở TPHCM',
    address: '97 Võ Văn Tần, Phường Xuân Hòa, Quận 3, TP. Hồ Chí Minh',
    plusCode: 'QMGQ+FX Xuan Hoa, Ho Chi Minh, Vietnam',
    placeId: 'ChIJ498f3UspdTER_x0d_zH4Q7U',
    latitude: 10.77625,
    longitude: 106.6903,
    lat: 10.77625,
    lng: 106.6903,
    distance: 'Ngay tại trường',
    walkingTime: 'Điểm tổ chức lễ',
    note: 'Bãi giữ xe bên trong khuôn viên trường ĐH Mở TP.HCM',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=B%C3%A3i+g%E1%BB%ADi+xe+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+M%E1%BB%9F+TPHCM,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-2',
    number: 2,
    name: 'Ngân hàng OCB , Võ Văn Tần',
    address: '123 - 127 Võ Văn Tần, Xuân Hòa, Hồ Chí Minh 700000, Vietnam',
    plusCode: 'QMGQ+8W Xuan Hoa, Ho Chi Minh, Vietnam',
    coordinatesDms: '10°46\'33.0"N 106°41\'23.3"E',
    placeId: 'ChIJlfUtGT8vdTERMz9_7BDXLZI',
    latitude: 10.77582,
    longitude: 106.689798,
    lat: 10.77582,
    lng: 106.689798,
    distance: '~80m từ trường',
    walkingTime: '~1 phút đi bộ',
    note: 'CN TP. Hồ Chí Minh - Ngân hàng TMCP Phương Đông (OCB), Võ Văn Tần',
    googleMapsUrl:
      'https://www.google.com/maps/place/Ng%C3%A2n+h%C3%A0ng+TMCP+Ph%C6%B0%C6%A1ng+%C4%90%C3%B4ng+(OCB)+-+CN+TP.+H%E1%BB%93+Ch%C3%AD+Minh/@10.7758197,106.6897977,17z/data=!4m6!3m5!1s0x31752f3b192df595:0x922dd710ec7f2f33!8m2!3d10.7758197!4d106.6897977!16s%2Fg%2F11bccmdptq',
  },
  {
    id: 'parking-3',
    number: 3,
    name: 'District 3 Post Office',
    address: '2 Bà Huyện Thanh Quan, Xuân Hòa, Hồ Chí Minh 72400, Vietnam',
    plusCode: 'QMGR+44 Xuan Hoa, Ho Chi Minh, Vietnam',
    coordinatesDms: '10°46\'29.8"N 106°41\'22.7"E',
    placeId: 'ChIJb6F6nUpdTER9K83eIuS9-8k',
    latitude: 10.774944,
    longitude: 106.689639,
    lat: 10.774944,
    lng: 106.689639,
    distance: '~280m từ trường',
    walkingTime: '~3 phút đi bộ',
    note: 'Bưu điện Quận 3, góc đường Bà Huyện Thanh Quan & Nguyễn Thị Minh Khai',
    googleMapsUrl:
      'https://www.google.com/maps/place/10%C2%B046%2729.8%22N+106%C2%B041%2722.7%22E/@10.774944,106.689639,17z',
  },
  {
    id: 'parking-4',
    number: 4,
    name: 'Công viên Tao Đàn',
    address: 'Công viên Tao Đàn, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    placeId: 'ChIJb536iUldTER9n3qA1kF7U_0',
    latitude: 10.77449,
    longitude: 106.69265,
    lat: 10.77449,
    lng: 106.69265,
    distance: '~350m từ trường',
    walkingTime: '~4 phút đi bộ',
    note: 'Bãi gửi xe công viên rộng rãi (cổng Trương Định hoặc Nguyễn Thị Minh Khai)',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=C%C3%B4ng+vi%C3%AAn+Tao+%C4%90%C3%A0n,+B%E1%BA%BFn+Th%C3%A0nh,+Qu%E1%BA%ADn+1,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  {
    id: 'parking-5',
    number: 5,
    name: 'HCMC Cultural Palace for Labors',
    address: '55B Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    placeId: 'ChIJhXU3jEldTER9d3-XJ7K281Q',
    latitude: 10.77635,
    longitude: 106.69313,
    lat: 10.77635,
    lng: 106.69313,
    distance: '~320m từ trường',
    walkingTime: '~4 phút đi bộ',
    note: 'Cung Văn hóa Lao động TP.HCM, trên trục đường Nguyễn Thị Minh Khai',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=HCMC+Cultural+Palace+for+Labors,+55B+Nguy%E1%BB%85n+Th%E1%BB%8B+Minh+Khai,+B%E1%BA%BFn+Th%C3%A0nh,+H%E1%BB%93+Ch%C3%AD+Minh',
  },
];
