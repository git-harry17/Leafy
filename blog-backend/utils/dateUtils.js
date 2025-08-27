export class DateUtils {
    /**
     * Format date for API responses
     */
    static formatDate(date) {
        return new Date(date).toISOString();
    }

    /**
     * Get time ago string (e.g., "2 hours ago")
     */
    static timeAgo(date) {
        const now = new Date();
        const diffInMs = now - new Date(date);
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
        return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
    }

    /**
     * Check if date is within last N days
     */
    static isWithinDays(date, days) {
        const now = new Date();
        const targetDate = new Date(date);
        const diffInMs = now - targetDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays <= days;
    }

    /**
     * Get start and end of day
     */
    static getStartOfDay(date = new Date()) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    static getEndOfDay(date = new Date()) {
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return end;
    }
}
