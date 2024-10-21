import {ActivityType, Client, GatewayIntentBits, IntentsBitField, Partials} from 'discord.js';
import {GuildQueue, Player, GuildQueueEvent} from 'discord-player';
import {SpotifyExtractor} from "@discord-player/extractor"
import {config} from './config.js';
import type {BotClient} from "./types/BotClient.js";
import {setupInteractionHandler, syncCommands} from "./handlers/interaction_handler.js";
import { YoutubeiExtractor } from "discord-player-youtubei"

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
        GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
}) as BotClient;

client.player = new Player(client, {})
client.ownerId = config.ownerId;
client.loginToken = config.token;


await setupInteractionHandler(client)
await syncCommands(client)

await client.player.extractors.register(SpotifyExtractor, {})
await client.player.extractors.register(YoutubeiExtractor, {
    authentication: process.env.DISCORD_PLAYER_TOKEN

})

//#region Events
client.player.events.on('playerStart', (queue: any, track: any) => {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
});

client.player.events.on('playerError', (queue: any, error: Error) => {
    queue.metadata.channel.send(`Error: ${error.message}`)
});
client.player.events.on(GuildQueueEvent.PlayerFinish, (queue: GuildQueue) => {
    console.log(queue.tracks.data);
})

client.once('ready', async () => {
    client.user?.setActivity('the Janitor', {
        type: ActivityType.Playing
    });
    console.log('Zofia ist online')
});

//#endregion

client.login(client.loginToken);