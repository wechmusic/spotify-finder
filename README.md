# 🎵 Spotify Distributor Finder

Spotify track linkinden distributor'ı otomatik tespit eden **Web Uygulaması** ve **Discord Botu**.

## 🚀 Hızlı Başlangıç

```bash
# 1. Paketleri kur
npm install

# 2. .env dosyasını yapılandır
cp .env.example .env
# Spotify API anahtarlarını .env'ye ekle

# 3. Web sunucusunu başlat
npm run web

# Tarayıcıda aç: http://localhost:3000
```

**Detaylı kurulum:** [QUICKSTART.md](QUICKSTART.md) | **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md) | **API Dokümantasyonu:** [API.md](API.md)

## ✨ Özellikler

### 🌐 Web Arayüzü
- Modern, responsive tasarım
- Anlık sonuç görüntüleme
- Mobil uyumlu
- 7/24 herkese açık

### 🤖 Discord Bot
- `/check <spotify_link>` slash komutu
- Mesajda sadece Spotify linki varsa otomatik analiz
- Discord server entegrasyonu

### 🎯 Analiz Özellikleri
- ISRC, UPC ve label adından distributor tespiti
- Güven seviyesi gösterimi (High / Medium / Low)
- Çoklu tespit yöntemi
- Detaylı track bilgileri

## Desteklenen Distributorlar

DistroKid, TuneCore, CD Baby, Amuse, UnitedMasters, Believe Distribution, ONErpm, AWAL, Stem, Ditto Music, RouteNote, Spinnup, Kontor New Media, iGroove, Symphonic Distribution, Empire Distribution, Repost by SoundCloud, Universal Music Group, Sony Music, Warner Music Group

## Kurulum

### 1. Gereksinimler
- Node.js 18+
- Discord Bot Token
- Spotify Developer hesabı

### 2. Discord Bot Oluştur
1. [Discord Developer Portal](https://discord.com/developers/applications) → New Application
2. Bot → Add Bot → Token kopyala
3. OAuth2 → URL Generator → `bot` + `applications.commands` seç
4. Bot Permissions: `Send Messages`, `Embed Links`, `Read Message History`
5. Linki aç ve botu sunucuna ekle

### 3. Spotify API
1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) → Create App
2. Client ID ve Client Secret kopyala

### 4. Kurulum

```bash
npm install
cp .env.example .env
# .env dosyasını düzenle
```

### 5. .env Doldur

```env
DISCORD_TOKEN=your_discord_bot_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 6. Çalıştır

**Web Sunucusu (Herkes için):**
```bash
npm run web
```
Web arayüzü: http://localhost:3000

**Discord Bot:**
```bash
npm start
```

**Her İkisi İçin Development Mode:**
```bash
# Web için
npm run web:dev

# Discord bot için
npm run dev
```

## 🌐 Web Kullanımı

1. Tarayıcınızda http://localhost:3000 açın
2. Spotify track linkini yapıştırın
3. "Analiz Et" butonuna tıklayın
4. Sonuçları görüntüleyin!

**Desteklenen Link Formatları:**
- `https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`
- `spotify:track:4iV5W9uYEdYUVa79Axb7Rh`
- `4iV5W9uYEdYUVa79Axb7Rh` (sadece ID)

## 🤖 Discord Bot Kullanımı

**Slash komut:**
```
/check https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
```

**Otomatik tespit:**
Kanala sadece Spotify linki at, bot otomatik analiz eder.

## 🚀 Production Deployment

Web uygulamasını herkese açmak için:

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

### Heroku Deployment
```bash
# Heroku CLI kurulu olmalı
heroku create spotify-distro-finder
git push heroku main
heroku config:set SPOTIFY_CLIENT_ID=xxx
heroku config:set SPOTIFY_CLIENT_SECRET=xxx
```

### Railway Deployment
1. [Railway.app](https://railway.app) hesabı oluştur
2. GitHub reposunu bağla
3. Environment variables ekle
4. Deploy et

### .env Production Ayarları
```env
PORT=3000
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
# Discord değişkenleri web için gerekli değil
```

## Nasıl Çalışır?

1. **ISRC prefix** → En güvenilir yöntem. Her distributor'ın kendine özgü ISRC prefix'i var.
2. **UPC prefix** → İkinci yöntem. UPC barkod aralıkları distributora göre değişir.
3. **Label adı** → Son çare. Label adında distributor adı geçiyorsa tespit eder.
