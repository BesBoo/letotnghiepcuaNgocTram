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
}

const config: InvitationConfig = {
  // === THÔNG TIN NGƯỜI GỬI ===
  senderName: "[Tên của bạn]",
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
    date: "[Ngày tháng năm]",
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
  // Thay thế bằng ảnh thật của bạn
  memories: [
    {
      id: "mem-1",
      src: "/assets/memories/memory-01.webp",
      caption: "Ngày đầu tiên bước vào giảng đường ✨",
      alt: "Kỷ niệm ngày nhập học",
      rotation: -3,
    },
    {
      id: "mem-2",
      src: "/assets/memories/memory-02.webp",
      caption: "Những buổi chiều cùng nhau ôn bài ☕",
      alt: "Kỷ niệm cùng bạn bè học bài",
      rotation: 2,
    },
    {
      id: "mem-3",
      src: "/assets/memories/memory-03.webp",
      caption: "Chuyến đi chơi nhớ mãi không quên 🌸",
      alt: "Kỷ niệm chuyến đi chơi cùng bạn bè",
      rotation: -2,
    },
    {
      id: "mem-4",
      src: "/assets/memories/memory-04.webp",
      caption: "Những nụ cười không bao giờ phai 💛",
      alt: "Kỷ niệm cùng bạn bè",
      rotation: 3,
    },
  ],

  // === GALLERY MOMENTS (Section: Little Moments) ===
  galleryPhotos: [
    {
      id: "gal-1",
      src: "/assets/memories/moment-01.webp",
      caption: "Một khoảnh khắc nhỏ, nhưng thật ấm áp",
      alt: "Khoảnh khắc đáng nhớ",
    },
    {
      id: "gal-2",
      src: "/assets/memories/moment-02.webp",
      caption: "Thanh xuân là khi có bạn bên cạnh",
      alt: "Khoảnh khắc cùng bạn bè",
    },
    {
      id: "gal-3",
      src: "/assets/memories/moment-03.webp",
      caption: "Cảm ơn vì những ngày tháng đó",
      alt: "Khoảnh khắc đáng nhớ",
    },
    {
      id: "gal-4",
      src: "/assets/memories/moment-04.webp",
      caption: "Mãi là bạn nhé!",
      alt: "Khoảnh khắc cùng bạn bè",
      rotation: -2,
    },
    {
      id: "gal-5",
      src: "/assets/memories/moment-05.webp",
      caption: "Những ngày tháng rực rỡ nhất",
      alt: "Khoảnh khắc vui vẻ",
      rotation: 1,
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
};

export default config;
