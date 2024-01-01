const axios = require("axios");
const { Zenith } = require('../../lib/_cmd_sxntax.js');

Zenith(
  {
    usage: "xnxxsh",
    desc: "18+ videos only",
    category: "Downloads",
    filename: __filename,
  },
  async (vorterx, coax, react, { args }) => {
    
    if (!args) {
      await react("❌");
      return coax.reply("Please provide a search term.");
    }

    const xnxx_vid = `https://raganork-network.vercel.app/api/xvideos/search?query=${args}`;

    axios.get(xnxx_vid)
      .then(response => {
        console.log(response.data);

        if (response.data && response.data.result.length > 0) {
          const resultList = response.data.result.map((result, index) => {
            return `:fire: **xnxx ${index + 1}**\n:clapper: *Title:* ${result.title}\n:link: *Link:* ${result.url}\n\n`;
          });
          return coax.reply(resultList.join('\n'));
        } else {
          return coax.reply(":x: No results found.");
        }
      })
      .catch(error => {
        console.error(error);
        return coax.reply(":warning: An error occurred while fetching the data.");
      });
  }
);
      
