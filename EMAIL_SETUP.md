# Email Setup Instructions - Resend

Ứng dụng sử dụng **Resend** để gửi email (thay vì Gmail SMTP) vì Render.com free tier block SMTP connections.

## Bước 1: Tạo tài khoản Resend

1. Truy cập: https://resend.com
2. Đăng ký tài khoản miễn phí (Free tier: 3,000 emails/month)
3. Verify email của bạn

## Bước 2: Lấy API Key

1. Sau khi đăng nhập, vào **API Keys** trong dashboard
2. Click **Create API Key**
3. Đặt tên: "Pham's Nail Supplies"
4. Chọn quyền: **Sending access**
5. Click **Add**
6. **Sao chép API key ngay** (chỉ hiển thị 1 lần!)

## Bước 3: Cấu hình Environment Variables

Thêm vào file `.env` của backend (hoặc trên Render.com dashboard):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Lưu ý:** 
- Giữ bảo mật API key
- Không commit API key lên Git
- API key bắt đầu với `re_`

## Bước 4: Verify Domain (Tùy chọn - Khuyến nghị)

### Sử dụng Resend default domain (Ngay lập tức):
- Email sẽ gửi từ `onboarding@resend.dev`
- Hoạt động ngay, không cần verify

### Verify domain của bạn (Chuyên nghiệp hơn):
1. Vào **Domains** trong Resend dashboard
2. Click **Add Domain**
3. Nhập domain của bạn (ví dụ: `nailweb.com`)
4. Thêm DNS records như hướng dẫn
5. Sau khi verify, cập nhật `from` trong code:
   ```typescript
   from: "Pham's nail supplies <noreply@yourdomain.com>"
   ```

## Bước 5: Khởi động lại server

Sau khi cấu hình, khởi động lại backend server để áp dụng thay đổi.

## Troubleshooting

### Email không đến
- Kiểm tra spam folder
- Verify email address đúng
- Check logs để xem có error không
- Kiểm tra Resend dashboard → Logs để xem email status

### Lỗi "Invalid API key"
- Kiểm tra lại RESEND_API_KEY trong .env
- Đảm bảo API key bắt đầu với `re_`
- Tạo API key mới nếu cần

### Email bị reject
- Kiểm tra Resend dashboard → Logs
- Verify domain nếu dùng custom domain
- Đảm bảo email address hợp lệ

## Ưu điểm của Resend

✅ Hoạt động tốt trên Render.com free tier  
✅ Free tier: 3,000 emails/month  
✅ API-based, không bị block như SMTP  
✅ Dashboard để track emails  
✅ Dễ dàng setup và sử dụng
