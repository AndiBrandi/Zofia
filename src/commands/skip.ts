import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import type {Command} from "../types/Command.ts";
import {BotClient} from "../types/BotClient";
import {config} from "../config";


const skipCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips to the next song in queue"),

    async execute(interaction: CommandInteraction, client: BotClient) {

        client.player.nodes.get(config.guildId)?.node.skip()

        await interaction.reply({content: "Skipping..."})

    }
};
export default skipCommand;