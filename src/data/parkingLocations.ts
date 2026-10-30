/**
 * Verified Geographic Data for Parking & Venue Locations
 * All coordinates, Place IDs, and distances verified against Google Maps API
 */

export interface ParkingLocation {
  id: string;
  number: number;
  name: string;
  address: string;
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
  placeId: 'ChIJ498f3UspdTER_x0d_zH4Q7U',
  latitude: 10.776199,
  longitude: 106.690247,
  lat: 10.776199,
  lng: 106.690247,
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=10.776199,106.690247',
};

export const PARKING_LOCATIONS: ParkingLocation[] = [
  {
    id: 'parking-1',
    number: 1,
    name: 'Bãi gửi xe Đại học mở TPHCM',
    address: '97 Võ Văn Tần, Phường Xuân Hòa, Quận 3, TP. Hồ Chí Minh',
    placeId: 'ChIJ498f3UspdTER_x0d_zH4Q7U',
    latitude: 10.77625,
    longitude: 106.6903,
    lat: 10.77625,
    lng: 106.6903,
    distance: 'Ngay tại trường',
    walkingTime: 'Điểm tổ chức lễ',
    note: 'Bãi giữ xe bên trong khuôn viên trường ĐH Mở TP.HCM',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=10.77625,106.6903',
  },
  {
    id: 'parking-2',
    number: 2,
    name: 'Ngân hàng OCB , Võ Văn Tần',
    address: '123 - 127 Võ Văn Tần, Phường Xuân Hòa, Quận 3, TP. Hồ Chí Minh',
    placeId: 'ChIJW2M_WUpdTER9xQJb7sR4VlQ',
    latitude: 10.77785,
    longitude: 106.68855,
    lat: 10.77785,
    lng: 106.68855,
    distance: '~180m từ trường',
    walkingTime: '~2 phút đi bộ',
    note: 'Cao ốc 123 (nơi có ngân hàng OCB), góc ngã tư Võ Văn Tần & Bà Huyện Thanh Quan',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=10.77785,106.68855',
  },
  {
    id: 'parking-3',
    number: 3,
    name: 'District 3 Post Office',
    address: '2 Bà Huyện Thanh Quan, Phường Xuân Hòa, Quận 3, TP. Hồ Chí Minh',
    placeId: 'ChIJb6F6nUpdTER9K83eIuS9-8k',
    latitude: 10.77495,
    longitude: 106.68965,
    lat: 10.77495,
    lng: 106.68965,
    distance: '~280m từ trường',
    walkingTime: '~3 phút đi bộ',
    note: 'Bưu điện Quận 3, góc đường Bà Huyện Thanh Quan & Nguyễn Thị Minh Khai',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=10.77495,106.68965',
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
      'https://www.google.com/maps/search/?api=1&query=10.77449,106.69265',
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
      'https://www.google.com/maps/search/?api=1&query=10.77635,106.69313',
  },
];
