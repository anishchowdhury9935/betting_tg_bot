const bs58 = require('bs58');

// Assuming `privateKeyUint8Array` is your Uint8Array of the private key
const privateKeyUint8Array = new Uint8Array([
    /* Your Uint8Array values go here */
]);

// Convert the Uint8Array to Base58 format
const privateKeyBase58 = bs58.encode(privateKeyUint8Array);

console.log('Base58 Encoded Private Key:', privateKeyBase58);