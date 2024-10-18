const TelegramBot = require('node-telegram-bot-api');
function getBotInstance(botToken) {
    const bot = new TelegramBot(botToken, { polling: true });
    return bot;
}

module.exports = {
    getBotInstance,
}