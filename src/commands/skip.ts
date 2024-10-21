import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import type {Command} from "../types/Command.ts";
import {BotClient} from "../types/BotClient";
import {config} from "../config";


const templateCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("This is a template Command"),

    async execute(interaction: CommandInteraction, client: BotClient) {

        client.player.nodes.get(config.guildId)?.node.skip()

        await interaction.reply({content: "Skipping..."})

    }
};
export default templateCommand;