const { SlashCommandBuilder } = require("discord.js");
const userCoins = require('../../items/coins');
const userGamblingData = require('../../items/gamblingData');

module.exports = {
  data: new SlashCommandBuilder() 
    .setName('startgambling')
    .setDescription('LETS GO GAMBLING!!!'),

  async execute(interaction) {
    const userId = interaction.user.id;
    let message = '# LETS GO GAMBLING!!!\n';

    // Only defer the reply if it hasn't already been done
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply(); // Do this FIRST before any logic
    }

    if (!userGamblingData.hasStartedGambling(userId)) {
      userCoins.setCoins(userId, 100);
      userGamblingData.setStartedGambling(userId, true);
      console.log(`Here is your money ${interaction.user.username}:3`);
      message += '🎁 You are rewarded **100 coins** to start gambling!';
    } else {
      message += 'You already started gambling nya~ 😼';
    }

    try {
      await interaction.editReply(message); // Edit the reply after logic
    } catch (error) {
      console.error(error);
    }
  }
};
