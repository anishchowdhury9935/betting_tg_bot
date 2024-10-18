const bot_inline_commands = require('../utils/commands/bot_inline_btn_commands');
const bot_commands = require('../utils/commands/bot_commands');
const pay_load_commands = require('../utils/commands/deep_link_commands');
const bot_reply = require('../utils/commands/bot_reply');
const { getChatId, decodeDataFroDeepLink } = require('../helper/helperMain');
const config = require('../../config');

function botMsgHandler(bot) {
    const com_key = Object.keys(bot_inline_commands);
    const bot_commandsItemsArr = Object.keys(bot_commands);
    const bot_replyItemsArr = Object.keys(bot_reply);
    const pay_load_commands_key = Object.keys(pay_load_commands);

    let botInfo;

    // Get the bot's information and store the bot ID
    bot.getMe().then((_botInfo) => {
        botInfo = _botInfo;
    });


    bot_commandsItemsArr.map((key) => {
        const regex = new RegExp(`^/${key}$`);
        bot.onText(regex, async (msg, match) => {
            await bot_commands[key](bot, msg, match);
        });
    })
    bot.onText(/^\/commands/,(msg, match)=>{
        const chatId = getChatId(msg)
        const availableCommands = [
            '/start - Shows bot info & help',
            '/commands - gives available commands ',
            '/games - Shows available games ',
            '/wallet - Shows wallet info',
            `/withdraw - use to withdraw ${config.memeCoinInfo.name}`,
        ]
        let replyTxt = 'Here is available commands 🤖:\n\n'
        availableCommands.map((command) =>{
            replyTxt += `${command}\n`
        })
        bot.sendMessage(chatId,replyTxt)
    })



    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        com_key.map((value) => {
            if (data === value) {
                bot_inline_commands[value](bot, msg);
            }
            bot.answerCallbackQuery(msg.id);
        })
    });





    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        bot_commandsItemsArr.map((value) => {
            if (data === value) {
                bot_commands[value](bot, msg);
            }
            bot.answerCallbackQuery(msg.id);
        })
    });











    bot.on('message', async (replyMsg) => {
        if (replyMsg.reply_to_message !== undefined) {
            if (replyMsg.reply_to_message.from.id === botInfo.id) {
                bot_reply.map(({ repliedMsgTxt, func }) => {
                    if (replyMsg.reply_to_message.text === repliedMsgTxt) {
                        func(bot, replyMsg);
                        return;
                    }
                })
            }
        }
    })














    bot.onText(/\/start(.*)/, (msg, match) => {
        const chatId = getChatId(msg);
        const payload = match[1].trim();
        if (payload) {
            const dataExtractedThroughLink = decodeDataFroDeepLink(match);
            for (let index = 0; index < pay_load_commands_key.length; index++) {
                const element = pay_load_commands_key[index];
                if (element === dataExtractedThroughLink.type) {
                    pay_load_commands[element](bot, msg, match, dataExtractedThroughLink);
                }
            }
        } else {
            // bot.sendMessage(chatId, "No payload provided. Please use the deeplink with your data.");
        }
    });


}



module.exports = {
    botMsgHandler,
}
