import {SlashCommandBuilder} from "@discordjs/builders";
import type {ChatInputCommandInteraction} from "discord.js";
import type {Command} from "../types/Command.ts";
import type {BotClient} from "../types/BotClient.ts";

const stopCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops playing music"),

    async execute(interaction: ChatInputCommandInteraction, client: BotClient) {

    }
};

export default stopCommand;