require('dotenv').config();

const devMode = process.env.DEV_MODE === 'true';

const config = {
    devMode,
    server: {
        port: parseInt(process.env.GAME_BACKEND_PORT) || 5010,
        corsOrigin: process.env.NODE_ENV === 'production' ? process.env.GAME_CLIENT_URL : "*",
    },
    db: {
        mongoConnectionUrl_main: process.env.MONGO_URL_PROD,
        mongoConnectionUrl_dev: process.env.MONGO_URL_DEV,
    },
    solana: {
        rpcNetwork: process.env.RPC_NETWORK,
        mintAddress: devMode ? process.env.MINT_ADDRESS_DEV : process.env.MINT_ADDRESS_PROD,
    }
};

module.exports = config;