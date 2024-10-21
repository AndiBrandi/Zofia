import {SlashCommandBuilder} from "@discordjs/builders";
import type {CommandInteraction} from "discord.js";
import type {Command} from "../types/Command.ts";

const pingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping Pong"),

    async execute(interaction: CommandInteraction) {
        await interaction.reply({content: "Pong!"})
    }
};

export default pingCommand;