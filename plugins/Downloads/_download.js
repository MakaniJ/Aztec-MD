const { Zenith } = require ('../../lib/_cmd_sxntax.js');
const bocil = require('@bochilteam/scraper');
const { tiny } = require('@viper-x/fancytext');
const config = require('../../config.js');
const { YTM3 } = require('../../lib/YTM3.js');
const ytdl = require('ytdl-core');
const gis = require('g-i-s');
const { ttdl, igdl } = require('btch-downloader');
const axios = require('axios');


function gisPromise(args) {
  return new Promise((resolve, reject) => {
    gis(args, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

Zenith(
    {
    usage: "fb",
    desc: "To download Facebook",
    category: "Downloads",
    filename: __filename
    }, async (vorterx, coax, react, {args}) => {
       
        try {
            if (!args) {
                await react("❌");
                return coax.reply(`*Please Provide a Valid Facebook Video Link*`);
            } else {
                await react("📤");
                bocil.facebookdlv2(`${args}`).then(async (data) => {

                    const { filesizeH, quality } = data.result[0];
                    let caption = `*Quality* : ${quality}\n\n*${config.CAPTION}*`;
                    vorterx.sendMessage(coax.from, {
                        video: {
                            url: data.result[0].url
                        },
                        caption: tiny(caption)
                    }, {
                        quoted: coax
                    });
                });
            }
        } catch (error) {
            vorterx.sendMessage(coax.from, {
                text: "Error occurred while processing"
            });
        }
    });

  //---------------------------------------------------------------------------                                

Zenith(
  {
  usage: 'gimage',
  alias: ['googleimg'],
  category: 'Downloads',
  desc: 'To Download with gimage',
  filename: __filename
  }, async (vorterx, coax, react, {args}) => {
    
    if (!args) {
      await react('❌');
      return coax.reply('Please provide an image name...');
    }
    await react('✔️');

    try {
      const search = await gisPromise(args);
      if (!search || search.length === 0) {
        await react('❌');
        return coax.reply('_No images found for the given term...');
      }

      const random_img = search[Math.floor(Math.random() * search.length)].url;
      const res = {
        image: { url: random_img },
        caption: `*GIMAGE DOWNLD*\n\n*TERM*: ${args}\n\n*${config.CAPTION}*`
      };

      vorterx.sendMessage(coax.from, res, { quoted: coax });
    } catch (error) {
      console.error(error);
      await react('❌');
      return coax.reply('An error occurred while fetching images...');
    }
  });

  //---------------------------------------------------------------------------                                

Zenith(
  {
  usage: 'insta',
  alias: ['ig'],
  category: 'Downloads',
  decs: 'to download insta vids',
  filename: __filename
  }, async (vorterx, coax, react, {args}) => {
   
    if (!args) {
      await react('❌');
      return coax.reply('Please provide a valid Instagram URL.');
    }

    try {
      const url = args;
      const data = await igdl(url);
      if (!data || data.length === 0) {
        return coax.reply('Failed to download the video.');
      }

      console.log(data);
      await react('📤');
      coax.reply(`\`\`\`Downloading your video, please wait...⏳\`\`\``);

      for (let i of data) {
        const { quality, size, url } = i;
        const vidi = `*Quality* : 420p\n\n*${config.CAPTION}*`;

        vorterx.sendMessage(coax.from, { video: { url }, caption: tiny(vidi)}, {quoted: coax });
      }
    } catch (error) {
      console.error(error);
      return coax.reply('Failed to download the video.');
    }
  });
                                                           
//---------------------------------------------------------------------------                                

Zenith (
  {
  usage: 'tiktok',
  alias: ['tik', 'tiktokdl', 'ttdl'],
  category: 'Downloads',
  desc: 'To download TikTok videos',
  filename: __filename
}, async (vorterx, coax, react, {args}) => {
    if (!args) {
      await react('❌');
      return coax.reply('Provide a valid TikTok video URL...');
    }

    await react('📥');
    coax.reply(`\`\`\`Downloading TikTok video, please wait...⏳\`\`\``);
    const result = await ttdl(args);

    if (result && result.video && result.video.length > 0) {
      const get_vid = result.video[0];
      const caption = `*Title:* ${result.title}\n*Audio:* ${result.title_audio}\n\n*${config.CAPTION}*`;

      await vorterx.sendMessage(coax.from, { video: { url: get_vid }, caption: tiny(caption) });
    } else {
      await react('❌');
      return coax.reply('Failed to download the TikTok video...');
    }
});

//---------------------------------------------------------------------------                                

Zenith(
  {
  usage: "xnxxdn",
  desc: "Download XNXX videos",
  category: "Downloads",
  filename: __filename
  }, async (vorterx, coax, react, {args}) => {
   
   if (!args) {
      await react("❌");
      coax.reply("*Missing XNXX link, please provide one.*");
      return;
    }

    let urlYt = args;
    if (!urlYt.startsWith("https")) {
      await react("❌");
      coax.reply("*😏 Provide me with an XNXXVD link.*");
      return;
    }

    await react("🍑");
    const res = await axios(`https://raganork-network.vercel.app/api/xvideos/download?url=${args}`);
    const video = res.data;

    let ca_pe = `
*XNXX VIDEO DOWNLOAD*\n\n
*PUSSY*

*${config.CAPTION}*
`;

    let buttonMessage = {
      video: video,
      mimetype: "video/mp4",
      fileName: `vorterx.mp4`,
      caption: tiny(ca_pe),
      gifPlayback: false,
      height: 496,
      width: 640,
      headerType: 1,
      messageOptions: {
        textColor: "#ffffff", 
        backgroundColor: "#000000", 
        footerTextColor: "#ffffff",
        footerBackgroundColor: "#333333",  
      },
    };

    return await vorterx.sendMessage(coax.from, buttonMessage, { quoted: coax });
  });

//---------------------------------------------------------------------------                                

Zenith(
  {
    usage: 'song',
    category: 'Downloads',
    desc: 'Downloads and sends the requested song',
    filename: __filename,
  },
 async (vorterx, coax, react, {args}) => {
   
    if (!args) {
      await react('❌');
      return coax.reply('__Please provide a song name__.');
    }

    const Query = args;
    YTM3.searchMusic(Query, async (err, results) => {
      if (err) {
        console.error(err);
        await react('❌');
        return coax.reply('__Error searching for music...');
      }

      if (results.length === 0) {
        await react('❌');
        return coax.reply(`__No results found for '${Query}'.`);
      }
      const gotQuery = results[0];
      const stream = ytdl(gotQuery.url, { filter: 'audioonly' });
      vorterx.sendMessage(coax.from, { file: stream, name: `${gotQuery.title}.mp3` });
      await react('✅');
      return coax.reply(`_Downloading:'${gotQuery.title}'.`);
    });
  }
);

//---------------------------------------------------------------------------                                

