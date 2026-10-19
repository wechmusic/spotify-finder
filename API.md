# 📡 API Dokümantasyonu

Spotify Distributor Finder REST API kullanım rehberi.

## Base URL

**Local Development:**
```
http://localhost:3000
```

**Production:**
```
https://your-deployment-url.com
```

---

## Endpoints

### 1. Health Check

Sunucunun çalışıp çalışmadığını kontrol eder.

**Endpoint:** `GET /api/health`

**Request:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Track Analysis

Spotify track'inin distributor'ını analiz eder.

**Endpoint:** `POST /api/check`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "track": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
}
```

**Desteklenen Track Formatları:**
- Full URL: `https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`
- Spotify URI: `spotify:track:4iV5W9uYEdYUVa79Axb7Rh`
- Track ID: `4iV5W9uYEdYUVa79Axb7Rh`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "track": {
      "id": "4iV5W9uYEdYUVa79Axb7Rh",
      "name": "Shape of You",
      "artists": "Ed Sheeran",
      "album": "÷ (Deluxe)",
      "albumImageUrl": "https://i.scdn.co/image/...",
      "releaseDate": "2017-01-06",
      "durationMs": 233713,
      "isrc": "GBAHS1600214",
      "upc": "00190295859251",
      "label": "Atlantic Records UK",
      "spotifyUrl": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
    },
    "analysis": {
      "distributor": "Universal Music Group",
      "confidence": "High",
      "method": "ISRC prefix"
    }
  }
}
```

**Error Response (400 - Bad Request):**
```json
{
  "success": false,
  "error": "Geçersiz Spotify track linki veya ID'si"
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "error": "Track bulunamadı"
}
```

**Error Response (429 - Rate Limit):**
```json
{
  "success": false,
  "error": "Rate limit aşıldı. Lütfen biraz bekleyin"
}
```

**Error Response (503 - Service Unavailable):**
```json
{
  "success": false,
  "error": "Spotify API kimlik doğrulama hatası"
}
```

---

## Response Fields

### Track Object
| Field | Type | Description |
|-------|------|-------------|
| id | string | Spotify track ID |
| name | string | Şarkı adı |
| artists | string | Sanatçı(lar) |
| album | string | Albüm adı |
| albumImageUrl | string | Albüm kapak görseli URL'si |
| releaseDate | string | Çıkış tarihi (YYYY-MM-DD) |
| durationMs | number | Şarkı süresi (milisaniye) |
| isrc | string | ISRC kodu (null olabilir) |
| upc | string | UPC barkod (null olabilir) |
| label | string | Plak şirketi adı (null olabilir) |
| spotifyUrl | string | Spotify'da açma linki |

### Analysis Object
| Field | Type | Description |
|-------|------|-------------|
| distributor | string | Tespit edilen dağıtımcı ("Unknown" olabilir) |
| confidence | string | Güven seviyesi: "High", "Medium", "Low" |
| method | string | Tespit yöntemi: "ISRC prefix", "UPC prefix", "Label name", "Licensor UUID" |

---

## Örnek Kullanımlar

### JavaScript (Fetch API)
```javascript
async function checkDistributor(trackUrl) {
  const response = await fetch('http://localhost:3000/api/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ track: trackUrl }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Distributor:', result.data.analysis.distributor);
    console.log('Confidence:', result.data.analysis.confidence);
  } else {
    console.error('Error:', result.error);
  }
}

checkDistributor('https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh');
```

### Python (requests)
```python
import requests

def check_distributor(track_url):
    response = requests.post(
        'http://localhost:3000/api/check',
        json={'track': track_url}
    )
    
    result = response.json()
    
    if result['success']:
        print(f"Distributor: {result['data']['analysis']['distributor']}")
        print(f"Confidence: {result['data']['analysis']['confidence']}")
    else:
        print(f"Error: {result['error']}")

check_distributor('https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh')
```

### cURL
```bash
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "track": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
  }'
```

### Postman
1. Method: `POST`
2. URL: `http://localhost:3000/api/check`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "track": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
}
```

---

## Rate Limiting

Şu anda rate limiting yok, ama Spotify API'nin kendi rate limit'leri var:
- **Limit:** ~180 request/dakika
- **Aşılırsa:** 429 hatası döner, 30-60 saniye beklemek gerekir

**Önerilen:** Aynı track'i tekrar tekrar sorgulamak yerine cache kullanın.

---

## Error Codes

| HTTP Code | Açıklama |
|-----------|----------|
| 200 | Başarılı |
| 400 | Geçersiz istek (track parametresi eksik veya hatalı) |
| 404 | Track bulunamadı (Spotify'da yok) |
| 429 | Rate limit aşıldı (çok fazla istek) |
| 500 | Sunucu hatası |
| 503 | Spotify API erişim hatası |

---

## CORS Policy

API tüm origin'lerden erişime açık (CORS enabled):
```
Access-Control-Allow-Origin: *
```

---

## Confidence Levels

| Level | Açıklama |
|-------|----------|
| **High** | ISRC/UPC prefix ile kesin tespit |
| **Medium** | Label adından tespit |
| **Low** | Kısmi eşleşme veya tahmin |

---

## Distributor List

API şu dağıtımcıları tespit edebilir:

- DistroKid
- TuneCore
- CD Baby
- Amuse
- UnitedMasters
- Believe Distribution
- ONErpm
- AWAL
- Stem
- Ditto Music
- RouteNote
- Spinnup
- Kontor New Media
- iGroove
- Symphonic Distribution
- Empire Distribution
- Repost by SoundCloud
- Universal Music Group
- Sony Music
- Warner Music Group
- +20 more...

---

## Webhook Integration (Gelecek)

Planlanan özellik: Webhook desteği ile otomatik notification.

```json
POST /api/webhook
{
  "url": "https://your-site.com/webhook",
  "events": ["analysis_complete"]
}
```

---

## API Best Practices

1. **Cache Results:** Aynı track'i tekrar sorgulamayın
2. **Handle Errors:** Her zaman hata kontrolü yapın
3. **Timeout:** 10-15 saniye timeout ayarlayın
4. **Retry Logic:** 429 hatalarında exponential backoff kullanın
5. **Validate Input:** Track URL'sini önce client-side validate edin

---

## Support

API ile ilgili sorular için:
- GitHub Issues: [your-repo]/issues
- Email: support@yourdomain.com

---

**Happy Coding! 🚀**
