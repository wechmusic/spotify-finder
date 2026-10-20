const axios = require("axios");
const { fetchSpClientMetadata } = require("./spClient");

let accessToken = null;
let tokenExpiry = 0;

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

  return accessToken;
}

/**
 * Extract Spotify track ID from various URL formats
 * Supports:
 * - https://open.spotify.com/track/ID
 * - https://open.spotify.com/intl-tr/track/ID (removes intl-XX)
 * - https://open.spotify.com/track/ID?si=...
 * - spotify:track:ID
 * - Just the ID itself
 */
function extractTrackId(input) {
  if (!input) return null;

  // Remove intl-XX language codes from URL
  input = input.replace(/\/intl-[a-z]{2}\//gi, '/');

  // spotify:track:ID format
  const uriMatch = input.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];

  // URL format
  const urlMatch = input.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];

  // Raw ID (22 chars, alphanumeric)
  if (/^[a-zA-Z0-9]{22}$/.test(input.trim())) {
    return input.trim();
  }

  return null;
}

/**
 * Extract label name from album copyrights
 * Fallback when spclient is not available.
 * Spotify Client Credentials doesn't return `label` field directly,
 * but `copyrights` is available. We parse the ℗ (P type) entry.
 */
function extractLabelFromCopyrights(copyrights) {
  if (!copyrights || copyrights.length === 0) return null;

  const pCopyright = copyrights.find((c) => c.type === "P") || copyrights[0];
  if (!pCopyright?.text) return null;

  let text = pCopyright.text;
  text = text.replace(/[℗©]/g, "").trim();
  text = text.replace(/^\(?\d{4}\)?\s+/, "").trim();
  text = text
    .replace(/\.\s*All rights reserved\.?$/i, "")
    .replace(/\s*under exclusive license.*$/i, "")
    .trim();

  return text || null;
}

/**
 * Fetch full track data from Spotify API
 * Uses both public API (for track/album info) and spclient (for label + licensor UUID)
 * 
 * @param {string} trackId
 * @returns {object} Processed track data including licensorUuid for distributor detection
 */
async function getTrackData(trackId) {
  const token = await getAccessToken();

  // Fetch track and spclient metadata in parallel
  const [trackResponse, spClientData] = await Promise.all([
    axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetchSpClientMetadata(trackId),
  ]);

  const track = trackResponse.data;
  const album = track.album;

  // Fetch album info for UPC and copyright-based label fallback
  const albumResponse = await axios.get(
    `https://api.spotify.com/v1/albums/${album.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const albumData = albumResponse.data;

  // Label priority: spclient (most accurate) > album field > copyright parsing
  const label =
    spClientData?.label ||
    albumData.label ||
    extractLabelFromCopyrights(albumData.copyrights) ||
    null;

  // ISRC priority: spclient > public API
  const isrc =
    spClientData?.isrc ||
    track.external_ids?.isrc ||
    null;

  return {
    // Track info
    trackId: track.id,
    trackName: track.name,
    artists: track.artists.map((a) => a.name).join(", "),
    durationMs: track.duration_ms,
    explicit: track.explicit,
    trackNumber: track.track_number,
    popularity: track.popularity,

    // ISRC (key for distributor detection)
    isrc,

    // Album info
    albumId: album.id,
    albumName: album.name,
    albumType: album.album_type,
    releaseDate: album.release_date,
    totalTracks: album.total_tracks,
    albumImageUrl: album.images?.[0]?.url || null,

    // UPC and label
    upc: albumData.external_ids?.upc || null,
    label,

    // Licensor UUID from spclient — used for precise distributor detection
    licensorUuid: spClientData?.licensorUuid || null,

    // Spotify URLs
    trackUrl: track.external_urls?.spotify,
    albumUrl: album.external_urls?.spotify,
  };
}

module.exports = { extractTrackId, getTrackData };
