const { SlashCommandBuilder } = require("discord.js");
const userCoins = require('../../items/coins');

module.exports = {
	data: new SlashCommandBuilder() 
		.setName('startgambling')
		.setDescription('LETS GO GAMBLING!!!'),

	async execute(interaction) {
		const userId = interaction.user.id;
		let message = '# LETS GO GAMBLING!!!\n';

		if (!userCoins.has(userId)) {
			userCoins.set(userId, 100);
			console.log(`Here is your money ${interaction.user.username}:3`);
			message += '🎁 You got **100 coins** to start gambling!';
		}

		try {
			await interaction.deferReply();
			await interaction.editReply(message);
		} catch(error) {
			console.log(error);
			if (!interaction.replied) {
			  await interaction.reply({ content: 'Something went wrong~ 😿', ephemeral: true });
			}
		}
	}
};
