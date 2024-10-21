import fs from 'fs';
import {
    Collection,
    Events,
    type Interaction,
    REST,
    Routes,
    TextChannel
} from 'discord.js';
import type { BotClient } from '../types/BotClient.ts';
import type { Command } from '../types/Command';
import {config} from "../config";
import { fileURLToPath } from 'url';
import path from 'path';
export async function setupInteractionHandler(client: BotClient) {
    client.interactions = new Collection<string, Command>();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath);

    for (const file of commandFiles) {
        if (file.endsWith('.ts')) {
            try {
                const filePath = path.join(commandsPath, file);
                const fileUrl = new URL(`file://${filePath}`);
                const {default: command} = await import(fileUrl.href);

                if ('data' in command && 'execute' in command) {
                    client.interactions.set(command.data.name, command);
                    console.log(`Loaded command: ${command.data.name}`);
                } else {
                    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            } catch (error) {
                console.error(`[ERROR] Failed to load command from file ${file}:`, error);
            }
        }
    }

    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = client.interactions!.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {

                    await (interaction.channel as TextChannel)!.send({ content: 'There was an error while executing this command!'});
                } else {
                    await (interaction.channel as TextChannel)!.send({ content: 'There was an error while executing this command!'});
                }
            }
        } else if (interaction.isAutocomplete()) {
            const command = client.interactions.get(interaction.commandName);

            if (!command || !command.autocomplete) {
                console.error(`No autocomplete matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }
    });

}

export async function syncCommands(client: BotClient) {
    const commands = [];
    for (const command of client.interactions.values()) {
        commands.push(command.data.toJSON());
    }

    const rest: REST = new REST().setToken(config.token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            {body: commands},
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}