const { SlashCommandBuilder } = require("discord.js");
const userCoins = require('../../items/coins')
const userGamblingData = require('../../items/gamblingData');

module.exports = {
	data: new SlashCommandBuilder() 
		.setName('stat')
		.setDescription('Your current stat'),

	async execute(interaction) {
		const userId = interaction.user.id;
		let message = '**STAT:**\n';
    	// Only defer the reply if it hasn't already been done
    	if (!interaction.replied && !interaction.deferred) {
    	  	await interaction.deferReply(); // Do this FIRST before any logic
    	}

		if (!userCoins.hasCoins(userId)) {
			message += '**New user!!!** Set coins to **0** automatically\n';
			userCoins.setCoins(userId, 0);
		}
		message += `💰 You have **${userCoins.getCoins(userId)} coins**.`;

		try {
			await interaction.editReply(message);
		} catch(error) {
			console.log(error);
			if (!interaction.replied) {
			  await interaction.reply({ content: 'Something went wrong~ 😿', flags: MessageFlags.Ephemeral });
			}
		}
	}
};
