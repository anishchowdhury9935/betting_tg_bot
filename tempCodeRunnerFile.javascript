const bs58 = require('bs58');

// Assuming `privateKeyUint8Array` is your Uint8Array of the private key
const privateKeyUint8Array = new Uint8Array([
    /* Your Uint8Array values go here */
]);

// Convert the Uint8Array to Base58 format
const privateKeyBase58 = bs58.encode(privateKeyUint8Array);

console.log('Base58 Encoded Private Key:', privateKeyBase58);


































const devModeOn = true;
const config = {
    botInfo: {
        botToken: "8559611419:AAE9ZbPG8NGEqxfmB5Gctou5HscVwXOvNw8",//**
        botTgUserName: devModeOn ? 'test_main_101_bot' : 'nomoGamblebot',
        botName: "Nomo Game bot",//**
    },
    db: {
        // In development phase use 'mongoHostUrlDev' (you should have mongodb installed in your machine) in production phase use 'mongoHostUrlMain'
        mongoHostUrlDev: devModeOn ? "mongodb://127.0.0.1:27017/tg_betting_bot" : false,
        mongoHostUrlMain: devModeOn ? false : "mongodb+srv://nomoonsolana:nomosol9935@cluster0.itrhg7m.mongodb.net/tg_betting_bot",//**
    },
    memeCoinInfo: {
        // mintAddress: 'J3EEg43NaHQmPCNxhPjFZhsjwa6FJxaBA3pudQFyf4Jq',//**
        mintAddress: devModeOn ? 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' : 'J3EEg43NaHQmPCNxhPjFZhsjwa6FJxaBA3pudQFyf4Jq',//**
        name: devModeOn ? 'USDC-DEV' : 'NOMO',//**

    }, bettingInfo: {
        bettingAmount: {
            min: 10,
            max: 1000
        }
    },
    rpcNetwork: 'https://solana-api.instantnodes.io/token-FkplVBNzBHxexjaAnPajqTAvRuZZWq0o',
    // rpcNetwork: 'https://solana-api.instantnodes.io/token-Kd8tc0HfwPYeraHzTi9t1r4VQmK7Mnca',
    PayerPrivateKey: devModeOn ? '5xuGQCytpr8uuNjc8Z46RUxKfDXomh2PMR6z7wnpJ5RTXvoLPUXwN88hEMdbVg1yf3pn5QQJjukKqmjyzLgPY3u' : '2CQzLyTedm7A2HA22KggCx9mVDdcA85wqrdW4U9DKckHX6asD6fwVrPSRRsmEHRCnJTEf1bmkitm3UR1JbeU28UZ',
    cutOffPublicKey: devModeOn ? 'HPKFp6tWjCMmoH6AR52KJUmECgmRxrtyW9Fy8u7yUJcC' : 'FQhCS9PkKgnTg6hyztCyZCkkeFmYP2G2EexokB7SPPJu',
    // PayerPrivateKey: '2CQzLyTedm7A2HA22KggCx9mVDdcA85wqrdW4U9DKckHX6asD6fwVrPSRRsmEHRCnJTEf1bmkitm3UR1JbeU28UZ',
    urls: {
        // gameClientBaseUrl: 'https://tg-betting-bot-client.nomoonsol.com',
        gameClientBaseUrl: devModeOn ? 'https://34ce-2405-201-4016-29bc-2975-8d10-8cf9-794c.ngrok-free.app' : "https://tg-betting-bot-client.nomoonsol.com",
        // gameServerBaseUrl: 'https://nomoonsol.com/',
        gameServerBaseUrl: devModeOn ? 'http://localhost:5010' : "https://nomoonsol.com/",
    }
    , port: 5100
}

module.exports = config;