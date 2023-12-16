const { MongoClient } = require("mongodb");
const { DisconnectReason, makeInMemoryStore, useMultiFileAuthState, fetchLatestBaileysVersion, makeWASocket, makeMongoStore, useMongoDBAuthState, removeCreds } = require('@iamrony777/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const express = require('express');
const { QuickDB } = require('quick.db');
const fs = require("fs");
const { Collection } = require('discord.js');
const config = require('./config.js');
const botName = config.botName;
const qr = require("qr-image");
const contact = require('./connects/contact.js');
const { MessageHandler, vorterx } = require('./lib/client.js');

const app = express();
const PORT = process.env.PORT;

if (!process.env.MONGODB) {
  console.error("Mongodb URL has not been provided yet...");
  process.exit(1);
}

const sessionId = config.SESSION_ID.replace(/\s/g, '_');
if (!sessionId) {
  console.error("config.SESSION_ID is not defined.");
  process.exit(1);
}

async function startAztec() {
  try {
    console.log("Initializing...");

    const inMemoryStore = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });
    const { state, saveCreds } = await useMultiFileAuthState(sessionId);

    console.log("Aztec state loaded successfully.");

    const mongo = new MongoClient(process.env.MONGODB, {
      socketTimeoutMS: 1_00_000,
      connectTimeoutMS: 1_00_000,
      waitQueueTimeoutMS: 1_00_000,
    });

    const authC = mongo.db(sessionId).collection("auth");
    const { state: mongoState, saveCreds: saveMongoCreds } = await useMongoDBAuthState(authC);

    const mongoStore = makeMongoStore({
      filterChats: true,
      db: mongo.db(sessionId),
      autoDeleteStatusMessage: true
    });

    let vorterx = makeWASocket({
      logger: P({ level: "silent" }),
      auth: {
      creds: state.creds,   
      keys: makeCacheableSignalKeyStore(state.keys),
    },
    printQRInTerminal: true,
  });

    if (mongoStore) {
      mongoStore.bind(vorterx.ev);
    } else {
      console.error("Error: 'mongoStore' is undefined. Please fix.");
    }

    vorterx.cmd = new Collection();
    vorterx.contactDB = new QuickDB().table('contacts');
    vorterx.contact = contact;

    async function readcommands() {
      const cmdfile = fs.readdirSync("./plugins").filter((file) => file.endsWith(".js"));
      for (const file of cmdfile) {
        const command = require(`./plugins/${file}`);
        vorterx.cmd.set(command.name, command);
      }
    }

    await readcommands();

    vorterx.ev.on('creds.update', async () => {
      await saveCreds();
      await saveMongoCreds();
    });

    vorterx.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      console.log("Connection update:", connection);

      if (connection === "open") {
        console.log('Connection is open!');
        console.log('Plugins loaded♻️');
        console.log('WhatsApp chatbot has connected✔️');
    
        const toxic = `Hello, I am your WhatsApp chatbot Aztec. Ready to assist you!`;
        vorterx.sendMessage(vorterx.user.id, { text: toxic });
      } else if (connection === "close") {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

        switch (reason) {
          case DisconnectReason.connectionClosed:
          case DisconnectReason.connectionLost:
            console.log("[🐏AZTEC] Connection closed or lost, reconnecting in 3000ms.");
            setTimeout(() => {
    
            }, 3000);
            break;
          case DisconnectReason.loggedOut:
            console.log("[😭AZTEC] Device Logged Out, Cleaning up session.");
            await removeCreds();
            process.exit();
            break;
          case DisconnectReason.restartRequired:
            console.log("[♻️AZTEC] Server starting.");
            
            break;
          case DisconnectReason.timedOut:
            console.log("[🎰AZTEC] Connection Timed Out, Trying to Reconnect.");
            
            break;
          default:
            console.log("[🌬AZTEC] Server Disconnected: Maybe Your WhatsApp Account got banned");
        }
      }

      if (update.qr) {
        vorterx.QR = qr.imageSync(update.qr);
      }
    });

    app.get("/", (req, res) => {
      res.end(vorterx.QR);
    });

    vorterx.ev.on('messages.upsert', async (messages) => await MessageHandler(messages, vorterx));
    vorterx.ev.on('contacts.update', async (update) => await contact.saveContacts(update, vorterx));

    await mongo.connect();
    process.on('exit', async () => {
      await mongo.close();
    });

    process.on('SIGINT', async () => {
      await mongo.close();
      await removeCreds();
      process.exit();
    });

  } catch (error) {
    console.error("An error occurred during initialization:", error);
    process.exit(1);
  }
}

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

async function main() {
  await startAztec();
  await startServer();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
