const { SlashCommandBuilder } = require('discord.js');
const userCoins = require('../../items/coins');
const userWorkData = new Map(); // You can move this to a persistent storage later :3

const WORK_REWARD = 20;
const WORK_LIMIT = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to earn 20 coins (Max 2 times per day)'),

	async execute(interaction) {
		const userId = interaction.user.id;

		// Initialize coin wallet if missing
		if (!userCoins.has(userId)) {
			await interaction.reply('You need to start gambling first using `/startgambling` :3');
			return;
		}

		// Get work data
		let workInfo = userWorkData.get(userId);

		const now = Date.now();

		if (!workInfo) {
			workInfo = {
				count: 0,
				lastReset: now
			};
		}

		// Reset daily work count if it's been over a day
		if (now - workInfo.lastReset > DAY_MS) {
			workInfo.count = 0;
			workInfo.lastReset = now;
		}

		// Check if user reached the limit
		if (workInfo.count >= WORK_LIMIT) {
			await interaction.reply('You’ve already worked **2 times today**~ 😿 Come back tomorrow! :3');
			return;
		}

		// Reward coins
		const currentCoins = userCoins.get(userId);
		userCoins.set(userId, currentCoins + WORK_REWARD);
		workInfo.count++;
		userWorkData.set(userId, workInfo);

		await interaction.reply(`💼 You worked hard and earned **${WORK_REWARD} coins**! You now have **${currentCoins + WORK_REWARD}** 🪙 coins :3`);
	}
};