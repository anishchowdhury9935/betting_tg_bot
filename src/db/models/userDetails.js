const mongoose = require("mongoose");
const UserDetailsSchema = new mongoose.Schema({
    walletAddress: {
        type: Object,
    },
    userName: {
        type: String,
        required: true,
    },
    bettingInfo: {
        type: Object,
        required: true,
        default: {
            nameOfBet:'',
        }
    },
    winningData:{
        type:Object,
        default:{
            totalCoinsWin:0,
            gamesWin:0,
            gamesLost:0
        }
    }
});

const userDetails = mongoose.model("userDetails", UserDetailsSchema);

module.exports = userDetails;
