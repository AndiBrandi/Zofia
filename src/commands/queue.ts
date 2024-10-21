import {EmbedBuilder, SlashCommandBuilder} from "@discordjs/builders";
import type {ChatInputCommandInteraction} from "discord.js";
import type {Command} from "../types/Command";
import {Colors} from "discord.js";
import {useQueue} from "discord-player";
import {config} from "../config";

const queueCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the queue"),

    async execute(interaction: ChatInputCommandInteraction) {

        let queue = useQueue(config.guildId)
        if (queue?.node == null) {
            await interaction.reply({content: "No Queue"})
            return
        }

        let length = queue.tracks.store.length
        let songList = "";
        let i;

        if (queue.tracks.toArray() == null) return;

        //////////////Create string of queue
        if (length >= 2) {

            for (i = 0; i < length; i++) {
                songList = songList.concat(i + ". " + queue.tracks.store[i].title + '\n')
                if (i === 60) {
                    break;
                }
            }

        } else {
            songList = "Empty queue";
        }
        //////////////

        const queueEmbed = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTitle('Queue for ' + interaction.guild!.name)
            .setDescription(songList)

        interaction.reply({embeds: [queueEmbed]}).catch(console.error)
        // components: [row] (nach [queueEmbed], einfügen um button anzuhängen)

    }
};

export default queueCommand;