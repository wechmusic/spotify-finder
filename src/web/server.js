require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { extractTrackId, getTrackData } = require("../spotify");
const { detectDistributor } = require("../data/distributors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Main API endpoint - Check track distributor
app.post("/api/check", async (req, res) => {
  try {
    const { track } = req.body;

    if (!track) {
      return res.status(400).json({
        success: false,
        error: "Spotify track linki veya ID'si gerekli",
      });
    }

    const trackId = extractTrackId(track);

    if (!trackId) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz Spotify track linki veya ID'si",
      });
    }

    // Fetch track data from Spotify
    const trackData = await getTrackData(trackId);

    // Detect distributor
    const { distributor, confidence, method } = detectDistributor({
      isrc: trackData.isrc,
      upc: trackData.upc,
      label: trackData.label,
      licensorUuid: trackData.licensorUuid,
    });

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

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
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
  console.log(`\n🎵 Spotify Distributor Finder - Web Interface\n`);
});
