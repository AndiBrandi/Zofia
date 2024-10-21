import {SlashCommandBuilder} from "@discordjs/builders";
import {type ChatInputCommandInteraction, PermissionsBitField, TextChannel} from "discord.js";
import type {Command} from "../types/Command";
import type {BotClient} from "../types/BotClient";
import {QueueRepeatMode} from "discord-player";
import {config} from "../config";

const playCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music through Keywords and links")
        .addStringOption(option => option.setName("query").setDescription("source for the music stream").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction, client: BotClient) {


        //getting information
        // const guildID = interaction.guild!.id;
        const textChannel :TextChannel = interaction.channel! as TextChannel
        //@ts-ignore
        const vc = interaction.member!.voice.channel
        //checking to avoid exceptions
        if (!vc) {
            await interaction.reply({content: "Please enter a voice channel to play music"});
            return;
        }
        const permissions = vc.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionsBitField.Flags.Connect)) {
            await interaction.reply({content: '🚫 You are not permitted to do that'});
            return;
        }
        if (!permissions.has(PermissionsBitField.Flags.Speak)) {
            await interaction.reply({content: '🚫 You are not permitted to do that'});
            return
        }

        let query = interaction.options.getString("query");
        console.log("Query: " + query);
        await interaction.deferReply();

        //#region Old spotify Link convert

        ///////////////////////////////////////////////// using own spotify API to convert into youtube playable keywords (old)
        // if (query.includes("spotify.com")) {
        //
        //
        //     if (args[0].toString().includes("spotify.com/intl-de/track")) {
        //
        //
        //         let regex = /track\/([^\?]+)/;  // Regular expression to match the ID
        //         let match = regex.exec(query);  // Execute the regular expression
        //         let id = match[1];  // Extract the ID from the match
        //
        //         query = id
        //         spotifyLinkType = "tracks"
        //
        //     } else if (args[0].toString().includes("spotify.com/playlist")) {
        //
        //
        //         let regex = /playlist\/([^\?]+)/;  // Regular expression to match the ID
        //         let match = regex.exec(query);  // Execute the regular expression
        //         let id = match[1];  // Extract the ID from the match
        //
        //         query = id
        //         spotifyLinkType = "playlists"
        //
        //     }
        //     // console.log(`Extracted string:${query}`) //debug
        //
        //     try {
        //
        //         //get metadata from Spotify API, whether its a single song or a playlist
        //         let jsonData = await getMetadata(query, spotifyLinkType)
        //         if (spotifyLinkType.startsWith("tracks")) {
        //
        //             query = jsonData.artists.at(0).name + " - " + jsonData.name
        //             isSpotify = true;
        //
        //         } else if (spotifyLinkType.startsWith("playlists")) {
        //
        //             //need to work on this, this is bs
        //             let spotifySongs = jsonData.tracks.items
        //             let i = 0
        //             spotifySongs.forEach(item => {
        //                 spotifySongs[i] = item.track.name + " - " + item.track.artists.at(0).name
        //                 ++i
        //             })
        //             isSpotify = true;
        //             query = spotifySongs
        //
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        //////////////////////////////////////////////////end

        //#endregion

        //#region Special Link converting

        ///////////////////////////////////////////////////Youtube music to normal YouTube link
        // if (query.includes("music.youtube.com")) {
        //     query = query.replace("music.youtube.com", "youtube.com")
        // } else if (query.includes("spotify.com/intl-de")) {
        //     query = query.replace("spotify.com/intl-de", "spotify.com")
        //
        // }
        ///////////////////////////////////////////////////

        //#endregion

        try {
            try {
                const {track} = await client.player.play(vc, query!, {
                    nodeOptions: {
                        leaveOnEnd: false,
                        // repeatMode: QueueRepeatMode.OFF,
                        // nodeOptions are the options for guild node (aka your queue in simple word)
                        metadata: interaction // we can access this metadata object using queue.metadata later on
                    }
                });
                client.player.queues.get(config.guildId)?.setRepeatMode(QueueRepeatMode.OFF)

                await interaction.followUp(`**${track.title}** added to the queue`);
            } catch (e) {
                // let's return error if something failed
                textChannel!.send(`Something went wrong: ${e}`);
                return
            }

            //#region Old Link converter

            //////////////////////////////////////// Link converting (old)
            // if (isSpotify) {
            //     //Spotify Link
            //
            //     if (spotifyLinkType.includes("tracks")) {
            //         await guildQueue.play(query)
            //         message.channel.send({content: query + " :notes: has been added to the queue"})
            //     } else {
            //         for (let string of query) {
            //             await guildQueue.play(string)
            //         }
            //         message.channel.send({content: "Spotify Playlist :notes: has been added to the queue"})
            //     }
            //
            //
            // } else if (query.includes("youtube.com/watch")) {
            //     //YT video
            //     song = await guildQueue.play(query)
            //     message.channel.send({content: song.name + " :notes: has been added to the queue"});
            //
            // } else if (query.includes("youtube.com/playlist") || query.includes("&list=")) {
            //     //YT playlist
            //     song = await guildQueue.playlist(query)
            //     console.log("Tried playing playlist instead: " + song)
            //     // message.channel.send({ content: song.name + " :notes: has been added to the queue" });
            //
            // } else {
            //     //keyword search
            //     song = await guildQueue.play(query)
            //     message.channel.send({content: song.name + " :notes: has been added to the queue"});
            //
            // }

            //#endregion

        } catch (e) {
            console.error(e);
            // @ts-ignore
            await interaction.channel!.send({content: "Da ist etwas schief gelaufen"});
        }
        // queue!.filters.ffmpeg.setInputArgs([
        //     '-threads',
        //     '3',
        //     '-reconnect',
        //     '1',
        //     '-reconnect_streamed',
        //     '1',
        //     '-reconnect_delay_max',
        //     '10',
        //     '-vn'
        // ])

    }
};

export default playCommand;