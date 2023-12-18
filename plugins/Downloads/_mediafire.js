const { mediafiredl } = require('@bochilteam/scraper');
const { tiny } = require('@viper-x/fancytext');
const config = require('../config.js');

function isValidUrl(string) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(string);
}

module.exports = {
  name: 'mediafire',
  category: 'Downloads',
  description: 'Download files from MediaFire links',
  async client(vorterx, m, { args, connect }) {
   
    try {
      if (args.length === 0) {
       await connect('❌');
        return m.reply('Please provide a valid MediaFire link.');
      }

      await connect('📤');
      await m.reply(`\`\`\`Downloading your media, wait...⏳\`\`\``);
      mediafiredl(args[0])
        .then(result => {
          const { url, filetype, filename, ext, filesizeH } = result;

          const v_cap = `
╭──*『 MEDIAFIRE DOWNLOAD 』*
│ *Name:* ${filename}
│ *Size:* ${filesizeH}
│ *Type:* ${filetype}
╰───────────────────༓\n\n*${config.CAPTION}*`;

          vorterx.sendMessage(m.from, {
            url,
            caption: tiny(v_cap),
            document: { url: filename, mimetype: ext },
            quoted: m,
          });
        })
        .catch(error => {
          console.error(error);
          m.reply('An error occurred during the download process...');
        });
    } catch (error) {
      console.error(error);
      m.reply('An unexpected error occurred...');
    }
  },
};
