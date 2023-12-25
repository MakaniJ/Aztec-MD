/*
* @Author: DiegosonTech
* @BotName: Aztec-MD 
*/

const fs = require("fs");
const { tiny } = require("@viper-x/fancytext");
const config = require("../../config.js");
const { getBuffer } = require('../../lib/_getBuffer.js');
const prefix = config.prefix;

module.exports = {
  name: 'alive',
  alias: ['bot'],
  description: 'To check the bot alive or off',
  category: 'Mics',
  async client(vorterx, m, {  connect }) {
   
    await connect('🧘');
    const image = {
      url: "https://i.ibb.co/grM9VLh/091e4657090fdaa14cb3fb9f69cfa7e6.jpg",
      mimetype: "image/jpeg",
    };

    let aliveMsg = ` 
╭––『 *CHAT ON* 』 
┆ ${m.pushName}
╰–❖ __
╭–––––––––––––––༓ 
┆✑  *Alive now🌷*
╰–––––––––––––––༓ 
╭–– 『 *Bot Status* 』      
┆ *Name* : ${process.env.BOTNAME}
┆ *Owner* : ${process.env.OWNER_NAME}
┆ *Prefix* :  ${prefix}
┆ *Time* : ${new Date().toLocaleTimeString()}
╰–––––––––––––––༓\n\n*${config.CAPTION}*
`;
    const messageOptions = {
      image: image,
      caption: tiny(aliveMsg),
      contextInfo: {
        externalAdReply: {
          title: `${config.CAPTION}`,
          body: "vorterx",
          thumbnail: await getBuffer("https://i.ibb.co/grM9VLh/091e4657090fdaa14cb3fb9f69cfa7e6.jpg"),
          mediaType: 1,
          mediaUrl: "",
          sourceUrl: "",
          ShowAdAttribution: true,
          forwardingScore: 999,
          isForwaded: true,
        },
      },
    };

    await vorterx.sendMessage(m.from, messageOptions, { quoted: m });
  }
  }
