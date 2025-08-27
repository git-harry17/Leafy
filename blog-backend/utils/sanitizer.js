import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export class Sanitizer {
    /**
     * Sanitize HTML content to prevent XSS attacks
     */
    static sanitizeHtml(html) {
        if (!html || typeof html !== 'string') return '';
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
            ALLOWED_ATTR: ['href', 'title', 'alt', 'src']
        });
    }

    /**
     * Sanitize user input to prevent injection attacks
     */
    static sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';
        return validator.escape(input.trim());
    }

    /**
     * Sanitize blog content object
     */
    static sanitizeBlogContent(content) {
        if (!content || typeof content !== 'object') return {};
        
        // If content has blocks (Editor.js format)
        if (content.blocks && Array.isArray(content.blocks)) {
            content.blocks = content.blocks.map(block => {
                if (block.type === 'paragraph' || block.type === 'header') {
                    block.data.text = this.sanitizeHtml(block.data.text);
                }
                return block;
            });
        }
        
        return content;
    }

    /**
     * Validate and sanitize email
     */
    static sanitizeEmail(email) {
        if (!email || typeof email !== 'string') return '';
        const sanitized = validator.normalizeEmail(email.trim().toLowerCase());
        return validator.isEmail(sanitized) ? sanitized : '';
    }

    /**
     * Sanitize URL
     */
    static sanitizeUrl(url) {
        if (!url || typeof url !== 'string') return '';
        const trimmed = url.trim();
        return validator.isURL(trimmed) ? trimmed : '';
    }
}