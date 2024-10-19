const config = {
    botInfo: {
        botToken: "7677063351:AAFAvug-SNT8FSyb3zzmh0uZDVrSaTntmdc",//**
        botTgUserName: 'nomoGamblebot',
        botName: "Nomo Gamble bot",//**
    },
    db: {
        // In development phase use 'mongoHostUrlDev' (you should have mongodb installed in your machine) in production phase use 'mongoHostUrlMain'
        mongoHostUrlDev: "mongodb://127.0.0.1:27017/tg_betting_bot",
        mongoHostUrlMain: "mongodb+srv://nomoonsolana:nomosol9935@cluster0.itrhg7m.mongodb.net/tg_betting_bot",//**
    },
    memeCoinInfo: {
        mintAddress: 'J3EEg43NaHQmPCNxhPjFZhsjwa6FJxaBA3pudQFyf4Jq',//**
        // mintAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',//**
        name: 'NOMO',//**

    }, bettingInfo: {
        bettingAmount: {
            min: 10,
            max: 1000
        }
    },
    // rpcNetwork:'https://solana-devnet.g.alchemy.com/v2/MUIfi34RSIvBWCew1-Q_K5Wo2K_Y6mdg',
    // rpcNetwork:'https://solana-mainnet.g.alchemy.com/v2/MUIfi34RSIvBWCew1-Q_K5Wo2K_Y6mdg',
    rpcNetwork: 'https://solana-api.instantnodes.io/token-FkplVBNzBHxexjaAnPajqTAvRuZZWq0o',
    // PayerPrivateKey: '5xuGQCytpr8uuNjc8Z46RUxKfDXomh2PMR6z7wnpJ5RTXvoLPUXwN88hEMdbVg1yf3pn5QQJjukKqmjyzLgPY3u',
    cutOffPublicKey: 'FQhCS9PkKgnTg6hyztCyZCkkeFmYP2G2EexokB7SPPJu',
    PayerPrivateKey: '2CQzLyTedm7A2HA22KggCx9mVDdcA85wqrdW4U9DKckHX6asD6fwVrPSRRsmEHRCnJTEf1bmkitm3UR1JbeU28UZ',
    urls: {
        gameClientBaseUrl: 'https://tg-betting-bot-client.nomoonsol.com/',
        gameServerBaseUrl: 'https://nomoonsol.com/',
    }
}

module.exports = config;