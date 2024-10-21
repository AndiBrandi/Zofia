import {SlashCommandBuilder, SlashCommandIntegerOption} from "@discordjs/builders";
import type {ChatInputCommandInteraction} from "discord.js";
import type {Command} from "../types/Command.ts";
import {TextChannel} from "discord.js";
import type {BotClient} from "../types/BotClient";


const purgeCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Delete messages in bulk")
        .addIntegerOption(new SlashCommandIntegerOption().setName("numtodelete").setDescription("Number of Messages to delete").setRequired(true)),
//@ts-ignore
    async execute(interaction: ChatInputCommandInteraction, client: BotClient) {
        let num = interaction.options.getInteger("numtodelete");

        if (num != null) {

            if (num > 100) {
                await interaction.reply("I can't delete more than 100 messages at once");
                return
            }

            if (num < 1)
                await interaction.reply("Please enter a number greater than 1");
///
            await interaction.channel!.messages.fetch({limit: num}).then(messages => {
                let channel = interaction.channel as TextChannel
                channel.bulkDelete(messages)
            });
            await interaction.reply({content: `Cleared ${num} messages`})
        }
    }
};

export default purgeCommand;