/**
 * Spotify spclient metadata fetcher
 * 
 * Uses Spotify's internal web player token (via TOTP) to access
 * spclient.wg.spotify.com/metadata/4/track/{gid}
 * This endpoint returns label + licensor UUID — enabling accurate distributor detection.
 * 
 * Based on: https://github.com/EduardLupu/spotify-artists
 */

const axios = require("axios");
const { getWebPlayerToken, invalidateToken } = require("./tokenManager");

/**
 * Convert Spotify base62 track ID to GID (hex)
 * Spotify internally uses 128-bit GIDs encoded as hex
 */
function spotifyIdToGid(spotifyId) {
  const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let num = BigInt(0);
  for (const char of spotifyId) {
    num = num * BigInt(62) + BigInt(CHARS.indexOf(char));
  }
  return num.toString(16).padStart(32, "0");
}

/**
 * Fetch track metadata from Spotify's internal spclient endpoint
 * Returns label and licensor UUID for accurate distributor detection
 * 
 * @param {string} trackId - Spotify track ID (base62)
 * @returns {{ label: string|null, licensorUuid: string|null, isrc: string|null } | null}
 */
async function fetchSpClientMetadata(trackId) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const token = await getWebPlayerToken();
      const gid = spotifyIdToGid(trackId);
      const url = `https://spclient.wg.spotify.com/metadata/4/track/${gid}?market=from_token`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "App-Platform": "WebPlayer",
          Accept: "application/json",
          "spotify-app-version": "1.2.31.582.g2b3a0b1b",
        },
        timeout: 10000,
      });

      const data = response.data;

      // Extract ISRC
      let isrc = null;
      if (Array.isArray(data.external_id)) {
        for (const ext of data.external_id) {
          if (ext.type?.toLowerCase() === "isrc") {
            isrc = ext.id;
            break;
          }
        }
      }

      // Extract label from album
      const label = data.album?.label || null;

      // Extract licensor UUID
      let licensorUuid = null;
      if (data.licensor?.uuid) {
        licensorUuid = data.licensor.uuid;
      } else if (data.album?.licensor?.uuid) {
        licensorUuid = data.album.licensor.uuid;
      }

      return { label, licensorUuid, isrc };

    } catch (err) {
      const status = err.response?.status;
      if ((status === 401 || status === 403) && attempt === 0) {
        invalidateToken();
        continue; // retry with fresh token
      }
      console.warn(`[spclient] Metadata fetch failed (${status || err.message})`);
      return null;
    }
  }
  return null;
}

module.exports = { fetchSpClientMetadata, spotifyIdToGid };
