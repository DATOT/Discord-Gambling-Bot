const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      // Ensure interaction is deferred before executing logic
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply();  // Defer reply if not already deferred or replied
      }

      await command.execute(interaction);  // Execute the command logic

    } catch (error) {
      console.log("\n\nINTERACTION_CREATE.JS BUG REPORT\n\n");
      console.error(error);

      // Handle error reply, based on whether it's already been replied or deferred
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};
