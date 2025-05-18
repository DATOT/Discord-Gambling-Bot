const { SlashCommandBuilder } = require("discord.js");
const userCoins = require('../../items/coins');

module.exports = {
	data: new SlashCommandBuilder() 
		.setName('stat')
		.setDescription('Your current stat'),

	async execute(interaction) {
		const userId = interaction.user.id;
		let message = '**STAT:**\n';

		if (!userCoins.has(userId)) {
			message += 'You dont have money since you didnt start gambling\n'
			message += 'You /startgambling to start gambling';
		} else {
			message += `💰 You have **${userCoins.get(userId)} coins**.`;
		}

		await interaction.deferReply();
		await interaction.editReply(message);
	}
};
