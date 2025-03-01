require('dotenv').config();
const { Telegraf } = require('telegraf');
const Database = require('better-sqlite3');
const path = require('path');

// Use /tmp directory for the database file, which is writable in Vercel lambdas
const dbPath = path.join('/tmp', 'tokens.db');
const db = new Database(dbPath, { fileMustExist: false }); // Allow creating the file if it doesn’t exist

// Create the tokens table if it doesn’t exist
db.exec(`CREATE TABLE IF NOT EXISTS tokens (
  address TEXT PRIMARY KEY,
  chain TEXT,
  price REAL,
  volume REAL,
  liquidity REAL,
  created_at INTEGER
)`);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function monitorTokens() {
  // Revert to random data for production
  const dummyToken = { name: "BeastCoin", price: Math.random() * 10, liquidity: Math.random() * 5000 };
  console.log(`[${new Date().toLocaleTimeString()}] Checking ${dummyToken.name} - Price: $${dummyToken.price.toFixed(2)}, Liquidity: $${dummyToken.liquidity.toFixed(2)}`);
  try {
    if (dummyToken.liquidity < 1000) {
      try {
        await bot.telegram.sendMessage(
          process.env.TELEGRAM_CHAT_ID,
          `🚨 Rug-Pull Alert: ${dummyToken.name} liquidity dropped below $1K!`
        );
        console.log("Sent rug-pull alert");
      } catch (telegramError) {
        console.error("Failed to send rug-pull alert:", telegramError.message);
      }
    }
    if (dummyToken.price > 5) {
      try {
        await bot.telegram.sendMessage(
          process.env.TELEGRAM_CHAT_ID,
          `📈 Pump Alert: ${dummyToken.name} surged to $${dummyToken.price.toFixed(2)}!`
        );
        console.log("Sent pump alert");
      } catch (telegramError) {
        console.error("Failed to send pump alert:", telegramError.message);
      }
    }
  } catch (error) {
    console.error("Error in monitorTokens:", error.message);
  }
}

setInterval(monitorTokens, 5 * 60 * 1000);
monitorTokens();

try {
  bot.launch();
  console.log("Beast Bot is running in polling mode!");
} catch (error) {
  console.error("Failed to launch bot:", error.message);
}

module.exports = (req, res) => {
  res.status(200).send("Beast Bot is active!");
};