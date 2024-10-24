const config = require("../../../config");
const userBettingData = require("../../db/models/userBettingData");
const userDetails = require("../../db/models/userDetails");
const userTransactionData = require("../../db/models/userTransactionData");
const UserRpsGameData = require("../../db/models/UserRpsGameData");
const globalVariables = require("../../global/globalVariables");
const { TryCatch, getChatId, isNumeric, getTokenBalanceAsBettingAmount, isValidPublicKey, hasTokenAccountForMint, getWalletBasicInfoToProceed } = require("../../helper/helperMain");
const { transferMemeCoin } = require("../../helper/helperWeb3");
const bot_commands = require('./bot_commands.js')
const bot_reply = [
    {
        repliedMsgTxt: `Please reply to this message with the amount of ${config.memeCoinInfo.name} you want to bet in it`,
        func: (bot, msg) => {
            return TryCatch(async () => {
                const replyToMessageId = msg.message_id;
                const msgTxt = msg.text;
                const userName = msg.from.username;
                const findUser = await userDetails.findOne({ userName }).select(['_id', 'bettingInfo']);
                const basicInfo = await getWalletBasicInfoToProceed(userName, bot, msg);
                if (!basicInfo.isAllTrue) {
                    return;
                }
                if (!findUser.bettingInfo.nameOfBet) {
                    bot.sendMessage(getChatId(msg), "Firstly choose your bet by using /bet command.", { reply_to_message_id: replyToMessageId });
                    return;
                }
                if (!isNumeric(msgTxt)) {
                    bot.sendMessage(getChatId(msg), 'Amount should be a number (like 123)', { reply_to_message_id: replyToMessageId });
                    return;
                }
                if (Number(msgTxt) < config.bettingInfo.bettingAmount.min || Number(msgTxt) > config.bettingInfo.bettingAmount.max) {
                    bot.sendMessage(getChatId(msg), `Please enter a valid amount between \n${config.bettingInfo.bettingAmount.min}-${config.bettingInfo.bettingAmount.max} ${config.memeCoinInfo.name}`, { reply_to_message_id: replyToMessageId });
                    return;
                }
                const { balance } = await getTokenBalanceAsBettingAmount(userName);
                if (balance < Number(msgTxt)) {
                    bot.sendMessage(getChatId(msg), `Your balance is only :${balance}\n\n And your betting amount is :${msgTxt} \n\n please add some ${config.memeCoinInfo.name} by using:\n /wallet `);
                    return;
                }
                const createNewBet = await userBettingData.create({ bettingAmount: Number(msgTxt), playersId: [findUser._id], nameOfBet: findUser.bettingInfo.nameOfBet });
                const bettingId = createNewBet._id;
                const findUserBettingData = await UserRpsGameData.findOne({ bettingId });
                if (!findUserBettingData) {
                    const newBet = await UserRpsGameData.create({ bettingId, playerRoundWin: [{ userId: findUser._id, winCount: 0 }] });
                } else {
                    const newArr = [...findUserBettingData.playerRoundWin, { userId: findUser._id, winCount: 0 }];
                    const updateBet = await UserRpsGameData.updateOne({ bettingId }, { playerRoundWin: [...newArr] });
                }
                const deleteNameOfBetFromUserDetails = await userDetails.updateOne({ userName }, { bettingInfo: { nameOfBet: '' } })
                bot.sendMessage(getChatId(msg), `@${userName} has started a new bet on /${findUser.bettingInfo.nameOfBet} \n\n click on the link below to bet on it\n\nhttps://t.me/${config.botInfo.botTgUserName}?start=bettingId-${createNewBet._id}_type-${'join'}_game-${findUser.bettingInfo.nameOfBet}`, { reply_to_message_id: replyToMessageId });
                console.log(msg)
                bot_commands.mybettings(bot,msg,false,msg.from.id);
            })
        }
    },
    {
        repliedMsgTxt: `Please reply to this message with the game in which you want to bet\n\n example:reply 'rps' to bet on rock paper scissor`,
        func: (bot, msg) => {
            return TryCatch(async () => {
                const replyToMessageId = msg.message_id;
                const msgTxt = msg.text?.toString().toLowerCase();
                const userName = msg.from.username;
                const chatId = getChatId(msg)
                const findUser = await userDetails.findOne({ userName }).select(['_id']);
                const basicInfo = await getWalletBasicInfoToProceed(userName, bot, msg);
                let isCommandRight = false;
                if (!basicInfo.isAllTrue) {
                    return;
                }
                globalVariables.games.map(({ commandName }) => {
                    if (commandName === msgTxt) {
                        isCommandRight = true;
                    }
                })
                if (!isCommandRight) {
                    bot.sendMessage(chatId, `invalid game name:${msgTxt} ❌ \n\nFor more info about game please use /games command.`, { reply_to_message_id: replyToMessageId })
                    return;
                }
                const saveType = await userDetails.updateOne({ userName }, { bettingInfo: { nameOfBet: msgTxt } });
                bot.sendMessage(chatId, `Please reply to this message with the amount of ${config.memeCoinInfo.name} you want to bet in it`, { reply_to_message_id: replyToMessageId })
            })
        }
    },
    {
        repliedMsgTxt: "Please reply to this message with the wallet address in which you want to withdraw.",
        func: (bot, msg) => {
            return TryCatch(async () => {
                const replyToMessageId = msg.message_id;
                const msgTxt = msg.text;
                const userName = msg.from.username;
                const isValidKey = await isValidPublicKey(msgTxt);
                if (!isValidKey) {
                    bot.sendMessage(getChatId(msg), `<code>${msgTxt}</code> is not a valid Public key❌\n\n**important**\nMake sure that wallet has already some ${config.memeCoinInfo.name} or at least signed with ${config.memeCoinInfo.name}`, { parse_mode: "HTML", reply_to_message_id: replyToMessageId });
                    return;
                }
                const findUserWalletAddress = await userDetails.findOne({ userName }).select(['walletAddress', '-_id']);
                if (findUserWalletAddress === null) {
                    bot.sendMessage(getChatId(msg), "You don't have any wallet. Please make it first by using the /create command.", { reply_to_message_id: replyToMessageId });
                    return;
                }
                const { walletAddress } = findUserWalletAddress
                const isSigned = hasTokenAccountForMint(walletAddress.publicKey);
                if (!isSigned) {
                    bot.sendMessage(getChatId(msg), `Your wallet isn't signed in by ${config.memeCoinInfo.name}`);
                    return;
                }
                const findUserTransactionData = await userTransactionData.findOne({ userName });
                bot.sendMessage(getChatId(msg), `please reply to this message with amount of ${config.memeCoinInfo.name} you want to withdraw.`, { reply_to_message_id: replyToMessageId });
                if (!findUserTransactionData) {
                    await userTransactionData.create({ userName, withdrawData: { publicKey: msgTxt } });
                    return;
                }
                await userTransactionData.updateOne({ userName }, { withdrawData: { publicKey: msgTxt } });
            })
        }
    },
    {
        repliedMsgTxt: `please reply to this message with amount of ${config.memeCoinInfo.name} you want to withdraw.`,
        func: (bot, msg) => {
            return TryCatch(async () => {
                const replyToMessageId = msg.message_id;
                const msgTxt = msg.text;
                const userName = msg.from.username;
                const findUserTransactionData = await userTransactionData.findOne({ userName }).select(['withdrawData', '-_id'])
                if (findUserTransactionData === null) {
                    bot.sendMessage(getChatId(msg), "firstly give your wallet address by this command /withdraw", { reply_to_message_id: replyToMessageId });
                    return;
                }
                if (!isNumeric(msgTxt)) {
                    bot.sendMessage(getChatId(msg), 'please give a valid amount', { reply_to_message_id: replyToMessageId });
                    return;
                }
                if (Number(msgTxt) <= 0) {
                    bot.sendMessage(getChatId(msg), 'please give a valid amount', { reply_to_message_id: replyToMessageId });
                    return;
                }
                // const minimumAmount = 0.5;
                // if (Number(msgTxt) < minimumAmount) {
                //     bot.sendMessage(getChatId(msg), `withdraw amount should be minimum ${minimumAmount} ${config.memeCoinInfo.name}`);
                //     return;
                // }
                const { balance } = await getTokenBalanceAsBettingAmount(userName);
                if (msgTxt > balance) {
                    bot.sendMessage(getChatId(msg), `Your balance is only: ${balance} ${config.memeCoinInfo.name}\n\n And you want to withdraw ${msgTxt}\n\nPlease give a valid amount to withdraw.`, { reply_to_message_id: replyToMessageId });
                    return;
                }
                const { walletAddress } = await userDetails.findOne({ userName }).select(['walletAddress', '-_id'])
                // const { withdrawData } = await userTransactionData.findOne({ userName }).select(['withdrawData', '-_id'])
                bot.sendMessage(getChatId(msg), 'transaction proceeding please wait...', { reply_to_message_id: replyToMessageId });
                const transaction = await transferMemeCoin(walletAddress.privateKey, findUserTransactionData.withdrawData.publicKey, msgTxt);
                if (transaction) {
                    const deleteTransactionData = await userTransactionData.deleteOne({ userName });
                    bot.sendMessage(getChatId(msg), `Transaction successful✅ ${msgTxt} ${config.memeCoinInfo.name} sended to <code>${findUserTransactionData.withdrawData.publicKey}</code>`, { parse_mode: "HTML", reply_to_message_id: replyToMessageId });
                } else {
                    bot.sendMessage(getChatId(msg), "Transaction failed❌", { reply_to_message_id: replyToMessageId });
                }
            })
        }
    },
]

module.exports = bot_reply;