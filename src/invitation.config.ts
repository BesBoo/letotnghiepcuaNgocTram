/**
 * INVITATION CONFIGURATION
 * ========================
 * Chỉnh sửa file này để thay đổi toàn bộ nội dung thiệp mời.
 * Tất cả thông tin sự kiện, ảnh kỷ niệm và nội dung hiển thị
 * đều được quản lý tại đây.
 */

export interface Memory {
  id: string;
  src: string;
  caption: string;
  alt: string;
  rotation?: number; // degrees
  aspectRatio?: string;
}

export interface InvitationConfig {
  // === THÔNG TIN NGƯỜI GỬI ===
  senderName: string;
  senderGreeting: string; // Cách xưng hô với người nhận

  // === TIÊU ĐỀ ===
  title: string;
  subtitle: string;

  // === LỜI MỜI ===
  invitationText: string[];

  // === THÔNG TIN SỰ KIỆN ===
  event: {
    date: string;
    time: string;
    endTime?: string;
    venue: string;
    address: string;
    contactPhone?: string;
    dressCode?: string;
    mapLink?: string;
    note?: string;
  };

  // === ĐỊA ĐIỂM GỬI XE ===
  parking?: {
    name: string;
    address: string;
  }[];

  // === ẢNH KỶ NIỆM ===
  memories: Memory[];

  // === GALLERY MOMENTS ===
  galleryPhotos: Memory[];

  // === LỜI NHẮN ===
  closingMessage: string;
  signOff: string;

  // === RSVP ===
  rsvp?: {
    enabled: boolean;
    contactMethod?: string; // e.g., "Nhắn tin cho mình qua Zalo nhé!"
    link?: string;
  };

  // === NHẠC NỀN ===
  music?: {
    enabled: boolean;
    src: string;
    volume?: number;
  };
}

const config: InvitationConfig = {
  // === THÔNG TIN NGƯỜI GỬI ===
  senderName: "Ngọc Trâm",
  senderGreeting: "Gửi bạn thân yêu",

  // === TIÊU ĐỀ ===
  title: "THIỆP MỜI TỐT NGHIỆP",
  subtitle: "A Letter to Our Youth",

  // === LỜI MỜI ===
  invitationText: [
    "Có những hành trình sẽ đẹp hơn khi có những người bạn thân thương cùng chứng kiến.",
    "Nhân dịp tốt nghiệp, mình rất mong bạn có thể đến chung vui và cùng lưu giữ thêm một kỷ niệm đẹp.",
  ],

  // === THÔNG TIN SỰ KIỆN ===
  event: {
    date: "07/11/2026",
    time: "[Giờ bắt đầu]",
    endTime: "[Giờ kết thúc]",
    venue: "Đại học mở TPHCM",
    address: "97 Võ Văn Tần, Xuân Hòa, Hồ Chí Minh 700000, Vietnam",
    contactPhone: "0901638309",
    mapLink: "https://www.google.com/maps/search/?api=1&query=HCMC+Open+University+-+Campus+1,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh",
    note: "Mình sẽ rất vui nếu được gặp bạn!",
  },

  // === ĐỊA ĐIỂM GỬI XE ===
  parking: [
    { name: "Tòa nhà Báo Người Lao động", address: "số 123 Võ Văn Tần" },
    { name: "Du Lịch Hoà Bình", address: "số 60 Võ Văn Tần" },
    { name: "Công viên Tao Đàn", address: "Cách trường khoảng vài phút đi bộ" },
  ],

  // === ẢNH KỶ NIỆM (Section: Our Memories) ===
  // Hiển thị 4 tấm ảnh kỷ niệm (3 ảnh bên trái và 1 ảnh lớn bên phải)
  memories: [
    {
      id: "mem-1",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/memory-01.png",
      caption: "Ngày đầu tiên bước vào giảng đường ",
      alt: "Kỷ niệm lễ tốt nghiệp",
      rotation: -2,
      aspectRatio: "1086/1448",
    },
    {
      id: "mem-2",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/memory-02.png",
      caption: "Những buổi chiều cùng nhau ôn bài ",
      alt: "Khoảnh khắc tốt nghiệp rực rỡ",
      rotation: 1.5,
      aspectRatio: "885/1777",
    },
    {
      id: "mem-3",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/memory-03.png",
      caption: "Chuyến đi chơi nhớ mãi không quên ",
      alt: "Kỷ niệm thanh xuân",
      rotation: -1.5,
      aspectRatio: "1037/1517",
    },
    {
      id: "mem-4",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/moment-01.png",
      caption: "Nụ cười rạng rỡ của thanh xuân ",
      alt: "Khoảnh khắc thanh xuân đáng nhớ",
      rotation: 1,
      aspectRatio: "1086/1448",
    },
  ],

  // === GALLERY MOMENTS (Section: Little Moments) ===
  galleryPhotos: [
    {
      id: "gal-1",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/moment-01.png",
      caption: "Một khoảnh khắc nhỏ, nhưng thật ấm áp",
      alt: "Khoảnh khắc đáng nhớ",
      aspectRatio: "1086/1448",
    },
    {
      id: "gal-2",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/moment-02.png",
      caption: "Thanh xuân là khi có bạn bên cạnh",
      alt: "Khoảnh khắc cùng bạn bè",
      aspectRatio: "1086/1448",
    },
    {
      id: "gal-3",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/moment-03.jpg",
      caption: "Cảm ơn vì những ngày tháng đó",
      alt: "Kỷ niệm dải sash tốt nghiệp",
      aspectRatio: "2560/1920",
    },
    {
      id: "gal-4",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/moment-04.jpg",
      caption: "Mãi là bạn nhé!",
      alt: "Khoảnh khắc đáng nhớ",
      rotation: -1.5,
      aspectRatio: "1920/2560",
    },
    {
      id: "gal-5",
      src: "https://agvvlhblinnizpwxduab.supabase.co/storage/v1/object/public/memories/moment-05.png",
      caption: "Những ngày tháng rực rỡ nhất",
      alt: "Khoảnh khắc vui vẻ",
      rotation: 1.5,
      aspectRatio: "1086/1448",
    },
  ],

  // === LỜI NHẮN ===
  closingMessage:
    "Cảm ơn vì đã luôn là một phần trong thanh xuân của mình. Hẹn gặp bạn ở một cột mốc thật đặc biệt nhé!",
  signOff: "Với tất cả yêu thương 💕",

  // === RSVP ===
  rsvp: {
    enabled: true,
    contactMethod: "Nhắn tin cho mình qua Zalo để xác nhận nhé!",
    link: "", // Optional: link to Google Form, etc.
  },

  // === NHẠC NỀN ===
  music: {
    enabled: true,
    src: "/music.mp3", // Đặt file nhạc music.mp3 vào thư mục public/
    volume: 0.6,
  },
};

export default config;
