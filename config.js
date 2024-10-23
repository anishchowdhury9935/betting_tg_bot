const devModeOn = false;
const config = {
    botInfo: {
        botToken: "7677063351:AAFAvug-SNT8FSyb3zzmh0uZDVrSaTntmdc",//**
        botTgUserName: 'nomoGamblebot',
        botName: "Nomo Game bot",//**
    },
    db: {
        // In development phase use 'mongoHostUrlDev' (you should have mongodb installed in your machine) in production phase use 'mongoHostUrlMain'
        mongoHostUrlDev: devModeOn ? "mongodb://127.0.0.1:27017/tg_betting_bot" : false,
        mongoHostUrlMain: devModeOn ? false : "mongodb+srv://nomoonsolana:nomosol9935@cluster0.itrhg7m.mongodb.net/tg_betting_bot",//**
    },
    memeCoinInfo: {
        // mintAddress: 'J3EEg43NaHQmPCNxhPjFZhsjwa6FJxaBA3pudQFyf4Jq',//**
        mintAddress: devModeOn ? '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' : 'J3EEg43NaHQmPCNxhPjFZhsjwa6FJxaBA3pudQFyf4Jq',//**
        name: devModeOn ? 'USDC' : 'NOMO',//**

    }, bettingInfo: {
        bettingAmount: {
            min: 10,
            max: 1000
        }
    },
    // rpcNetwork: 'https://solana-api.instantnodes.io/token-FkplVBNzBHxexjaAnPajqTAvRuZZWq0o',
    rpcNetwork: 'wss://go.getblock.io/e6d7ee70d7f24f42ad2f4028c4c8f8d6',
    PayerPrivateKey: devModeOn ? '5xuGQCytpr8uuNjc8Z46RUxKfDXomh2PMR6z7wnpJ5RTXvoLPUXwN88hEMdbVg1yf3pn5QQJjukKqmjyzLgPY3u' : '2CQzLyTedm7A2HA22KggCx9mVDdcA85wqrdW4U9DKckHX6asD6fwVrPSRRsmEHRCnJTEf1bmkitm3UR1JbeU28UZ',
    cutOffPublicKey: devModeOn ? 'HPKFp6tWjCMmoH6AR52KJUmECgmRxrtyW9Fy8u7yUJcC' : 'FQhCS9PkKgnTg6hyztCyZCkkeFmYP2G2EexokB7SPPJu',
    // PayerPrivateKey: '2CQzLyTedm7A2HA22KggCx9mVDdcA85wqrdW4U9DKckHX6asD6fwVrPSRRsmEHRCnJTEf1bmkitm3UR1JbeU28UZ',
    urls: {
        // gameClientBaseUrl: 'https://tg-betting-bot-client.nomoonsol.com',
        gameClientBaseUrl: devModeOn ? 'https://b05e-2405-201-4016-285d-e0fd-bd1d-649f-2655.ngrok-free.app' : "https://tg-betting-bot-client.nomoonsol.com",
        // gameServerBaseUrl: 'https://nomoonsol.com/',
        gameServerBaseUrl: devModeOn ? 'http://localhost:5010' : "https://nomoonsol.com/",
    }
    , port: 5100
}

module.exports = config;