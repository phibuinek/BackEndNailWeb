# Email Setup Instructions

Để gửi email hóa đơn tự động, bạn cần cấu hình Gmail App Password:

## Bước 1: Tạo Gmail App Password

1. Đăng nhập vào tài khoản Gmail của bạn (phibuinek@gmail.com)
2. Truy cập: https://myaccount.google.com/apppasswords
3. Chọn "Mail" và "Other (Custom name)"
4. Nhập tên: "Pham's mail supplies" (hoặc bất kỳ tên nào bạn muốn - không ảnh hưởng)
5. Click "Generate"
6. Sao chép mật khẩu 16 ký tự được tạo

## Bước 2: Cấu hình Environment Variables

Thêm vào file `.env` của backend (hoặc trên Render.com dashboard):

```env
EMAIL_USER=phibuinek@gmail.com
EMAIL_PASSWORD=<app-password-16-characters>
```

**Lưu ý:** 
- Không sử dụng mật khẩu Gmail thông thường
- Chỉ sử dụng App Password được tạo từ bước 1
- Giữ bảo mật file `.env` và không commit lên Git

## Bước 3: Vấn đề với Render.com Free Tier

**⚠️ QUAN TRỌNG:** Render.com free tier có thể block SMTP connections. Nếu gặp lỗi "Connection timeout", bạn có các lựa chọn:

### Option 1: Sử dụng Email Service khác (Khuyến nghị)
- **Resend** (Free tier: 3,000 emails/month): https://resend.com
- **SendGrid** (Free tier: 100 emails/day): https://sendgrid.com
- **Mailgun** (Free tier: 5,000 emails/month): https://mailgun.com

### Option 2: Upgrade Render.com
- Upgrade lên paid plan để có outbound SMTP access

### Option 3: Sử dụng Background Job
- Queue email sending để retry sau nếu fail
- Hoặc gửi email từ local machine/server khác

## Bước 4: Khởi động lại server

Sau khi cấu hình, khởi động lại backend server để áp dụng thay đổi.

## Troubleshooting

### Lỗi "Connection timeout"
- Render.com free tier block SMTP
- Giải pháp: Dùng email service (Resend/SendGrid) hoặc upgrade plan

### Lỗi "Invalid login"
- Kiểm tra lại App Password
- Đảm bảo 2-Step Verification đã bật trên Gmail

### Email không đến
- Kiểm tra spam folder
- Verify email address đúng
- Check logs để xem có error không
