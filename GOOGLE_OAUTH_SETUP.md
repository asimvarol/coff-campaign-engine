# Google OAuth Setup Guide

## 🔐 Google OAuth Credentials Nasıl Alınır?

### 1. Google Cloud Console'a Git
https://console.cloud.google.com

### 2. Yeni Proje Oluştur (veya mevcut projeyi seç)
- Sol üst köşeden proje seç
- "New Project" tıkla
- Proje adı: "Coff Campaign Engine"
- Create tıkla

### 3. OAuth Consent Screen Ayarla
- Sol menüden **APIs & Services** > **OAuth consent screen**
- User Type: **External** seç
- Create tıkla

**App Information**:
- App name: `Coff Campaign Engine`
- User support email: (kendi emailin)
- Developer contact: (kendi emailin)
- Save and Continue

**Scopes**: Skip (Save and Continue)
**Test users**: Skip (Save and Continue)
**Summary**: Save

### 4. OAuth 2.0 Credentials Oluştur
- Sol menüden **APIs & Services** > **Credentials**
- **+ CREATE CREDENTIALS** > **OAuth client ID** tıkla

**Application type**: Web application

**Name**: `Coff Campaign Engine - Local`

**Authorized JavaScript origins**:
```
http://localhost:3001
```

**Authorized redirect URIs**:
```
http://localhost:3001/api/auth/callback/google
```

**CREATE** tıkla

### 5. Credentials'ı Kopyala
Açılan popup'tan:
- **Client ID** → kopyala
- **Client Secret** → kopyala

### 6. .env Dosyasına Ekle
`apps/web/.env` veya root `.env` dosyasını aç:

```env
# NextAuth Google OAuth
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
NEXTAUTH_SECRET="generate-random-secret-with-command-below"
NEXTAUTH_URL="http://localhost:3001"
```

**NEXTAUTH_SECRET oluştur**:
```bash
openssl rand -base64 32
```

### 7. Dev Server'ı Yeniden Başlat
```bash
bun run dev
```

### 8. Test Et
1. http://localhost:3001/login git
2. "Google" butonuna tıkla
3. Google hesabını seç
4. İzin ver
5. /campaigns sayfasına yönlendirilmelisin

---

## 🌐 Production için (Cloudflare Tunnel / Deploy)

### Authorized redirect URIs'e ekle:
```
https://your-domain.com/api/auth/callback/google
https://your-cloudflare-tunnel.trycloudflare.com/api/auth/callback/google
```

### Environment Variables'ı güncelle:
```env
NEXTAUTH_URL="https://your-domain.com"
```

---

## 🐛 Troubleshooting

### Hata: "redirect_uri_mismatch"
**Çözüm**: Google Console'da Authorized redirect URIs'i kontrol et. Tam olarak eşleşmeli:
```
http://localhost:3001/api/auth/callback/google
```

### Hata: "access_denied"
**Çözüm**: OAuth Consent Screen'de Test Users'a kendi emailini ekle

### Hata: "NEXTAUTH_SECRET not found"
**Çözüm**: .env dosyasına NEXTAUTH_SECRET ekle (openssl rand -base64 32)

---

## ✅ Başarıyla Kurulduysa

Login sayfasında Google butonu çalışır ve:
1. Google login popup'ı açılır
2. Hesap seçilir
3. İzinler verilir
4. /campaigns sayfasına yönlendirilir
5. Session aktif olur (next-auth)

---

**Not**: Bu sadece development için. Production'da OAuth App'i "Published" yapman gerekir (Google Review süreci).
