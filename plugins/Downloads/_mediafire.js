/*
* @Author: DiegosonTech
* @BotName: Aztec-MD
*/

const { mediafiredl } = require('@bochilteam/scraper');
const { tiny } = require('@viper-x/fancytext');
const config = require('../../config.js');
const { Zenith } = require ('../../lib/_cmd_sxntax.js');

function isValidUrl(string) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(string);
}

Zenith(
  {
  usage: 'mediafire',
  category: 'Downloads',
  desc: 'Download files from MediaFire links',
  filename: __filename
}, async (vorterx, coax, args, react) => {
    try {
      if (args.length === 0 || !isValidUrl(args[0])) {
        await react('❌');
        return coax.reply('Please provide a valid MediaFire link.');
      }

      await react('📤');
      await coax.reply(`\`\`\`Downloading your media, wait...⏳\`\`\``);

      const result = await mediafiredl(args[0]);

      if (result) {
        const { url, filetype, filename, ext, filesizeH } = result;

        const v_cap = `
╭──*『 MEDIAFIRE DOWNLOAD 』*
│ *Name:* ${filename}
│ *Size:* ${filesizeH}
│ *Type:* ${filetype}
╰───────────────────༓\n\n*${config.CAPTION}*`;

        await vorterx.sendMessage(coax.from, {
          url,
          caption: tiny(v_cap),
          document: { url: filename, mimetype: ext },
          quoted: coax,
        });
      } else {
        await react('❌');
        return coax.reply('Failed to download the file. Please check the MediaFire link.');
      }
    } catch (error) {
      console.error(error);
      await react('❌');
      return coax.reply('An unexpected error occurred during the download process.');
    }
  });
          
