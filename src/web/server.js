require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { extractTrackId, getTrackData } = require("../spotify");
const { detectDistributor } = require("../data/distributors");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory log storage (replace with database in production)
const logs = [];

// Admin credentials (from environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "super-secret-token-12345";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, error: "Geçersiz kullanıcı adı veya şifre" });
  }
});

// Admin logs endpoint
app.get("/api/admin/logs", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  // Calculate stats
  const total = logs.length;
  const today = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const now = new Date();
    return logDate.toDateString() === now.toDateString();
  }).length;
  
  const successful = logs.filter(log => log.success).length;
  const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

  res.json({
    success: true,
    logs: logs.slice(-50).reverse(), // Last 50 logs, newest first
    stats: {
      total,
      today,
      successRate
    }
  });
});

// Main API endpoint - Check track distributor
app.post("/api/check", async (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    success: false,
    trackId: null,
    trackName: null,
    artists: null,
    distributor: null,
    confidence: null,
    error: null
  };

  try {
    const { track } = req.body;

    if (!track) {
      logEntry.error = "No track provided";
      logs.push(logEntry);
      return res.status(400).json({
        success: false,
        error: "Spotify track linki veya ID'si gerekli",
      });
    }

    const trackId = extractTrackId(track);

    if (!trackId) {
      logEntry.error = "Invalid track format";
      logs.push(logEntry);
      return res.status(400).json({
        success: false,
        error: "Geçersiz Spotify track linki veya ID'si",
      });
    }

    logEntry.trackId = trackId;

    // Fetch track data from Spotify
    const trackData = await getTrackData(trackId);

    logEntry.trackName = trackData.trackName;
    logEntry.artists = trackData.artists;

    // Detect distributor
    const { distributor, confidence, method } = detectDistributor({
      isrc: trackData.isrc,
      upc: trackData.upc,
      label: trackData.label,
      licensorUuid: trackData.licensorUuid,
    });

    logEntry.distributor = distributor || "Unknown";
    logEntry.confidence = confidence;
    logEntry.success = true;

    logs.push(logEntry);

    res.json({
      success: true,
      data: {
        track: {
          id: trackId,
          name: trackData.trackName,
          artists: trackData.artists,
          album: trackData.albumName,
          albumImageUrl: trackData.albumImageUrl,
          releaseDate: trackData.releaseDate,
          durationMs: trackData.durationMs,
          isrc: trackData.isrc,
          upc: trackData.upc,
          label: trackData.label,
          spotifyUrl: `https://open.spotify.com/track/${trackId}`,
        },
        analysis: {
          distributor: distributor || "Unknown",
          confidence,
          method,
        },
      },
    });
  } catch (error) {
    console.error("[API Error]", error);

    let errorMessage = "Bir hata oluştu";
    let statusCode = 500;

    if (error.response?.status === 404) {
      errorMessage = "Track bulunamadı";
      statusCode = 404;
    } else if (error.response?.status === 401) {
      errorMessage = "Spotify API kimlik doğrulama hatası";
      statusCode = 503;
    } else if (error.response?.status === 429) {
      errorMessage = "Rate limit aşıldı. Lütfen biraz bekleyin";
      statusCode = 429;
    }

    logEntry.error = errorMessage;
    logs.push(logEntry);

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

// Serve the admin panel
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server - Listen on all network interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌐 Web server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`📡 Network: http://YOUR_VDS_IP:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/check`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`👤 Admin: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
  console.log(`\n🎵 Spotify Distributor Finder - Web Interface\n`);
});
