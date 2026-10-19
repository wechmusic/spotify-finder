# 📁 Proje Yapısı

```
spotify-distro-finder/
│
├── src/                          # Kaynak kodlar
│   ├── commands/                 # Discord bot komutları
│   │   └── check.js             # /check slash komutu
│   │
│   ├── data/                    # Veri ve algılama modülleri
│   │   ├── distributors.js      # Distributor tespit mantığı
│   │   └── licensors.js         # Licensor UUID veritabanı
│   │
│   ├── web/                     # Web arayüzü
│   │   ├── server.js            # Express.js sunucusu
│   │   └── public/              # Frontend dosyaları
│   │       ├── index.html       # Ana sayfa
│   │       ├── styles.css       # CSS stilleri
│   │       ├── app.js           # Frontend JavaScript
│   │       └── favicon.svg      # Site ikonu
│   │
│   ├── index.js                 # Discord bot ana dosyası
│   ├── spotify.js               # Spotify API entegrasyonu
│   ├── spClient.js              # Spotify Web API client
│   └── tokenManager.js          # Token yönetimi
│
├── node_modules/                 # Dependencies (gitignore'da)
│
├── .env                         # Environment variables (gitignore'da)
├── .env.example                 # Environment örneği
├── .gitignore                   # Git ignore kuralları
│
├── package.json                 # NPM paket tanımları
├── package-lock.json            # Locked dependencies
│
├── Procfile                     # Heroku deployment
├── vercel.json                  # Vercel deployment
│
├── README.md                    # Ana dokümantasyon
├── QUICKSTART.md                # Hızlı başlangıç rehberi
├── SETUP.md                     # Detaylı kurulum rehberi
├── DEPLOYMENT.md                # Production deployment
├── API.md                       # API dokümantasyonu
├── PROJECT_STRUCTURE.md         # Bu dosya
│
├── licensor.rtf                 # Licensor veritabanı (kaynak)
└── licensor_distributors.csv    # CSV formatında licensor verileri
```

## 📂 Klasör Detayları

### `/src/commands/`
Discord bot slash komutları burada. Her komut kendi dosyasında.

- **check.js**: Ana komut - Spotify linkinden distributor tespiti

### `/src/data/`
Veri işleme ve distributor tespit algoritmaları.

- **distributors.js**: ISRC/UPC/Label'dan distributor tespit mantığı
- **licensors.js**: Spotify licensor UUID'lerinden distributor eşleştirme

### `/src/web/`
Web arayüzü ve API.

- **server.js**: Express.js REST API sunucusu
- **public/**: Frontend statik dosyaları (HTML/CSS/JS)

### Ana Dosyalar

- **index.js**: Discord bot entry point
- **spotify.js**: Spotify API wrapper
- **spClient.js**: Spotify Web API client
- **tokenManager.js**: OAuth token yönetimi

## 🔧 Yapılandırma Dosyaları

| Dosya | Amacı |
|-------|-------|
| `.env` | Environment variables (gitignore'da) |
| `.env.example` | Örnek environment dosyası |
| `.gitignore` | Git'in görmezden geleceği dosyalar |
| `package.json` | NPM dependencies ve scriptler |
| `Procfile` | Heroku deployment ayarları |
| `vercel.json` | Vercel deployment ayarları |

## 📚 Dokümantasyon Dosyaları

| Dosya | İçerik |
|-------|--------|
| `README.md` | Genel bakış ve temel bilgiler |
| `QUICKSTART.md` | 5 dakikada başla |
| `SETUP.md` | Detaylı kurulum rehberi |
| `DEPLOYMENT.md` | Production'a çıkma rehberi |
| `API.md` | REST API dokümantasyonu |

## 🎯 Giriş Noktaları

### Web Uygulaması
```bash
npm run web
# Entry: src/web/server.js
# Frontend: src/web/public/index.html
```

### Discord Bot
```bash
npm start
# Entry: src/index.js
```

## 🔄 Veri Akışı

### Web Uygulaması:
```
Browser → index.html → app.js → 
POST /api/check → server.js → 
spotify.js → Spotify API → 
distributors.js → Response → Browser
```

### Discord Bot:
```
Discord User → /check command → 
check.js → spotify.js → 
Spotify API → distributors.js → 
Embed Response → Discord
```

## 📦 Ana Modüller

### Spotify API (`spotify.js`)
- Track bilgilerini Spotify'dan çeker
- ISRC, UPC, Label, Licensor bilgilerini alır
- Token yönetimini handle eder

### Distributor Detection (`data/distributors.js`)
- ISRC prefix kontrolü (en güvenilir)
- UPC prefix kontrolü
- Label adı kontrolü
- Licensor UUID kontrolü

### Web Server (`web/server.js`)
- Express.js REST API
- CORS support
- Static file serving
- Error handling

### Discord Bot (`index.js`)
- Discord.js v14
- Slash commands
- Embed messages
- Error handling

## 🎨 Frontend (`web/public/`)

### index.html
- Semantik HTML5
- SEO meta tags
- Responsive layout

### styles.css
- Modern CSS3
- Flexbox & Grid
- Animations
- Dark theme
- Mobile-first

### app.js
- Vanilla JavaScript
- Fetch API
- DOM manipulation
- Error handling

## 🔐 Güvenlik

- `.env` dosyası gitignore'da
- API keys asla frontend'de değil
- CORS yapılandırması
- Input validation
- Error message sanitization

## 📊 Dependencies

### Production
```json
{
  "express": "Web sunucusu",
  "cors": "CORS middleware",
  "discord.js": "Discord bot",
  "axios": "HTTP client",
  "dotenv": "Environment variables",
  "spotify-web-api-node": "Spotify API wrapper"
}
```

### Development
```json
{
  "nodemon": "Auto-restart on changes"
}
```

## 🚀 Deployment Hedefleri

| Platform | Entry Point | Port |
|----------|-------------|------|
| Vercel | `src/web/server.js` | Dynamic |
| Railway | `src/web/server.js` | `$PORT` |
| Heroku | `Procfile` | `$PORT` |
| Local | `npm run web` | 3000 |

## 📝 NPM Scripts

| Script | Komut | Açıklama |
|--------|-------|----------|
| `start` | `node src/index.js` | Discord bot başlat |
| `dev` | `nodemon src/index.js` | Bot dev mode |
| `web` | `node src/web/server.js` | Web sunucu başlat |
| `web:dev` | `nodemon src/web/server.js` | Web dev mode |

## 🎯 Modül Görevleri

### `spotify.js` - Spotify Entegrasyonu
- ✅ Track ID extraction
- ✅ Track metadata fetch
- ✅ ISRC/UPC extraction
- ✅ Token management

### `distributors.js` - Tespit Algoritması
- ✅ ISRC prefix matching
- ✅ UPC prefix matching
- ✅ Label name matching
- ✅ Confidence scoring

### `server.js` - Web API
- ✅ REST endpoints
- ✅ Static file serving
- ✅ Error handling
- ✅ CORS support

### `check.js` - Discord Command
- ✅ Slash command definition
- ✅ Input validation
- ✅ Embed formatting
- ✅ Error messages

---

**Bu yapı ile kod tabanı kolayca okunabilir ve genişletilebilir! 🚀**
