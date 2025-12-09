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

### Tối thiểu (chỉ test với email của bạn):
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Đầy đủ (sau khi verify domain):
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_DOMAIN=yourdomain.com
RESEND_FROM_EMAIL=noreply
```

**Lưu ý:** 
- Giữ bảo mật API key
- Không commit API key lên Git
- API key bắt đầu với `re_`
- `RESEND_DOMAIN`: Domain đã verify trên Resend
- `RESEND_FROM_EMAIL`: Phần trước @ (ví dụ: noreply, hello, info)

## Bước 4: Verify Domain (BẮT BUỘC để gửi email đến khách hàng)

**⚠️ QUAN TRỌNG:** Resend chỉ cho phép gửi email đến chính email của bạn (phibuinek@gmail.com) khi dùng domain mặc định. Để gửi email đến khách hàng, bạn **PHẢI** verify domain.

### Cách verify domain:

1. **Vào Resend Dashboard** → **Domains**
2. **Click "Add Domain"**
3. **Nhập domain của bạn** (ví dụ: `nailweb.com` hoặc subdomain như `mail.nailweb.com`)
   - Nếu bạn dùng Vercel, có thể dùng domain của Vercel
   - Hoặc mua domain riêng (Namecheap, GoDaddy, etc.)
4. **Thêm DNS Records** như Resend hướng dẫn:
   - Thường cần thêm 3-4 records (TXT, MX, etc.)
   - Copy records từ Resend và thêm vào DNS provider của bạn
5. **Chờ verify** (thường mất 5-15 phút)
6. **Sau khi verify**, thêm vào `.env`:
   ```env
   RESEND_DOMAIN=yourdomain.com
   RESEND_FROM_EMAIL=noreply
   ```
   Email sẽ gửi từ: `noreply@yourdomain.com`

### Nếu chưa có domain:

**⚠️ LƯU Ý:** Vercel không cho phép dùng domain miễn phí (`*.vercel.app`) cho email. Bạn cần domain riêng.

**Option 1: Mua domain rẻ (KHUYẾN NGHỊ)**
- **Namecheap**: ~$1-10/năm (thường có mã giảm giá)
  - Truy cập: https://www.namecheap.com
  - Tìm domain rẻ (ví dụ: `.xyz`, `.online`, `.site`)
  - Mua và cấu hình DNS
- **GoDaddy**: ~$1-15/năm
- **Cloudflare Registrar**: Giá gốc, không markup

**Option 2: Dùng domain miễn phí (KHÔNG KHUYẾN NGHỊ)**
- **Freenom**: (.tk, .ml, .ga, .cf) - Miễn phí nhưng có thể bị spam filter chặn
- **No-IP**: Subdomain miễn phí
- ⚠️ **Cảnh báo**: Domain miễn phí thường bị email providers chặn, email dễ vào spam folder

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
