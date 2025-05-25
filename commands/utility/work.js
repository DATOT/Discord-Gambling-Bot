const { SlashCommandBuilder } = require('discord.js');
const userCoins = require('../../items/coins'); // make sure this path matches your folder layout~ :3
const userWorkData = require('../../items/workData'); // the userWorkData is here:3

const WORK_REWARD = 20;
const WORK_LIMIT = 2;
const DAY_MS = 24 * 60 * 60 * 1000 / 2;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to earn 20 coins (Max 2 times per day)'),

	async execute(interaction) {
		const userId = interaction.user.id;

		// Only defer the reply if it hasn't already been done
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply(); // Do this FIRST before any logic
    }

		// Get or initialize work data
		const now = Date.now();	
		const last = userWorkData.lastReset(userId);
		let count = userWorkData.count(userId);

		// Reset daily work limit if 12h passed
		if (now - last > DAY_MS) {
			userWorkData.resetWorkData(userId);
			count = 0;
		}

		// If limit reached
		if (count >= WORK_LIMIT) {    		
			try {
				await interaction.editReply('Youve already worked **2 times today**~ 😿 Come back tomorrow! :3');
			} catch (error) {
				console.error(error);
				if (!interaction.replied) {
					await interaction.reply({ content: 'Something went wrong~ 😿', ephemeral: true });
				}
			}
			return;
		}
		userWorkData.increaseCount(userId);

		// Reward the user
		userCoins.addCoins(userId, WORK_REWARD);

		const updatedCoins = userCoins.getCoins(userId);

		try {
			await interaction.editReply(`💼 You worked hard and earned **${WORK_REWARD} coins**! You now have **${updatedCoins}** 🪙 coins :3`);
		} catch (error) {
			console.error(error);
			if (!interaction.replied) {
				await interaction.reply({ content: 'Something went wrong~ 😿',  flags: MessageFlags.Ephemeral });
			}
		}
	}
};
