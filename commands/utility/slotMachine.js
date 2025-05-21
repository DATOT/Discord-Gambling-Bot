const { SlashCommandBuilder } = require('discord.js');
const userCoins = require('../../items/coins'); // Adjust the path if needed!

const price = 10;
const moneyFor2 = 30;
const moneyForJackpot = 70;
const moneyForLoseHard = 20;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slotmachine')
		.setDescription('Try your luck with the slot machine! 🎰'),

	async execute(interaction) {
		const userId = interaction.user.id;
		const symbols = [
			'🍒', '🍋', '🍊', '🍉',
			'⭐', '7️⃣', '💎', '🔥',
			'💰', '🎲', '💀', '✨',
		];

		if (userGamblingData.hasStartedGambling(userId)) {
			await interaction.reply('You didnt start gambling yet~\nUse `/startgambling` to start gambling :3');
			return;
		}

		let currentCoins = userCoins.getCoins(userId);

		if (currentCoins < price) {
			await interaction.reply(`You need at least ${price} coins to play! You currently have ${currentCoins} 🪙 :3`);
			return;
		}

		currentCoins -= price;


		// Roll 3 random symbols
		const roll = () => symbols[Math.floor(Math.random() * symbols.length)];
		const slot1 = roll();
		const slot2 = roll();
		const slot3 = roll();

		const result = `${slot1} | ${slot2} | ${slot3}`;
		let message = `# 🎰 SLOT MACHINE 🎰\n${result}\n\n`;
		message += `By using slot machine you lose **${price} coins**\n`;

		// Check win conditions
		if (slot1 === slot2 && slot2 === slot3) {
			if (slot1 === '💀') {
				message += '💀 **YOU LOSE HARD!**';
				currentCoins -= moneyForLoseHard;
			} else {
				message += '🎉 **JACKPOT!! YOU WIN!** 🎉';
				currentCoins += moneyForJackpot;
			}
		} else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
			message += '✨ **Nice! Two matched! You win a little!** ✨';
			currentCoins += moneyFor2;
		} else {
			message += '💔 No match... better luck next time!';
		}

		// Update user coins and reply
		userCoins.setCoins(userId, currentCoins);

		message += `\n\nYou now have **${currentCoins}** 🪙 coins :3`;

		try {
			await interaction.deferReply();
			await interaction.editReply(message);
		} catch(error) {
			console.log(error);
			if (!interaction.replied) {
			  await interaction.reply({ content: 'Something went wrong~ 😿', ephemeral: true });
			}
		}
	},
};