const { SlashCommandBuilder } = require("discord.js");
const userCoins = require('../../items/coins'); // Adjust the path if needed!

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
				.setDescription('Number to bet on (1-6)')
				.setMinValue(1)
				.setMaxValue(6)
		),

	async execute(interaction) {
		const userId = interaction.user.id;
		const bet = interaction.options.getInteger('bet') ?? 0;
		const betOn = interaction.options.getInteger('bet_on_number');

		if (!userCoins.has(userId)) {
			await interaction.reply('You didnt start gambling yet.\nUse /startgambling to start gambling.')
			return;
		}

		const currentCoins = userCoins.get(userId);

		if (bet > currentCoins) {
			await interaction.reply(`❌ You only have ${currentCoins} coins!`);
			return;
		}

		if (bet > 0 && betOn === null) {
			await interaction.reply('❗ You must pick a number to bet on (1–6)!');
			return;
		}

		const diceRoll = Math.floor(Math.random() * 6) + 1;
		resultMessage = `# 🎲 ROLL A DICE 🎲\n\n`;
		resultMessage += `🎲 You rolled a **${diceRoll}**!\n`;

		if (bet > 0) {
			if (diceRoll === betOn) {
				const winnings = bet * 3;
				userCoins.set(userId, currentCoins + winnings);
				resultMessage += `💰 You won **${winnings} coins**! You now have **${userCoins.get(userId)} coins**.`;
			} else {
				userCoins.set(userId, currentCoins - bet);
				resultMessage += `😢 You lost **${bet} coins**... You now have **${userCoins.get(userId)} coins**.`;
			}
		} else {
			resultMessage += `💡 You didn't place a bet. You still have **${currentCoins} coins**.`;
		}

		try {
			await interaction.deferReply();
			await interaction.editReply(resultMessage);
		} catch(error) {
			console.log(error);
			if (!interaction.replied) {
			  await interaction.reply({ content: 'Something went wrong~ 😿', ephemeral: true });
			}
		};
	}
};
