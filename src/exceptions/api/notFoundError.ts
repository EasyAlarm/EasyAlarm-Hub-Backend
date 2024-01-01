// notFoundError.ts
import ApiError from "./apiError";

class NotFoundError extends ApiError
{
    private static readonly defaultStatusCode = 404;
    private static readonly defaultErrorCode = "NOT_FOUND";

    constructor(message: string = "Resource not found")
    {
        super(message, NotFoundError.defaultStatusCode, NotFoundError.defaultErrorCode);
    }
}

export default NotFoundError;
