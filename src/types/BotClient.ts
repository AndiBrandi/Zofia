// src/types/BotClient.ts
import { Client, Collection } from 'discord.js';
import { Player } from 'discord-player';

export interface BotClient extends Client {
    player: Player;
    commands: Collection<string, any>;
    events: Collection<string, any>;
    interactions: Collection<string, any>;
    ownerId: string;
    loginToken: string;
    // Add any other custom properties your bot client might have
}