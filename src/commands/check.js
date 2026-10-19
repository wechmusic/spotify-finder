const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { extractTrackId, getTrackData } = require("../spotify");
const { detectDistributor } = require("../data/distributors");

/**
 * Format duration from milliseconds to MM:SS
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Get distributor emoji
 */
function getDistributorEmoji(distributor) {
  const emojis = {
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
  return emojis[distributor] || "📦";
}

/**
 * Get confidence color for embed
 */
function getConfidenceColor(confidence) {
  switch (confidence) {
    case "High": return 0x1DB954; // Spotify green
    case "Medium": return 0xFFA500; // Orange
    case "Low": return 0xFF6B6B; // Red
    default: return 0x808080; // Gray
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("Spotify track'inin distributor'ını bul")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription("Spotify track linki veya ID'si")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const input = interaction.options.getString("track");
    const trackId = extractTrackId(input);

    if (!trackId) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("❌ Geçersiz Link")
            .setDescription(
              "Geçerli bir Spotify track linki veya ID'si gir.\n\n" +
              "**Desteklenen formatlar:**\n" +
              "`https://open.spotify.com/track/ID`\n" +
              "`spotify:track:ID`"
            ),
        ],
      });
    }

    try {
      // Fetch track data from Spotify
      const trackData = await getTrackData(trackId);

      // Detect distributor
      const { distributor, confidence, method } = detectDistributor({
        isrc: trackData.isrc,
        upc: trackData.upc,
        label: trackData.label,
        licensorUuid: trackData.licensorUuid,
      });

      const distributorEmoji = getDistributorEmoji(distributor);
      const embedColor = getConfidenceColor(confidence);

      // Build the embed
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle("🎵 Track Analysis Results")
        .setDescription(`**${trackData.trackName}** - ${trackData.artists}`)
        .addFields(
          {
            name: "💿 Album",
            value: trackData.albumName || "N/A",
            inline: true,
          },
          {
            name: "🔍 ISRC",
            value: trackData.isrc || "Not found",
            inline: true,
          },
          {
            name: "💎 UPC",
            value: trackData.upc || "Not found",
            inline: true,
          },
          {
            name: "🏷️ Label",
            value: trackData.label || "Not found",
            inline: true,
          },
          {
            name: "📅 Release Date",
            value: trackData.releaseDate || "N/A",
            inline: true,
          },
          {
            name: "⏱️ Duration",
            value: formatDuration(trackData.durationMs),
            inline: true,
          },
          {
            name: "📦 Distributor Analysis",
            value: distributor
              ? `${distributorEmoji} **Final Result**: ${distributor}\n🎯 Confidence: ${confidence} (via ${method})`
              : "❓ **Final Result**: Unknown\nDistributor tespit edilemedi.",
            inline: false,
          }
        )
        .setFooter({
          text: `Analysis performed for ${interaction.user.username} • ${new Date().toLocaleString("tr-TR")}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      // Add album art thumbnail if available
      if (trackData.albumImageUrl) {
        embed.setThumbnail(trackData.albumImageUrl);
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("[check command error]", error);

      let errorMessage = "Bir hata oluştu.";

      if (error.response?.status === 404) {
        errorMessage = "Track bulunamadı. Link doğru mu?";
      } else if (error.response?.status === 401) {
        errorMessage = "Spotify API kimlik doğrulama hatası. Bot yeniden başlatılmalı.";
      } else if (error.response?.status === 429) {
        errorMessage = "Spotify API rate limit aşıldı. Biraz bekle.";
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("❌ Hata")
            .setDescription(errorMessage),
        ],
      });
    }
  },
};
