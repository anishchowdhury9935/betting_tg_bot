const mongoose = require("mongoose");
const UserBettingDataSchema = new mongoose.Schema({
    bettingAmount: {
        type: Number,
    },
    bettingState: {
        type: Object,
        default: {
            isRunning:true
        },
    },
    playersId: {
        type: Array,
        required:true
    },
    nameOfBet:{
        type:String,
        required:true
    },
});

const userBettingData = mongoose.model("userBettingData", UserBettingDataSchema);

module.exports = userBettingData;
