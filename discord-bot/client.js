// client.js
import { Client } from "discord.js";
import "dotenv/config";

const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "MessageContent"
  ]
});

client.login(process.env.token).then(() => console.log("\x1b[33mDiscord bot online!\x1b[0m")
);

export default client;
