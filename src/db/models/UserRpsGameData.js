const mongoose = require("mongoose");
const userRpsGameDataSchema = new mongoose.Schema({
    bettingId:{
        type:String,
        required:true,
    },
    roundNumber:{
        type:Number,
        default:1
    },
    playerRoundWin:{
        type:Array,
        default:[
            
        ]
    },
});

const userRpsGameData = mongoose.model("userRpsGameData", userRpsGameDataSchema);

module.exports = userRpsGameData;