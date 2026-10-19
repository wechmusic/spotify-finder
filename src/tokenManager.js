/**
 * Spotify Web Player Token Manager
 * 
 * Replicates the TOTP-based authentication used by Spotify's web player.
 * Fetches a valid access token that can access internal endpoints like spclient.
 * 
 * Based on: https://github.com/EduardLupu/spotify-artists (token_service.py)
 * TOTP secrets: https://github.com/xyloflake/spot-secrets-go
 */

const axios = require("axios");
const { TOTP } = require("otpauth");

const SECRETS_URL =
  "https://raw.githubusercontent.com/xyloflake/spot-secrets-go/refs/heads/main/secrets/secretDict.json";
const TOKEN_URL = "https://open.spotify.com/api/token";
const SERVER_TIME_URL = "https://open.spotify.com/";
const SECRETS_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedToken = null;
let tokenExpiryMs = 0;
let secretsCache = null;
let secretsFetchedAt = 0;

/**
 * Fetch TOTP secrets from public repo
 */
async function fetchSecrets() {
  const now = Date.now();
  if (secretsCache && now - secretsFetchedAt < SECRETS_TTL_MS) {
    return secretsCache;
  }

  const res = await axios.get(SECRETS_URL, { timeout: 10000 });
  secretsCache = res.data;
  secretsFetchedAt = now;
  return secretsCache;
}

/**
 * Build TOTP secret from raw int array (same XOR transform as Python)
 * @param {number[]} data
 * @returns {string} base32 secret
 */
function buildTotpSecret(data) {
  // XOR transform: value ^ ((index % 33) + 9)
  const transformed = data.map((val, idx) => val ^ ((idx % 33) + 9));
  // Join as string of numbers, encode to hex, then base32
  const joined = transformed.join("");
  const hexStr = Buffer.from(joined, "utf8").toString("hex");
  // Convert hex to base32
  const bytes = Buffer.from(hexStr, "hex");
  return base32Encode(bytes);
}

/**
 * Base32 encode (RFC 4648, no padding)
 */
function base32Encode(buffer) {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Generate TOTP code for given version and timestamp
 */
function generateTotp(secretData, timestampSeconds) {
  const secret = buildTotpSecret(secretData);
  const totp = new TOTP({
    secret,
    digits: 6,
    period: 30,
    algorithm: "SHA1",
  });
  return totp.generate({ timestamp: timestampSeconds * 1000 });
}

/**
 * Get Spotify server time (seconds)
 */
async function getServerTime() {
  try {
    const res = await axios.head(SERVER_TIME_URL, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const dateHeader = res.headers["date"];
    if (dateHeader) {
      return Math.floor(new Date(dateHeader).getTime() / 1000);
    }
  } catch (_) {}
  return Math.floor(Date.now() / 1000);
}

/**
 * Fetch a fresh Spotify web player token using TOTP
 */
async function fetchFreshToken() {
  const secrets = await fetchSecrets();
  const versions = Object.keys(secrets).sort((a, b) => parseInt(b) - parseInt(a));
  const serverTime = await getServerTime();

  for (const version of versions) {
    const secretData = secrets[version];
    const totpCode = generateTotp(secretData, serverTime);

    for (const reason of ["transport", "init"]) {
      try {
        const params = {
          reason,
          productType: "web-player",
          totp: totpCode,
          totpServer: totpCode,
          totpVer: version,
        };

        // Add SP_DC cookie if available
        const headers = {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://open.spotify.com/",
          Origin: "https://open.spotify.com",
          "App-Platform": "WebPlayer",
          "spotify-app-version": "1.2.31.582.g2b3a0b1b",
        };

        const spDc = process.env.SP_DC;
        if (spDc) {
          headers["Cookie"] = `sp_dc=${spDc}`;
        }

        const res = await axios.get(TOKEN_URL, {
          params,
          headers,
          timeout: 15000,
        });

        const data = res.data;
        if (data.accessToken && data.accessTokenExpirationTimestampMs) {
          const isAnon = data.isAnonymous === true;
          console.log(
            `[TokenManager] Got ${isAnon ? "anonymous" : "authenticated"} token via TOTP v${version} (${reason})`
          );
          return {
            token: data.accessToken,
            expiry: data.accessTokenExpirationTimestampMs - 60000,
            isAnonymous: isAnon,
          };
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          console.warn(`[TokenManager] TOTP v${version} ${reason} rejected (${status}), trying next...`);
          continue;
        }
        // Other errors — try next reason
        console.warn(`[TokenManager] TOTP v${version} ${reason} failed: ${err.message}`);
      }
    }
  }

  throw new Error("[TokenManager] All TOTP versions exhausted — could not get token");
}

/**
 * Get a valid Spotify web player token (cached)
 * @returns {Promise<string>}
 */
async function getWebPlayerToken() {
  if (cachedToken && Date.now() < tokenExpiryMs) {
    return cachedToken;
  }

  const result = await fetchFreshToken();
  cachedToken = result.token;
  tokenExpiryMs = result.expiry;
  return cachedToken;
}

/**
 * Invalidate cached token (call on 401 responses)
 */
function invalidateToken() {
  cachedToken = null;
  tokenExpiryMs = 0;
}

module.exports = { getWebPlayerToken, invalidateToken };
