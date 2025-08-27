export class ResponseUtils {
    /**
     * Standard success response
     */
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Standard error response
     */
    static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors && process.env.NODE_ENV === 'development') {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Paginated response
     */
    static paginated(res, data, pagination, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Not found response
     */
    static notFound(res, resource = 'Resource') {
        return this.error(res, `${resource} not found`, 404);
    }

    /**
     * Unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }

    /**
     * Forbidden response
     */
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }

    /**
     * Validation error response
     */
    static validationError(res, errors) {
        return this.error(res, 'Validation failed', 400, errors);
    }
}
