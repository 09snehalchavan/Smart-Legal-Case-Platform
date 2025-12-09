import type { StudyMaterial } from '../types';

// --- KEY MANAGEMENT ---
// In a real app, these would be securely stored and managed (e.g., in an HSM or secure storage).
// For this simulation, we generate them once and keep them in memory.
let lawyerSigningKeys: CryptoKeyPair; // ECDSA key pair for lawyer
let clientKeyExchangeKeys: CryptoKeyPair; // ECDH key pair for client (recipient)

export const generateAllKeys = async () => {
    // Lawyer's long-term key for signing files
    lawyerSigningKeys = await window.crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['sign', 'verify']
    );
    // Client's long-term key for key agreement
    clientKeyExchangeKeys = await window.crypto.subtle.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        ['deriveKey']
    );
    console.log("Cryptographic keys generated for simulation.");
};

// This function needs to be called once when the app loads to ensure keys exist.
// We wrap it in a promise to handle the async nature.
export const keyGenerationPromise = generateAllKeys();


// --- ENCRYPTION FLOW (Lawyer's side) ---
export const encryptAndSign = async (content: ArrayBuffer): Promise<Pick<StudyMaterial, 'content' | 'iv' | 'ephemeralPubKey' | 'signature'>> => {
    
    // 1. Generate ephemeral ECDH key pair for this encryption session (provides Forward Secrecy)
    const ephemeralKeyPair = await window.crypto.subtle.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        ['deriveKey']
    );

    // 2. Derive a shared secret using the ephemeral private key and the client's public key.
    const sharedSecret = await window.crypto.subtle.deriveKey(
        { name: 'ECDH', public: clientKeyExchangeKeys.publicKey },
        ephemeralKeyPair.privateKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
    );
    
    // 3. Encrypt the file content with the derived shared secret.
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        sharedSecret,
        content
    );

    // 4. Export the ephemeral public key to send to the client.
    const ephemeralPubKey = await window.crypto.subtle.exportKey('raw', ephemeralKeyPair.publicKey);

    // 5. Sign the ephemeral public key and the encrypted data to ensure integrity and authenticity.
    const dataToSign = new Uint8Array([
        ...new Uint8Array(ephemeralPubKey),
        ...new Uint8Array(encryptedContent),
        ...new Uint8Array(iv)
    ]);
    const signature = await window.crypto.subtle.sign(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        lawyerSigningKeys.privateKey,
        dataToSign
    );

    return { content: encryptedContent, iv, ephemeralPubKey, signature };
};


// --- DECRYPTION FLOW (Client's side) ---
export const decryptAndVerify = async (
    encryptedContent: ArrayBuffer,
    iv: ArrayBuffer,
    ephemeralPubKeyRaw: ArrayBuffer,
    signature: ArrayBuffer
): Promise<ArrayBuffer> => {
    
    // 1. Verify the signature first. If this fails, we don't proceed.
    const dataToVerify = new Uint8Array([
        ...new Uint8Array(ephemeralPubKeyRaw),
        ...new Uint8Array(encryptedContent),
        ...new Uint8Array(iv)
    ]);

    const isSignatureValid = await window.crypto.subtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        lawyerSigningKeys.publicKey, // Use lawyer's PUBLIC signing key to verify
        signature,
        dataToVerify
    );

    if (!isSignatureValid) {
        throw new Error("Digital signature verification failed. The file may be tampered with or not from the expected sender.");
    }
    
    // 2. Import the lawyer's ephemeral public key.
    const ephemeralPubKey = await window.crypto.subtle.importKey(
        'raw',
        ephemeralPubKeyRaw,
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        []
    );

    // 3. Derive the same shared secret using the client's private key and the lawyer's ephemeral public key.
    const sharedSecret = await window.crypto.subtle.deriveKey(
        { name: 'ECDH', public: ephemeralPubKey },
        clientKeyExchangeKeys.privateKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
    );

    // 4. Decrypt the actual file content.
    const decryptedContent = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        sharedSecret,
        encryptedContent
    );
    
    return decryptedContent;
};
