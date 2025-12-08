# Email Setup Instructions

Để gửi email hóa đơn tự động, bạn cần cấu hình Gmail App Password:

## Bước 1: Tạo Gmail App Password

1. Đăng nhập vào tài khoản Gmail của bạn (phibuinek@gmail.com)
2. Truy cập: https://myaccount.google.com/apppasswords
3. Chọn "Mail" và "Other (Custom name)"
4. Nhập tên: "Nail Web App"
5. Click "Generate"
6. Sao chép mật khẩu 16 ký tự được tạo

## Bước 2: Cấu hình Environment Variables

Thêm vào file `.env` của backend:

```env
EMAIL_USER=phibuinek@gmail.com
EMAIL_PASSWORD=<app-password-16-characters>
```

**Lưu ý:** 
- Không sử dụng mật khẩu Gmail thông thường
- Chỉ sử dụng App Password được tạo từ bước 1
- Giữ bảo mật file `.env` và không commit lên Git

## Bước 3: Khởi động lại server

Sau khi cấu hình, khởi động lại backend server để áp dụng thay đổi.

