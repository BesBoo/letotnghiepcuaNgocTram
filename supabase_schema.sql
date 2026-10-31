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
    url TEXT,                                         -- Tự động sinh link mời: https://letotnghiepcua-ngoc-tram.vercel.app/?to=...
    start_time VARCHAR(50),                           -- Giờ đón tiếp riêng cho khách: ví dụ '08:30' hoặc '08h30'
    end_time VARCHAR(50),                             -- Giờ kết thúc riêng cho khách: ví dụ '10:30' hoặc '11h00'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm các cột nếu bảng guests đã tồn tại từ trước
ALTER TABLE guests ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS start_time VARCHAR(50);
ALTER TABLE guests ADD COLUMN IF NOT EXISTS end_time VARCHAR(50);

-- 2. Tạo hàm tự động cập nhật URL khi thêm hoặc sửa slug
CREATE OR REPLACE FUNCTION auto_update_guest_url()
RETURNS TRIGGER AS $$
DECLARE
    base_url TEXT := 'https://letotnghiepcua-ngoc-tram.vercel.app';
BEGIN
    -- Chỉ cập nhật URL khi:
    -- 1. Thêm mới bản ghi (INSERT)
    -- 2. Hoặc slug bị sửa đổi (ảnh hưởng đến URL)
    -- 3. Hoặc ô url đang bị trống (NULL hoặc rỗng)
    IF TG_OP = 'INSERT' OR NEW.slug IS DISTINCT FROM OLD.slug OR NEW.url IS NULL OR NEW.url = '' THEN
        NEW.url := base_url || '/?to=' || NEW.slug;
    END IF;

    -- Nếu chỉ sửa name, greeting, rsvp... mà slug không đổi thì URL giữ nguyên
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gán Trigger chạy tự động trước khi INSERT hoặc UPDATE
DROP TRIGGER IF EXISTS trigger_auto_update_guest_url ON guests;
CREATE TRIGGER trigger_auto_update_guest_url
BEFORE INSERT OR UPDATE ON guests
FOR EACH ROW
EXECUTE FUNCTION auto_update_guest_url();

-- Cập nhật URL ngay lập tức cho các khách mời hiện có trong database
UPDATE guests
SET url = 'https://letotnghiepcua-ngoc-tram.vercel.app/?to=' || slug
WHERE url IS NULL OR url = '';

-- 3. Kích hoạt Row Level Security (RLS) để bảo vệ bảng
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
-- 5. DỮ LIỆU KHÁCH MỜI
-- ==========================================================
INSERT INTO guests (slug, name, greeting, custom_message)
VALUES 
    (
        'yen-nhi',
        'Yến Nhi',
        'Gửi Nhi xinh iu',
        'Một chặng đường khép lại, một hành trình mới mở ra.
Tui rất vui khi được chia sẻ với bà tin vui tốt nghiệp và cùng lưu giữ một cột mốc đáng nhớ trên hành trình trưởng thành của mình.
Mong bà sẽ có mặt để cùng tui lưu lại những khoảnh khắc thật đẹp này nha! 💗'
    ),
    (
        'bich-phuong',
        'Bích Phượng',
        'Gửi Phượng',
        NULL
    ),
    (
        'diem-my',
        'Diễm My',
        'Gửi My',
        NULL
    ),
    (
        'phuc-kiet',
        'Phúc Kiệt',
        'Gửi VPK',
        'Vậy là sắp tốt nghiệp ròi 🎓
Mời anh đến chụp hình với tui vào ngày tốt nghiệp, coi như lưu lại một chút kỷ niệm cho những năm tháng đại học của tụi mình nè.'
    ),
    (
        'ng-tram',
        'Ngọc Trâm',
        'Gửi Châm',
        'Vậy là sắp tốt nghiệp ròi 🎓
Mời 2 đến chụp hình với tui vào ngày tốt nghiệp, coi như lưu lại một chút kỷ niệm cho những năm tháng đại học của tụi mình nè. 💗'
    ),
    (
        'thuan',
        'Thuận',
        'Gửi Thuận',
        'Trân trọng kính mời bạn đến chung vui và lưu giữ những khoảnh khắc đáng nhớ cùng mình trong ngày tốt nghiệp.'
    ),
    (
        'dien',
        'Anh Điền',
        'Gửi anh Điền',
        'Trân trọng kính mời anh đến chung vui và lưu giữ những khoảnh khắc đáng nhớ cùng em trong ngày tốt nghiệp.'
    ),
    (
        'chị-han',
        'Chị Hân',
        'Gửi chị',
        'Sau những năm tháng học tập và nỗ lực, em đã sắp hoàn thành một chặng đường đáng nhớ của mình.
Em muốn chia sẻ niềm vui này cùng chị và lưu lại những khoảnh khắc đẹp trong ngày tốt nghiệp. 💗'
    ),
    (
        'duc',
        'Em Đức',
        'Hellu em',
        'Vậy là chị sắp hoàn thành một chặng đường thanh xuân rồi!
Mời em đến chụp hình và cùng chị lưu lại những khoảnh khắc đáng nhớ trong ngày tốt nghiệp này.'
    ),
    (
        'bo-thui',
        'Bô Thúi',
        'Gửi thúi bô',
        'Bi sắp tốt nghiệp ròi đó (bô cũng biết mà kaka). Bi hong biết nói gì với bô đâu, nma bi cảm ơn bô rất nhiều vì đã hỗ trợ, phụ bi quá tròi lun. Tốt nghiệp bi mà bô giúp nhiều hơn bi làm nữa hehe, nên là ún trà xanh sữa hong bi bao.'
    )
ON CONFLICT (slug) DO UPDATE 
SET 
    name = EXCLUDED.name,
    greeting = EXCLUDED.greeting,
    custom_message = EXCLUDED.custom_message;

-- Kiểm tra lại danh sách khách mời và link đã tự động sinh
SELECT id, slug, name, greeting, url, custom_message, has_opened, rsvp_status FROM guests ORDER BY id ASC;

