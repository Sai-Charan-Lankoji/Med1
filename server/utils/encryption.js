// utils/encryption.js
const crypto = require('crypto');

class TokenEncryption {
  constructor() {
    const key = process.env.ENCRYPTION_KEY || 'default-key-32-chars-exactly!@#$%^&*';
    // Ensure key is exactly 32 bytes
    this.key = crypto.scryptSync(key, 'salt', 32);
    this.algorithm = 'aes-256-cbc';
  }

  encrypt(text) {
    try {
      // Generate a random 16 bytes IV
      const iv = crypto.randomBytes(16);
      
      // Create cipher with key and iv
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      
      // Encrypt the text
      let encrypted = cipher.update(text, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Return IV and encrypted data as base64
      return `${iv.toString('base64')}:${encrypted}`;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  decrypt(text) {
    try {
      // Split IV and encrypted data
      const [ivString, encrypted] = text.split(':');
      
      // Convert IV from base64 to buffer
      const iv = Buffer.from(ivString, 'base64');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      
      // Decrypt the text
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  // Utility method to generate a secure encryption key
  generateKey() {
    return crypto.randomBytes(32).toString('base64');
  }
}

module.exports = new TokenEncryption();