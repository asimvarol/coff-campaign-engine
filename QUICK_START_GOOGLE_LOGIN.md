# ⚡ Google Login - Hızlı Başlangıç (5 Dakika)

## 🚀 En Hızlı Yol (Test için)

### 1. Google Cloud Console'a Git
🔗 https://console.cloud.google.com/apis/credentials

### 2. "CREATE CREDENTIALS" → "OAuth client ID"

### 3. Bilgileri Doldur:
```
Application type: Web application
Name: Coff Campaign Local

Authorized redirect URIs:
http://localhost:3001/api/auth/callback/google
https://basename-strongly-walks-tuner.trycloudflare.com/api/auth/callback/google
```

### 4. Client ID ve Secret'ı Kopyala
✅ Client ID: `123456789-abc...apps.googleusercontent.com`  
✅ Client Secret: `GOCSPX-abc123...`

### 5. .env Dosyasını Güncelle
```bash
cd /Users/dev/coff-campaign-engine
```

`.env` dosyasını aç ve şunları ekle/güncelle:

```env
# Google OAuth
GOOGLE_CLIENT_ID="123456789-abc...apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123..."
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3001"
```

### 6. Dev Server'ı Yeniden Başlat
```bash
# Mevcut server'ı durdur (Ctrl+C)
bun run dev
```

### 7. Test Et! 🎉
```
http://localhost:3001/login
```

"Google" butonuna tıkla → Hesap seç → /campaigns'e yönlendirileceksin!

---

## 🔧 OAuth Consent Screen (İlk Kez Yapıyorsan)

Eğer "OAuth Consent Screen" hatası alırsan:

1. **APIs & Services** > **OAuth consent screen** git
2. **External** seç
3. Sadece zorunlu alanları doldur:
   - App name: `Coff Campaign Engine`
   - User support email: (senin emailin)
   - Developer contact: (senin emailin)
4. **Save and Continue** × 3 (scope/test users skip)
5. Tekrar credentials'a dön

---

## ✅ Çalışıyor mu Kontrol Et

### Başarılı Login:
1. Google popup açılır
2. Hesap seçilir
3. → `/campaigns` sayfasına yönlendirilir
4. Console'da hata yok

### Hata Alıyorsan:

**"redirect_uri_mismatch"**
→ Redirect URI'yi kontrol et, tam eşleşmeli:
```
http://localhost:3001/api/auth/callback/google
```

**"access_blocked"**
→ OAuth Consent Screen'de **Test users** kısmına emailini ekle

**"Client ID not found"**
→ .env dosyasını kontrol et, GOOGLE_CLIENT_ID doğru mu?

**"Invalid client secret"**
→ GOOGLE_CLIENT_SECRET'ı tekrar kopyala

---

## 🌐 Cloudflare Tunnel için

Cloudflare tunnel kullanıyorsan:

1. Google Console → Credentials → OAuth 2.0 Client ID
2. **Authorized redirect URIs**'e ekle:
```
https://your-tunnel-url.trycloudflare.com/api/auth/callback/google
```

3. .env'i güncelle:
```env
NEXTAUTH_URL="https://your-tunnel-url.trycloudflare.com"
```

4. Dev server restart

---

## 🎯 Özet Checklist

- [ ] Google Cloud Console'da proje var
- [ ] OAuth Client ID oluşturuldu
- [ ] Redirect URI doğru: `http://localhost:3001/api/auth/callback/google`
- [ ] .env dosyasında GOOGLE_CLIENT_ID var
- [ ] .env dosyasında GOOGLE_CLIENT_SECRET var
- [ ] .env dosyasında NEXTAUTH_SECRET var (openssl rand -base64 32)
- [ ] .env dosyasında NEXTAUTH_URL="http://localhost:3001"
- [ ] Dev server yeniden başlatıldı
- [ ] /login sayfasında Google butonu var
- [ ] Tıklayınca Google popup açılıyor

Hepsi ✅ ise → **ÇALIŞIYOR!** 🎉

---

**Sorun mu var?** GOOGLE_OAUTH_SETUP.md'deki detaylı kılavuza bak.
