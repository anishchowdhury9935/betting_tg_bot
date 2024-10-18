const mongoose = require("mongoose");
const UserTransactionDataSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    withdrawData: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 1, // The document will be automatically deleted after i day of its creation time
    },
});

const userTransactionData = mongoose.model("userTransactionData", UserTransactionDataSchema);

module.exports = userTransactionData;
