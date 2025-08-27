import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class EncryptionUtils {
    /**
     * Hash password using bcrypt
     */
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Compare password with hash
     */
    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    /**
     * Generate random token
     */
    static generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate OTP
     */
    static generateOTP(length = 6) {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    /**
     * Create hash for verification
     */
    static createHash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}
