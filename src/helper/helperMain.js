const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, getAccount, } = require("@solana/spl-token");
const { PublicKey, tokeAddress } = require('@solana/web3.js');
const config = require("../../config");
const solanaWeb3 = require('@solana/web3.js');
const userBettingData = require("../db/models/userBettingData");
const userDetails = require("../db/models/userDetails");
const { getUserMemeCoinBalanceObj } = require("./helperWeb3");
const connection = new solanaWeb3.Connection(config.rpcNetwork, 'confirmed');
// const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');


/**
* Function to check if a public key has a token account for a specific mint address.
* @param {string} walletAddress - The wallet public key (owner).
* @returns {boolean} - Returns true if the wallet has a token account for the mint, otherwise false.
*/
async function hasTokenAccountForMint(walletAddress) {
    const connection = new solanaWeb3.Connection('https://solana-api.instantnodes.io/token-Kd8tc0HfwPYeraHzTi9t1r4VQmK7Mnca', 'confirmed');
    try {
        // Convert the wallet and mint addresses to PublicKey objects
        const ownerPublicKey = new PublicKey(walletAddress);
        const mintPublicKey = new PublicKey(config.memeCoinInfo.mintAddress);

        // Get the associated token account for the given wallet and mint
        const associatedTokenAddress = await getAssociatedTokenAddress(
            mintPublicKey,  // Mint address (e.g., USDC, NOMO)
            ownerPublicKey, // Owner of the account
            false,          // Allow creation of associated token account (false = don't create if it doesn't exist)
            TOKEN_PROGRAM_ID
        );
        // Fetch token account info to check if the account exists
        const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
        if (accountInfo !== null && accountInfo.data.length > 0) {
            return true; // Account exists, so the wallet has a token account for the mint
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking token account:", error);
        return false; // Return false if there is any error
    }
}








const index = {
    TryCatch: async (func, res = false) => {
        try {
            return await func();
        } catch (error) {
            console.log(error);
            return res ? res.status(400).json({ error: 'internal server error' }) : false;
        }
    },
    /** returns the chat id */
    getChatId: (msgObj = {}) => {
        return msgObj.chat?.id || msgObj.message?.chat?.id
    },
    isNumeric: (str) => {
        return /^[0-9]+(\.[0-9]+)?$/.test(str);
    },
    /** returns the calculated wallet token balance object through amount of betting balance(from db) minus original balance (getUserMemeCoinBalanceObj)*/
    getTokenBalanceAsBettingAmount: async (userName) => {
        // this is used to get the amount of used tokens(meme coins) in betting
        const { walletAddress, _id } = await userDetails.findOne({ userName }).select(['walletAddress']);
        const findAllBets = await userBettingData.find({ playersId: { $in: [_id] } }).select(['bettingAmount', '-_id']);
        const { balance } = await getUserMemeCoinBalanceObj(walletAddress);
        let countAmount = 0;
        findAllBets.map(({ bettingAmount }) => {
            countAmount += bettingAmount;
        })
        return {
            balance: balance - countAmount,
            walletAddress,
        };
    },
    isValidPublicKey: async (key) => {
        try {
            const publicKey = new PublicKey(key);
            const tokenAccount = await getAssociatedTokenAddress(new PublicKey(config.memeCoinInfo.mintAddress), publicKey);
            const accountInfo = await connection.getAccountInfo(tokenAccount);
            // Check if the Base58 encoded key is 32 bytes (a valid Solana public key)
            return PublicKey.isOnCurve(publicKey.toBytes()) && accountInfo !== null;
        } catch (error) {
            console.log(error)
            return false; // If any error occurs, the key is not valid
        }
    },
    /** It takes the 'match' data as argument which comes from callback through tg bot  */
    decodeDataFroDeepLink: (match) => {
        const payload = match[1].trim();
        const pairs = payload.split('_');
        const data = {};

        pairs.forEach(pair => {
            const [key, value] = pair.split('-');
            data[key] = value;
        });
        return { ...data };
    },
    /**
     * @param {Object} dataObject - The data in key value pair.
    * @returns {string} - Returns the encoded string. 
    */
    encodeDataFroDeepLink: (data = {}) => {
        const keys = Object.keys(data);
        let encodedString = '';
        keys.map((key, index) => {
            if (keys.length - 1 === index) {
                encodedString += `_${key}-${data[key]}`;
                return;
            }
            encodedString += `${key}-${data[key]}_`;
        })
    },
    /** returns the confirmation object of having wallet in db and also is the wallet signed with the mint Address Or token. 
     * Can also send message according to situation.  */
    getWalletBasicInfoToProceed: async (userName, bot, msg) => {
        try {
            const findUser = await userDetails.findOne({ userName });
            const findHasToken = await hasTokenAccountForMint(findUser.walletAddress.publicKey);
            const obj = {
                hasWallet: !!findUser,
                isSignedWithMintOrToken: findHasToken,
                isAllTrue: !!findUser && findHasToken,
                userBasicData: findUser
            }
            obj.hasWallet ? '' : bot.sendMessage(msg.chat?.id || msg.message?.chat?.id, 'please make the wallet first by using /start command');
            obj.isSignedWithMintOrToken ? '' : bot.sendMessage(msg.chat?.id || msg.message?.chat?.id, `your wallet is not signed with ${config.memeCoinInfo.name} use /wallet command to sign it.`);
            return obj;
        } catch (error) {
            console.log(error);
        }
        return {
            hasWallet: false,
            isSignedWithMintOrToken: false,
            isAllTrue: false,
            userBasicData: false
        };
    }
}
module.exports = {
    ...index,
    hasTokenAccountForMint
}