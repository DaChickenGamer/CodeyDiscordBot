import {SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Deletes x amount of messages")
        .addIntegerOption(option =>
            option.setName("x")
                .setDescription("amount of messages to delete")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const amountOfMessages = interaction.options.getInteger("x") || 0;

        const channel = interaction.channel;

        if (!channel || !channel.isTextBased()) {
            await interaction.reply("This command can only be used in a text channel.");
            return;
        }

        const textChannel = channel as TextChannel;

        try {
            const messages = await textChannel.messages.fetch({ limit: amountOfMessages });

            const deleted = await textChannel.bulkDelete(messages, true);

            await interaction.reply(`🧹 Deleted ${deleted.size} message(s).`);
        } catch (error) {
            console.error("Bulk delete error:", error);
            await interaction.reply({
                content: "❌ Could not delete messages. They might be older than 14 days, or I lack permissions.",
                ephemeral: true,
            });
        }
    }
}