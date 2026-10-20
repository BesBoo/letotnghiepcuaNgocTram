-- ==========================================================
-- SUPABASE SQL SCHEMA: THIỆP MỜI TỐT NGHIỆP CÁ NHÂN HÓA
-- Hướng dẫn: Copy toàn bộ nội dung file này và paste vào
-- mục "SQL Editor" trên trang quản trị Supabase của bạn, sau đó bấm RUN.
-- ==========================================================

-- 1. Tạo bảng guests
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,                -- Định danh trên link URL: ví dụ '1', 'tuan-anh', 'ban-linh'
    name VARCHAR(255) NOT NULL,                       -- Tên người nhận: 'Nguyễn Văn Tuấn'
    greeting VARCHAR(255) DEFAULT 'Gửi bạn thân yêu,',-- Lời xưng hô riêng: 'Gửi anh Tuấn thân yêu,', 'Gửi em Linh,'
    custom_message TEXT,                              -- Lời nhắn riêng cho bạn bè (nếu muốn)
    has_opened BOOLEAN DEFAULT FALSE,                 -- Tự động chuyển thành TRUE khi khách bấm mở thư
    opened_at TIMESTAMP WITH TIME ZONE,               -- Thời điểm khách bấm mở thư
    rsvp_status VARCHAR(50) DEFAULT 'pending',        -- 'attending' (Sẽ tham gia) | 'declined' (Bận) | 'pending'
    rsvp_note TEXT,                                   -- Lời nhắn/chúc khách gửi lại khi bấm xác nhận
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Kích hoạt Row Level Security (RLS) để bảo vệ bảng
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- 3. Tạo chính sách (Policy) cho phép đọc thông tin khách qua slug/id công khai
DROP POLICY IF EXISTS "Cho phép khách đọc thông tin thiệp" ON guests;
CREATE POLICY "Cho phép khách đọc thông tin thiệp"
ON guests FOR SELECT
USING (true);

-- 4. Tạo chính sách (Policy) cho phép cập nhật trạng thái mở thư và phản hồi RSVP
DROP POLICY IF EXISTS "Cho phép khách cập nhật mở thư và RSVP" ON guests;
CREATE POLICY "Cho phép khách cập nhật mở thư và RSVP"
ON guests FOR UPDATE
USING (true);

-- ==========================================================
-- 5. DỮ LIỆU MẪU (Thay đổi danh sách bạn bè của bạn tại đây)
-- ==========================================================
INSERT INTO guests (slug, name, greeting, custom_message)
VALUES 
    ('1', 'Nguyễn Văn Tuấn', 'Gửi anh Tuấn thân yêu,', 'Cảm ơn anh vì đã luôn đồng hành cùng em suốt những năm tháng đại học!'),
    ('2', 'Trần Thị Lan', 'Gửi chị Lan yêu quý,', 'Rất mong được gặp chị trong ngày lễ tốt nghiệp đặc biệt này 💕'),
    ('linh-dan', 'Khánh Linh', 'Gửi cô bạn thân Khánh Linh,', 'Thanh xuân này thật tuyệt vì có cậu bên cạnh!')
ON CONFLICT (slug) DO UPDATE 
SET 
    name = EXCLUDED.name,
    greeting = EXCLUDED.greeting,
    custom_message = EXCLUDED.custom_message;

-- Kiểm tra lại danh sách
SELECT id, slug, name, greeting, has_opened, rsvp_status FROM guests;
