const express = require('express');
const app = express();
const config = require("./config");
const { getBotInstance } = require("./src/utils/connect_tg_bot");
const bot_commands = require('./src/utils/commands/bot_commands');
const { connectToMongo } = require("./src/db/db");
const { botMsgHandler } = require("./src/handlers/botMsgHandler");
const userBettingData = require('./src/db/models/userBettingData');
const { TryCatch } = require('./src/helper/helperMain');
const userDetails = require('./src/db/models/userDetails');
const { transferMemeCoin } = require('./src/helper/helperWeb3');
const UserRpsGameData = require('./src/db/models/UserRpsGameData');
const bot_token = config.botInfo.botToken;
const port = 5100
const bot = getBotInstance(bot_token);

app.use(express.json());
connectToMongo(); // db connection
botMsgHandler(bot); // inline btn callBack function's


function calculatePercentage(percentage, value) {
    return (percentage / 100) * value;
}

 
app.post('/savewinnertransaction', (req, res) => {
    return TryCatch(async () => {
        const { winnerId, bettingId } = req.body;
        const findBet = await userBettingData.findById({ _id: bettingId });
        const findWinner = await userDetails.findById({ _id: winnerId })
        const findLoserId = findBet.playersId.filter((val) => {
            return val !== findWinner._id;
        })
        const findLoser = await userDetails.findById({ _id: findLoserId[0] });
        const betAmount = findBet.bettingAmount;
        const winnerWalletPublicKey = findWinner.walletAddress.publicKey;
        const loserWalletPrivateKey = findLoser.walletAddress.privateKey;
        const cutOffAmount = calculatePercentage(2, betAmount);
        const amountToSentInWinnerWallet = betAmount - cutOffAmount;
        const transferMemeCoinToWinner = await transferMemeCoin(loserWalletPrivateKey, winnerWalletPublicKey, amountToSentInWinnerWallet);
        const transferMemeCoinOfCutOff = await transferMemeCoin(loserWalletPrivateKey, config.cutOffPublicKey, cutOffAmount);
        if (transferMemeCoinToWinner && transferMemeCoinOfCutOff) {
            const deleteBet = await userBettingData.deleteOne({ _id: bettingId });
        }else{
            const deleteBetData = await UserRpsGameData.deleteOne({bettingId});
        }
        return res.status(200).json({ msg: '' });
    }, res)
})

app.get('/',(req,res)=>{
    res.status(200).json({ msg:'Success ✅'})
})

app.listen(port, () => {
    console.log(`chat app backend listening on port: http://localhost:${port}`)
}) 