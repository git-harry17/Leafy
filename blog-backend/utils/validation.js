export class ValidationUtils {
    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     */
    static isValidPassword(password) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        return passwordRegex.test(password);
    }

    /**
     * Validate username format
     */
    static isValidUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    }

    /**
     * Validate MongoDB ObjectId
     */
    static isValidObjectId(id) {
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        return objectIdRegex.test(id);
    }

    /**
     * Validate URL format
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if string contains only alphanumeric characters and spaces
     */
    static isAlphanumericWithSpaces(str) {
        const regex = /^[a-zA-Z0-9\s]+$/;
        return regex.test(str);
    }
}