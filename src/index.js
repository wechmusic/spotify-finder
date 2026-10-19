require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  Events,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

// Validate required env vars
const required = ["DISCORD_TOKEN", "SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // MessageContent intent removed - only slash commands work without it
    // To enable auto link detection: add MessageContent intent here AND
    // enable "Message Content Intent" in Discord Developer Portal > Bot > Privileged Gateway Intents
  ],
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Loaded command: /${command.data.name}`);
  }
}

// Register slash commands when bot is ready
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`\n🤖 Logged in as ${readyClient.user.tag}`);
  console.log(`📡 Serving ${readyClient.guilds.cache.size} guild(s)\n`);

  try {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    const commands = client.commands.map((cmd) => cmd.data.toJSON());

    console.log("🔄 Registering slash commands...");

    const guildId = process.env.GUILD_ID;

    if (guildId) {
      // Guild-specific: instant registration (for development/testing)
      await rest.put(
        Routes.applicationGuildCommands(readyClient.user.id, guildId),
        { body: commands }
      );
      console.log(`✅ Registered ${commands.length} command(s) to guild ${guildId} (instant)`);
    } else {
      // Global: takes up to 1 hour to propagate
      await rest.put(
        Routes.applicationCommands(readyClient.user.id),
        { body: commands }
      );
      console.log(`✅ Registered ${commands.length} command(s) globally`);
      console.log("⚠️  Global commands may take up to 1 hour to appear. Add GUILD_ID to .env for instant registration.\n");
    }
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
  }
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[${interaction.commandName}] Error:`, error);

    const reply = {
      content: "❌ Komut çalıştırılırken bir hata oluştu.",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
