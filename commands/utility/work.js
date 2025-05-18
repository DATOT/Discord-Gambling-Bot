const { SlashCommandBuilder } = require('discord.js');
const userCoins = require('../../item/coins'); // make sure this path matches your folder layout~ :3
const userWorkData = new Map(); // still in-memory unless you wanna persist it too~ :3

const WORK_REWARD = 20;
const WORK_LIMIT = 2;
const DAY_MS = 24 * 60 * 60 * 1000 / 2;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to earn 20 coins (Max 2 times per day)'),

	async execute(interaction) {
		const userId = interaction.user.id;

		// Make sure user has a wallet
		if (!userCoins.exists(userId)) {
			await interaction.reply('You need to start gambling first using `/startgambling` :3');
			return;
		}

		// Get or initialize work data
		let workInfo = userWorkData.get(userId);
		const now = Date.now();

		if (!workInfo) {
			workInfo = {
				count: 0,
				lastReset: now
			};
		}

		// Reset daily work limit if 12h passed
		if (now - workInfo.lastReset > DAY_MS) {
			workInfo.count = 0;
			workInfo.lastReset = now;
		}

		// If limit reached
		if (workInfo.count >= WORK_LIMIT) {
			await interaction.reply('You’ve already worked **2 times today**~ 😿 Come back tomorrow! :3');
			return;
		}

		// Reward the user
		userCoins.addCoins(userId, WORK_REWARD);
		workInfo.count++;
		userWorkData.set(userId, workInfo);

		const updatedCoins = userCoins.getCoins(userId);

		await interaction.reply(`💼 You worked hard and earned **${WORK_REWARD} coins**! You now have **${updatedCoins}** 🪙 coins :3`);
	}
};
