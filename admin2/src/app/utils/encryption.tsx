// utils/encryption.ts
export class TokenEncryption {
    private static key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

    static async encrypt(plainText: string): Promise<string> {
        try {
            if (!this.key) {
                throw new Error('Encryption key not found in environment variables');
            }

            const iv = crypto.getRandomValues(new Uint8Array(16));
            const keyBuffer = this.base64ToArrayBuffer(this.key);
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyBuffer,
                'AES-CBC',
                false,
                ['encrypt']
            );

            const encodedText = new TextEncoder().encode(plainText);
            const encryptedBuffer = await crypto.subtle.encrypt(
                {
                    name: 'AES-CBC',
                    iv: iv
                },
                cryptoKey,
                encodedText
            );

            const ivBase64 = this.arrayBufferToBase64(iv.buffer);
            const encryptedBase64 = this.arrayBufferToBase64(encryptedBuffer);
            return `${ivBase64}:${encryptedBase64}`;
        } catch (error: any) {
            console.error('Encryption error:', error);
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    static async decrypt(encryptedText: string): Promise<string> {
        try {
            // console.log('Attempting to decrypt token:', encryptedText);
            // console.log('Using key:', this.key); // Debug log

            if (!this.key) {
                throw new Error('Encryption key not found in environment variables');
            }

            const [ivString, encryptedData] = encryptedText.split(':');
            
            if (!ivString || !encryptedData) {
                throw new Error('Invalid encrypted token format');
            }

            // Convert key from base64
            const keyBuffer = this.base64ToArrayBuffer(this.key);
            // console.log('Key buffer:', keyBuffer); // Debug log

            if (keyBuffer.byteLength !== 32) {
                throw new Error(`Invalid key length: ${keyBuffer.byteLength} bytes. Expected 32 bytes.`);
            }
            
            // Import the key
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyBuffer,
                'AES-CBC',
                false,
                ['decrypt']
            );
            // console.log('Crypto key:', cryptoKey); // Debug log

            // Convert IV and data from base64
            const iv = this.base64ToArrayBuffer(ivString);
            const data = this.base64ToArrayBuffer(encryptedData);
            // console.log('IV:', iv); // Debug log
            // console.log('Encrypted data:', data); // Debug log

            if (iv.byteLength !== 16) {
                throw new Error(`Invalid IV length: ${iv.byteLength} bytes. Expected 16 bytes.`);
            }

            if (data.byteLength === 0) {
                throw new Error('Encrypted data is empty');
            }

            // Decrypt
            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: 'AES-CBC',
                    iv: iv
                },
                cryptoKey,
                data
            );
            console.log('Decrypted buffer:', decryptedBuffer); // Debug log

            // Convert the decrypted buffer to string
            return new TextDecoder().decode(decryptedBuffer);

        } catch (error : any) {
            console.error('Detailed decryption error:', error);
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    private static base64ToArrayBuffer(base64: string): ArrayBuffer {
        try {
            // Remove any padding if present
            const cleanBase64 = base64.replace(/=+$/, '');
            
            const binaryString = window.atob(cleanBase64);
            const bytes = new Uint8Array(binaryString.length);
            
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            return bytes.buffer;
        } catch (error:any) {
            console.error('Base64 conversion error:', error);
            throw new Error(`Invalid base64 string: ${error.message}`);
        }
    }

    private static arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}