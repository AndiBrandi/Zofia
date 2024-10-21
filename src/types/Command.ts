import {
    AutocompleteInteraction,
    type SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction
} from 'discord.js';
import type { BotClient } from './BotClient.ts';

export interface Command {
    data: SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction, client: BotClient) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction, client: BotClient) => Promise<void>;
}