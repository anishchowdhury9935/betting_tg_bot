// routes/userRpsGame.js
const express = require("express");
const userRpsGameData = require("../db/models/UserRpsGameData");
const userBettingData = require("../db/models/userBettingData");
const { tryCatch } = require("../../helper/helperMain");
const { ObjectId } = require("mongodb");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const maxRoundInRps = 4;


async function saveWinnerTransaction(winnerId, bettingId) {
    const body = { winnerId: winnerId, bettingId: bettingId }
    try {
        const response = await fetch("http://localhost:5100/savewinnertransaction", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'  // Added header for JSON request
            },
            body: JSON.stringify(body)  // Correctly stringifying the body
        });

        if (!response.ok) {
            const errorData = await response.json();  // Attempt to parse the response for errors
            throw new Error(errorData.message || 'Failed to save winner transaction');
        }
        const bet = await response.json();  // Parse the response if successful
        return bet;
    } catch (error) {
        console.error('Error saving winner transaction:', error);  // Log error
        return null;  // Return null in case of failure
    }
};

function findWinner(player1Id, player2Id) {
    console.log(player1Id, player2Id)
    if (player1Id.winCount === player2Id.winCount) {
        return 'draw';
    }
    if (player1Id.winCount > player2Id.winCount) {
        return player1Id.userId;
    }
    return player2Id.userId
}

router.get('/bettingbasicdata/:bettingId', async (req, res) => {
    const { bettingId } = req.params;
    try {
        if (!isValidObjectId(bettingId)) {
            console.log('Invalid betting')
            return res.status(200).json({ isBetFound: false })
        }
        const findBetInData = await userBettingData.findById({ _id: bettingId }).select(['-_id']);
        if (!findBetInData) {
            return res.status(200).json({ isBetFound: false })
        }
        const existingBet = await userRpsGameData.findOne({ bettingId });
        // if (!existingBet) {
        //     const findUserBettingData = await userBettingData.findOne({ _id: bettingId });
        //     const newArr = findUserBettingData.playersId.map((data) => {
        //         return { userId: data, winCount: 0 }
        //     })
        //     const newBet = await userRpsGameData.create({ bettingId, playerRoundWin: [...newArr] });
        //     // return res.status(201).json({ data: newBet });
        // }
        if (!!existingBet && existingBet.roundNumber >= maxRoundInRps) {
            const winnerId = findWinner(existingBet.playerRoundWin[0], existingBet.playerRoundWin[1]);
            if (winnerId !== 'draw') {
                const _saveWinnerTransaction = await saveWinnerTransaction(winnerId, bettingId);
            } else {
                const deleteBettingRpsData = await userRpsGameData.deleteOne({ _id: bettingId });
            }
            return res.status(200).json({ data: { shouldProceedRound: false, winner: winnerId } });
        }
        return res.status(200).json({ data: existingBet });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update betting data by bettingId
router.put('/bettingbasicdata/:bettingId/:winnerId', async (req, res) => {
    // Validate inputs
    try {
        const { bettingId, winnerId } = req.params;
        if (!winnerId) {
            return res.status(400).json({ message: "Winner ID is required" });
        }
        const findBet = await userRpsGameData.findOne({ bettingId })
        const winner = findBet.playerRoundWin.map(({ userId, winCount }) => {
            if (String(userId) === winnerId) {
                return { userId, winCount: winCount + 1 }; // Increment winCount for the winner
            }
            return { userId, winCount }; // Return unchanged object for others
        });
        const updatedBet = await userRpsGameData.findOneAndUpdate(
            { bettingId },
            { playerRoundWin: [...winner], roundNumber: findBet.roundNumber + 1 },
        );
        if (!updatedBet) {
            return res.status(404).json({ message: "Bet not found" });
        }
        const newBetUpdated = await userRpsGameData.findOne({ bettingId });
        if (newBetUpdated.roundNumber >= maxRoundInRps) {
            const winnerId = findWinner(newBetUpdated.playerRoundWin[0], newBetUpdated.playerRoundWin[1]);
            if (winnerId !== 'draw') {
                const _saveWinnerTransaction = await saveWinnerTransaction(winnerId, bettingId);
            } else {
                const deleteBettingRpsData = await userRpsGameData.deleteOne({ _id: bettingId });
            }
            return res.status(200).json({ data: { shouldProceedRound: false, winner: winnerId } });
        }
        return res.status(200).json({ data: updatedBet });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// Delete betting data by bettingId
router.delete('/bettingbasicdata/:bettingId', async (req, res) => {
    try {
        const deletedBet = await userRpsGameData.findOneAndDelete({ bettingId: req.params.bettingId });
        if (!deletedBet) {
            return res.status(404).json({ message: "Bet not found" });
        }
        return res.status(204).send(); // No content
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
