import client from "./client.js";
import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import { basename } from "path";

async function announcer(title, link, newChapter, image) {
  if (!client.isReady()) {
    await new Promise(resolve => {
      client.once("ready", resolve);
    });
  }

  const channel = await client.channels.fetch(process.env.channelId);

  const img = new AttachmentBuilder(image);

  const embed = new EmbedBuilder()
    .setColor(0x00aaff)
    .setTitle(`Update Manga: ${title}`)
    .setDescription(`Chapter ${newChapter.join(", ")}`)
    .setImage(`attachment://${basename(image)}`)
    .setURL(link)
    .setTimestamp();

  await channel.send({
    embeds: [embed],
    files: [img]
  });
}

export default announcer;
