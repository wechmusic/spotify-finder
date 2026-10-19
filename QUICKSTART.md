# ⚡ Hızlı Başlangıç

5 dakikada sistemi çalıştır ve test et!

## 🎯 Senaryo 1: Sadece Web Sitesi (En Basit)

Discord bot istemiyorsan, sadece web arayüzü için:

### Adım 1: Node.js Kur
https://nodejs.org/ → LTS indir ve kur

### Adım 2: Spotify API Al
1. https://developer.spotify.com/dashboard
2. "Create App" → İsim: "Distributor Finder"
3. **Client ID** ve **Client Secret** kopyala

### Adım 3: .env Oluştur
Proje klasöründe `.env` dosyası oluştur:

```env
SPOTIFY_CLIENT_ID=buraya_client_id_yapistir
SPOTIFY_CLIENT_SECRET=buraya_client_secret_yapistir
PORT=3000
```

### Adım 4: Başlat
```bash
npm install
npm run web
```

### Adım 5: Test Et
Tarayıcıda aç: http://localhost:3000

**Test Linki:**
```
https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
```

✅ **Tamamdır!** Web sitesi çalışıyor.

---

## 🤖 Senaryo 2: Discord Bot + Web Sitesi

Her ikisini de istiyorsan:

### Ekstra Adım: Discord Bot Token Al
1. https://discord.com/developers/applications
2. "New Application" → Bot → "Add Bot"
3. Token kopyala
4. OAuth2 → URL Generator → `bot` + `applications.commands` seç
5. Permissions: `Send Messages`, `Embed Links`
6. Linki kopyala ve botu sunucuna ekle

### .env Dosyasına Ekle
```env
DISCORD_TOKEN=buraya_discord_token_yapistir
SPOTIFY_CLIENT_ID=buraya_client_id_yapistir
SPOTIFY_CLIENT_SECRET=buraya_client_secret_yapistir
PORT=3000
```

### İki Terminalde Çalıştır

**Terminal 1 - Web:**
```bash
npm run web
```

**Terminal 2 - Discord Bot:**
```bash
npm start
```

✅ **Her ikisi de çalışıyor!**

---

## 🌐 İnternet'e Açma (Railway - 2 Dakika)

Arkadaşların da erişebilsin:

### Adım 1: GitHub'a Yükle
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin GITHUB_REPO_URL
git push -u origin main
```

### Adım 2: Railway'e Deploy
1. https://railway.app → GitHub ile giriş yap
2. "New Project" → "Deploy from GitHub repo"
3. Repo'nu seç

### Adım 3: Environment Variables
Railway'de:
- Settings → Variables
- `SPOTIFY_CLIENT_ID` ekle
- `SPOTIFY_CLIENT_SECRET` ekle

### Adım 4: URL'yi Al
- Settings → Domains
- Otomatik URL gelecek: `https://xxx.up.railway.app`

✅ **Artık herkes erişebilir! Link'i paylaş.**

---

## 🐛 Sorun mu Yaşıyorsun?

### "npm command not found"
→ Node.js kurmadın. https://nodejs.org/ → İndir ve kur

### "Spotify API error 401"
→ Client ID veya Secret yanlış. Tekrar kopyala

### "Port 3000 already in use"
→ `.env` dosyasında `PORT=3001` yap

### "Cannot find module"
→ `npm install` çalıştır

### Başka sorun?
→ SETUP.md dosyasına bak

---

## 📱 Test Linkleri

Sistemi test etmek için:

```
https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH
```

---

## ✅ Checklist

- [ ] Node.js kuruldu
- [ ] Spotify API anahtarları alındı
- [ ] `.env` dosyası oluşturuldu
- [ ] `npm install` çalıştırıldı
- [ ] `npm run web` ile test edildi
- [ ] http://localhost:3000 açıldı
- [ ] Bir şarkı test edildi
- [ ] (Opsiyonel) Railway'e deploy edildi

---

**Tamamdır! Sorular için SETUP.md veya DEPLOYMENT.md'ye bak.**
