const { PublicKey, Keypair, Transaction, sendAndConfirmTransaction, } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccount, createTransferInstruction, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, } = require("@solana/spl-token");
const bs58 = require('bs58');
const solanaWeb3 = require('@solana/web3.js');
const config = require('../../config');
const { TryCatch } = require('./helperMain');
// const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
const connection = new solanaWeb3.Connection(config.rpcNetwork, 'confirmed');
const mintAddress = config.memeCoinInfo.mintAddress;

function getKeyPairWithPrivateKey(PrivateKey) {
    return Keypair.fromSecretKey(new Uint8Array(bs58.decode(PrivateKey)), false);
}
async function connectWalletAddressWithMintAddress(
    payerPrivateKey = '',
    mintAddress = '',
    walletPublicKey = ''
) {
    try {
        const payer = getKeyPairWithPrivateKey(payerPrivateKey);
        const userTokenAddress = await createAssociatedTokenAccount(connection, payer, new PublicKey(mintAddress), new PublicKey(walletPublicKey), {
            commitment: "finalized",
        },)
        return userTokenAddress;
    } catch (error) {
        console.log(error);
    }
}

const helperWeb3MainObj = {

    /** create's a new wallet.*/
    createWalletAddress: () => {
        const newWallet = Keypair.generate();
        // Get the public key (wallet address)
        const publicKey = newWallet.publicKey.toString();
        const privateKey = bs58.encode(newWallet.secretKey); // Base58 encoding of the private key
        return {
            publicKey: publicKey,
            privateKey: privateKey,
        };
    },





    /** returns the original wallet token balance object from solana blockchain.*/
    getUserMemeCoinBalanceObj: async (walletAddressObj = {}) => {
        try {
            const { publicKey } = walletAddressObj;
            const mintAddress = config.memeCoinInfo.mintAddress;
            const mintPublicKey = new PublicKey(mintAddress);
            // The wallet address of the user
            const walletPublicKey = new PublicKey(publicKey);

            // Find the associated token account for the wallet and the given token mint
            const tokenAccount = await getAssociatedTokenAddress(mintPublicKey, walletPublicKey);

            const accountInfo = await connection.getAccountInfo(tokenAccount);
            // // // If the account doesn't exist, create it
            if (accountInfo === null) {
                await connectWalletAddressWithMintAddress(config.PayerPrivateKey, mintAddress, publicKey)
            }
            // Fetch the token account balance
            const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);

            // Display the balance in human-readable format
            const amount = tokenBalance.value.amount / 10 ** tokenBalance.value.decimals;
            return {
                walletAddress: { publicKey },
                mintAddress: mintAddress,
                balance: amount,
            };
        } catch (error) {
            console.log(error);
        }
    },







    /** Transfer tokens from one wallet to another. */
    transferMemeCoin: async (_fromWalletPrivateKey, _toWalletPublicKey, amount, _feePayerPrivatekey = config.PayerPrivateKey) => {
        try {
            const connectionFast = new solanaWeb3.Connection('https://solana-api.instantnodes.io/token-FkplVBNzBHxexjaAnPajqTAvRuZZWq0o', 'confirmed');
            // Create a new Token object
            // Get the associated token accounts for the sender and recipient
            const fromWallet = getKeyPairWithPrivateKey(_fromWalletPrivateKey);
            const feePayer = getKeyPairWithPrivateKey(_feePayerPrivatekey);
            const toWallet = new PublicKey(_toWalletPublicKey);
            const mintAddress = new PublicKey(config.memeCoinInfo.mintAddress);
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                mintAddress,
                fromWallet.publicKey
            );
            // Get or create the associated token account for the recipient
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                mintAddress,
                toWallet
            );
            const tokenAccount = await getAssociatedTokenAddress(mintAddress, new PublicKey(_toWalletPublicKey));
            const tokenBalance = await connectionFast.getTokenAccountBalance(tokenAccount);
            // Create the transfer transaction
            const transaction = new Transaction().add(
                createTransferInstruction(
                    fromTokenAccount.address, // Source account
                    toTokenAccount.address, // Destination account
                    fromWallet.publicKey, // Owner of the source account
                    BigInt(amount * 10 ** tokenBalance.value.decimals), // Amount to transfer (ensure this is a BigInt if required)
                    [], // Multi-signers (if needed, leave empty for a single signer)
                    TOKEN_PROGRAM_ID // SPL Token program account
                )
            );
            transaction.feePayer = feePayer.publicKey;
            const connectionForHash = new solanaWeb3.Connection('https://solana-api.instantnodes.io/token-Kd8tc0HfwPYeraHzTi9t1r4VQmK7Mnca', 'confirmed');
            const { blockhash, lastValidBlockHeight } = await connectionForHash.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            const signature = await sendAndConfirmTransaction(connectionFast, transaction, [fromWallet, feePayer], {
                commitment: 'finalized',
                preflightCommitment: 'finalized'
            });
            return signature;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};
module.exports = { helperWeb3MainObj, connectWalletAddressWithMintAddress, getKeyPairWithPrivateKey, ...helperWeb3MainObj };