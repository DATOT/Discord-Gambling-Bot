const { SlashCommandBuilder } = require("discord.js");
const userCoins = require('../../items/coins');
const userGamblingData = require('../../items/gamblingData');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll a dice and optionally place a bet')
		.addIntegerOption(option =>
			option.setName('bet')
				.setDescription('Amount of coins to bet')
				.setMinValue(1)
		)
		.addIntegerOption(option =>
			option.setName('bet_on_number')
				.setDescription('Number to bet on (1–6)')
				.setMinValue(1)
				.setMaxValue(6)
		),

	async execute(interaction) {
		const userId = interaction.user.id;
		const bet = interaction.options.getInteger('bet') ?? 0;
		const betOn = interaction.options.getInteger('bet_on_number');

		if (userGamblingData.hasStartedGambling(userId)) {
			await interaction.reply('You didn’t start gambling yet~\nUse `/startgambling` to start gambling :3');
			return;
		}

		const currentCoins = userCoins.getCoins(userId);

		// Check coin balance
		if (bet > currentCoins) {
			await interaction.reply(`❌ You only have **${currentCoins} coins**! You can’t bet that much :3`);
			return;
		}

		// Must choose a number if betting
		if (bet > 0 && betOn === null) {
			await interaction.reply('❗ You must pick a number to bet on (1–6) nya~!');
			return;
		}

		const diceRoll = Math.floor(Math.random() * 6) + 1;
		let resultMessage = `# 🎲 ROLL A DICE 🎲\n\n`;
		resultMessage += `🎲 You rolled a **${diceRoll}**!\n`;

		if (bet > 0) {
			if (diceRoll === betOn) {
				const winnings = bet * 3;
				userCoins.addCoins(userId, winnings);
				const updatedCoins = userCoins.getCoins(userId);
				resultMessage += `💰 You won **${winnings} coins**! You now have **${updatedCoins} coins**~! :3`;
			} else {
				userCoins.setCoins(userId, currentCoins - bet);
				const updatedCoins = userCoins.getCoins(userId);
				resultMessage += `😢 You lost **${bet} coins**... You now have **${updatedCoins} coins**~ :c`;
			}
		} else {
			resultMessage += `💡 You didn’t place a bet. You still have **${currentCoins} coins**~ :3`;
		}

		try {
			await interaction.deferReply();
			await interaction.editReply(resultMessage);
		} catch (error) {
			console.error(error);
			if (!interaction.replied) {
				await interaction.reply({ content: 'Something went wrong~ 😿', ephemeral: true });
			}
		}
	}
};
