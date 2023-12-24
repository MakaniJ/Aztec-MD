/*
* @Author: DiegosonTech
* @BotName: Aztec-MD
*/

const fetch = async (url) => import('node-fetch').then(module => module.default(url));
const config = require('../../config.js');

module.exports = {
  name: 'blackbox',
  category: 'GPT AI',
  async client(vorterx, m, { args, connect }) {
    
    if (!args) {
      await connect('❌');
      return m.reply(
        "```\nError 404: Text not found. Please provide a text to get results...\n```"
      );
    }

    const app = `https://mzn-api.onrender.com/ai/blackbox?prompt=${encodeURIComponent(args)}`;
    
    const res = await fetch(app);
    const result = await res.json();

    const formattedResult = JSON.stringify(result, null, 2);

    await connect('🤖');
    return m.reply(formattedResult);
  },
};
