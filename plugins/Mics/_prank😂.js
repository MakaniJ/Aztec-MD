const { Zenith, REST_BRUH } = require('../..lib/functions');

Zenith({ usage: 'countdown', desc: 'Spooky countdown prank', category: 'Prank' }, async (vorterx, m, react) => {
 
  m.edit('👻 Initiating Spooky Countdown...');
   await react('🤐');
  for (let i = 10; i >= 0; i--) {
    await REST_BRUH(2000); 

    if (i > 0) {
      m.edit(`⏳ ${i}...`);
    } else {
      m.edit('💀 Boo! Spooky countdown complete👻');
      await REST_BRUH(1500); 
      m.edit('🕷️ Surprise! A spider crawls across your screen! 🕷️');
      await REST_BRUH(2000); 
      m.edit('😱 Just kidding! Happy 2024 😂😂😂..omg');
    }
  }
});
