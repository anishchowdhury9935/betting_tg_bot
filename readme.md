
# 🎮 Nomo Betting Telegram Bot

A full-stack Telegram-based betting application with integrated **Solana blockchain** and **cryptocurrency transactions**. Players can bet using meme coins (NOMO/USDC) and participate in real-time games like Rock-Paper-Scissors with socket.io-powered multiplayer features.

---

## ✨ Features

### Core Betting Features
- 🎯 **Real-time Multiplayer Gaming** - Connect and play against other players via Telegram
- 💰 **Cryptocurrency Betting** - Bet using Solana-based meme coins (NOMO/USDC)
- 🎲 **Multiple Games** - Extensible game architecture (Rock-Paper-Scissors implemented)
- 🔗 **Deep Links** - Invite players directly to betting sessions via Telegram deep links
- 📊 **Betting Records** - Track wins, losses, and total coins wagered
- ✅ **Wallet Verification** - Verify token balances before allowing bets

### Blockchain Features
- 🔐 **Solana Wallet Integration** - Secure wallet creation and management
- 💸 **Automatic Crypto Transfers** - Trustless, automated winner payouts
- 🎫 **SPL Token Support** - Full support for Solana Program Library (SPL) tokens
- 🪙 **Meme Coin Support** - Mint address configuration for any SPL token
- 💳 **Transaction Tracking** - Complete transaction history in database
- 📈 **Token Balance Verification** - Real-time balance checks on Solana blockchain

### Bot Features
- 🤖 **Telegram Bot Commands** - `/start`, `/wallet`, `/play`, and more
- 🔘 **Inline Button Callbacks** - Interactive game UI through Telegram buttons
- 🎁 **Auto Payouts** - Automated winner rewards via crypto transfers
- 🔄 **Session Management** - Deep link-based session handling

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│        Telegram Bot (node-telegram-bot-api)  │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │  Main Backend   │  │  Game Backend   │   │
│  │  (Express)      │  │  (Express)      │   │
│  │  Port: 5100     │  │  Port: 5010     │   │
│  └────────┬────────┘  └────────┬────────┘   │
│           │                    │             │
│           └────────┬───────────┘             │
│                    │                        │
│  ┌─────────────────┴─────────────────────┐  │
│  │     MongoDB Database                  │  │
│  │  (User Data, Bets, Transactions)      │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  Solana Blockchain                  │    │
│  │  (SPL Token Transfers)              │    │
│  └─────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB with Mongoose
- **Bot**: node-telegram-bot-api

### Blockchain
- **Network**: Solana (devnet/mainnet)
- **Web3**: @solana/web3.js
- **Tokens**: @solana/spl-token

### Frontend (Game Client)
- **Framework**: React 18
- **Build Tool**: Vite
- **Real-time**: Socket.io-client
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Animations**: Animate.css

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Solana Devnet/Mainnet RPC endpoint
- Telegram Bot Token (from @BotFather)

### Step 1: Clone & Install Dependencies

```bash
# Main backend
npm install

# Game frontend
cd game
npm install

# Game backend
cd ../game_backend/rps
npm install
```

### Step 2: Environment Configuration

Edit `config.js` in the root directory:

```javascript
const config = {
    botInfo: {
        botToken: "YOUR_BOT_TOKEN_HERE",
        botTgUserName: 'your_bot_name',
    },
    db: {
        mongoHostUrlDev: "mongodb://127.0.0.1:27017/tg_betting_bot",
        mongoHostUrlMain: "mongodb+srv://user:pass@cluster.mongodb.net/tg_betting_bot",
    },
    memeCoinInfo: {
        mintAddress: 'YOUR_MINT_ADDRESS',  // SPL Token mint
        name: 'NOMO',  // Token name
    },
    bettingInfo: {
        bettingAmount: {
            min: 10,   // Minimum bet
            max: 1000  // Maximum bet
        }
    },
    PayerPrivateKey: 'YOUR_PAYER_PRIVATE_KEY',  // For transactions
    cutOffPublicKey: 'PLATFORM_WALLET_ADDRESS', // Platform fee wallet
    urls: {
        gameClientBaseUrl: 'https://your-client-url',
        gameServerBaseUrl: 'http://localhost:5010',
    },
    port: 5100
}
```

### Step 3: Start the Services

```bash
# Terminal 1: Main backend
npm start

# Terminal 2: Game backend
cd game_backend/rps
npm start

# Terminal 3: Game frontend (dev)
cd game
npm run dev
```

---

## 🚀 How to Use

### For Users (Via Telegram)

1. **Start the Bot**
   ```
   /start
   ```
   Creates a Solana wallet and registers the user

2. **Link Wallet with Token**
   ```
   /wallet
   ```
   Verifies if wallet is signed with the meme coin

3. **Browse Games**
   ```
   /play
   ```
   Shows available games (Rock-Paper-Scissors)

4. **Join a Bet via Deep Link**
   - Click invite link: `https://t.me/bot_name?start=bettingId-123_chat-456_type-joinbet`
   - Automatically joins the betting session

### Deep Link Format

```
https://t.me/BOT_NAME?start=key1-value1_key2-value2_type-REQUEST_TYPE
```

**Example:**
```
https://t.me/This_is_Test400_bot?start=bettingId-12345_chat-36356_type-joinbet
```

**Supported Types:**
- `joinbet` - Join an existing bet
- `creategame` - Create a new game session
- `playgame` - Start a game match

### Betting Flow

1. Player A creates a bet with amount
2. Bot generates deep link
3. Player B joins via deep link
4. Both players enter the game interface
5. Game is played in real-time (Rock-Paper-Scissors)
6. Winner determined
7. Automatic crypto transfer to winner (2% platform fee)

---

## 📁 Project Structure

```
betting_tg_bot/
├── config.js                      # Main configuration file
├── index.js                       # Main bot entry point
├── package.json
├── src/
│   ├── db/
│   │   ├── db.js                 # MongoDB connection
│   │   └── models/
│   │       ├── userDetails.js    # User wallet & profile data
│   │       ├── userBettingData.js # Betting records
│   │       ├── UserRpsGameData.js # Game-specific data
│   │       └── userTransactionData.js # Crypto transactions
│   ├── handlers/
│   │   └── botMsgHandler.js      # Bot callback handlers
│   ├── helper/
│   │   ├── helperMain.js         # Utility functions
│   │   └── helperWeb3.js         # Solana/crypto functions
│   └── utils/
│       ├── connect_tg_bot.js     # Bot initialization
│       └── commands/
│           ├── bot_commands.js   # Bot commands (/start, etc)
│           ├── bot_inline_btn_commands.js # Button callbacks
│           ├── bot_reply.js      # Bot responses
│           └── deep_link_commands.js # Deep link handling
│
├── game/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── routes/
│   │       └── Rps_routes.jsx    # Rock-Paper-Scissors UI
│   ├── games/
│   │   └── rps/                  # Rock-Paper-Scissors game
│   │       ├── Rps_home.jsx      # Game home screen
│   │       ├── components/       # Game components
│   │       ├── helper/           # Game utilities
│   │       ├── utils/            # Socket utilities
│   │       └── style/            # Game styles
│   └── vite.config.js
│
└── game_backend/                  # Game server (Express + Socket.io)
    └── rps/
        ├── index.js              # Server entry
        ├── utils/
        │   ├── routes/           # API endpoints
        │   ├── socketFiles/      # Socket.io handlers
        │   └── db/               # Database models (mirror)
        └── package.json
```

---

## 🔗 Blockchain Integration Details

### Solana Wallet Management

**Wallet Creation:**
```javascript
// User-specific Solana keypair stored in DB
{
    userName: "user123",
    walletAddress: {
        publicKey: "HPKFp6tWjCMmoH6AR52KJUmECgmRxrtyW9Fy8u7yUJcC",
        privateKey: "5xuGQCytpr8uuNjc8Z46RUxKfDXomh2PMR6z7wnpJ5RTXvoLPUXwN88hEMdbVg1yf3pn5QQJjukKqmjyzLgPY3u"
    }
}
```

### Token Account Verification

Before allowing bets, the system verifies:
1. User has a Solana wallet
2. Wallet has an **Associated Token Account (ATA)** for the meme coin
3. Token balance is sufficient

```javascript
// Checks if wallet is signed with the token
const hasTokenAccount = await hasTokenAccountForMint(walletAddress);
```

### Automatic Payouts

When a player wins:
1. Platform deducts **2% fee** from bet amount
2. Remaining amount transferred to winner's wallet
3. Loser's tokens are debited
4. Transaction recorded in database

```javascript
const cutOffAmount = calculatePercentage(2, betAmount);
const winnerAmount = betAmount - cutOffAmount;
// Transfer to winner wallet
await transferMemeCoin(winnerWallet, winnerAmount);
```

### Supported Networks

- **Development**: Solana Devnet (USDC-DEV)
- **Production**: Solana Mainnet (NOMO token)

---

## 💾 Database Models

### User Details
```javascript
{
    userName: String,
    walletAddress: {
        publicKey: String,
        privateKey: String
    },
    winningData: {
        totalCoinsWin: Number,
        gamesWin: Number,
        gamesLose: Number
    },
    createdAt: Date
}
```

### Betting Data
```javascript
{
    playersId: [ObjectId],      // Two players
    bettingAmount: Number,
    status: String,             // 'pending', 'completed'
    winner: ObjectId,
    createdAt: Date
}
```

### Transaction Data
```javascript
{
    from: String,               // Sender public key
    to: String,                 // Receiver public key
    amount: Number,
    bettingId: ObjectId,
    transactionHash: String,
    status: String,             // 'pending', 'confirmed'
    timestamp: Date
}
```

---

## 🎯 Key Features in Detail

### Real-time Multiplayer
- **Socket.io** connects players in real-time
- Game state synchronized across clients
- Live player status updates

### Betting Logic
- Players can bet between min-max amounts
- Bets are locked until game starts
- Winner receives bet amount minus platform fee
- Loser amount is automatically debited

### Security Features
- ✅ Private keys stored securely in database
- ✅ SPL token verification before transactions
- ✅ Public key validation
- ✅ Error handling for failed transactions

---

## 📝 API Endpoints

### Main Backend (Port 5100)

**POST** `/savewinnertransaction`
- Records winner and transfers crypto
- Body: `{ winnerId, bettingId }`
- Handles automatic fund transfer via Solana

### Game Backend (Port 5010)

**API Routes** (in `/utils/routes/`)
- Socket.io handlers for real-time game state
- Player connection/disconnection logic
- Game choice submission and validation

---

## 🔧 Commands Reference

| Command | Description |
|---------|-------------|
| `/start` | Initialize bot, create Solana wallet |
| `/wallet` | Link/verify wallet with token |
| `/play` | Browse and select games |
| `/help` | Show available commands |

---

## 🐛 Troubleshooting

### Bot not responding
- Check bot token in `config.js`
- Ensure main backend is running (`npm start`)
- Check MongoDB connection

### Wallet verification fails
- Verify wallet has token account created
- Check if mint address is correct in config
- Ensure Solana devnet/mainnet is accessible

### Transaction fails
- Check payer wallet has sufficient SOL for fees
- Verify receiver wallet exists
- Check network connectivity to RPC endpoint

---

## 📊 Development vs Production

### Development Mode (`devModeOn = true`)
- Uses Solana **Devnet**
- USDC-DEV token
- Local MongoDB
- Test bot token

### Production Mode
- Uses Solana **Mainnet**
- NOMO token
- Cloud MongoDB
- Live bot token

Toggle in `config.js` by changing `devModeOn` constant.

---

## 🚀 Deployment

### Prerequisites
- Node.js hosting (e.g., Heroku, DigitalOcean, AWS)
- MongoDB Atlas (cloud database)
- Solana Mainnet RPC endpoint
- Telegram bot token (production)

### Steps
1. Update `config.js` with production values
2. Deploy backend to hosting
3. Deploy frontend to static hosting (Vercel, Netlify)
4. Update deep link URLs in bot commands
5. Monitor logs and transactions

---

## 📄 License

ISC

---

## 👥 Author

Developed for Nomo Gambling Platform

---

## 📞 Support

For issues or questions:
- Check MongoDB connection
- Verify Solana RPC endpoint
- Ensure all environment variables are set
- Check bot token validity

---

## Deep Links Reference

Format: `https://t.me/BOT_NAME?start=KEY-VALUE_KEY-VALUE_type-TYPE`

**Parameters:**
- `bettingId` - ID of the bet
- `chat` - Chat/User ID
- `type` - Request type (joinbet, creategame, playgame)

**Example:**
```
https://t.me/This_is_Test400_bot?start=bettingId-12345_chat-36356_type-joinbet
```






<type> filed is important for all deep link requests.