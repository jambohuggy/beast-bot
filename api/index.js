require('dotenv').config();
const { Telegraf } = require('telegraf');
const sqlite3 = require('sqlite3').verbose();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.on('message', (ctx) => {
  const chatId = ctx.chat.id;
  console.log(`Your Chat ID is: ${chatId}`);
  bot.telegram.sendMessage(chatId, `Hey @jambohuggy! Your Chat ID is: ${chatId}`);
});

const db = new sqlite3.Database('./tokens.db');
db.run(`CREATE TABLE IF NOT EXISTS tokens (
  address TEXT PRIMARY KEY,
  chain TEXT,
  price REAL,
  volume REAL,
  liquidity REAL,
  created_at INTEGER
)`);

async function monitorTokens() {
  const dummyToken = { name: "BeastCoin", price: Math.random() * 10, liquidity: Math.random() * 5000 };
  console.log(`[${new Date().toLocaleTimeString()}] Checking ${dummyToken.name} - Price: $${dummyToken.price.toFixed(2)}, Liquidity: $${dummyToken.liquidity.toFixed(2)}`);
  try {
    if (dummyToken.liquidity < 1000) {
      await bot.telegram.sendMessage(
        process.env.TELEGRAM_CHAT_ID,
        `🚨 Rug-Pull Alert: ${dummyToken.name} liquidity dropped below $1K!`
      );
      console.log("Sent rug-pull alert");
    }
    if (dummyToken.price > 5) {
      await bot.telegram.sendMessage(
        process.env.TELEGRAM_CHAT_ID,
        `📈 Pump Alert: ${dummyToken.name} surged to $${dummyToken.price.toFixed(2)}!`
      );
      console.log("Sent pump alert");
    }
  } catch (error) {
    console.error("Error sending alert:", error.message);
  }
}

setInterval(monitorTokens, 5 * 60 * 1000);
monitorTokens();

bot.launch();
console.log("Beast Bot is running!");