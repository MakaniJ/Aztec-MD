const config = require('../config.js');

module.exports = {
  name: "owner",
  description: "Get owner information",
  category: "user",
  async xstart(vorterx, m, { xReact }) {
    await xReact("✔️");

    const ownerName = config.mods;
    const logo = "https://i.ibb.co/v47d4BL/IMG-20230429-WA0021.jpg";
    const sourceUrl = `https://wa.me/+${ownerName}?text=Hii+bro,I+am+a+big+fan+`;

    const buttonMessage = {
         contacts: {
         displayName: ownerName,
         contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nORG:;\nTEL;type=CELL;type=VOICE;waid=${ownerName}:+${ownerName}\nEND:VCARD` }],
      },
      contextInfo: {
          externalAdReply: {
          title: "Aztec MD.",
          body: "Powerd by Aztec",
          renderLargerThumbnail: true,
          thumbnailUrl: logo,
          thumbnail: logo,
          mediaType: 1,
          mediaUrl: "",
          sourceUrl: sourceUrl,
         },
        },
       };

    await vorterx.sendMessage(m.from, buttonMessage, { quoted: m });
    },
   };
