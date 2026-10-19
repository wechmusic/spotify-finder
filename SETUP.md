# 🚀 Kurulum Rehberi - Spotify Distributor Finder

## ⚠️ Ön Gereksinimler

### 1. Node.js Kurulumu
Node.js henüz sistemde yüklü değil. Kurulum için:

**İndirme Linki:** https://nodejs.org/
- **Önerilen:** LTS sürümü (20.x veya üzeri)
- İndirdikten sonra kurulum sihirbazını takip edin
- Tüm varsayılan ayarları kabul edin
- Kurulum bitince terminali yeniden başlatın

**Kurulum Kontrolü:**
```bash
node --version
npm --version
```

### 2. Paket Kurulumu
Node.js kurduktan sonra proje dizininde:

```bash
npm install
```

Bu komut tüm gerekli paketleri kuracak:
- express (web sunucusu)
- cors (güvenlik)
- discord.js (Discord bot)
- axios (HTTP istekleri)
- ve diğerleri...

## 🔑 API Anahtarları

### Spotify API
1. https://developer.spotify.com/dashboard adresine git
2. "Create App" butonuna tıkla
3. App ismini gir (örn: "Distributor Finder")
4. Redirect URI: `http://localhost:3000` ekle
5. **Client ID** ve **Client Secret** kopyala

### Discord Bot (opsiyonel - sadece Discord kullanacaksan)
1. https://discord.com/developers/applications adresine git
2. "New Application" tıkla
3. Bot → Add Bot → Token kopyala
4. OAuth2 → URL Generator → `bot` + `applications.commands` seç
5. Botu sunucuna ekle

## ⚙️ Yapılandırma

`.env` dosyasını oluştur (örnek .env.example'dan kopyala):

```bash
cp .env.example .env
```

Sonra `.env` dosyasını düzenle:

```env
# Spotify API (Zorunlu)
SPOTIFY_CLIENT_ID=buraya_client_id_yazin
SPOTIFY_CLIENT_SECRET=buraya_client_secret_yazin

# Discord Bot (Opsiyonel - sadece Discord botu için)
DISCORD_TOKEN=buraya_discord_token_yazin

# Web Server Portu (Opsiyonel, varsayılan: 3000)
PORT=3000
```

## ▶️ Çalıştırma

### Web Sunucusu (Herkese Açık)
```bash
npm run web
```

Tarayıcıda aç: **http://localhost:3000**

### Discord Bot
```bash
npm start
```

### Her İkisi Birden (Farklı terminallerde)
**Terminal 1:**
```bash
npm run web
```

**Terminal 2:**
```bash
npm start
```

## 🌐 İnternet'e Açma (7/24 Herkese Açık)

Şu anda sadece kendi bilgisayarında çalışıyor. Herkese açmak için:

### Seçenek 1: Vercel (Ücretsiz, Önerilen)
```bash
# Vercel CLI kur
npm install -g vercel

# Deploy et
vercel
```

### Seçenek 2: Railway (Ücretsiz)
1. https://railway.app adresine git
2. GitHub hesabınla giriş yap
3. "New Project" → "Deploy from GitHub repo"
4. Bu projeyi seç
5. Environment variables ekle (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
6. Deploy et

### Seçenek 3: Heroku (Ücretli)
```bash
# Heroku CLI kur: https://devcenter.heroku.com/articles/heroku-cli
heroku create spotify-distro-finder
git push heroku main
heroku config:set SPOTIFY_CLIENT_ID=xxx
heroku config:set SPOTIFY_CLIENT_SECRET=xxx
```

### Seçenek 4: Render (Ücretsiz)
1. https://render.com adresine git
2. "New Web Service" seç
3. GitHub reposunu bağla
4. Build Command: `npm install`
5. Start Command: `npm run web`
6. Environment variables ekle

## 🧪 Test Etme

### Web Arayüzünü Test Et
1. http://localhost:3000 aç
2. Örnek link: `https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`
3. "Analiz Et" butonuna tıkla
4. Sonuçları görüntüle

### API'yi Test Et (Postman veya curl)
```bash
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"track": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"}'
```

## 🐛 Sorun Giderme

### Port zaten kullanılıyor
`.env` dosyasında farklı bir port dene:
```env
PORT=3001
```

### Spotify API hatası
- Client ID ve Secret doğru mu kontrol et
- Spotify Developer Dashboard'da uygulamanın aktif olduğundan emin ol

### Dependencies hataları
```bash
# node_modules ve package-lock.json sil, tekrar kur
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobil Erişim (Aynı WiFi)

Aynı WiFi'deyseler, bilgisayarın IP adresiyle erişebilirler:

1. IP adresini bul:
```bash
ipconfig
```

2. IPv4 adresini al (örn: 192.168.1.100)

3. Mobil cihazdan:
```
http://192.168.1.100:3000
```

## 🎯 Sonraki Adımlar

- [ ] Node.js kur
- [ ] `npm install` çalıştır
- [ ] Spotify API anahtarları al
- [ ] `.env` dosyasını yapılandır
- [ ] `npm run web` ile test et
- [ ] Railway/Vercel'e deploy et
- [ ] Herkese link paylaş! 🚀

## 💡 İpuçları

- **Geliştirme modu:** `npm run web:dev` - Değişikliklerde otomatik yenilenir
- **Logs:** Sunucu loglarını terminalde görebilirsin
- **HTTPS:** Production'da SSL sertifikası otomatik gelir (Vercel, Railway, vb.)
- **Custom Domain:** Deploy platformundan özel domain ekleyebilirsin

## 📞 Destek

Sorun yaşarsan:
1. `.env` dosyasının doğru yapılandırıldığından emin ol
2. Node.js versiyonunu kontrol et (18+ olmalı)
3. Konsol loglarına bak
4. Port çakışması var mı kontrol et

---

**Hazır mısın? Node.js'i kur ve başlayalım! 🚀**
