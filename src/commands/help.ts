import {EmbedBuilder, SlashCommandBuilder} from "@discordjs/builders";
import type {Command} from "../types/Command.ts";
import {CommandInteraction} from "discord.js";

const helpCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Opens help panel for Bot"),
    async execute(interaction: CommandInteraction) {
            const embed = new EmbedBuilder()
                .setColor(0x00c9b6)
                .setTitle('Zofia v2 Help Panel')
                .setDescription('This Bot is maintained by @_andinator')
                .addFields({ name: 'The music function is', value: '[powered by discord-player](https://www.npmjs.com/package/discord-player)' },
                    {
                        name: 'Music commands (Supporting YouTube and Spotify as source)',
                        value: '**play** *link or keyword* \n' +
                            '**playlist** *link or keyword* \n' +
                            '**queue** *show song queue for server* \n' +
                            '**skip** (skip to the next song) \n' +
                            '**stop/leave** (make Zofia leave) \n' +
                            '**shuffle** (shuffle the queue) \n' +
                            '**nowplaying** (currently playing song) \n' +
                            '**pause** (pause current song) \n' +
                            '**resume** (resumes paused song) \n',
                        inline: true
                    }
                )
            await interaction.reply({ embeds: [embed] })
    }
};

export default helpCommand;