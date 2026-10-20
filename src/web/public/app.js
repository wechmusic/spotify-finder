// Get DOM elements
const searchForm = document.getElementById("searchForm");
const trackInput = document.getElementById("trackInput");
const searchButton = document.getElementById("searchButton");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const resultsSection = document.getElementById("resultsSection");

// Distributor emojis
const distributorEmojis = {
  "DistroKid": "🟢",
  "TuneCore": "🔵",
  "CD Baby": "🟡",
  "Amuse": "🟣",
  "UnitedMasters": "🔴",
  "Believe Distribution": "🎯",
  "ONErpm": "🟠",
  "AWAL": "⚪",
  "Stem": "🌿",
  "Ditto Music": "🎵",
  "RouteNote": "📍",
  "Spinnup": "🌀",
  "Kontor New Media": "🎛️",
  "iGroove": "🎸",
  "Symphonic Distribution": "🎼",
  "Empire Distribution": "👑",
  "Repost by SoundCloud": "☁️",
  "Universal Music Group": "🏢",
  "Sony Music": "🏢",
  "Warner Music Group": "🏢",
};

// Format duration from milliseconds to MM:SS
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Show error message
function showError(message) {
  errorText.textContent = message;
  errorMessage.style.display = "flex";
  resultsSection.style.display = "none";
  
  // Hide after 5 seconds
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);
}

// Hide error message
function hideError() {
  errorMessage.style.display = "none";
}

// Set loading state
function setLoading(isLoading) {
  const buttonText = searchButton.querySelector(".button-text");
  const buttonLoading = searchButton.querySelector(".button-loading");
  
  if (isLoading) {
    buttonText.style.display = "none";
    buttonLoading.style.display = "flex";
    searchButton.disabled = true;
    trackInput.disabled = true;
  } else {
    buttonText.style.display = "inline";
    buttonLoading.style.display = "none";
    searchButton.disabled = false;
    trackInput.disabled = false;
  }
}

// Display results
function displayResults(data) {
  const { track, analysis } = data;

  // Track info
  document.getElementById("albumImage").src = track.albumImageUrl || "https://via.placeholder.com/180";
  document.getElementById("trackName").textContent = track.name;
  document.getElementById("artistName").textContent = track.artists;
  document.getElementById("albumName").textContent = track.album || "N/A";

  // Track details
  document.getElementById("isrc").textContent = track.isrc || "Not found";
  document.getElementById("upc").textContent = track.upc || "Not found";
  document.getElementById("label").textContent = track.label || "Not found";
  document.getElementById("releaseDate").textContent = track.releaseDate || "N/A";
  document.getElementById("duration").textContent = formatDuration(track.durationMs);
  document.getElementById("spotifyLink").href = track.spotifyUrl;

  // Distributor info
  const distributorEmoji = distributorEmojis[analysis.distributor] || "📦";
  document.getElementById("distributorEmoji").textContent = distributorEmoji;
  document.getElementById("distributorName").textContent = analysis.distributor;

  // Confidence badge
  const confidenceBadge = document.getElementById("confidenceBadge");
  confidenceBadge.textContent = analysis.confidence;
  confidenceBadge.className = `badge ${analysis.confidence.toLowerCase()}`;

  // Method text
  document.getElementById("methodText").textContent = `Tespit yöntemi: ${analysis.method}`;

  // Show results
  resultsSection.style.display = "block";
  
  // Smooth scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

// Handle form submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const trackUrl = trackInput.value.trim();
  
  if (!trackUrl) {
    showError("Lütfen bir Spotify track linki veya ID'si girin");
    return;
  }

  hideError();
  setLoading(true);

  try {
    const response = await fetch("/api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ track: trackUrl }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Bir hata oluştu");
    }

    if (result.success) {
      displayResults(result.data);
    } else {
      throw new Error(result.error || "Beklenmeyen bir hata oluştu");
    }

  } catch (error) {
    console.error("Error:", error);
    showError(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
    setLoading(false);
  }
});

// Allow Enter key to submit
trackInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !searchButton.disabled) {
    searchForm.requestSubmit();
  }
});

// Clear error on input
trackInput.addEventListener("input", () => {
  if (errorMessage.style.display !== "none") {
    hideError();
  }
});

console.log("🎵 Spotify Distributor Finder initialized");
