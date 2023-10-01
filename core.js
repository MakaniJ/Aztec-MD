const mongoose = require('mongoose');
const {
  default: AztecConnect,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  Browsers,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const PORT = (process.env.PORT);
const PREFIX = (process.env.PREFIX);
const BOTNAME = (process.env.BOTNAME);
const { imageSync } = require('qr-image');
const path = require('path');
const { say } = require('cfonts');
const express = require("express");
const config = require('./config');
const vorterx = require('./lib/message/vorterx.js');
const { QuickDB } = require('quick.db')
const { MongoDriver } = require('quickmongo');
const fs = require("fs");
const { Collection } = require('discord.js')
const chalk = require('chalk');
const { remove } = require('fs-extra');
const contact = require("./mangoes/contact.js");
const MessageHandler = require('./lib/message/vorterx.js');
const driver = new MongoDriver(process.env.MONGODB_URI)
const store = makeInMemoryStore({
  logger: P().child({
    level: 'silent',
    stream: 'store'
  })
})

async function startAztec() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const { MakeSession } = require("./lib/session");

    const { state, saveCreds } = await useMultiFileAuthState('/connects/creds.json');

    if (!fs.existsSync(sessionCredentialsPath)) {
      await MakeSession(config.session_id, sessionCredentialsPath);
      console.log("Version: " + require("./package.json").version);
    }

    say("%c AZTEC MD", "font-weight: bold;font-size: 50px;color: red;text-shadow: 3px 3px 0 rgb(217,31,38) ,6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) ,12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) ,18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113); margin-bottom: 12px; padding: 5%");

    const vorterxInstance = AztecConnect({
      logger: P({ level: "silent" }),
      printQRInTerminal: true,
      browser: Browsers.macOS("Desktop"),
      auth: state,
      qrTimeout: undefined,
      version: (await fetchLatestBaileysVersion()).version,
    });

    console.log("[🚀AZTEC WABOT HAS STARTED TO LAUNCH]");

    store.bind(vorterxInstance.ev);

    vorterxInstance.cmd = new Collection();
    vorterxInstance.DB = new QuickDB({
      driver
    });
    vorterxInstance.contactDB = vorterxInstance.DB.table('contacts');
    vorterxInstance.contact = contact;

    async function readCommands() {
      const cmdFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
      for (const file of cmdFiles) {
        const command = require(`./commands/${file}`);
        vorterxInstance.cmd.set(command.name, command);
      }
    }

    await readCommands();

    vorterxInstance.ev.on('creds.update', saveCreds);
    vorterxInstance.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (update.qr) {
        console.log(`[${chalk.red('!')}]`, 'white');
        vorterxInstance.QR = imageSync(update.qr);
      }
      if (connection === "open") {
        console.log("💗 You have successfully logged in to Aztec");
        const max = `\`\`\`*👾AZTEC BEEN CONNECTED👾*\n*VERSION* : ${require(__dirname + "/package.json").version}\n*BOTNAME* : ${global.botname}\n*UPDATED* : LATEST\n *PREFIX* : ${global.prefix} \`\`\``;
        vorterxInstance.sendMessage(vorterxInstance.user.id, {
          text: max,
        });
      }
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.connectionClosed) {
          console.log("[👾 AZTEC ] Connection closed, reconnecting....");
          startAztec();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("[👾AZTEC ] Connection Lost from Server, reconnecting...");
          startAztec();
        } else if (reason === DisconnectReason.loggedOut) {    await remove('session');
          console.log("[👾 AZTEC ] Device Logged Out, Please Delete Session and Scan Again.");
          process.exit(0);
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("[👾 CONNECT ] Server starting...");
          startAztec();
        } else if (reason === DisconnectReason.timedOut) {
          console.log("[👾 CONNECT ] Connection Timed Out, Trying to Reconnect....");
          startAztec();
        } else {
          vorterxInstance.end(`[👾 SERVER ] Server Disconnected: ${reason} | ${connection}`);
        }
      }
    });

    app.get('/', (req, res) => {
      res.status(200).setHeader('Content-Type', 'image/png').send(vorterxInstance.QR);
    });

    vorterxInstance.ev.on('messages.upsert', async (messages) => await MessageHandler(messages, vorterxInstance));
    vorterxInstance.ev.on('contacts.update', async (update) => await contact.saveContacts(update, vorterxInstance));
  } catch (error) {
    console.error('Error starting Aztec:', error);
    process.exit(1);
  }
}

mongoose.set('useFindAndModify', false);

if (!process.env.MONGODB_URI) {
  console.error('❌Error: Provide a MONGODB URL to continue the process');
  vorterxInstance.sendMessage(vorterxInstance.user.id, {
    text: 'Error: Please provide a MongoDB URL to continue the process',
  });
} else {
  driver.connect()
    .then(() => {
      console.log(chalk.green.bold('👨‍💻You have connected to Aztec-MD'));
      startAztec();
    })
    .catch((err) => console.error(err));

  app.listen(PORT, () => {
    console.log(`⚡Bot is running on Port ${PORT}`);
  });
}
