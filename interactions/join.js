const { SlashCommandBuilder } = require('@discordjs/builders');
const { VoiceChannel } = require('discord.js');
// const { createDiscordJSAdapter } = require( './adapter');
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const player = createAudioPlayer();
    function playSong() {
        const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
            inputType: StreamType.Arbitrary,
        });
            player.play(resource);
            return entersState(player, AudioPlayerStatus.Playing, 5e3);
        }
        async function connectToChannel(channel = VoiceChannel) {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: createDiscordJSAdapter(channel),
            });
            try {
                await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
                return connection;
            } catch (error) {
                connection.destroy();
                throw error;
            }
        }
module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Entra a un chat de voz'),
	async execute(interaction) {
        const channel = interaction.member?.voice.channel;

		if (channel) {
			try {
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
				interaction.reply('Playing now!');
			} catch (error) {
				console.error(error);
			}
		} else {
			interaction.reply('Join a voice channel then try again!');
		}
	},
};