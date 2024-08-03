const fs = require("fs");
const path = require("path");

const { GatewayIntentBits, REST, Routes, Client } = require("discord.js");

const tokens = require("./tokens.json");
const commands = require("./commands");
const handleInteraction = require("./handleInteraction");

const TabProcess = require("../clicker/TabProcess");
const LaunchBrowser = require("../clicker/LaunchBrowser");
const BattleFind = require("../clicker/BattleFind");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on("ready", bot => console.log("Clicker is online!"));
client.on("interactionCreate", async interaction => {
  if (interaction.commandName == "click") {
    const battleId = interaction.options.get("battle-id").value;
    const team = interaction.options.get("team").value;
    handleInteraction.handleSetClick(interaction, battleId, team);
    BattleFind.setDetails(battleId, team);
    //await TabProcess.setClickTargets(LaunchBrowser.pages);
  }
  if (interaction.commandName == "sethash") {
    const hash = interaction.options.get("hashkey").value;
    const operation = interaction.options.get("operation").value;
    const type = interaction.options.get("type").value;
    const nick = interaction.options.get("nickname").value;
    handleInteraction.handleSetHash(interaction, hash, operation, type, nick);
  }
  if (interaction.commandName == "start") await LaunchBrowser.process();
  if (interaction.commandName == "stop") LaunchBrowser.setBrowserCloseState(true);
  if (interaction.commandName == "play") TabProcess.setShouldJoin(true);
});

const rest = new REST({ version: "10" }).setToken(tokens.botAuthToken);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(tokens.botClientID), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.login(tokens.botAuthToken);
