import path from 'path';
import fs from 'fs';

export class FileUtils {
    /**
     * Ensure directory exists
     */
    static ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * Get file extension
     */
    static getFileExtension(filename) {
        return path.extname(filename).toLowerCase();
    }

    /**
     * Generate unique filename
     */
    static generateUniqueFilename(originalName) {
        const extension = this.getFileExtension(originalName);
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return `${timestamp}_${random}${extension}`;
    }

    /**
     * Validate file type
     */
    static isValidImageType(filename) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const extension = this.getFileExtension(filename);
        return allowedExtensions.includes(extension);
    }

    /**
     * Get file size in MB
     */
    static getFileSizeInMB(sizeInBytes) {
        return sizeInBytes / (1024 * 1024);
    }
}