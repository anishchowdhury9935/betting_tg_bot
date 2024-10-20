const config = require("../../../config");
const userBettingData = require("../../db/models/userBettingData");
const userDetails = require("../../db/models/userDetails");
const { TryCatch, getChatId, getWalletBasicInfoToProceed, getTokenBalanceAsBettingAmount } = require("../../helper/helperMain");
const { getUserMemeCoinBalanceObj } = require("../../helper/helperWeb3");

// these commands is for deep link's 
const index = {
    join: (bot, msg, match, dataExtractedThroughLink) => {
        return TryCatch(async () => {
            const { bettingId, type } = dataExtractedThroughLink;
            const chatId = getChatId(msg);
            const userName = msg.from.username;
            const basicInfo = await getWalletBasicInfoToProceed(userName, bot, msg);
            if (!basicInfo.isAllTrue) {
                return;
            }
            const findBetDetails = await userBettingData.findById({ _id: bettingId });
            if (!findBetDetails) {
                bot.sendMessage(chatId, 'This room does not exist ❌');
                return;
            }
            if (findBetDetails.playersId.length === 2) {
                bot.sendMessage(chatId, 'This room is full 🧑‍🤝‍🧑');
                return;
            }
            const findUser = await userDetails.findOne({ userName });
            if (findBetDetails.playersId.includes(findUser._id)) {
                bot.sendMessage(chatId, 'You have already joined this room');
                return;
            }
            const { balance } = await getTokenBalanceAsBettingAmount(userName);
            if (balance < findBetDetails.bettingAmount) {
                bot.sendMessage(chatId, `Your balance is only :${balance}\n\n And your betting amount is :${findBetDetails.bettingAmount} \n\n please add some ${config.memeCoinInfo.name} by using:\n /wallet `);
                return;
            }
            const addUserToBetRoom = await userBettingData.updateOne({ _id: bettingId }, { playersId: [...findBetDetails.playersId, findUser._id] })
            bot.sendMessage(chatId, `@${userName} have betted ${findBetDetails.bettingAmount} ${config.memeCoinInfo.name} on ${findBetDetails.nameOfBet}\n\nClick on the link below to play the game:\n\nhttps://t.me/${config.botInfo.botTgUserName}?start=bettingId-${bettingId}_type-${'play'}_game-${findUser.bettingInfo.nameOfBet}\n\n you can use /mybettings to show the betting status`);
        })
    },
    play: (bot, msg, match, dataExtractedThroughLink) => {
        return TryCatch(async () => {
            const { bettingId, type } = dataExtractedThroughLink;
            const chatId = getChatId(msg);
            const userName = msg.from.username;
            const basicInfo = await getWalletBasicInfoToProceed(userName, bot, msg);
            if (!basicInfo.isAllTrue) {
                return;
            }
            const findBetDetails = await userBettingData.findById({ _id: bettingId });
            if (!findBetDetails) {
                bot.sendMessage(chatId, 'This room does not exist ❌');
                return;
            }
            if (!findBetDetails.playersId.includes(basicInfo.userBasicData._id)) {
                bot.sendMessage(chatId, 'You are not a player of this game');
                return;
            }
            const replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: `play ${findBetDetails.nameOfBet}`,
                            web_app: { url: `${config.urls.gameClientBaseUrl}/rps/${findBetDetails._id}/${type}/${findBetDetails.nameOfBet}/${basicInfo.userBasicData._id}` }, // Unique identifier for the button
                        },
                    ],
                ],
            };
            // console.log(`http:/localhost:5173/rps/${findBetDetails._id}/${type}/${findBetDetails.nameOfBet}/${basicInfo.userBasicData._id}`)
            bot.sendMessage(chatId, `Play ${findBetDetails.nameOfBet} by clicking on button below:`, { reply_markup: replyMarkup });
        })
    }
}

module.exports = index;