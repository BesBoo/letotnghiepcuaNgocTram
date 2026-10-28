export const config = {
  runtime: 'nodejs',
};

const RECIPIENTS = ['tranduyduc9679@gmail.com', 'truongtram2k4@gmail.com'];
const VALID_CHOICES = ['9:00–11:00', '11:00–13:00', 'Mình bận rồi'];

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, error: 'Dữ liệu JSON không hợp lệ' });
      }
    }

    const { choice, message, guestName, slug } = body || {};

    if (!choice || !VALID_CHOICES.includes(choice)) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng chọn 1 trong 3 phương án: 9:00–11:00, 11:00–13:00 hoặc Mình bận rồi',
      });
    }

    const cleanMessage = typeof message === 'string' ? message.slice(0, 500).trim() : '';
    const cleanGuestName = typeof guestName === 'string' && guestName.trim() ? guestName.trim() : 'Khách mời thân thương';
    const cleanSlug = typeof slug === 'string' ? slug.trim() : '';
    const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const isDeclined = choice === 'Mình bận rồi';
    const subject = isDeclined
      ? `[Thiệp tốt nghiệp] ${cleanGuestName} báo bận không thể đến`
      : `[Thiệp tốt nghiệp] Xác nhận tham dự – ${cleanGuestName} (${choice})`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #4A3E3D; background-color: #FFF5F7; margin: 0; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(201, 104, 133, 0.15); border: 1px solid #FAD2DE; }
          .header { background: linear-gradient(135deg, #F3A1B5, #E27396); padding: 28px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
          .header p { margin: 0; font-size: 14px; opacity: 0.95; }
          .content { padding: 28px 24px; }
          .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 20px; ${isDeclined ? 'background: #F0E6E8; color: #8C6D75;' : 'background: #FFE4EC; color: #C96885; border: 1px solid #F3A1B5;'} }
          .field { margin-bottom: 16px; }
          .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8C6D75; font-weight: 600; margin-bottom: 4px; }
          .field-value { font-size: 16px; color: #2B2124; font-weight: 500; }
          .message-box { background: #FFF9FA; border-left: 4px solid #E27396; padding: 14px 16px; border-radius: 4px; margin-top: 6px; font-style: italic; color: #4A3E3D; }
          .footer { padding: 18px 24px; background: #FFF0F4; text-align: center; font-size: 12px; color: #8C6D75; border-top: 1px dashed #FAD2DE; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 Xác Nhận Lời Mời Tốt Nghiệp</h1>
            <p>Lễ tốt nghiệp của Ngọc Trâm</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="badge">${isDeclined ? 'Tiếc quá, khách báo bận 💔' : `Sẽ tham dự: ${choice} 💕`}</span>
            </div>

            <div class="field">
              <div class="field-label">Tên khách mời</div>
              <div class="field-value">${cleanGuestName} ${cleanSlug ? `<span style="font-size: 13px; color: #8C6D75;">(slug: ${cleanSlug})</span>` : ''}</div>
            </div>

            <div class="field">
              <div class="field-label">Lựa chọn tham dự</div>
              <div class="field-value" style="color: ${isDeclined ? '#8C6D75' : '#C96885'}; font-weight: 700;">
                ${choice}
              </div>
            </div>

            <div class="field">
              <div class="field-label">Lời nhắn từ khách mời</div>
              <div class="message-box">
                ${cleanMessage ? cleanMessage.replace(/\n/g, '<br/>') : '<em>(Khách không để lại lời nhắn)</em>'}
              </div>
            </div>

            <div class="field">
              <div class="field-label">Thời gian phản hồi</div>
              <div class="field-value" style="font-size: 14px; color: #8C6D75;">${timestamp}</div>
            </div>
          </div>
          <div class="footer">
            Email tự động gửi từ hệ thống Thiệp Mời Tốt Nghiệp Ngọc Trâm.<br/>
            Hẹn gặp tại Đại học Mở TP.HCM (97 Võ Văn Tần) vào ngày 07/11/2026.
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Update Supabase if configured
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && cleanSlug) {
      try {
        const updateUrl = `${supabaseUrl}/rest/v1/guests?slug=eq.${encodeURIComponent(cleanSlug)}`;
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            rsvp_status: choice,
            rsvp_note: cleanMessage,
          }),
        });
      } catch (dbErr) {
        console.warn('Supabase RSVP update warning:', dbErr);
      }
    }

    // 2. Send Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    if (resendApiKey) {
      let resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `Thiệp Tốt Nghiệp <${emailFrom}>`,
          to: RECIPIENTS,
          subject,
          html: emailHtml,
        }),
      });

      // If in Resend free test mode without verified domain, Resend restricts to account owner
      if (!resendRes.ok) {
        const errData = await resendRes.json().catch(() => ({}));
        if (typeof errData?.message === 'string' && errData.message.includes('You can only send testing emails to your own email address')) {
          console.log('Resend test mode detected: Sending to primary verified email tranduyduc9679@gmail.com');
          resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: `Thiệp Tốt Nghiệp <${emailFrom}>`,
              to: ['tranduyduc9679@gmail.com'],
              subject,
              html: emailHtml,
            }),
          });
        }

        if (!resendRes.ok) {
          const finalErr = await resendRes.json().catch(() => ({}));
          console.error('Resend error:', finalErr);
          return res.status(500).json({
            success: false,
            error: `Lỗi gửi email qua Resend: ${finalErr.message || resendRes.statusText}`,
          });
        }
      }

      const resendData = await resendRes.json();
      return res.status(200).json({
        success: true,
        message: 'Thông tin đã được gửi thành công!',
        id: resendData.id,
      });
    }

    // If RESEND_API_KEY is not configured
    return res.status(500).json({
      success: false,
      error: 'Hệ thống email chưa được cấu hình biến môi trường RESEND_API_KEY trên server.',
      missingEnv: 'RESEND_API_KEY',
    });
  } catch (error: any) {
    console.error('Server error in /api/rsvp:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Lỗi server xử lý RSVP',
    });
  }
}
