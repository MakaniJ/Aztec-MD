const malScraper = require('mal-scraper');
const { Zenith } = require('../../lib/_cmd_sxntax.js');

Zenith(
  {
  usage: 'anime',
  category: 'Anime',
  filename: __filename
  }, async (vorterx,m, react,{args}) => {
    
    try {
      if (!args) {
        await react('❌');
        return m.reply(`🚫 Please provide the name of an anime, e.g., "Dragon Ball"`);
     }
      const animeInfo = await malScraper.getInfoFromName(args).catch(() => null);
      if (!animeInfo) {
        await react('❌');
        return m.reply(`❗ Sorry, couldn't retrieve data for the provided anime name.`);
      }

      const {
        title,
        type,
        premiered,
        episodes,
        status,
        genres,
        studios,
        score,
        rating,
        ranked,
        popularity,
        trailer,
        synopsis,
        picture,
      } = animeInfo;

      const list = `
*ANIMATION INFORMATION*\n
*-🎀Title*: ${title}
*-🌷Type*: ${type}
*-🌵Premiered on*: ${premiered}
*-💫Total Episodes*: ${episodes}
*-📈Status*: ${status}
*-🧧Genres*: ${genres}
*-🎋Studio*: ${studios}
*-🕹️Score*: ${score}
*-🌟Rating*: ${rating}
*-📍Rank*: ${ranked}
*-🎗Popularity*: ${popularity}
*-🎃Trailer*: ${trailer}
*-❄Description*: ${synopsis}`;

await vorterx.sendMessage(m.chat, { image: { url: picture }, caption: list }, { quoted: m});
    } catch (error) {
      console.error(error);
      await react('❌');
      return m.reply(`❌ An error occurred while processing the request.`);
    }
  });          
