const { Zenith } = require ('../../lib/_cmd_sxntax.js');


Zenith(
  {
  usage: "gcname",
  category: "Group",
  desc: "Change the group name",
  filename: __filename
}, async (vorterx, coax, args, isBotAdmin, isGroup, react) => {
    
    if (!isGroup) {
      await react("❌");
      return coax.reply("⛔️*This command is only for group admins.*");
    }

    if (!isBotAdmin) {
      await react("❌");
      return coax.reply("⛔️ *I need to be an admin to use this command.*");
    }

      if (!args) {
      await react("❌");
      return coax.reply("⛔️ *Please provide the new group name you want to update to.*");
    }

    await react("🔉");

    const D3centX = [
      "🎉 Group name successfully changed! 🎊",
      "✨ The group name has been updated! ✨",
      "🔥 New group name set! 🔥",
      "🌟 Group name has been modified! 🌟",
      "💥 Group name successfully updated! 💥",
    ];

    const random_D3centX = D3centX[Math.floor(Math.random() * D3centX.length)];
    const caption = `*${random_D3centX}*\n\n🏷️ New group name: ${args}`;

    await vorterx.groupUpdateSubject(coax.from, text);
    await coax.reply(caption);
   });
