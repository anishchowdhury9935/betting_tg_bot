require('dotenv').config();

const devMode = process.env.DEV_MODE === 'true';

const config = {
    devMode,
    botInfo: {
        botToken: devMode ? process.env.BOT_TOKEN_DEV : process.env.BOT_TOKEN_PROD,
        botTgUserName: devMode ? process.env.BOT_USERNAME_DEV : process.env.BOT_USERNAME_PROD,
        botName: process.env.BOT_NAME,
    },
    db: {
        mongoHostUrlDev: process.env.MONGO_URL_DEV,
        mongoHostUrlMain: process.env.MONGO_URL_PROD,
    },
    memeCoinInfo: {
        mintAddress: devMode ? process.env.MINT_ADDRESS_DEV : process.env.MINT_ADDRESS_PROD,
        name: devMode ? process.env.MEME_COIN_NAME_DEV : process.env.MEME_COIN_NAME_PROD,
    },
    bettingInfo: {
        bettingAmount: {
            min: Number.parseInt(process.env.MIN_BET_AMOUNT) || 10,
            max: Number.parseInt(process.env.MAX_BET_AMOUNT) || 1000,
        }
    },
    rpcNetwork: process.env.RPC_NETWORK,
    PayerPrivateKey: devMode ? process.env.PAYER_PRIVATE_KEY_DEV : process.env.PAYER_PRIVATE_KEY_PROD,
    cutOffPublicKey: devMode ? process.env.CUT_OFF_PUBLIC_KEY_DEV : process.env.CUT_OFF_PUBLIC_KEY_PROD,
    platformFee: Number.parseInt(process.env.PLATFORM_FEE) || 2,
    urls: {
        gameClientBaseUrl: process.env.GAME_CLIENT_URL,
        gameServerBaseUrl: process.env.GAME_SERVER_URL,
    },
    port: Number.parseInt(process.env.MAIN_BACKEND_PORT) || 5100,
};

module.exports = config;