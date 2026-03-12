
# Telegram Betting Bot

A Telegram betting bot built with Node.js, MongoDB, React, Socket.IO, and Solana SPL-token transfers. The current implementation supports one real-time game, Rock Paper Scissors, and uses Telegram deep links plus a web app flow to move players from chat into the game.

## Overview

This repo is split into three parts:

- Main backend: Telegram bot logic, wallet flow, balance checks, withdrawals, and winner settlement.
- Game frontend: React/Vite client used to play the game in a Telegram web app.
- Game backend: Socket and REST support for RPS rounds and winner selection.

## Current Features

- Telegram bot onboarding with wallet creation.
- Per-user Solana wallet generation and storage in MongoDB.
- SPL-token balance checks before betting.
- Bet creation and join flow through Telegram deep links.
- Web-app launch flow for Rock Paper Scissors.
- RPS round tracking and winner calculation.
- Automatic payout flow from loser wallet to winner wallet plus platform fee wallet.
- Withdraw flow for user balances.
- Leaderboard, wallet view, stats, and active-bets view.

## Important Implementation Notes

- The only implemented game right now is `rps`.
- User wallet keypairs are stored in MongoDB in the current implementation.
- `userTransactionData` is used as temporary withdrawal state, not as a permanent transaction ledger.
- The game backend currently settles winners by calling the main backend endpoint at `http://localhost:5100/savewinnertransaction`.
- Solana connections in the bot helpers use `config.rpcNetwork`, with devnet as fallback.

## Architecture

```text
Telegram User
  -> Telegram Bot API
  -> Main Backend (Express + node-telegram-bot-api)
     -> MongoDB
     -> Solana RPC / SPL Token Program
     -> Game Frontend URL for Telegram web app launch

Game Frontend (React + Vite)
  -> Game Backend (Express + Socket.IO)
     -> MongoDB
     -> Main Backend winner settlement endpoint
```

## Tech Stack

### Main backend

- Node.js
- Express
- node-telegram-bot-api
- Mongoose
- @solana/web3.js
- @solana/spl-token

### Game frontend

- React 18
- Vite
- react-router-dom
- socket.io-client
- react-hot-toast

### Game backend

- Express
- Socket.IO
- Mongoose

## Project Structure

```text
betting_tg_bot/
├── config.js
├── index.js
├── package.json
├── src/
│   ├── db/
│   │   ├── db.js
│   │   └── models/
│   │       ├── userBettingData.js
│   │       ├── userDetails.js
│   │       ├── UserRpsGameData.js
│   │       └── userTransactionData.js
│   ├── global/
│   │   └── globalVariables.js
│   ├── handlers/
│   │   └── botMsgHandler.js
│   ├── helper/
│   │   ├── helperMain.js
│   │   └── helperWeb3.js
│   └── utils/
│       ├── connect_tg_bot.js
│       └── commands/
│           ├── bot_commands.js
│           ├── bot_inline_btn_commands.js
│           ├── bot_reply.js
│           └── deep_link_commands.js
├── game/
│   ├── config.js
│   ├── package.json
│   ├── src/
│   └── games/rps/
└── game_backend/rps/
    ├── config.js
    ├── index.js
    ├── package.json
    └── utils/
        ├── db/
        ├── routes/
        └── socketFiles/
```

## Environment Setup

There are three separate runtime configs in this repo.

### 1. Root `.env`

Used by the main backend.

```env
BOT_TOKEN_DEV=your_dev_bot_token
BOT_USERNAME_DEV=your_dev_bot_username
BOT_TOKEN_PROD=your_prod_bot_token
BOT_USERNAME_PROD=your_prod_bot_username
BOT_NAME=Telegram Betting Bot

MONGO_URL_DEV=mongodb://127.0.0.1:27017/tg_betting_bot
MONGO_URL_PROD=mongodb+srv://user:pass@cluster.mongodb.net/tg_betting_bot

MINT_ADDRESS_DEV=your_dev_token_mint
MEME_COIN_NAME_DEV=DEV_TOKEN
PAYER_PRIVATE_KEY_DEV=your_dev_private_key
CUT_OFF_PUBLIC_KEY_DEV=your_dev_platform_wallet

MINT_ADDRESS_PROD=your_prod_token_mint
MEME_COIN_NAME_PROD=PROD_TOKEN
PAYER_PRIVATE_KEY_PROD=your_prod_private_key
CUT_OFF_PUBLIC_KEY_PROD=your_prod_platform_wallet

MIN_BET_AMOUNT=10
MAX_BET_AMOUNT=1000
PLATFORM_FEE=2
RPC_NETWORK=https://your-rpc-endpoint

GAME_CLIENT_URL=http://localhost:5173
GAME_SERVER_URL=http://localhost:5010
MAIN_BACKEND_PORT=5100
GAME_BACKEND_PORT=5010

NODE_ENV=development
DEV_MODE=true
```

### 2. `game/.env.local`

Used by the Vite frontend.

```env
VITE_DEV_MODE=true
VITE_GAME_SERVER_URL=http://localhost:5010
VITE_GAME_CLIENT_URL=http://localhost:5173
```

### 3. `game_backend/rps/.env`

Used by the RPS backend.

```env
DEV_MODE=true
NODE_ENV=development
GAME_BACKEND_PORT=5010
MONGO_URL_DEV=mongodb://127.0.0.1:27017/tg_betting_bot
MONGO_URL_PROD=mongodb+srv://user:pass@cluster.mongodb.net/tg_betting_bot
RPC_NETWORK=https://your-rpc-endpoint
MINT_ADDRESS_DEV=your_dev_token_mint
MINT_ADDRESS_PROD=your_prod_token_mint
GAME_CLIENT_URL=http://localhost:5173
```

### Dev vs prod switch

The main backend switches bot token, bot username, token mint, token name, payer private key, and platform wallet using `DEV_MODE=true|false`.

## Installation

```bash
npm install
cd game
npm install
cd ../game_backend/rps
npm install
```

## Run Locally

Start all three services.

### Terminal 1

```bash
npm start
```

### Terminal 2

```bash
cd game_backend/rps
npm start
```

### Terminal 3

```bash
cd game
npm run dev
```

Default local ports:

- Main backend: `5100`
- Game backend: `5010`
- Vite frontend: `5173`

## Telegram Commands

These are the currently wired commands.

- `/start`: starts onboarding and creates a wallet if the user does not already have one.
- `/create`: explicit wallet creation entry point. It also sends the welcome message and inline buttons.
- `/commands`: prints the available command list.
- `/games`: lists the available games.
- `/wallet`: shows wallet address and token balance.
- `/bet`: starts the betting flow by asking the user to reply with the game name.
- `/withdraw`: starts the withdraw flow.
- `/mybettings`: shows the user’s active bets.
- `/leaderboard`: shows top players by total winnings.
- `/stats`: shows the user’s game statistics.

## Actual User Flow

### 1. Start or create a wallet

Use `/start` or `/create`.

This creates a Solana wallet for the Telegram username if one does not already exist.

### 2. Open wallet view

Use `/wallet`.

This fetches the current SPL-token balance and can trigger associated token account creation if needed.

### 3. Create a bet

Use `/bet`.

The bot will ask for:

1. A game name. Right now the valid value is `rps`.
2. A bet amount between `MIN_BET_AMOUNT` and `MAX_BET_AMOUNT`.

After that, the bot creates a betting record and returns a Telegram deep link for another player to join.

### 4. Join a bet

The second player opens the generated deep link.

This runs the `/start` payload flow handled in the deep-link command module.

### 5. Launch the game

Once joined, the bot sends a Telegram web-app button that opens the React game client.

### 6. Resolve the game

The RPS backend tracks rounds, determines the winner, and asks the main backend to process the settlement.

## Deep Links

Current deep-link payloads are handled through `/start`.

### Format

```text
https://t.me/BOT_USERNAME?start=bettingId-<id>_type-<join|play>_game-<gameName>
```

### Example join link

```text
https://t.me/your_bot_username?start=bettingId-12345_type-join_game-rps
```

### Supported deep-link types in code

- `join`
- `play`

## Game Backend API

Routes are registered under `/api`.

### `GET /api/bettingbasicdata/:bettingId`

- Returns the current RPS game state for a betting id.
- If the match is finished, it may trigger winner settlement.

### `PUT /api/bettingbasicdata/:bettingId/:winnerId`

- Increments the round winner and advances the match.
- If the max round count is reached, it determines the final winner.

### `DELETE /api/bettingbasicdata/:bettingId`

- Deletes the RPS game state for a betting id.

## Main Backend API

### `POST /savewinnertransaction`

Body:

```json
{
  "winnerId": "...",
  "bettingId": "..."
}
```

This endpoint:

- updates winner and loser stats,
- calculates the platform fee,
- transfers the main payout to the winner,
- transfers the fee to the configured platform wallet,
- removes finished bet state.

## Data Model Summary

### `userDetails`

- `walletAddress`
- `userName`
- `bettingInfo.nameOfBet`
- `winningData.totalCoinsWin`
- `winningData.gamesWin`
- `winningData.gamesLose`

### `userBettingData`

- `bettingAmount`
- `bettingState.isRunning`
- `playersId`
- `nameOfBet`
- `isConnected`

### `userRpsGameData`

- `bettingId`
- `roundNumber`
- `playerRoundWin`

### `userTransactionData`

- `userName`
- `withdrawData`
- auto-expiring temporary record used during withdrawals

## Blockchain Behavior

- The token mint comes from `config.memeCoinInfo.mintAddress`.
- The fee payer key comes from `config.PayerPrivateKey`.
- The fee wallet comes from `config.cutOffPublicKey`.
- The fee percentage comes from `config.platformFee`.
- The current helper code uses the configured `RPC_NETWORK` value, with devnet fallback.

## Known Limitations

- Only one game is implemented.
- Wallet private keys are stored directly in MongoDB in the current implementation.
- The game backend settlement callback is still hardcoded to `http://localhost:5100`.
- Some text in the bot assumes a specific fee breakdown even though only the total percentage is configurable.

## Troubleshooting

### Bot does not respond

- Verify `BOT_TOKEN_DEV` or `BOT_TOKEN_PROD` in the root `.env`.
- Make sure the main backend is running.
- Confirm MongoDB is reachable.

### Wallet or token validation fails

- Verify the configured token mint matches the network used by the RPC endpoint.
- Confirm the wallet has or can create an associated token account.
- Check `RPC_NETWORK`.

### Settlement fails

- Make sure the main backend is reachable on port `5100`.
- Verify the payer wallet has enough SOL for transaction fees.
- Verify both players have valid token accounts.

### Frontend cannot connect to the game backend

- Check `VITE_GAME_SERVER_URL` in `game/.env.local`.
- Check `GAME_CLIENT_URL` and `GAME_BACKEND_PORT` in `game_backend/rps/.env`.

## Deployment Notes

For deployment you need to provide production values in the environment files and set `DEV_MODE=false`.

At minimum, review:

- bot credentials,
- MongoDB production URL,
- production token mint and token name,
- production payer private key,
- production platform wallet,
- production frontend and backend URLs,
- the hardcoded settlement URL in the RPS backend.

## License

ISC