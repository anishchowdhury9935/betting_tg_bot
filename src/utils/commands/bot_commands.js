const config = require("../../../config");
const { TryCatch, getChatId, getTokenBalanceAsBettingAmount, hasTokenAccountForMint, getWalletBasicInfoToProceed } = require("../../helper/helperMain");
const userDetails = require("../../db/models/userDetails");
const { InlineKeyboardMarkup } = require('node-telegram-bot-api');
const { helperWeb3MainObj } = require("../../helper/helperWeb3");
const globalVariables = require("../../global/globalVariables");
const userBettingData = require("../../db/models/userBettingData");

const { createWalletAddress } = helperWeb3MainObj;



const index = {
    create: async (bot, msg, match) => {
        TryCatch(async () => {
            const userName = msg.from.username;
            const replyToMessageId = msg.message_id;
            if (!userName) {
                bot.sendMessage(getChatId(msg), "you didn't have you username please make it first from your settings tab 👍🏻", { reply_to_message_id: replyToMessageId })
                return;
            }
            const findUser = await userDetails.findOne({ userName }).select(['_id']);
            if (!findUser) {
                const newWalletAddress = createWalletAddress();
                await userDetails.create({
                    walletAddress: {
                        publicKey: newWalletAddress.publicKey,
                        privateKey: newWalletAddress.privateKey,
                    },
                    userName
                });
            }
            const replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: 'All games 🕹',
                            callback_data: 'games', // Unique identifier for the button
                        },
                        {
                            text: 'Your wallet 💵',
                            callback_data: 'wallet',
                        },
                    ],
                    [
                        {
                            text: 'Stats📊',
                            callback_data: 'stats',
                        }
                    ]
                ],
            };
            const reply = `Welcome to the ${config.botInfo.botName}!\n\nRight now, we have one exciting game, but more are on the way soon!\n\nTap the 🎰 Available Games button below to explore all the games with detailed descriptions.\n\nYou can use the /commands command to see everything you can do here.\n\nA small portion of each pot goes toward community growth:\n\t• 1% will be burned,\n\t• 0.5% goes into our marketing fund,\n\t• Another 0.5% is reserved for giveaways.\n\nYou can place bets ranging from 10 to 100 ${config.memeCoinInfo.name}, and the winner takes the full pot (after fees).\n\nEvery player gets their own wallet to manage their ${config.memeCoinInfo.name}.\n\nIf you have enough in your wallet, you can jump into games instantly, no extra transaction required.\n\nTo withdraw your ${config.memeCoinInfo.name}, just hit the 💰 Wallet button below.\n\nDive in and have a great time! 🕹`;
            bot.sendMessage(getChatId(msg), reply, { reply_markup: replyMarkup, reply_to_message_id: replyToMessageId });
        });
    },
    wallet: (bot, msg, match) => {
        TryCatch(async () => {
            const userName = msg.from.username;
            const replyToMessageId = msg.message_id;
            const getUserWallet = await userDetails.findOne({ userName }).select(['walletAddress', '-_id']);
            if (getUserWallet) {
                const { publicKey } = getUserWallet.walletAddress
                // bot.sendMessage(getChatId(msg), "");
                if (!hasTokenAccountForMint(publicKey)) {
                    bot.sendMessage(getChatId(msg), `It mit take some time for first time to signin with ${config.memeCoinInfo.name}......`, { reply_to_message_id: replyToMessageId });
                }
                try {
                    const { walletAddress, balance } = await getTokenBalanceAsBettingAmount(userName);
                    const replyMarkup = {
                        inline_keyboard: [
                            [
                                {
                                    text: 'withdraw',
                                    callback_data: 'withdraw', // Unique identifier for the button
                                },
                            ],
                        ],
                    };
                    const replyTxt = `🪙 *WALLET INFO* 🪙\n\n📬 *Your Address:* <code>${walletAddress.publicKey}</code>\n\nYou can use this wallet address to add ${config.memeCoinInfo.name}\n\n 💰*Current Balance:* ${balance > 0 ? balance : 0} ${config.memeCoinInfo.name}\n\nYou can withdraw your *${config.memeCoinInfo.name}* by clicking on the 💸 *Withdraw* button below.`;
                    bot.sendMessage(getChatId(msg), replyTxt, {
                        parse_mode: "HTML",
                        reply_markup: replyMarkup,
                        reply_to_message_id: replyToMessageId
                    });
                    return;
                } catch (error) {
                    bot.sendMessage(getChatId(msg), "failed to make wallet ❌", { reply_to_message_id: replyToMessageId });
                    // throw new Error(error);
                }
            }
            bot.sendMessage(getChatId(msg), "You don't have any wallet 🙅🏻. Please make it first by using the /create command.", { reply_to_message_id: replyToMessageId });
        });
    },
    games: (bot, msg, match) => {
        return TryCatch(async () => {
            const replyToMessageId = msg.message_id;
            let replyTxt = '🎰 All available Games 🎰\n\n';
            globalVariables.games.map(({ name, about }, index) => {
                replyTxt += `no.${index + 1})\n\n${name}\nOverview:${about}\n\n`;
            });
            const replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: 'click here to bet',
                            callback_data: 'bet', // Unique identifier for the button
                        },
                    ],
                ],
            };
            bot.sendMessage(getChatId(msg), replyTxt, { reply_markup: replyMarkup, reply_to_message_id: replyToMessageId });
            return;
        })
    },
    stats: (bot, msg, match) => {
        return TryCatch(async () => {
            const replyToMessageId = msg.message_id;
            const replyTxt = `📊 Your Game Statistics 📊\n\n🏆 Games Won: ${0}\n❌ Games Lost: ${0}\n💰 Total Winnings: ${0} ${config.memeCoinInfo.name}\n\nKeep playing and good luck!\n`
            bot.sendMessage(getChatId(msg), replyTxt, { reply_to_message_id: replyToMessageId });
        })
    },
    bet: (bot, msg, match) => {
        return TryCatch(() => {
            const replyToMessageId = msg.message_id;
            // this has a reply (go to bot_reply.js file for more information)
            // bot.sendMessage(getChatId(msg), `Please reply this message with the amount of ${config.memeCoinInfo.name} you want to bet\n\nbetting ranges to \n${config.bettingInfo.bettingAmount.min}-${config.bettingInfo.bettingAmount.max}${config.memeCoinInfo.name}`);
            bot.sendMessage(getChatId(msg), "Please reply to this message with the game in which you want to bet\n\n example:reply 'rps' to bet on rock paper scissor", { reply_to_message_id: replyToMessageId });
        })
    },
    withdraw: (bot, msg, match) => {
        return TryCatch(async () => {
            const replyToMessageId = msg.message_id;
            // this has a reply (go to bot_reply.js file for more information)
            const userName = msg.from.username;
            const findUser = await userDetails.findOne({ userName }).select(['_id']);
            if (!findUser) {
                bot.sendMessage(getChatId(msg), "You don't have any wallet. Please make it first by using the /create command.", { reply_to_message_id: replyToMessageId });
                return;
            }
            bot.sendMessage(getChatId(msg), "Please reply to this message with the wallet address in which you want to withdraw.", { reply_to_message_id: replyToMessageId });
        })
    },
    mybettings: (bot, msg, match, _specific_chatId) => {
        return TryCatch(async () => {
            const replyToMessageId = msg.message_id;
            // this has a reply (go to bot_reply.js file for more information)
            const chatId = _specific_chatId ? _specific_chatId : getChatId(msg);
            const userName = msg.from.username;
            const basicInfo = await getWalletBasicInfoToProceed(userName, bot, msg);
            if (!basicInfo.isAllTrue) {
                return;
            }
            const findUserBetting = await userBettingData.find({ playersId: { $in: [basicInfo.userBasicData._id] } })
            if (!findUserBetting.length) {
                bot.sendMessage(chatId, 'You have not betted in any game yet!', { reply_to_message_id: replyToMessageId });
                return;
            }
            let replyTxt = '**Your Active bets**\n\n';
            findUserBetting.map((element) => {
                replyTxt += `----------------\nName of game: ${element.nameOfBet}\n\nstatus: ${element.bettingState.isRunning ? 'active 🟢' : 'ended 🔴'}\n\nAmount 💵: ${element.bettingAmount} ${config.memeCoinInfo.name}\n\n${element.bettingState.isRunning ? `play link :\nhttps://t.me/${config.botInfo.botTgUserName}?start=bettingId-${element._id}_type-${'play'}_game-${element.nameOfBet}` : ""}\n----------------`
            })
            console.log(chatId)
            bot.sendMessage(chatId, replyTxt, { reply_to_message_id: replyToMessageId });
        })
    },

}
module.exports = index;

